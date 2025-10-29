import { PrismaClient } from '@prisma/client';

interface Institution {
  id: number;
  name: string;
  imageUrl: string;
  primaryColor: string;
}

const prisma = new PrismaClient();

async function createApiKey(): Promise<string> {
  const response = await fetch('https://api.pluggy.ai/auth', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      clientId: process.env.PLUGGY_CLIENT_ID,
      clientSecret: process.env.PLUGGY_CLIENT_SECRET,
    }),
  });

  const data = await response.json();

  return data.apiKey;
}

async function fetchInstitutions(apiKey: string): Promise<Institution[]> {
  const response = await fetch(
    'https://api.pluggy.ai/connectors?countries=BR',
    {
      headers: {
        'X-API-KEY': apiKey,
        accept: 'application/json',
      },
    },
  );

  const data = await response.json();
  return data.results as Institution[];
}

async function seedInstitutions() {
  const apiKey = await createApiKey();
  const institutions = await fetchInstitutions(apiKey);

  await Promise.all(
    institutions.map((institution) => {
      const institutionColor = institution.primaryColor.startsWith('#')
        ? institution.primaryColor
        : `#${institution.primaryColor}`;

      const data = {
        name: institution.name,
        code: institution.id.toString(),
        logoUrl: institution.imageUrl,
        color: institutionColor,
      };

      return prisma.institution.upsert({
        where: {
          code: institution.id.toString(),
        },
        create: data,
        update: data,
      });
    }),
  );
}

seedInstitutions()
  .then(() => {
    console.log('📊 Institutions seeded successfully');
    process.exit(0);
  })
  .catch((e) => {
    console.error('⛔ Error seeding institutions:', e);
    process.exit(1);
  });
