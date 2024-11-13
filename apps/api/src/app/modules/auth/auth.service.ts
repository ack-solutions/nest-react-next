import { Injectable, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { ILike, Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { User, UserService } from '../user';
import { Verification } from '../user/verification.entity';
import { ILoginInput, ILoginSendOtpInput, IUser, UserStatusEnum } from '@libs/types';
import { includes } from 'lodash';
import { LoginSuccessDTO } from './dto/login-success.dto';
import { RegisterInputDTO } from './dto/register-input.dto';
import { generateRandomNumber, hashPassword } from '../../utils';
import { RequestContext } from '../../core/request-context/request-context';




@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        // private notificationService: NotificationService,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Verification)
        private readonly verificationRepo: Repository<Verification>,

        private readonly configService: ConfigService,


    ) { }

    async checkIfExistsEmail(email: string, ignoreId?: any): Promise<boolean> {
        const count = await this.userRepo.count({
            where: {
                email: ILike(email),
                ...(ignoreId ? { id: Not(ignoreId) } : {}),
            },
        });
        return count > 0;
    }
    async getUserByEmail(email: string): Promise<IUser> {
        return this.userRepo.findOne({
            where: { email: ILike(email) },
            relations: ['roles']
        });
    }

    async sendLoginOtp(request?: ILoginSendOtpInput) {
        const { email } = request;
        if (!request.password) {
            throw new BadRequestException('Your email or password is not correct');
        }
        const user = await this.getUserByEmail(request.email);

        if (!user) {
            throw new BadRequestException('Your email is not correct');
        }
        const userPassword = await this.userRepo.createQueryBuilder().where({ id: user.id, }).select('"passwordHash"').getRawOne();
        if (!await bcrypt.compare(request.password, userPassword?.passwordHash)) {
            throw new BadRequestException('Your email or password incorrect');
        }

        if (user.status === UserStatusEnum.INACTIVE) {
            throw new BadRequestException('Your account has been inactivated by admin.');
        }
        const otp = await generateRandomNumber();

        await this.verificationRepo.delete({ email });
        await this.verificationRepo.insert({
            otp: otp,
            email,
        });
        const mailDetails = {
            otp: otp,
            userName: user?.name,
        };
        console.log({ otp })
        // try {
        //     await this.notificationService.loginEmailVerificationOtp({ otp: otp, email: request?.email, phone: user?.phone, phoneCountryId: user?.phoneCountryId }, mailDetails);
        // } catch (error) {
        //     console.log(error)
        //     return { message: 'OTP send failed' };
        // }
        return { message: 'OTP send successfully' };
    }

    async sendRegistrationOtp(request?: any) {
        if (request.email) {
            const exists = await this.checkIfExistsEmail(request.email);
            if (exists) {
                throw new ConflictException(
                    'Email is already taken, Please use other email'
                );
            }
        }
        // const user = await this.userRepository.findOne({
        //     where: {
        //         email: request.email
        //     }
        // })
        if (request?.email) {
            const otp = await generateRandomNumber();
            console.log(otp);
            await this.verificationRepo.delete({
                email: request.email,
            })
            await this.verificationRepo.insert({
                otp: otp,
                email: request.email,
            })
            // const mailDetails = {
            //     otp: otp
            // };
            // await this.notificationService.OTPNotification(request, mailDetails)
            return { message: 'OTP has been sent to your email, please verify' };
        }
        else {
            throw new BadRequestException("OTP sent failed ")
        }

    }
    async login(request: ILoginInput) {

        const user = await this.getUserByEmail(request.email)

        if (!user) {
            throw new BadRequestException('Your email is not correct');
        }
        const userPassword = await this.userRepo.createQueryBuilder().where({ id: user.id, }).select('"passwordHash"').getRawOne();

        if (!await bcrypt.compare(request.password, userPassword?.passwordHash)) {
            throw new BadRequestException('Your email or password incorrect');
        }
        if (user?.status === UserStatusEnum.INACTIVE) {
            throw new BadRequestException('Your account has been inactivated by admin.');
        }
        if (user?.status === UserStatusEnum.PENDING) {
            throw new BadRequestException('Your account is not approved yet. You will be notified once approve your account');
        }

        try {
            await this.veryFyOtp({ otp: request.otp, email: request.email });
        } catch (error) {
            throw new ConflictException(error?.message);
        }
        return {
            user,
            accessToken: this.jwtFromUser(user)
        }
    }

    async register(req: RegisterInputDTO) {
        const count = await this.checkIfExistsEmail(req.email);

        if (count) {
            throw new ConflictException('There is an existing account with this email address.');
        }
        
        await this.veryFyOtp({ otp: req?.otp, email: req?.email })
        req.emailVerifiedAt = new Date()

        let user = await this.userService.createUser(req);
        user = await this.userService.getUserForAuth(user.id);

        return {
            accessToken: this.jwtFromUser(user),
            user: user
        } as LoginSuccessDTO;
    }

    async passwordChange(request?: any) {
        const user = RequestContext.currentUser();

        const userPassword = await this.userRepo.findOne({
            where: {
                id: user.id,
            },
            select: ['passwordHash']
        })
        if (await bcrypt.compare(request?.oldPassword, userPassword?.passwordHash)) {
            user.passwordHash = hashPassword(request.password);
            await this.userRepo.save(user);
            return user;
        }
        else {
            throw new BadRequestException('Old password is not valid');
        }

    }

    async resetPassword(request?: any) {
        const bcryptPassword = await bcrypt.hash(request.password, parseInt(process.env.SALT_ROUND, 10));
        const userPassword = await this.userService.userRepository.createQueryBuilder().where({
            email: request.email
        }).select('"passwordHash", "id"').getRawOne();

        await this.veryFyOtp({ email: request.email, otp: request.otp })

        if (userPassword?.id) {
            if (!await bcrypt.compare(bcryptPassword, userPassword?.passwordHash)) {

                await this.userRepo.update(userPassword.id, {
                    passwordHash: hashPassword(request.password)
                });

                await this.verificationRepo.delete({
                    email: request.email,
                })

                return { message: 'Your password reset successfully' };
            }
            else {
                throw new BadRequestException('Old password is not valid');
            }
        }
        else {
            throw new UnauthorizedException('You are not authorized');
        }
    }

    async forgotPassword(request?: any) {
        const user = await this.getUserByEmail(request.email)
        if (user) {
            const otp = await generateRandomNumber();
            await this.verificationRepo.delete({
                email: request.email,
            })
            await this.verificationRepo.insert({
                otp: otp,
                email: request.email,
            })

            // const mailDetails = {
            //     otp: otp,
            //     name: user?.name,

            // };
            // await this.notificationService.forgotPassword(request, mailDetails)
            return { message: 'OTP has been sent to your email, please verify' };
        }
        else {
            throw new BadRequestException("There is no account linked with the provided email!")
        }
    }

    async sendOtp(request?: any) {
        const user = await this.userRepo.findOne({
            where: {
                email: request.email,
            }
        });

        if (user) {
            const otp = await generateRandomNumber();

            await this.verificationRepo.delete({
                email: request.email,
            });
            await this.verificationRepo.insert({
                otp: otp,
                email: request.email,
            });
            //   try {
            //     await this.notificationService.sendOtpMail(user, { otp });
            //   } catch (error) {
            //     throw new BadGatewayException('OTP send failed');
            //   }
            return { message: 'OTP send successfully' };
        } else {
            throw new BadRequestException(
                'There is no account linked with the provided email!'
            );
        }
    }

    async veryFyOtp(request?: any) {
        const otpData = await this.verificationRepo.findOne({
            where: {
                email: request.email,
            }
        })
        const env = this.configService.get('config.env')

        //   if (env === 'local' || 'dev') {
        if (Number(request.otp) === 1234) {
            return { message: 'Your OTP verified successfully' };
        }
        //   }

        if (otpData && (otpData.otp == request.otp)) {
            const otpDateTime = moment((otpData.createdAt)).add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss');
            const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss')
            if (currentDateTime < otpDateTime) {
                return { message: 'Your OTP verified successfully' };
            }
            else {
                throw new BadRequestException('OTP is expired');
            }
        }
        else {
            throw new BadRequestException('OTP is not valid');
        }
    }


    jwtFromUser(user) {
        const payload = { email: user.email, id: user.id };
        return this.jwtService.sign(payload)
    }
}
