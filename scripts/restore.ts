import * as fs from 'node:fs';
import { PrismaClient } from '@prisma/client';

const BACKUP_PATH = './scripts/output/backup.json';

const prisma = new PrismaClient();

function safeIdent(name: string) {
  if (!name) {
    throw new Error(`Invalid table name: ${name}`);
  }

  if (!/^[A-Za-z0-9_]+$/.test(name)) {
    throw new Error(`Unsafe identifier: ${name}`);
  }

  return name;
}

async function tableExists(tableName: string) {
  try {
    const ident = safeIdent(tableName);
    const result = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${ident}
      ) as "exists"
    `;
    return result[0].exists;
  } catch (error) {
    console.error(`Error checking table ${tableName}:`, error);
    return false;
  }
}

async function restore() {
  try {
    if (!fs.existsSync(BACKUP_PATH)) {
      throw new Error('output/backup.json not found');
    }

    const raw = JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf-8'));

    const models = Object.entries(prisma)
      .filter(
        ([, delegate]) => delegate && typeof delegate.createMany === 'function',
      )
      .map(([name]) => name);

    console.log('Models found:', models);

    for (const model of models) {
      const tableName = model.charAt(0).toUpperCase() + model.slice(1);
      const records = raw[tableName];

      if (!records || !records.length) {
        console.log(`Skipping ${model}: no data in backup`);
        continue;
      }

      const exists = await tableExists(tableName);
      if (!exists) {
        console.warn(`⚠️ Table ${tableName} not found in database, skipping`);
        continue;
      }

      try {
        await prisma[model].createMany({ data: records, skipDuplicates: true });
        console.log(`createMany -> ${model}: ${records.length}`);
      } catch (e) {
        console.warn(
          `createMany failed for ${model}, falling back to per-row create`,
        );
        for (const r of records) {
          try {
            await prisma[model].create({ data: r });
          } catch (err) {
            console.warn(`[${model}] insert failed:`, err.message);
          }
        }
      }
    }

    console.log('restore finished');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

restore()
  .then(() => {
    console.log('Restore completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Restore failed:', err);
    process.exit(1);
  });
