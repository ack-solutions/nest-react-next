import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-custom';
import { ExtractJwt } from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../user';
import { UserStatusEnum } from '@mlm/types';

@Injectable()
export class IfJwtStrategy extends PassportStrategy(Strategy, 'if-jwt') {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
    ) {
        super();
    }

    async validate(req: any, done: any) {
        try {
            const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
            const token = jwtFromRequest(req);
            if (token) {
                const payload: any = jwt.verify(token, this.configService.get('jwt').secret);
                const user = await this.userService.userRepository.findOne({
                    where: {
                        id: payload.id,
                        status: UserStatusEnum.ACTIVE
                    },
                    relations: ['roles']
                });
                done(null, user);
            } else {
                done(null, true);
            }
        } catch (error) {
            console.log(error)
            done(null, true);
        }
    }
}