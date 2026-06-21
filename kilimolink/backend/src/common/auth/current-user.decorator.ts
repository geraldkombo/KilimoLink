import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type JwtUser = { userId: string; role: string };

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<{ user?: JwtUser }>();
  return req.user;
});

