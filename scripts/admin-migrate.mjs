/**
 * Applies the admin-governance schema (DDL + permission/role seed) to the
 * Postgres database named by ADMIN_DATABASE_URL.
 *
 * Usage:
 *   node scripts/admin-migrate.mjs
 *
 * Safe to run repeatedly — every statement is idempotent (IF NOT EXISTS /
 * ON CONFLICT DO NOTHING) and the whole run is wrapped in a transaction.
 */
import { Pool } from "@neondatabase/serverless";
import { ADMIN_DDL_STATEMENTS } from "../src/admin/db/schema.ts";
import { PERMISSION_DESCRIPTIONS } from "../src/admin/rbac/permissions.ts";
import { ROLE_DEFINITIONS } from "../src/admin/rbac/roles.ts";

const connectionString = process.env.ADMIN_DATABASE_URL;
if (!connectionString) {
  console.error("Missing ADMIN_DATABASE_URL");
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function main() {
  const client = await pool.connect();
  try {
    await client.query("begin");

    for (const statement of ADMIN_DDL_STATEMENTS) {
      await client.query(statement);
    }

    console.log(`Seeding ${Object.keys(PERMISSION_DESCRIPTIONS).length} permissions…`);
    for (const [key, description] of Object.entries(PERMISSION_DESCRIPTIONS)) {
      await client.query(
        `insert into admin_permissions (key, description) values ($1, $2)
         on conflict (key) do nothing`,
        [key, description],
      );
    }

    console.log(`Seeding ${Object.keys(ROLE_DEFINITIONS).length} roles…`);
    for (const role of Object.values(ROLE_DEFINITIONS)) {
      await client.query(
        `insert into admin_roles (key, name, description) values ($1, $2, $3)
         on conflict (key) do nothing`,
        [role.key, role.name, role.description],
      );
      for (const permission of role.permissions) {
        await client.query(
          `insert into admin_role_permissions (role_id, permission_key)
           select r.id, $2 from admin_roles r where r.key = $1
           on conflict (role_id, permission_key) do nothing`,
          [role.key, permission],
        );
      }
    }

    await client.query("commit");
    console.log("Migration applied successfully.");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
  await pool.end();
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exitCode = 1;
});
