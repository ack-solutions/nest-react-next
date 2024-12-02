import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IfJwtStrategy } from './if-jwt.strategy';
import { User, UsersModule } from '../user';
import { Verification } from '../user/verification.entity';
import { JwtConfigService } from './jwt-config.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }), 
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: JwtConfigService
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forFeature([User, Verification]),
        // NotificationModule,
        // SMSModule,
        forwardRef(() => UsersModule),
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        JwtStrategy,
        IfJwtStrategy,
    // FacebookStrategy,
    ]
})
export class AuthModule { }
