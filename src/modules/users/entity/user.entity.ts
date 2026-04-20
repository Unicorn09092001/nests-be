// user-response.dto.ts
import { Exclude, Expose, Type } from 'class-transformer';

export class ProfileEntity {
  @Expose()
  avatar: string | null;

  @Expose()
  phone: string;

  @Expose()
  name: string;

  @Expose()
  address: string | null;
}

export class PermissionEntity {
  @Expose()
  name: string;
}

export class RoleEntity {
  @Expose()
  permissions: PermissionEntity[]
}

export class UserEntity {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => RoleEntity)
  roles: RoleEntity[];

  // Giả sử bạn muốn trả về profile kèm theo
  @Expose()
  @Type(() => ProfileEntity)
  profile: ProfileEntity | null;

  @Exclude() // Đảm bảo trường này không bao giờ lọt ra ngoài
  password: string;

  @Exclude() // Đảm bảo trường này không bao giờ lọt ra ngoài
  refreshToken: string | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}