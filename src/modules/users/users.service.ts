import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getPagingMeta, hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs, { Dayjs } from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { ActiveUserDto } from './dto/active-user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly mailerService: MailerService
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userRepo.findByEmail(email);
    return user ? true : false;
  }

  async create(createUserDto: CreateUserDto) {
    // Check if email already exists
    const isExist = await this.isEmailExist(createUserDto.email);
    if (isExist) {
      throw new BadRequestException(`Email ${createUserDto.email} already exists`);
    }

    // Hash the password before saving the user
    const hashPassword = await hashPasswordHelper(createUserDto.password) as string;
    const user = await this.userRepo.create({
      ...createUserDto,
      password: hashPassword,
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const [data, count] = await this.userRepo.findAll({
      email: filter.email,
      refreshToken: filter.refreshToken,
      id: filter.id,
      page: current,
      pageSize: pageSize
    })

    return {
      data,
      meta: getPagingMeta(count, current as number, pageSize as number)
    };
  }

  async getUserById(id: string) {
      const user = await this.userRepo.findById(id);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    
    return user;
  }

  async update(updateUserDto: Partial<Omit<UpdateUserDto, 'id'>> & Pick<UpdateUserDto, 'id'>) {
    const user = await this.userRepo.findById(updateUserDto.id as string);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return await this.userRepo.update(updateUserDto);
  }

  async remove(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }
    
    return await this.userRepo.remove(id);
  }

  async active(activeUserDto: ActiveUserDto) {
    const user = await this.userRepo.findById(activeUserDto.userId)

    if (!user) {
      throw new BadRequestException("User khong ton taij")
    }

    if (user.codeId !== activeUserDto.verifyCode) {
      throw new BadRequestException("Code verify khong hop le")
    }

    if (user.isEmailVerified) {
      throw new BadRequestException("Tai khoan da duoc kich hoat")
    }

    return await this.userRepo.update({
      id: activeUserDto.userId,
      isEmailVerified: true,
    })
  }

  async handleResendVerifyCode(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new BadRequestException("User khong ton taij")
    }

    if (user.isEmailVerified) {
      throw new BadRequestException("Tai khoan da duoc kich hoat")
    }

    if (user.codeExpired && Date.now() > new Date(user.codeExpired).getTime()) {
      throw new BadRequestException("Verify code is expired, please request a new one")
    }

    const codeId = uuidv4();
    await this.userRepo.update(
      {
        id: userId,
        isEmailVerified: false,
        codeId: codeId,
        codeExpired: dayjs().add(5, 'minutes').toISOString()
      },
    )

    this.mailerService.sendMail({
      to: user.email,
      subject: "Activate your account at @hoidanit",
      template: "register",
      context: {
        name: user.name ?? user.email,
        activationCode: codeId
      }
    })

    return "Resend verify code success"
  }

  async handleRegister(registerDto: CreateAuthDto) {
    // Check if email already exists
    const isExist = await this.isEmailExist(registerDto.email);
    if (isExist) {
      throw new BadRequestException(`Email ${registerDto.email} already exists`);
    }

    // Hash the password before saving the user
    const hashPassword = await hashPasswordHelper(registerDto.password) ?? "";
    const codeId = uuidv4();
    const user = await this.userRepo.create({
      email: registerDto.email,
      name: registerDto.name ?? "",
      password: hashPassword,
      phone: '',
      address: '',
      avatar: '',
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes').toISOString()
    });

    //send email
    try {
      this.mailerService.sendMail({
        to: user.email,
        subject: "Activate your account at @hoidanit",
        template: "register",
        context: {
          name: user.name ?? user.email,
          activationCode: codeId
        }
      })
    } catch (error) {
      console.log(error)
    }
    
    //Tra ra phan hoi
    return {
      id: user.id,
    };
  }
}
