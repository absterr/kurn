import { getTableName, sql } from "drizzle-orm";
import { db } from "../drizzle";
import { tableNames } from "./table-names";

async function setupTriggers() {
  try {
    await db.execute(sql`
          CREATE OR REPLACE FUNCTION set_updated_at()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = now();
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;
        `);

    for (const table of tableNames) {
      const tableName = getTableName(table);
      await db.execute(sql`
            CREATE OR REPLACE TRIGGER set_updated_at_on_${sql.raw(tableName)}
            BEFORE UPDATE ON ${table}
            FOR EACH ROW
            EXECUTE FUNCTION set_updated_at();
          `);
    }

    console.log(`[✓] Triggers applied for ${tableNames.length} tables`);
  } catch (error) {
    console.error("[✗] Failed to set up triggers: ", error);
    process.exit(1);
  }
}

setupTriggers();
