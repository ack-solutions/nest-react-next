import { Controller } from '@nestjs/common';

import { CmsService } from './cms.service';


@Controller('cms')
export class CmsController {

    constructor(private cmsService: CmsService) { }


}
