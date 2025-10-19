import {
  Args,
  Context,
  ID,
  Info,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { UserService } from '@/user/user.service';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { getQueriedFields } from '@/utils/get-queried-fields';
import { Role, UserCreateInput } from '@/lib/graphql/prisma-client';
import { RedisSubscriptionService } from '@/lib/redis/redis-subscription.service';
import { OrdenationUserArgs, UserModel } from '@/user/models/user.model';
import { Auth } from '@/auth/auth.decorator';
import { CurrentUser } from './user.decorator';
import { AuthService } from '@/auth/auth.service';
import { SignIn } from '@/auth/models/sign-in.model';
import { UserConnection } from './models/user.connection';
import { PaginationArgs } from '@/utils/args/pagination.args';
import { SearchArgs } from '@/utils/args/search.args';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/env';
import { Response } from 'express';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly redisSubscriptionService: RedisSubscriptionService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  @Query(() => UserConnection, { name: 'users' })
  async findMany(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @Args() ordenationArgs: OrdenationUserArgs,
    @Info() info: GraphQLResolveInfo,
  ) {
    const queriedFields = getQueriedFields<UserModel>(info, 'users');
    return this.userService.findMany({
      queriedFields,
      paginationArgs,
      searchArgs,
      ordenationArgs,
    });
  }

  @Auth(Role.ADMIN)
  @Query(() => UserModel, { name: 'user' })
  async findOne(@CurrentUser() user: UserModel) {
    return this.userService.findOne(user.id);
  }

  @Mutation(() => SignIn, { name: 'createUser' })
  async create(
    @Args('data') data: UserCreateInput,
    @Context('res') res: Response,
  ) {
    const emailAlreadyExists = await this.userService.findByEmail(data.email);

    if (!!emailAlreadyExists) {
      throw new GraphQLError('E-mail já cadastrado');
    }

    const createdUser = await this.userService.create(data);

    const { accessToken, user } = await this.authService.signIn(
      createdUser.email,
      data.password,
    );

    res.cookie('accessToken', accessToken, {
      maxAge:
        this.configService.get('JWT_EXPIRES_IN_SECONDS', { infer: true }) *
        1000,
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      signed: false,
    });

    return {
      user,
    };
  }

  @Subscription(() => UserModel, {
    name: 'userAdded',
  })
  subscribeToUserAdded() {
    return this.redisSubscriptionService.asyncIterator('userAdded');
  }
}
