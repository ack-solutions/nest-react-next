import { UserStatusEnum } from '@libs/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../user';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UserService,
        configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwt').secret,
        });
    }

    async validate(payload: any, done: any) {
        try {
            const user = await this.userService.userRepository.findOne({
                where: {
                    id: payload.id,
                    status: UserStatusEnum.ACTIVE
                },
                relations: ['roles']
            });
            done(null, user);
        } catch (error) {
            throw new UnauthorizedException('unauthorized', error.message);
        }
    }
}
