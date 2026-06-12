import { getTableName, sql } from "drizzle-orm";
import { db } from "../drizzle";
import { tableNames } from "./table-names";

async function clearTriggers() {
  for (const table of tableNames) {
    const tableName = getTableName(table);
    await db.execute(sql`
      DROP TRIGGER IF EXISTS set_updated_at_on_${sql.raw(tableName)}
      ON ${table};
    `);
  }

  await db.execute(sql`
    DROP FUNCTION IF EXISTS set_updated_at();
  `);

  console.log(`[✓] Triggers dropped for ${tableNames.length} tables`);
}

clearTriggers();
