import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { ActiveUserDto } from './dto/active-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,

    private readonly mailerService: MailerService
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    return user ? true : false;
  }

  async create(createUserDto: CreateUserDto) {
    // Check if email already exists
    const isExist = await this.isEmailExist(createUserDto.email);
    if (isExist) {
      throw new BadRequestException(`Email ${createUserDto.email} already exists`);
    }

    // Hash the password before saving the user
    const hashPassword = await hashPasswordHelper(createUserDto.password);
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
    });
    return {
      _id: user._id,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, limit, sort} = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * pageSize;

    const results = await this.userModel
    .find(filter)
    .limit(limit)
    .skip(skip)
    .select("-password")
    .sort(sort as any);

    return {results, totalPages};
  }

  async getUserById(id: string) {
    try {
      const user = (await this.userModel.findById(id))?.toObject();
      if (!user) {
        throw new NotFoundException("User not found");
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOneByEmail(email: string) {
    const user = (await this.userModel.findOne({email: email}))?.toObject();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      {_id: updateUserDto._id},
      {
        name: updateUserDto.name,
        phone: updateUserDto.phone,
        address: updateUserDto.address,
        image: updateUserDto.image,
        refreshToken: updateUserDto.refreshToken
      }
    )
  }

  async remove(id: string) {
    //check id 
    if (mongoose.isValidObjectId(id)) {
      return await this.userModel.deleteOne({_id: id})
    } else {
      throw new BadRequestException("_ID khoong dung dinh dang")
    }
  }

  async active(activeUserDto: ActiveUserDto) {
    const user = await this.userModel.findById(activeUserDto.userId)

    if (!user) {
      throw new BadRequestException("User khong ton taij")
    }

    if (user.codeId !== activeUserDto.verifyCode) {
      throw new BadRequestException("Code verify khong hop le")
    }

    if (user.isActive) {
      throw new BadRequestException("Tai khoan da duoc kich hoat")
    }

    return await this.userModel.updateOne(
      {_id: activeUserDto.userId},
      {
        isActive: true,
      }
    )
  }

  async handleResendVerifyCode(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException("User khong ton taij")
    }

    const codeId = uuidv4();
    await this.userModel.updateOne(
      {_id: userId},
      {
        isActive: false,
        codeId: codeId,
        codeExpired: dayjs().add(5, "minutes"),
      }
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
    const hashPassword = await hashPasswordHelper(registerDto.password);
    const codeId = uuidv4();
    const user = await this.userModel.create({
      ...registerDto,
      password: hashPassword,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(5, "minutes"),
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
      _id: user._id,
    };
  }
}
