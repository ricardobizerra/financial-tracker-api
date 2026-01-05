import { PrismaClient, AccountType } from '@prisma/client';

/**
 * Normaliza um código hex (ex: #F0A -> #FF00AA)
 */
function normalizeHex(hex: string): string {
  if (hex.length === 4) {
    // #F0A
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
}

/**
 * Analisa uma string SVG e extrai a cor (hex) mais frequente.
 *
 * @param svgString O conteúdo do arquivo SVG como uma string.
 * @returns A cor hexadecimal mais provável (ex: "#ec7000") ou null se nenhuma for encontrada.
 */
function extractMainColorFromSVG(svgString: string): string | null {
  // Cores a ignorar (em formato 6-dígitos lowercase)
  const IGNORE_COLORS = new Set([
    '#ffffff', // white
    '#000000', // black
  ]);

  const colorCounts = new Map<string, number>();

  // Regex para encontrar códigos hex de 3 ou 6 dígitos
  // Ex: #FFF, #ff0000, #123456
  // Isso varre o arquivo de texto inteiro, funcionando para <style>, style="", e fill=""
  const hexRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g;

  const matches = svgString.match(hexRegex);

  if (!matches) {
    console.warn('Nenhum código hex encontrado no SVG.');
    return null; // Nenhuma cor encontrada
  }

  for (const match of matches) {
    const lowerColor = match.toLowerCase();

    // Normaliza (ex: #f00 -> #ff0000)
    const normalizedColor = normalizeHex(lowerColor);

    // Checa se a cor normalizada deve ser ignorada
    if (IGNORE_COLORS.has(normalizedColor)) {
      continue;
    }

    // Contabiliza a cor
    const count = (colorCounts.get(normalizedColor) || 0) + 1;
    colorCounts.set(normalizedColor, count);
  }

  // Encontrar a cor mais frequente
  if (colorCounts.size === 0) {
    return null; // Só encontrou cores ignoradas
  }

  let mainColor: string | null = null;
  let maxCount = 0;

  for (const [color, count] of colorCounts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      mainColor = color;
    }
  }

  return mainColor;
}

/**
 * Busca um SVG de uma URL e extrai sua cor principal.
 *
 * @param url A URL completa (https://...) do arquivo SVG.
 * @returns Uma Promise que resolve para a cor principal (string) ou null.
 */
