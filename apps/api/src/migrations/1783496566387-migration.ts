import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1783496566387 implements MigrationInterface {
    name = 'Migration1783496566387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nest_auth_users" RENAME COLUMN "isVerified" TO "mustChangePassword"`);
        await queryRunner.query(`CREATE TABLE "nest_auth_platform_accesses" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_nest_auth_platform_accesses_user_id" UNIQUE ("userId"), CONSTRAINT "REL_01925ff2bc9c642e8344b2c870" UNIQUE ("userId"), CONSTRAINT "pk_nest_auth_platform_accesses_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_platform_accesses_user_id" ON "nest_auth_platform_accesses" ("userId") `);
        await queryRunner.query(`CREATE TABLE "nest_auth_platform_access_roles" ("nestAuthPlatformAccessId" uuid NOT NULL, "nestAuthRolesId" uuid NOT NULL, CONSTRAINT "pk_nest_auth_platform_access_roles_nest_auth_platform_access_idnest_auth_roles_id" PRIMARY KEY ("nestAuthPlatformAccessId", "nestAuthRolesId"))`);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_platform_access_roles_nest_auth_platform_access_id" ON "nest_auth_platform_access_roles" ("nestAuthPlatformAccessId") `);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_platform_access_roles_nest_auth_roles_id" ON "nest_auth_platform_access_roles" ("nestAuthRolesId") `);
        await queryRunner.query(`ALTER TABLE "nest_auth_platform_accesses" ADD CONSTRAINT "fk_nest_auth_platform_accesses_user_id" FOREIGN KEY ("userId") REFERENCES "nest_auth_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nest_auth_platform_access_roles" ADD CONSTRAINT "fk_nest_auth_platform_access_roles_nest_auth_platform_access_id" FOREIGN KEY ("nestAuthPlatformAccessId") REFERENCES "nest_auth_platform_accesses"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "nest_auth_platform_access_roles" ADD CONSTRAINT "fk_nest_auth_platform_access_roles_nest_auth_roles_id" FOREIGN KEY ("nestAuthRolesId") REFERENCES "nest_auth_roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nest_auth_platform_access_roles" DROP CONSTRAINT "fk_nest_auth_platform_access_roles_nest_auth_roles_id"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_platform_access_roles" DROP CONSTRAINT "fk_nest_auth_platform_access_roles_nest_auth_platform_access_id"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_platform_accesses" DROP CONSTRAINT "fk_nest_auth_platform_accesses_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_platform_access_roles_nest_auth_roles_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_platform_access_roles_nest_auth_platform_access_id"`);
        await queryRunner.query(`DROP TABLE "nest_auth_platform_access_roles"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_platform_accesses_user_id"`);
        await queryRunner.query(`DROP TABLE "nest_auth_platform_accesses"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_users" RENAME COLUMN "mustChangePassword" TO "isVerified"`);
    }

}
