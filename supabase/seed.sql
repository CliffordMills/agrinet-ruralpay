-- AGRINET RURALPAY — Seed Data
-- Realistic Ghana agricultural data for development & staging

-- ============================================================
-- GEOGRAPHY: Ghana Regions & Districts
-- ============================================================
INSERT INTO public.regions (id, name, code) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Brong-Ahafo', 'BA'),
  ('a1000000-0000-0000-0000-000000000002', 'Ashanti', 'ASH'),
  ('a1000000-0000-0000-0000-000000000003', 'Northern', 'NOR'),
  ('a1000000-0000-0000-0000-000000000004', 'Upper East', 'UE'),
  ('a1000000-0000-0000-0000-000000000005', 'Upper West', 'UW'),
  ('a1000000-0000-0000-0000-000000000006', 'Volta', 'VOL'),
  ('a1000000-0000-0000-0000-000000000007', 'Eastern', 'EAS'),
  ('a1000000-0000-0000-0000-000000000008', 'Western', 'WES'),
  ('a1000000-0000-0000-0000-000000000009', 'Central', 'CEN'),
  ('a1000000-0000-0000-0000-000000000010', 'Greater Accra', 'GA');

INSERT INTO public.districts (id, region_id, name) VALUES
  -- Brong-Ahafo
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Sunyani Municipal'),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Techiman Municipal'),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Kintampo North'),
  -- Ashanti
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'Kumasi Metropolitan'),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'Offinso North'),
  -- Northern
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', 'Tamale Metropolitan'),
  ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000003', 'Savelugu Municipal'),
  -- Upper East
  ('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000004', 'Bolgatanga Municipal'),
  ('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000004', 'Bawku Municipal'),
  -- Upper West
  ('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000005', 'Wa Municipal');

INSERT INTO public.villages (id, district_id, name, gps_lat, gps_lng) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Odumase', 7.3349, -2.3280),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Chiraa', 7.3920, -2.2940),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'Tuobodom', 7.5830, -1.9170),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000003', 'Kintampo', 8.0578, -1.7241),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000006', 'Tamale New Town', 9.4008, -0.8393),
  ('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000007', 'Savelugu', 9.6235, -0.8270),
  ('c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000008', 'Bolgatanga Central', 10.7855, -0.8508),
  ('c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000009', 'Bawku', 11.0598, -0.2417),
  ('c1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000010', 'Wa Town', 10.0601, -2.5099),
  ('c1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000005', 'Afrancho', 6.9010, -1.7350);

-- ============================================================
-- COMMODITIES
-- ============================================================
INSERT INTO public.commodities (id, name, code, unit) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Maize', 'MZE', 'kg'),
  ('d1000000-0000-0000-0000-000000000002', 'Soybean', 'SOY', 'kg'),
  ('d1000000-0000-0000-0000-000000000003', 'Groundnut', 'GND', 'kg'),
  ('d1000000-0000-0000-0000-000000000004', 'Cashew', 'CSH', 'kg'),
  ('d1000000-0000-0000-0000-000000000005', 'Shea Butter', 'SHA', 'kg'),
  ('d1000000-0000-0000-0000-000000000006', 'Rice', 'RCE', 'kg'),
  ('d1000000-0000-0000-0000-000000000007', 'Yam', 'YAM', 'kg'),
  ('d1000000-0000-0000-0000-000000000008', 'Cocoa', 'COC', 'kg');

INSERT INTO public.commodity_grades (commodity_id, name, code, min_score, max_score, price_premium_pct) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Grade A', 'A', 80, 100, 15),
  ('d1000000-0000-0000-0000-000000000001', 'Grade B', 'B', 60, 79, 5),
  ('d1000000-0000-0000-0000-000000000001', 'Grade C', 'C', 0, 59, 0),
  ('d1000000-0000-0000-0000-000000000002', 'Grade A', 'A', 80, 100, 20),
  ('d1000000-0000-0000-0000-000000000002', 'Grade B', 'B', 60, 79, 8),
  ('d1000000-0000-0000-0000-000000000003', 'Premium', 'P', 85, 100, 25),
  ('d1000000-0000-0000-0000-000000000003', 'Standard', 'S', 0, 84, 0),
  ('d1000000-0000-0000-0000-000000000004', 'Grade W240', 'W240', 80, 100, 30),
  ('d1000000-0000-0000-0000-000000000004', 'Grade W320', 'W320', 60, 79, 15),
  ('d1000000-0000-0000-0000-000000000008', 'Grade I', 'I', 90, 100, 20),
  ('d1000000-0000-0000-0000-000000000008', 'Grade II', 'II', 70, 89, 5);