async function fetchAndExtractColor(url: string): Promise<string | null> {
  try {
    // 1. Buscar o conteúdo da URL
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Falha ao buscar SVG: ${response.status} ${response.statusText}`,
      );
    }

    // 2. Obter o conteúdo como texto
    const svgString = await response.text();

    // Verificação rápida se parece ser um SVG
    if (
      !svgString.trim().startsWith('<svg') &&
      !svgString.trim().startsWith('<?xml')
    ) {
      console.warn(`O conteúdo da URL ${url} não parece ser um SVG.`);
      return null;
    }

    // 3. Chamar a função de análise (a nova, baseada em Regex)
    return extractMainColorFromSVG(svgString);
  } catch (error) {
    console.error(`Erro no processo de fetch ou análise para ${url}:`, error);
    return null;
  }
}

const prisma = new PrismaClient();

/**
 * Tipos de string literais para status, com base no YAML.
 */
type StatusParticipante = 'Active' | 'Pending' | 'Withdrawn';
type StatusCertificacaoApi =
  | 'Awaiting Certification'
  | 'Certified'
  | 'Deprecated'
  | 'Rejected'
  | 'Self-Certified';
type StatusDominio = 'Active' | 'Inactive';

/**
 * Representa uma autorização dentro de um OrgDomainRoleClaim.
 * Baseado na definição 'Authorisations' do YAML.
 */
interface AutorizacaoDominio {
  Status: StatusDominio;
  MemberState: string;
}

/**
 * Interface raiz que representa o participante do sistema financeiro.
 */
interface ParticipanteFinanceiro {
  OrganisationId: string;
  Status: StatusParticipante; // Atualizado para o enum do YAML
  OrganisationName: string;
  CreatedOn: string; // ISO Date String
  LegalEntityName: string;
  CountryOfRegistration: string;
  CompanyRegister: string;
  Tags: unknown | null; // O JSON tem 'Tags' (plural), o YAML tem 'Tag' (singular)
  Flags: OrganisationFlags;
  Size: string; // Adicionado (estava no JSON e YAML)
  TaxRegistrationNumber: string | null;
  RegistrationNumber: string;
  RegistrationId: string;
  RegisteredName: string;
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  Postcode: string;
  Country: string;
  ParentOrganisationReference: string;
  AuthorisationServers: AuthorisationServer[];
  OrgDomainClaims: OrgDomainClaim[];
  OrgDomainRoleClaims: OrgDomainRoleClaim[];
}

/**
 * Flags no nível raiz da organização.
 * (Presente no JSON, mas ausente no YAML)
 */
interface OrganisationFlags {
  'Homologação Pix Tester': string[];
  generated: string[];
}

/**
 * Representa um servidor de autorização da organização.
 */
interface AuthorisationServer {
  AutoRegistrationSupported: boolean;
  AutoRegistrationNotificationWebhook: string | null;
  CustomerFriendlyDescription: string;
  CustomerFriendlyLogoUri: string; // YAML especifica .svg
  CustomerFriendlyName: string;
  DeveloperPortalUri: string;
  TermsOfServiceUri: string | null;
  NotificationWebhook: string | null;
  OpenIDDiscoveryDocument: string;
  PayloadSigningCertLocationUri: string;
  ParentAuthorisationServerId: string | null;
  DeprecatedDate: string; // ISO Date String
  RetirementDate: string; // ISO Date String
  SupersededByAuthorisationServerId: string | null; // <<< Corrigi para 'string | null'
  FederationId: string | null;
  OmitFromEcosystem: unknown | null;
  AuthorisationServerId: string;
  OrganisationId: string;
  Issuer: string;
  FederationEndpoint: string | null;
  NotificationWebhookAddedDate: string | null; // ISO Date String
  NotificationWebhookStatus: string | null;
  SupportsCiba: boolean;
  SupportsDCR: boolean;
  SupportsRedirect: boolean;
  CreatedAt: string; // ISO Date String
  Status: string; // O JSON tinha 'Active', mas o YAML não especificou enum aqui
  ApiResources: ApiResource[];
  AuthorisationServerCertifications: AuthorisationServerCertification[];
  Flags: AuthorisationServerFlags;
}

/**
 * Representa um endpoint de descoberta de API.
 */
interface ApiDiscoveryEndpoint {
  ApiDiscoveryId: string;
  ApiEndpoint: string;
}

/**
 * Representa um recurso de API (conjunto de endpoints)
 * associado a um servidor de autorização.
 */
interface ApiResource {
  ApiResourceId: string;
  ApiVersion: string;
  FamilyComplete: boolean;
  ApiCertificationUri: string;
  CertificationStatus: StatusCertificacaoApi; // Atualizado para o enum do YAML
  CertificationStartDate: string;
  CertificationExpirationDate: string;
  ApiFamilyType: string;
  Status: string; // O JSON tinha 'Active'
  ApiDiscoveryEndpoints: ApiDiscoveryEndpoint[];
}

/**
 * Representa uma certificação do servidor de autorização.
 */
interface AuthorisationServerCertification {
  CertificationStartDate: string;
  CertificationExpirationDate: string;
  CertificationId: string;
  AuthorisationServerId: string;
  CertificationStatus: StatusCertificacaoApi; // Atualizado para o enum do YAML
  ProfileVariant: string; // YAML tem enums mais complexos (CertificationRedirectEnum, etc.)
  ProfileType: string;
  ProfileVersion: number;
  CertificationURI: string;
  Status: StatusCertificacaoApi; // Atualizado para o enum do YAML
}

/**
 * Flags específicas do servidor de autorização.
 */
interface AuthorisationServerFlags {
  'Suporta Contas PF': string[];
  G3: string[];
  'Suporta Contas PJ': string[];
}

/**
 * Representa um "claim" de domínio da organização.
 * (Mapeado de 'OrganisationAuthorityDomainClaim' no YAML)
 */
interface OrgDomainClaim {
  AuthorisationDomainName: string;
  AuthorityName: string;
  RegistrationId: string;
  Status: StatusDominio; // Atualizado para o enum do YAML
}

/**
 * Representa um "claim" de papel (role) de domínio da organização.
 * (Mapeado de 'OrganisationAuthorityClaim' no YAML)
 */
interface OrgDomainRoleClaim {
  AuthorisationDomainRoleIdentifier: string;
  Status: StatusDominio; // Atualizado para o enum do YAML
  AuthorisationDomain: string;
  Role: string;
  RegistrationId: string;
  UniqueTechnicalIdentifiers: unknown | null;
  Authorisations: AutorizacaoDominio[]; // Atualizado para o tipo do YAML
  RoleType: string;
  Exclusive: boolean;
  Metadata: unknown[];
}

const INVESTMENT_FAMILIES: Set<string> = new Set([
  'variable-incomes',
  'credit-fixed-incomes',
  'bank-fixed-incomes',
  'treasure-titles',
  'funds',
]);

enum CustomerType {
  PJ_ONLY = 'PJ_ONLY',
  PF_ONLY = 'PF_ONLY',
  PF_PJ_MIXED = 'PF_PJ_MIXED',
  UNKNOWN = 'UNKNOWN',
}

type InstitutionBrasilAPI = {
  ispb: string;
  name: string;
  code: number | null;
  fullName: string;
};

async function fetchInstitutionsFromBrasilAPI(): Promise<
  InstitutionBrasilAPI[]
> {
  console.log('Buscando instituições no Brasil API...');

  const response = await fetch('https://brasilapi.com.br/api/banks/v1', {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao buscar instituições: ${response.statusText}`);
  }

  const data: (InstitutionBrasilAPI & { code: string | null })[] =
    await response.json();
  console.log(`Encontrados ${data.length} instituições no Brasil API.`);
  return data.filter((institution) => !!institution.code);
}

