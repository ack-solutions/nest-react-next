import { RoleGuardEnum, RoleNameEnum } from '@libs/types';
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NestAuthAuthGuard, NestAuthRoles } from '@ackplus/nest-auth';
import { ModuleRef } from '@nestjs/core';
import { ALL_SEEDERS, SEEDER_METADATA } from '../../seeders';


interface SeederInfo {
    name: string;
    key: string;
    description?: string;
    hasDrop: boolean;
}

interface RunSeederDto {
    seederKey: string;
    truncate?: boolean;
}

@ApiTags('Seeders')
@Controller('seeders')
@UseGuards(NestAuthAuthGuard)
export class SeederController {
    constructor(
        private readonly moduleRef: ModuleRef,
    ) { }

    @Get()
    @NestAuthRoles(RoleNameEnum.SUPER_ADMIN, RoleGuardEnum.ADMIN)
    @ApiOperation({ summary: 'Get list of available seeders' })
    async getSeeders(): Promise<SeederInfo[]> {
        return SEEDER_METADATA.map((metadata, index) => ({
            name: metadata.name,
            key: metadata.key,
            description: metadata.description,
            hasDrop: typeof ALL_SEEDERS[index].prototype.drop === 'function',
        }));
    }

    @Post('run')
    @NestAuthRoles(RoleNameEnum.SUPER_ADMIN, RoleGuardEnum.ADMIN)
    @ApiOperation({ summary: 'Run a specific seeder' })
    async runSeeder(@Body() dto: RunSeederDto): Promise<{ success: boolean; message: string }> {
        const seederIndex = SEEDER_METADATA.findIndex(m => m.key === dto.seederKey);

        if (seederIndex === -1) {
            throw new BadRequestException(`Seeder with key "${dto.seederKey}" not found`);
        }

        const SeederClass = ALL_SEEDERS[seederIndex];
        const metadata = SEEDER_METADATA[seederIndex];

        try {
            // Get the seeder instance from the module ref
            const seederInstance = await this.moduleRef.create(SeederClass as any);

            // If truncate is requested and seeder has drop method, run it first
            if (dto.truncate && typeof (seederInstance as any).drop === 'function') {
                await (seederInstance as any).drop();
            }

            // Run the seed method
            await (seederInstance as any).seed();

            return {
                success: true,
                message: `Seeder "${metadata.name}" executed successfully${dto.truncate ? ' (with truncate)' : ''}`,
            };
        } catch (error: any) {
            throw new BadRequestException(`Failed to run seeder: ${error.message}`);
        }
    }

    @Post('run-all')
    @NestAuthRoles(RoleNameEnum.SUPER_ADMIN, RoleGuardEnum.ADMIN)
    @ApiOperation({ summary: 'Run all seeders in order' })
    async runAllSeeders(@Body() dto: { truncate?: boolean }): Promise<{ success: boolean; message: string; results: any[] }> {
        const results: any[] = [];

        for (let i = 0; i < ALL_SEEDERS.length; i++) {
            const SeederClass = ALL_SEEDERS[i];
            const metadata = SEEDER_METADATA[i];

            try {
                const seederInstance = await this.moduleRef.create(SeederClass as any);

                if (dto.truncate && typeof (seederInstance as any).drop === 'function') {
                    await (seederInstance as any).drop();
                }

                await (seederInstance as any).seed();

                results.push({
                    name: metadata.name,
                    key: metadata.key,
                    success: true,
                });
            } catch (error: any) {
                results.push({
                    name: metadata.name,
                    key: metadata.key,
                    success: false,
                    error: error.message,
                });
            }
        }

        const allSuccess = results.every(r => r.success);

        return {
            success: allSuccess,
            message: allSuccess ? 'All seeders executed successfully' : 'Some seeders failed',
            results,
        };
    }
}
