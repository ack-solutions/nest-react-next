import { CrudController } from '@api/app/core/crud';
import { IRole } from '@libs/types';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { RoleDTO } from './dto/role.dto';
import { RoleService } from './role.service';


@ApiTags('Role')
@Controller('role')
@UseGuards(AuthGuard('jwt'))
export class RoleController extends CrudController(RoleDTO)<IRole> {

    constructor(private roleService: RoleService) {
        super(roleService);
    }

}
