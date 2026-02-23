import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { Env } from '@/env';
import { TransactionCategory } from '@/lib/graphql/prisma-client';

export interface CategorySuggestion {
  category: TransactionCategory;
  confidence: number;
  reasoning?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly ai: GoogleGenAI;
  private readonly model = 'gemini-2.5-flash';

  // Mapeamento de categorias para descrições em português
  private readonly categoryDescriptions: Record<TransactionCategory, string> = {
    FOOD_DINING: 'Alimentação (restaurantes, delivery, mercado)',
    TRANSPORT: 'Transporte (uber, combustível, transporte público)',
    HOUSING: 'Moradia (aluguel, condomínio, IPTU)',
    UTILITIES: 'Contas (luz, água, internet, telefone)',
    HEALTHCARE: 'Saúde (farmácia, consultas, plano de saúde)',
    ENTERTAINMENT: 'Lazer (streaming, jogos, cinema)',
    SHOPPING: 'Compras (roupas, eletrônicos, outros)',
    EDUCATION: 'Educação (cursos, livros, escola)',
    TRAVEL: 'Viagens (passagens, hospedagem)',
    SALARY: 'Salário e renda',
    INVESTMENT_INCOME: 'Rendimentos de investimentos',
    TRANSFER: 'Transferências entre contas',
    OTHER: 'Outros',
  };

  constructor(private readonly configService: ConfigService<Env, true>) {
    const apiKey = this.configService.get('GEMINI_API_KEY', { infer: true });
    if (!apiKey) {
      this.logger.warn(
        'GEMINI_API_KEY não configurada. Funcionalidades de IA estarão indisponíveis.',
      );
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  /**
   * Sugere uma categoria para uma transação baseada na descrição
   */
  async suggestCategory(description: string): Promise<CategorySuggestion> {
    if (!this.configService.get('GEMINI_API_KEY')) {
      return {
        category: TransactionCategory.OTHER,
        confidence: 0,
        reasoning: 'API de IA não configurada',
      };
    }

    const categoriesInfo = Object.entries(this.categoryDescriptions)
      .map(([key, desc]) => `- ${key}: ${desc}`)
      .join('\n');

    const prompt = `Você é um assistente financeiro especializado em categorizar transações.

Categorias disponíveis:
${categoriesInfo}

Com base na descrição da transação abaixo, retorne APENAS um JSON válido com:
- category: a categoria mais apropriada (use o nome exato da lista acima)
- confidence: um número de 0 a 1 indicando sua confiança
- reasoning: uma breve explicação em português

Descrição da transação: "${description}"

Responda APENAS com o JSON, sem markdown ou texto adicional.`;

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          maxOutputTokens: 200,
          temperature: 0.3, // Baixa temperatura para respostas mais consistentes
        },
      });

      const text = response.text?.trim() || '';

      // Remove possíveis marcadores de código markdown
      const jsonText = text.replace(/```json\n?|\n?```/g, '').trim();

      const result = JSON.parse(jsonText);

      // Valida se a categoria retornada é válida
      if (!Object.values(TransactionCategory).includes(result.category)) {
        this.logger.warn(
          `Categoria inválida retornada pela IA: ${result.category}`,
        );
        return {
          category: TransactionCategory.OTHER,
          confidence: 0.5,
          reasoning: 'Categoria não reconhecida',
        };
      }

      return {
        category: result.category as TransactionCategory,
        confidence: Math.min(Math.max(result.confidence || 0.5, 0), 1),
        reasoning: result.reasoning,
      };
    } catch (error) {
      this.logger.error('Erro ao sugerir categoria:', error);
      return {
        category: TransactionCategory.OTHER,
        confidence: 0,
        reasoning: 'Erro ao processar sugestão',
      };
    }
  }

  /**
   * Processa uma mensagem de chat do usuário com contexto financeiro
   */
  async chat(
    message: string,
    financialContext: {
      totalBalance?: number;
      monthlyIncome?: number;
      monthlyExpenses?: number;
      topCategories?: Array<{ category: string; total: number }>;
    },
  ): Promise<string> {
    if (!this.configService.get('GEMINI_API_KEY')) {
      return 'Desculpe, o assistente de IA não está configurado. Configure a GEMINI_API_KEY para usar esta funcionalidade.';
    }

    const contextInfo = [];
    if (financialContext.totalBalance !== undefined) {
      contextInfo.push(
        `Saldo total: R$ ${financialContext.totalBalance.toFixed(2)}`,
      );
    }
    if (financialContext.monthlyIncome !== undefined) {
      contextInfo.push(
        `Receita do mês: R$ ${financialContext.monthlyIncome.toFixed(2)}`,
      );
    }
    if (financialContext.monthlyExpenses !== undefined) {
      contextInfo.push(
        `Despesas do mês: R$ ${financialContext.monthlyExpenses.toFixed(2)}`,
      );
    }
    if (
      financialContext.topCategories &&
      financialContext.topCategories.length > 0
    ) {
      const categoriesStr = financialContext.topCategories
        .map((c) => `${c.category}: R$ ${c.total.toFixed(2)}`)
        .join(', ');
      contextInfo.push(`Principais categorias: ${categoriesStr}`);
    }

    const systemPrompt = `Você é um assistente financeiro pessoal amigável e prestativo.
Responda de forma concisa e objetiva em português brasileiro.
Use formatação simples (sem markdown complexo).
Forneça insights úteis sobre finanças pessoais quando apropriado.

${contextInfo.length > 0 ? `Contexto financeiro do usuário:\n${contextInfo.join('\n')}` : 'Nota: Sem dados financeiros disponíveis para contexto.'}`;

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          {
            role: 'model',
            parts: [
              { text: 'Entendido! Como posso ajudar com suas finanças hoje?' },
            ],
          },
          { role: 'user', parts: [{ text: message }] },
        ],
        config: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });

      return response.text || 'Desculpe, não consegui processar sua mensagem.';
    } catch (error) {
      this.logger.error('Erro no chat:', error);
      return 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.';
    }
  }
}
