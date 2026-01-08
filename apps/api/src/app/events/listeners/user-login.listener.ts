import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { NestAuthEvents, UserLoggedInEvent } from '@ackplus/nest-auth';
import { ConfigService } from '@nestjs/config';
/**
 * Handles user registration events
 * Creates entries in the user table when a user registers through the auth system
 */
@Injectable()
export class UserLoginListener {
    private readonly logger = new Logger(UserLoginListener.name);

    constructor(
        private configService: ConfigService
    ) { }

    /**
     * Handle user registration event
     * Creates a new user entry in the user table with data from the auth system
     */
    @OnEvent(NestAuthEvents.LOGGED_IN)
    async handleUserLogin(event: UserLoggedInEvent): Promise<void> {
        this.logger.log(`Handling user login event for auth user`);
        const { user: authUser, input } = event.payload;
        try {
            // let user = await User.findOne({ where: { authUserId: authUser.id }, select: ['id'] });

            // // Create User in over platform if not exist
            // if (!user) {
            //     try {
            //         const metadata = authUser?.metadata
            //         const userData: Partial<User> = {
            //             authUserId: authUser.id,
            //             firstName: metadata?.name?.split(' ')[0],
            //             lastName: metadata?.name?.split(' ').slice(1).join(' '),
            //             email: authUser?.email,
            //             phone: authUser?.phone,
            //             avatar: metadata?.avatar || metadata?.picture,
            //         };
            //         Object.keys(userData).forEach(key => {
            //             if (userData[key] === undefined) {
            //                 delete userData[key];
            //             }
            //         });
            //         user = await User.save(User.create(userData));
            //     } catch (error) {
            //         console.error(error)
            //     }

            // }

            // const loginHistory = (input as any)?.loginHistory
            // if (loginHistory?.deviceType) {
            //     if (loginHistory?.latitude && loginHistory?.longitude) {
            //         const apiKey = this.configService.get('config.googleApiKey');
            //         if (apiKey) {
            //             loginHistory.location = await getFullAddressFromCoordinates(loginHistory?.latitude, loginHistory?.longitude, apiKey)
            //         }
            //     }
            //     await LoginHistory.create({
            //         ...loginHistory,
            //         userId: user?.id
            //     }).save()
            // }

            this.logger.log(`Successfully created user entry for auth user: ${authUser.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to create user entry for auth user: ${authUser.id}`, error.stack);
            throw error;
        }
    }
}
