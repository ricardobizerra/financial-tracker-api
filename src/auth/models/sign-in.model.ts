import { UserModel } from '@/user/models/user.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignIn {
  @Field(() => UserModel, { nullable: true })
  user: UserModel;
}
