import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { PermissionDTO } from './dto/permission.dto';
import { Permission } from './permission.entity';
import { PermissionService } from './permission.service';
import { CrudController } from '@mlm/nest-core';

@ApiTags('Permission')
@Controller("permission")
@UseGuards(
  AuthGuard('jwt')
)
export class PermissionController extends CrudController(PermissionDTO)<Permission> {

  constructor(permissionService: PermissionService) {
    super(permissionService);
  }

}
