import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './types/auth-response.interface';
import { UserDocument } from '../users/schemas/user.schema';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    this.logger.log('User registration attempt', { email: registerDto.email });

    const user = await this.usersService.create(
      registerDto.email,
      registerDto.password,
      registerDto.name,
    );

    return this.generateAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(user, loginDto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastLogin(user._id.toString());

    return this.generateAuthResponse(user);
  }

  async logout(userId: string): Promise<void> {
    this.logger.log('User logout', { userId });
  }

  private async generateAuthResponse(user: UserDocument): Promise<AuthResponse> {
    const accessToken = await this.jwtService.signAsync(
      { sub: user._id.toString(), email: user.email },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: 900,
      },
    );

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      tokens: {
        accessToken,
      },
    };
  }
}