async function fetchOpenFinanceParticipants(): Promise<
  ParticipanteFinanceiro[]
> {
  console.log('Buscando instituições no Open Finance Brasil...');

  const response = await fetch(
    'https://data.directory.openbankingbrasil.org.br/participants',
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Falha ao buscar participantes: ${response.statusText}`);
  }

  const data: ParticipanteFinanceiro[] = await response.json();
  console.log(
    `Encontrados ${data.length} participantes no Open Finance Brasil.`,
  );
  return data;
}

/**
 * Função principal que implementa a lógica de categorização
 */
function getAccountTypesForServer(server: AuthorisationServer): AccountType[] {
  // Usar um Set garante que não teremos tipos duplicados
  const outputTypes = new Set<AccountType>();

  // Primeiro, pegamos todos os tipos de família únicos que este servidor oferece
  const apiFamilies = new Set(
    server.ApiResources.map((resource) => resource.ApiFamilyType),
  );

  // Agora, iteramos sobre as famílias únicas e aplicamos nossa lógica
  for (const family of apiFamilies) {
    // Este é o bloco "if-else" que você pediu,
    // aplicado para cada família de API que a instituição possui.

    if (family === 'accounts' || family.startsWith('opendata-accounts_')) {
      // A API 'accounts' cobre os três tipos
      outputTypes.add(AccountType.CHECKING);
      outputTypes.add(AccountType.SAVINGS);
      outputTypes.add(AccountType.WALLET);
    } else if (
      family === 'credit-cards-accounts' ||
      family.startsWith('opendata-creditcards_')
    ) {
      outputTypes.add(AccountType.CREDIT_CARD);
    } else if (
      INVESTMENT_FAMILIES.has(family) ||
      family.startsWith('opendata-investments_')
    ) {
      outputTypes.add(AccountType.INVESTMENT);
    }
  }

  // Converte o Set de volta para um array
  return Array.from(outputTypes);
}

/**
 * Analisa um AuthorisationServer e determina seu tipo de cliente (PF, PJ ou Misto).
 */
function getCustomerTypeForServer(server: AuthorisationServer): CustomerType {
  // Coleta todas as famílias de API únicas
  const apiFamilies = new Set(
    server.ApiResources.map((resource) => resource.ApiFamilyType),
  );

  let hasPersonalApis = false;
  let hasBusinessApis = false;

  // Itera sobre as famílias para encontrar sinais de PF ou PJ
  for (const family of apiFamilies) {
    if (family.includes('personal')) {
      hasPersonalApis = true;
    }
    if (family.includes('business')) {
      hasBusinessApis = true;
    }
  }

  // --- Lógica de Classificação ---

  // 1. Se tem APIs 'business' E NÃO tem APIs 'personal'
  if (hasBusinessApis && !hasPersonalApis) {
    return CustomerType.PJ_ONLY;
  }

  // 2. Se tem os dois tipos
  if (hasBusinessApis && hasPersonalApis) {
    return CustomerType.PF_PJ_MIXED;
  }

  // 3. Se tem apenas APIs 'personal'
  if (hasPersonalApis && !hasBusinessApis) {
    return CustomerType.PF_ONLY;
  }

  // 4. Se não encontramos nenhuma (ex: APIs de 'admin' ou 'discovery')
  return CustomerType.UNKNOWN;
}

/**
 * Função principal para orquestrar o processo de seeding.
 */
async function seedInstitutions() {
  const [participants, institutionsBrasilAPI] = await Promise.all([
    fetchOpenFinanceParticipants(),
    fetchInstitutionsFromBrasilAPI(),
  ]);

  console.log('🔄 Iniciando processo de upsert no banco de dados...');

  // Usamos um Map para evitar duplicatas de organizações (baseado no CNPJ)
  // O Open Finance pode listar a mesma organização múltiplas vezes
  const institutionMap: Array<{
    cnpj: string;
    name: string;
    logoUrl: string;
    status: string;
    types: AccountType[];
    code: string | null;
  }> = [];

  for (const participant of participants) {
    // Pulamos participantes sem CNPJ ou sem "Authorisation Servers"
    if (
      !participant.RegistrationNumber ||
      !participant.AuthorisationServers?.length
    ) {
      console.log(
        'Pulando participante sem CNPJ ou sem "Authorisation Servers"',
      );
      continue;
    }

    // Filtra os servidores para pegar apenas os que NÃO foram depreciados
    // Como a data de desativação pode ser no futuro, usamos a data atual para verificar
    const activeAuthorisationServers = participant.AuthorisationServers.filter(
      (server) =>
        !server.DeprecatedDate ||
        (!!server.DeprecatedDate &&
          new Date(server.DeprecatedDate) > new Date()),
    );

    // Itera APENAS sobre os servidores ativos filtrados
    for (const authorisationServer of activeAuthorisationServers) {
      if (
        !authorisationServer.CustomerFriendlyName ||
        !authorisationServer.CustomerFriendlyLogoUri
      ) {
        console.log('Pulando participante sem nome amigável ou sem logo');
        continue;
      }

      if (authorisationServer.Flags?.['Suporta Contas PF']?.length === 0) {
        console.log('Pulando participante sem suporte a Contas PF');
        continue;
      }

      const types = getAccountTypesForServer(authorisationServer);

      if (types.length === 0) {
        console.log('Pulando participante sem tipos de contas');
        continue;
      }

      const customerType = getCustomerTypeForServer(authorisationServer);

      if (
        customerType === CustomerType.PJ_ONLY ||
        customerType === CustomerType.UNKNOWN
      ) {
        console.log('Pulando participante sem suporte a Contas PF');
        continue;
      }

      const brasilApiInstitution = institutionsBrasilAPI.find((i) =>
        participant.RegistrationNumber.startsWith(i.ispb),
      );

      // Mapeia os dados da API para o seu schema do Prisma
      const data = {
        cnpj: participant.RegistrationNumber, // CNPJ como código único
        name: authorisationServer.CustomerFriendlyName,
        logoUrl: authorisationServer.CustomerFriendlyLogoUri,
        status: participant.Status,
        types,
        code: brasilApiInstitution?.code
          ? String(brasilApiInstitution.code).padStart(3, '0')
          : null,
      };

      // Adiciona ao Map, usando o 'code' (CNPJ) como chave para de-duplicar
      institutionMap.push(data);
    }
  }

  // Replace the existing Promise.all block with this updated version
  await Promise.all(
    institutionMap.map(async (institution) => {
      // First, try to find an existing institution with the same code, name, or logo URL
      const existingInstitution = await prisma.institution.findFirst({
        where: {
          code: institution.code ?? '000',
          name: institution.name,
          logoUrl: institution.logoUrl,
        },
      });

      if (existingInstitution) {
        // Update the existing institution
        return prisma.institution.update({
          where: { id: existingInstitution.id },
          data: {
            code: institution.code ?? '000',
            name: institution.name,
            logoUrl: institution.logoUrl,
            types: institution.types,
            color:
              (await fetchAndExtractColor(institution.logoUrl)) ??
              existingInstitution.color,
          },
        });
      } else {
        return prisma.institution.create({
          data: {
            code: institution.code ?? '000',
            name: institution.name,
            logoUrl: institution.logoUrl,
            types: institution.types,
            color:
              (await fetchAndExtractColor(institution.logoUrl)) ?? '#000000',
          },
        });
      }
    }),
  );

  console.log(
    `✅ Sucesso! ${institutionMap.length} instituições foram sincronizadas.`,
  );
}

// Executa a função principal
seedInstitutions()
  .then(() => {
    console.log('📊 Institutions seeded successfully');
    process.exit(0);
  })
  .catch((e) => {
    console.error('⛔ Error seeding institutions:', e);
    process.exit(1);
  });
