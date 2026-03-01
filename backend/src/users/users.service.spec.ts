import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/user.schema';
import { LoggerService } from '../common/logger/logger.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    _id: new Types.ObjectId(),
    email: 'test@example.com',
    password: '$2b$10$hashedpassword',
    name: 'Test User',
    save: jest.fn().mockResolvedValue(this),
  };

  interface MockUserModel {
    new (userData: Partial<User>): Partial<UserDocument>;
    findOne: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
  }

  const mockUserModel = function (this: unknown, userData: Partial<User>) {
    return {
      ...userData,
      _id: new Types.ObjectId(),
      save: jest.fn().mockResolvedValue({ ...userData, _id: new Types.ObjectId() }),
    };
  } as unknown as MockUserModel;

  mockUserModel.findOne = jest.fn();
  mockUserModel.findById = jest.fn();
  mockUserModel.findByIdAndUpdate = jest.fn();

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const email = 'newuser@example.com';
      const password = 'password123';
      const name = 'New User';

      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.create(email, password, name);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toBeDefined();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.create('existing@example.com', 'password123')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser);

      const result = await service.findById(mockUser._id.toString());

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(service.findById('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = { ...mockUser, password: hashedPassword } as unknown as UserDocument;

      const result = await service.validatePassword(user, 'password123');

      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = { ...mockUser, password: hashedPassword } as unknown as UserDocument;

      const result = await service.validatePassword(user, 'wrongpassword');

      expect(result).toBe(false);
    });

    it('should return false if user has no password', async () => {
      const user = { ...mockUser, password: undefined } as unknown as UserDocument;

      const result = await service.validatePassword(user, 'anypassword');

      expect(result).toBe(false);
    });
  });
});
