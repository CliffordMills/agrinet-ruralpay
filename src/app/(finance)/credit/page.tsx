import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CreditScoreCard from "@/components/finance/CreditScoreCard";
import { scoreTier, tierBg } from "@/lib/finance/creditScoring";

export default async function CreditScorePage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();

  const { data: farmer } = await supabase
    .from("farmers")
    .select("id, credit_score")
    .eq("user_id", session.user.id)
    .single();

  const { data: history } = farmer
    ? await supabase
        .from("credit_scores")
        .select("score, reason, created_at")
        .eq("farmer_id", farmer.id)
        .order("created_at", { ascending: false })
        .limit(20)
    : { data: null };

  const currentScore = farmer?.credit_score ?? 0;
  const previousScore = history && history.length > 1 ? history[1].score : undefined;
  const lastUpdated = history?.[0]?.created_at;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Credit Score</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CreditScoreCard
            score={currentScore}
            previousScore={previousScore}
            lastUpdated={lastUpdated}
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold mb-3">What affects your score?</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-green-600">+</span> Completing procurement cycles on time</li>
              <li className="flex gap-2"><span className="text-green-600">+</span> Repaying loans before due date</li>
              <li className="flex gap-2"><span className="text-green-600">+</span> Consistent commodity quality (high grade)</li>
              <li className="flex gap-2"><span className="text-green-600">+</span> Larger farm size and diversified crops</li>
              <li className="flex gap-2"><span className="text-red-500">−</span> Missed or late loan repayments</li>
              <li className="flex gap-2"><span className="text-red-500">−</span> Low commodity quality scores</li>
            </ul>
          </div>

          {history && history.length > 0 && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border font-semibold">Score History</div>
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Date</th>
                    <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Score</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Tier</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.map((entry, i) => {
                    const tier = scoreTier(entry.score);
                    return (
                      <tr key={i}>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString("en-GH")}
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold">{entry.score}</td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${tierBg(tier)}`}>{tier}</span>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs">{entry.reason || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
