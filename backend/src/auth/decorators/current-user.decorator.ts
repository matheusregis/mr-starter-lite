import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserDocument } from '../../users/schemas/user.schema';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserDocument => {
    const request = ctx.switchToHttp().getRequest<Request & { user: UserDocument }>();
    return request.user;
  },
);
