import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';

@Injectable()
export class AdminRouteGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    return req.user?.admin;
  }
}
