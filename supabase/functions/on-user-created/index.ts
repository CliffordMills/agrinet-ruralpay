import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const payload = await req.json();
  const user = payload?.record;

  if (!user?.id) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const role = user.raw_user_meta_data?.role ?? "FARMER";

  // Update JWT claims via app_metadata so middleware can read role without DB roundtrip
  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: {
      role,
      permissions: getPermissionsForRole(role),
    },
  });

  if (error) {
    console.error("Failed to set app_metadata:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Insert welcome notification
  const digitalId = user.raw_user_meta_data?.digital_id ?? "";
  await supabase.from("notifications").insert({
    user_id: user.id,
    title: "Welcome to AGRINET",
    body: `Your AGRINET RURALPAY account is ready. Digital ID: ${digitalId}.`,
    type: "registration_complete",
    channel: "in_app",
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

function getPermissionsForRole(role: string): string[] {
  const map: Record<string, string[]> = {
    SUPER_ADMIN: ["*"],
    ADMIN: [
      "farmers:create", "farmers:read", "farmers:update",
      "procurement:create", "procurement:approve",
      "payments:initiate", "payments:approve",
      "marketplace:bid", "marketplace:list",
      "hub:manage", "analytics:read", "finance:score", "finance:approve",
    ],
    AGENT: [
      "farmers:create", "farmers:read", "farmers:update",
      "procurement:create", "payments:initiate",
    ],
    FARMER: ["farmers:read"],
    BUYER: ["marketplace:bid", "marketplace:list"],
    HUB_MANAGER: ["hub:manage", "analytics:read"],
    ANALYST: ["farmers:read", "marketplace:list", "analytics:read", "finance:score"],
  };
  return map[role] ?? ["farmers:read"];
}
