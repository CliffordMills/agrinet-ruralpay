-- Migration 002: Roles & Permissions
-- Custom roles and permission enums

CREATE TYPE user_role AS ENUM (
  'SUPER_ADMIN',
  'ADMIN',
  'AGENT',
  'FARMER',
  'BUYER',
  'HUB_MANAGER',
  'ANALYST'
);

CREATE TYPE payment_provider AS ENUM (
  'mtn',
  'telecel',
  'airteltigo',
  'bank'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'successful',
  'failed',
  'reversed'
);

CREATE TYPE batch_status AS ENUM (
  'received',
  'graded',
  'stored',
  'reserved',
  'sold',
  'exported'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'accepted',
  'contracted',
  'logistics',
  'delivered',
  'complete'
);

CREATE TYPE notification_channel AS ENUM (
  'in_app',
  'sms',
  'whatsapp',
  'email'
);

CREATE TYPE loan_status AS ENUM (
  'applied',
  'under_review',
  'approved',
  'disbursed',
  'repaying',
  'settled',
  'defaulted',
  'rejected'
);

CREATE TYPE alert_severity AS ENUM (
  'info',
  'warning',
  'critical'
);
