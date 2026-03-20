import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>
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

  async findOne(id: string) {
    return this.userModel.findById(id);
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({email: email});
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      {_id: updateUserDto._id},
      {
        name: updateUserDto.name,
        phone: updateUserDto.phone,
        address: updateUserDto.address,
        image: updateUserDto.image
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
}
