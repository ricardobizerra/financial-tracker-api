import {
  Args,
  Field,
  Float,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import {
  AiService,
  CategorySuggestion as CategorySuggestionType,
} from './ai.service';
import { Auth } from '@/auth/auth.decorator';
import { TransactionCategory } from '@/lib/graphql/prisma-client';
import { CurrentUser } from '@/user/user.decorator';
import { UserModel } from '@/user/models/user.model';
import { TransactionService } from '@/transaction/transaction.service';
import { startOfMonth, endOfMonth } from 'date-fns';

@ObjectType()
export class CategorySuggestion {
  @Field(() => TransactionCategory)
  category: TransactionCategory;

  @Field(() => Float)
  confidence: number;

  @Field(() => String, { nullable: true })
  reasoning?: string;
}

@ObjectType()
export class ChatResponse {
  @Field(() => String)
  message: string;
}

@Resolver()
export class AiResolver {
  constructor(
    private readonly aiService: AiService,
    private readonly transactionService: TransactionService,
  ) {}

  @Auth()
  @Query(() => CategorySuggestion, { name: 'suggestCategory' })
  async suggestCategory(
    @Args('description', { type: () => String }) description: string,
  ): Promise<CategorySuggestionType> {
    return this.aiService.suggestCategory(description);
  }

  @Auth()
  @Mutation(() => ChatResponse, { name: 'chat' })
  async chat(
    @Args('message', { type: () => String }) message: string,
    @CurrentUser() user: UserModel,
  ): Promise<ChatResponse> {
    // Buscar contexto financeiro do usuário para o mês atual
    const now = new Date();
    const summary = await this.transactionService.getSummary({
      userId: user.id,
      filterArgs: {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      },
      searchArgs: { search: '' },
    });

    const response = await this.aiService.chat(message, {
      monthlyIncome: summary.totalIncome,
      monthlyExpenses: summary.totalExpense,
    });

    return { message: response };
  }
}
