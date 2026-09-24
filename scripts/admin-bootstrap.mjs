/**
 * Creates (or resets) the first Super Admin user and grants it the
 * `super_admin` role on the database named by ADMIN_DATABASE_URL.
 *
 * Usage:
 *   ADMIN_BOOTSTRAP_EMAIL=admin@cmdanigeria.org \
 *   ADMIN_BOOTSTRAP_NAME="CMDA Admin" \
 *   ADMIN_BOOTSTRAP_PASSWORD="a-strong-password" \
 *   node scripts/admin-bootstrap.mjs
 *
 * Run `node scripts/admin-migrate.mjs` first so the roles exist.
 */
import { Pool } from "@neondatabase/serverless";
import { hashPassword } from "../src/admin/auth/password.ts";

const {
  ADMIN_BOOTSTRAP_EMAIL,
  ADMIN_BOOTSTRAP_NAME,
  ADMIN_BOOTSTRAP_PASSWORD,
  ADMIN_DATABASE_URL,
} = process.env;

if (!ADMIN_BOOTSTRAP_EMAIL || !ADMIN_BOOTSTRAP_PASSWORD || !ADMIN_DATABASE_URL) {
  console.error(
    "Missing required env: ADMIN_DATABASE_URL, ADMIN_BOOTSTRAP_EMAIL, ADMIN_BOOTSTRAP_PASSWORD",
  );
  process.exit(1);
}

const pool = new Pool({ connectionString: ADMIN_DATABASE_URL });

async function main() {
  const passwordHash = await hashPassword(ADMIN_BOOTSTRAP_PASSWORD);
  const email = ADMIN_BOOTSTRAP_EMAIL.trim().toLowerCase();

  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `insert into admin_users (email, name, password_hash, is_active)
       values ($1, $2, $3, true)
       on conflict (email) do update
         set password_hash = excluded.password_hash,
             name = excluded.name,
             is_active = true,
             updated_at = now()
       returning id, email, name`,
      [email, (ADMIN_BOOTSTRAP_NAME ?? "").trim() || "Super Admin", passwordHash],
    );
    const user = rows[0];
    if (!user) throw new Error("Failed to upsert user");

    const roleResult = await client.query(
      `select id from admin_roles where key = 'super_admin' limit 1`,
    );
    const role = roleResult.rows[0];
    if (!role) {
      throw new Error("super_admin role not found — run `node scripts/admin-migrate.mjs` first");
    }

    const grant = await client.query(
      `insert into admin_user_roles (user_id, role_id, arm, region_slug, chapter_slug)
       values ($1, $2, null, null, null)
       on conflict (user_id, role_id, arm, region_slug, chapter_slug)
       do nothing
       returning user_id`,
      [user.id, role.id],
    );

    console.log("Super admin ready:");
    console.log(`  email: ${user.email}`);
    console.log(`  name:  ${user.name}`);
    console.log(`  role:  super_admin${grant.rows.length ? " (granted)" : " (already present)"}`);
  } finally {
    client.release();
  }
  await pool.end();
}

main().catch((error) => {
  console.error("Bootstrap failed:", error);
  process.exitCode = 1;
});
