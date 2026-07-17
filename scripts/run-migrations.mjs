// Applies every SQL file in supabase/migrations (in filename order) to the
// database given by DATABASE_URL. Each file is sent as one multi-statement
// query. Usage:
//   DATABASE_URL='postgresql://...' node scripts/run-migrations.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, '..', 'supabase', 'migrations');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('ERROR: DATABASE_URL is not set.');
  process.exit(1);
}

const files = readdirSync(dir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 20000,
});

const run = async () => {
  await client.connect();
  console.log(`Connected. Applying ${files.length} migration file(s):\n`);
  for (const file of files) {
    const sql = readFileSync(join(dir, file), 'utf8');
    process.stdout.write(`  • ${file} … `);
    try {
      await client.query(sql);
      console.log('OK');
    } catch (err) {
      console.log('FAILED');
      console.error(`\n    ${err.message}\n`);
      throw err;
    }
  }
  console.log('\nAll migrations applied successfully.');
};

run()
  .catch((err) => {
    console.error('Migration run aborted:', err.message);
    process.exitCode = 1;
  })
  .finally(() => client.end());
