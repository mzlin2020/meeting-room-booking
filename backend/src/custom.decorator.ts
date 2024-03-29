import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';

// 添加需要登录标识
export const RequireLogin = () => SetMetadata('require-login', true);

// 添加权限标识
export const RequirePermission = (...permissions: string[]) => SetMetadata('require-permission', permissions);

// 属性装饰器——获取用户信息
export const UserInfo = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.user) return null;

  return data ? request.user[data] : request.user;
});
