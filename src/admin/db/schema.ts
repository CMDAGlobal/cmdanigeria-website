/**
 * Idempotent DDL for the admin governance layer.
 *
 * Consumed by `scripts/admin-migrate.mjs` (Node's type stripping imports this
 * module directly), so this file must only use erasable TypeScript syntax.
 */
export const ADMIN_DDL_STATEMENTS: readonly string[] = [
  `create table if not exists admin_users (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    name text not null default '',
    password_hash text not null,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,

  `create table if not exists admin_roles (
    id uuid primary key default gen_random_uuid(),
    key text not null unique,
    name text not null,
    description text not null default '',
    created_at timestamptz not null default now()
  )`,

  `create table if not exists admin_permissions (
    key text primary key,
    description text not null default ''
  )`,

  `create table if not exists admin_role_permissions (
    role_id uuid not null references admin_roles(id) on delete cascade,
    permission_key text not null references admin_permissions(key) on delete cascade,
    primary key (role_id, permission_key)
  )`,

  `create table if not exists admin_user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references admin_users(id) on delete cascade,
    role_id uuid not null references admin_roles(id) on delete cascade,
    arm text check (arm in ('doctors', 'students', 'global')),
    region_slug text,
    chapter_slug text,
    created_at timestamptz not null default now(),
    unique nulls not distinct (user_id, role_id, arm, region_slug, chapter_slug)
  )`,

  `create index if not exists admin_user_roles_user_idx on admin_user_roles (user_id)`,

  `create index if not exists admin_user_roles_role_idx on admin_user_roles (role_id)`,

  `create table if not exists admin_sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references admin_users(id) on delete cascade,
    token_hash text not null unique,
    created_at timestamptz not null default now(),
    expires_at timestamptz not null,
    last_seen_at timestamptz,
    ip_address text,
    user_agent text,
    revoked_at timestamptz
  )`,

  `create index if not exists admin_sessions_token_hash_idx on admin_sessions (token_hash)`,

  `create index if not exists admin_sessions_user_idx on admin_sessions (user_id)`,

  `create table if not exists admin_audit_logs (
    id uuid primary key default gen_random_uuid(),
    actor_user_id uuid references admin_users(id) on delete set null,
    action text not null,
    target_type text,
    target_id text,
    scope_arm text,
    scope_region text,
    scope_chapter text,
    outcome text not null check (outcome in ('success', 'denied', 'error')),
    reason text,
    ip_address text,
    user_agent text,
    created_at timestamptz not null default now()
  )`,

  `create index if not exists admin_audit_logs_created_idx on admin_audit_logs (created_at desc)`,

  `create index if not exists admin_audit_logs_actor_idx on admin_audit_logs (actor_user_id)`,
] as const;
