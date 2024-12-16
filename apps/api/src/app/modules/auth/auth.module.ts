import { forwardRef, Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IfJwtStrategy } from './if-jwt.strategy';
import { JwtConfigService } from './jwt-config.service';
import { JwtStrategy } from './jwt.strategy';
import { User, UsersModule } from '../user';
import { Verification } from '../user/verification.entity';


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
