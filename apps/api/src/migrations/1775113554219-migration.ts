import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1775113554219 implements MigrationInterface {
    name = 'Migration1775113554219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nest_auth_tenants" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "slug" character varying, "description" character varying, "metadata" text DEFAULT '{}', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_nest_auth_tenants_slug" UNIQUE ("slug"), CONSTRAINT "pk_nest_auth_tenants_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nest_auth_identities" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "provider" character varying NOT NULL, "providerId" character varying, "metadata" text DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "pk_nest_auth_identities_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nest_auth_sessions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid, "data" text DEFAULT '{}', "refreshToken" character varying, "expiresAt" TIMESTAMP, "userAgent" character varying, "deviceName" character varying, "ipAddress" character varying, "lastActive" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "pk_nest_auth_sessions_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nest_auth_otps" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "code" character varying NOT NULL, "type" text NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "pk_nest_auth_otps_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nest_auth_mfa_secrets" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "secret" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "deviceName" character varying, "lastUsedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "pk_nest_auth_mfa_secrets_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nest_auth_permissions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "guard" character varying DEFAULT 'web', "description" text, "category" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_nest_auth_permissions_nameguard" UNIQUE ("name", "guard"), CONSTRAINT "pk_nest_auth_permissions_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_permissions_name" ON "nest_auth_permissions" ("name") `);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_permissions_guard" ON "nest_auth_permissions" ("guard") `);
        await queryRunner.query(`CREATE TABLE "nest_auth_role_permissions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "roleId" uuid NOT NULL, "permissionId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_role_permission_unique" UNIQUE ("roleId", "permissionId"), CONSTRAINT "pk_nest_auth_role_permissions_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_role_permissions_role_id" ON "nest_auth_role_permissions" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_role_permissions_permission_id" ON "nest_auth_role_permissions" ("permissionId") `);
        await queryRunner.query(`CREATE TABLE "nest_auth_roles" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "guard" character varying DEFAULT 'web', "tenantId" uuid, "isSystem" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_nest_auth_roles_nameguardtenant_id" UNIQUE ("name", "guard", "tenantId"), CONSTRAINT "pk_nest_auth_roles_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nest_auth_users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" character varying, "emailVerifiedAt" TIMESTAMP, "phone" character varying, "phoneVerifiedAt" TIMESTAMP, "passwordHash" character varying, "isVerified" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "metadata" text DEFAULT '{}', "isMfaEnabled" boolean NOT NULL DEFAULT false, "mfaRecoveryCode" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "pk_nest_auth_users_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_users_email" ON "nest_auth_users" ("email") `);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_users_email_verified_at" ON "nest_auth_users" ("emailVerifiedAt") `);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_users_phone" ON "nest_auth_users" ("phone") `);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_users_phone_verified_at" ON "nest_auth_users" ("phoneVerifiedAt") `);
        await queryRunner.query(`CREATE TABLE "nest_auth_user_accesses" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "tenantId" uuid, "isActive" boolean NOT NULL DEFAULT true, "isDefault" boolean NOT NULL DEFAULT false, "status" character varying NOT NULL DEFAULT 'active', "metadata" text DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "pk_nest_auth_user_accesses_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_user_accesses_user_id" ON "nest_auth_user_accesses" ("userId") `);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_user_accesses_tenant_id" ON "nest_auth_user_accesses" ("tenantId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_user_null_tenant" ON "nest_auth_user_accesses" ("userId") WHERE "tenantId" IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_user_tenant_not_null" ON "nest_auth_user_accesses" ("userId", "tenantId") WHERE "tenantId" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "nest_auth_trusted_devices" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "tokenHash" text NOT NULL, "userAgent" character varying, "ipAddress" character varying, "expiresAt" TIMESTAMP NOT NULL, "revokedAt" TIMESTAMP, "lastUsedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "pk_nest_auth_trusted_devices_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_trusted_devices_user_id" ON "nest_auth_trusted_devices" ("userId") `);
        await queryRunner.query(`CREATE TABLE "nest_auth_access_keys" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "publicKey" character varying NOT NULL, "privateKey" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, "expiresAt" TIMESTAMP, "lastUsedAt" TIMESTAMP, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_nest_auth_access_keys_public_key" UNIQUE ("publicKey"), CONSTRAINT "pk_nest_auth_access_keys_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nest_auth_admin_users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" character varying NOT NULL, "name" character varying, "passwordHash" character varying NOT NULL, "metadata" text DEFAULT '{}', "lastLoginAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_nest_auth_admin_users_email" UNIQUE ("email"), CONSTRAINT "pk_nest_auth_admin_users_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_admin_users_email" ON "nest_auth_admin_users" ("email") `);
        await queryRunner.query(`CREATE TABLE "nest_dynamic_template_layouts" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "displayName" character varying, "description" text, "type" text NOT NULL, "engine" text NOT NULL DEFAULT 'njk', "language" text NOT NULL, "content" text NOT NULL, "templateLayoutName" character varying, "scope" character varying DEFAULT 'system', "scopeId" character varying, "locale" character varying DEFAULT 'en', "previewContext" text, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "pk_nest_dynamic_template_layouts_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_nest_dynamic_template_layouts_namescopescope_idlocale" ON "nest_dynamic_template_layouts" ("name", "scope", "scopeId", "locale") `);
        await queryRunner.query(`CREATE TABLE "nest_dynamic_templates" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "displayName" character varying, "description" text, "type" text, "engine" text NOT NULL DEFAULT 'njk', "language" text NOT NULL, "subject" character varying, "content" text NOT NULL, "templateLayoutName" character varying, "scope" character varying DEFAULT 'system', "scopeId" character varying, "locale" character varying DEFAULT 'en', "previewContext" text, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "pk_nest_dynamic_templates_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_nest_dynamic_templates_namescopescope_idlocale" ON "nest_dynamic_templates" ("name", "scope", "scopeId", "locale") `);
        await queryRunner.query(`CREATE TABLE "country" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "country" character varying, "code" character varying, "iso" character varying, CONSTRAINT "pk_country_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."page_status_enum" AS ENUM('draft', 'published', 'unpublished')`);
        await queryRunner.query(`CREATE TABLE "page" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "name" character varying, "slug" character varying, "content" character varying, "status" "public"."page_status_enum" NOT NULL DEFAULT 'draft', "extras" jsonb, "template" character varying, CONSTRAINT "pk_page_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "setting" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "key" character varying, "value" character varying, "type" text, CONSTRAINT "pk_setting_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "firstName" character varying NOT NULL, "lastName" character varying, "authUserId" uuid, "phoneNumber" character varying(20), "phoneIsoCode" character varying(3), "phoneCountryCode" character varying(6), "avatar" character varying, "isSuperUser" boolean DEFAULT false, "status" text NOT NULL DEFAULT 'active', "tenantId" character varying, CONSTRAINT "pk_user_id" PRIMARY KEY ("id")); COMMENT ON COLUMN "user"."authUserId" IS 'Save Nest Auth User ID'`);
        await queryRunner.query(`CREATE TABLE "nest_auth_user_access_roles" ("nestAuthUserAccessId" uuid NOT NULL, "nestAuthRolesId" uuid NOT NULL, CONSTRAINT "pk_nest_auth_user_access_roles_nest_auth_user_access_idnest_auth_roles_id" PRIMARY KEY ("nestAuthUserAccessId", "nestAuthRolesId"))`);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_user_access_roles_nest_auth_user_access_id" ON "nest_auth_user_access_roles" ("nestAuthUserAccessId") `);
        await queryRunner.query(`CREATE INDEX "idx_nest_auth_user_access_roles_nest_auth_roles_id" ON "nest_auth_user_access_roles" ("nestAuthRolesId") `);
        await queryRunner.query(`ALTER TABLE "nest_auth_identities" ADD CONSTRAINT "fk_nest_auth_identities_user_id" FOREIGN KEY ("userId") REFERENCES "nest_auth_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nest_auth_sessions" ADD CONSTRAINT "fk_nest_auth_sessions_user_id" FOREIGN KEY ("userId") REFERENCES "nest_auth_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nest_auth_otps" ADD CONSTRAINT "fk_nest_auth_otps_user_id" FOREIGN KEY ("userId") REFERENCES "nest_auth_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nest_auth_mfa_secrets" ADD CONSTRAINT "fk_nest_auth_mfa_secrets_user_id" FOREIGN KEY ("userId") REFERENCES "nest_auth_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nest_auth_role_permissions" ADD CONSTRAINT "fk_nest_auth_role_permissions_role_id" FOREIGN KEY ("roleId") REFERENCES "nest_auth_roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nest_auth_role_permissions" ADD CONSTRAINT "fk_nest_auth_role_permissions_permission_id" FOREIGN KEY ("permissionId") REFERENCES "nest_auth_permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nest_auth_roles" ADD CONSTRAINT "fk_nest_auth_roles_tenant_id" FOREIGN KEY ("tenantId") REFERENCES "nest_auth_tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nest_auth_user_accesses" ADD CONSTRAINT "fk_nest_auth_user_accesses_user_id" FOREIGN KEY ("userId") REFERENCES "nest_auth_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nest_auth_user_accesses" ADD CONSTRAINT "fk_nest_auth_user_accesses_tenant_id" FOREIGN KEY ("tenantId") REFERENCES "nest_auth_tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nest_auth_trusted_devices" ADD CONSTRAINT "fk_nest_auth_trusted_devices_user_id" FOREIGN KEY ("userId") REFERENCES "nest_auth_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nest_auth_access_keys" ADD CONSTRAINT "fk_nest_auth_access_keys_user_id" FOREIGN KEY ("userId") REFERENCES "nest_auth_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "fk_user_auth_user_id" FOREIGN KEY ("authUserId") REFERENCES "nest_auth_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nest_auth_user_access_roles" ADD CONSTRAINT "fk_nest_auth_user_access_roles_nest_auth_user_access_id" FOREIGN KEY ("nestAuthUserAccessId") REFERENCES "nest_auth_user_accesses"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "nest_auth_user_access_roles" ADD CONSTRAINT "fk_nest_auth_user_access_roles_nest_auth_roles_id" FOREIGN KEY ("nestAuthRolesId") REFERENCES "nest_auth_roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nest_auth_user_access_roles" DROP CONSTRAINT "fk_nest_auth_user_access_roles_nest_auth_roles_id"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_user_access_roles" DROP CONSTRAINT "fk_nest_auth_user_access_roles_nest_auth_user_access_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "fk_user_auth_user_id"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_access_keys" DROP CONSTRAINT "fk_nest_auth_access_keys_user_id"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_trusted_devices" DROP CONSTRAINT "fk_nest_auth_trusted_devices_user_id"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_user_accesses" DROP CONSTRAINT "fk_nest_auth_user_accesses_tenant_id"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_user_accesses" DROP CONSTRAINT "fk_nest_auth_user_accesses_user_id"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_roles" DROP CONSTRAINT "fk_nest_auth_roles_tenant_id"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_role_permissions" DROP CONSTRAINT "fk_nest_auth_role_permissions_permission_id"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_role_permissions" DROP CONSTRAINT "fk_nest_auth_role_permissions_role_id"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_mfa_secrets" DROP CONSTRAINT "fk_nest_auth_mfa_secrets_user_id"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_otps" DROP CONSTRAINT "fk_nest_auth_otps_user_id"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_sessions" DROP CONSTRAINT "fk_nest_auth_sessions_user_id"`);
        await queryRunner.query(`ALTER TABLE "nest_auth_identities" DROP CONSTRAINT "fk_nest_auth_identities_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_user_access_roles_nest_auth_roles_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_user_access_roles_nest_auth_user_access_id"`);
        await queryRunner.query(`DROP TABLE "nest_auth_user_access_roles"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "setting"`);
        await queryRunner.query(`DROP TABLE "page"`);
        await queryRunner.query(`DROP TYPE "public"."page_status_enum"`);
        await queryRunner.query(`DROP TABLE "country"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_dynamic_templates_namescopescope_idlocale"`);
        await queryRunner.query(`DROP TABLE "nest_dynamic_templates"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_dynamic_template_layouts_namescopescope_idlocale"`);
        await queryRunner.query(`DROP TABLE "nest_dynamic_template_layouts"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_admin_users_email"`);
        await queryRunner.query(`DROP TABLE "nest_auth_admin_users"`);
        await queryRunner.query(`DROP TABLE "nest_auth_access_keys"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_trusted_devices_user_id"`);
        await queryRunner.query(`DROP TABLE "nest_auth_trusted_devices"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_user_tenant_not_null"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_user_null_tenant"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_user_accesses_tenant_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_user_accesses_user_id"`);
        await queryRunner.query(`DROP TABLE "nest_auth_user_accesses"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_users_phone_verified_at"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_users_phone"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_users_email_verified_at"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_users_email"`);
        await queryRunner.query(`DROP TABLE "nest_auth_users"`);
        await queryRunner.query(`DROP TABLE "nest_auth_roles"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_role_permissions_permission_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_role_permissions_role_id"`);
        await queryRunner.query(`DROP TABLE "nest_auth_role_permissions"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_permissions_guard"`);
        await queryRunner.query(`DROP INDEX "public"."idx_nest_auth_permissions_name"`);
        await queryRunner.query(`DROP TABLE "nest_auth_permissions"`);
        await queryRunner.query(`DROP TABLE "nest_auth_mfa_secrets"`);
        await queryRunner.query(`DROP TABLE "nest_auth_otps"`);
        await queryRunner.query(`DROP TABLE "nest_auth_sessions"`);
        await queryRunner.query(`DROP TABLE "nest_auth_identities"`);
        await queryRunner.query(`DROP TABLE "nest_auth_tenants"`);
    }

}
