import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) public userModel: Model<UserDocument>,
    private readonly logger: LoggerService,
  ) {}

  async create(email: string, password?: string, name?: string): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      this.logger.warn('User creation failed: email already exists', { email });
      throw new ConflictException('Email already exists');
    }

    this.logger.log('Creating new user', { email });

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const user = new this.userModel({
      email,
      password: hashedPassword,
      name,
    });

    const savedUser = await user.save();

    this.logger.log('User created successfully', {
      userId: savedUser._id.toString(),
      email: savedUser.email,
    });

    return savedUser;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validatePassword(user: UserDocument, password: string): Promise<boolean> {
    if (!user.password) {
      return false;
    }
    return bcrypt.compare(password, user.password);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      lastLoginAt: new Date(),
    });
  }
}
