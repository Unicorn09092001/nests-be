import { PERMISSIONS_KEY } from '@/decorator/customize';
import { UsersService } from '@/modules/users/users.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UsersService
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    // const user = request.user.id;

    const user = await this.userService.getUserById(request.user.id);

    let userPermissions: string[] = [];
    user.roles.forEach(role => {
      userPermissions = [...userPermissions, ...role.permissions?.map(p => p.name) || []];
    });

    if(!requiredPermissions.every((p) => userPermissions.includes(p))) {
      throw new UnauthorizedException('Bạn không có quyền truy cập vào tài nguyên này');
    }

    return true;
  }
}