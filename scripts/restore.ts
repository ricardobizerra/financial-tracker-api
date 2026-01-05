import * as fs from 'node:fs';
import { PrismaClient } from '@prisma/client';

const BACKUP_PATH = './scripts/output/backup.json';

const prisma = new PrismaClient();

// Maps model names to their FK fields that need to be converted to relations
const RELATION_FIELDS: Record<string, Record<string, string>> = {
  investment: {
    userId: 'user',
    accountId: 'account',
  },
  account: {
    userId: 'user',
    institutionId: 'institution',
  },
  accountCard: {
    accountId: 'account',
  },
  cardBilling: {
    accountCardId: 'accountCard',
    paymentTransactionId: 'paymentTransaction',
  },
  cardBillingHistory: {
    cardBillingId: 'cardBilling',
    changedById: 'changedBy',
  },
  investmentTransaction: {
    investmentId: 'investment',
    accountId: 'account',
  },
  transaction: {
    sourceAccountId: 'sourceAccount',
    destinyAccountId: 'destinyAccount',
    cardBillingId: 'cardBilling',
    recurringTransactionId: 'recurringTransaction',
    userId: 'user',
  },
  transactionInstallment: {
    transactionId: 'transaction',
    cardBillingId: 'cardBilling',
  },
  recurringTransaction: {
    sourceAccountId: 'sourceAccount',
    destinyAccountId: 'destinyAccount',
    userId: 'user',
  },
};

/**
 * Converts FK fields to Prisma relation connect format
 * e.g., { userId: "123" } -> { user: { connect: { id: "123" } } }
 */
function convertToRelationFormat(
  model: string,
  data: Record<string, unknown>,
): Record<string, unknown> {
  const relationMap = RELATION_FIELDS[model];
  if (!relationMap) return data;

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const relationName = relationMap[key];
    if (relationName && value !== null && value !== undefined) {
      // Convert FK to relation connect format
      result[relationName] = { connect: { id: value } };
    } else if (!relationMap[key]) {
      // Keep non-FK fields as-is
      result[key] = value;
    }
    // If FK is null/undefined, skip (don't add to result for optional relations)
  }

  return result;
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
            const convertedData = convertToRelationFormat(model, r);
            await prisma[model].create({ data: convertedData });
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