-- ============================================================
-- MARKET PRICES (current season)
-- ============================================================
INSERT INTO public.market_prices (commodity_id, price_per_kg, currency, price_date, source) VALUES
  ('d1000000-0000-0000-0000-000000000001', 0.85, 'GHS', CURRENT_DATE, 'MoFA Ghana'),
  ('d1000000-0000-0000-0000-000000000002', 4.20, 'GHS', CURRENT_DATE, 'MoFA Ghana'),
  ('d1000000-0000-0000-0000-000000000003', 6.50, 'GHS', CURRENT_DATE, 'MoFA Ghana'),
  ('d1000000-0000-0000-0000-000000000004', 15.00, 'GHS', CURRENT_DATE, 'CRIG Ghana'),
  ('d1000000-0000-0000-0000-000000000005', 18.50, 'GHS', CURRENT_DATE, 'GNA'),
  ('d1000000-0000-0000-0000-000000000006', 3.20, 'GHS', CURRENT_DATE, 'MoFA Ghana'),
  ('d1000000-0000-0000-0000-000000000007', 1.10, 'GHS', CURRENT_DATE, 'MoFA Ghana'),
  ('d1000000-0000-0000-0000-000000000008', 22.00, 'GHS', CURRENT_DATE, 'COCOBOD');

-- ============================================================
-- STORAGE HUBS
-- ============================================================
INSERT INTO public.storage_hubs (id, name, code, region_id, district_id, gps_lat, gps_lng, capacity_tonnes) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'Sunyani AgriHub', 'HUB-SUN-01', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 7.3349, -2.3280, 500),
  ('e1000000-0000-0000-0000-000000000002', 'Techiman Grain Store', 'HUB-TEC-01', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 7.5895, -1.9326, 800),
  ('e1000000-0000-0000-0000-000000000003', 'Tamale Northern Hub', 'HUB-TAM-01', 'a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000006', 9.4008, -0.8393, 1200),
  ('e1000000-0000-0000-0000-000000000004', 'Bolgatanga UE Hub', 'HUB-BOL-01', 'a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000008', 10.7855, -0.8508, 600),
  ('e1000000-0000-0000-0000-000000000005', 'Wa Upper West Hub', 'HUB-WA-01', 'a1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000010', 10.0601, -2.5099, 400);

-- ============================================================
-- NOTIFICATION TEMPLATES
-- ============================================================
INSERT INTO public.notification_templates (key, title, body, channel) VALUES
  ('payment_successful', 'Payment Received', 'You have received a payment of GHS {{amount}} for batch {{batch_id}}.', 'in_app'),
  ('payment_failed', 'Payment Failed', 'Your payment of GHS {{amount}} failed. Reason: {{reason}}.', 'in_app'),
  ('batch_graded', 'Batch Graded', 'Your batch {{batch_id}} has been graded as {{grade}}.', 'in_app'),
  ('batch_stored', 'Batch Stored', 'Your batch {{batch_id}} is now stored at {{hub_name}}.', 'in_app'),
  ('batch_sold', 'Batch Sold', 'Your batch {{batch_id}} has been sold. Payment will be processed within 24 hours.', 'in_app'),
  ('loan_approved', 'Loan Approved', 'Your loan application for GHS {{amount}} has been approved.', 'in_app'),
  ('loan_due', 'Loan Due Soon', 'Your loan repayment of GHS {{amount}} is due on {{due_date}}.', 'in_app'),
  ('climate_alert', 'Climate Alert', '{{title}}: {{message}}', 'in_app'),
  ('bid_accepted', 'Bid Accepted', 'Your bid on {{commodity}} has been accepted. Contract details to follow.', 'in_app'),
  ('registration_complete', 'Welcome to AGRINET', 'Your AGRINET RURALPAY account is ready. Digital ID: {{digital_id}}.', 'sms');
