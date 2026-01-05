import * as fs from 'node:fs';
import { PrismaClient } from '@prisma/client';

const OUTPUT_DIR = './scripts/output';
const BACKUP_PATH = './scripts/output/backup.json';

const prisma = new PrismaClient();

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function safeIdent(name: string) {
  if (!name) {
    throw new Error(`Invalid table name: ${name}`);
  }

  if (!/^[A-Za-z0-9_]+$/.test(name)) {
    throw new Error(`Unsafe identifier: ${name}`);
  }

  return name;
}

function loadExistingBackup() {
  if (!fs.existsSync(BACKUP_PATH)) {
    return {};
  }

  try {
    const content = fs.readFileSync(BACKUP_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('⚠️ Failed to load existing backup, starting fresh:', error);
    return {};
  }
}

async function getTableNames() {
  try {
    const tables = await prisma.$queryRaw<Array<{ tableName: string }>>`
      SELECT table_name as "tableName"
      FROM information_schema.tables
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name != '_prisma_migrations'
      ORDER BY table_name;
    `;
    return tables.map((row) => row.tableName);
  } catch (error) {
    console.error('⛔ Error fetching table names:', error);
    throw error;
  }
}

async function backupTable(tableName: string) {
  try {
    const ident = safeIdent(tableName);
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM "${ident}"`);

    return JSON.parse(
      JSON.stringify(rows, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );
  } catch (error) {
    console.error(`Error backing up table ${tableName}:`, error);
    throw error;
  }
}

async function main() {
  ensureOutputDir();
  const existingBackup = loadExistingBackup();

  try {
    const tables = await getTableNames();
    console.log(`Found ${tables.length} tables to back up`);

    for (const table of tables) {
      console.log(`Backing up table: ${table}`);
      existingBackup[table] = await backupTable(table);
    }

    fs.writeFileSync(BACKUP_PATH, JSON.stringify(existingBackup, null, 2));
    console.log(`✅ Backup successfully written to: ${BACKUP_PATH}`);
    return { success: true, tables: tables.length };
  } catch (error) {
    console.error('⛔ Backup failed:', error);
    throw error;
  }
}

process.on('uncaughtException', (error) => {
  console.error('⛔ Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⛔ Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main()
  .then(({ tables }) => {
    console.log(`✅ Successfully backed up ${tables} tables`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('⛔ Critical error during backup:', error);
    process.exit(1);
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error('⛔ Error disconnecting from database:', error);
    }
  });
