
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RoleDTO } from './dto/role.dto';
import { RoleService } from './role.service';
import { IRole } from '@mlm/types';
import { CrudController } from '@mlm/nest-core'

@ApiTags('Role')
@Controller("role")
@UseGuards(AuthGuard('jwt'))
export class RoleController extends CrudController(RoleDTO)<IRole> {
  constructor(private roleService: RoleService) {
    super(roleService);
  }
}
