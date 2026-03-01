import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoggerService } from '../common/logger/logger.service';
import { Types } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser: Partial<UserDocument> = {
    _id: new Types.ObjectId(),
    email: 'test@example.com',
    password: '$2b$10$hashedpassword',
    name: 'Test User',
  };

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    validatePassword: jest.fn(),
    updateLastLogin: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        JWT_SECRET: 'test-secret',
        JWT_EXPIRES_IN: '15m',
        FRONTEND_URL: 'http://localhost:3000',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      const createdUser = { ...mockUser, email: registerDto.email };

      mockUsersService.create.mockResolvedValue(createdUser);
      mockJwtService.signAsync.mockResolvedValueOnce('access-token');

      const result = await service.register(registerDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens.accessToken');
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
      };

      mockUsersService.create.mockRejectedValue(new ConflictException('Email already exists'));

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValueOnce('access-token');

      const result = await service.login(loginDto);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockUsersService.validatePassword).toHaveBeenCalledWith(mockUser, loginDto.password);
      expect(mockUsersService.updateLastLogin).toHaveBeenCalled();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens.accessToken');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const userId = mockUser._id.toString();
      await expect(service.logout(userId)).resolves.toBeUndefined();
    });
  });
});
