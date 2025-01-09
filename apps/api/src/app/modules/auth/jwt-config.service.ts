import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";


@Injectable()
export class JwtConfigService implements JwtOptionsFactory {

    constructor(private configService: ConfigService) { }

    createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
        const secret = this.configService.get('jwt.secret');
        const expiresIn = this.configService.get('jwt.expiresIn');

        return {
            secret,
            signOptions: {
                expiresIn
            },
        };
    }

}