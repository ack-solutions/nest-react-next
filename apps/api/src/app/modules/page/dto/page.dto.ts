import { PartialType } from '@nestjs/swagger';
import { Page } from '../page.entity';
export class PageDTO extends PartialType(
    Page
) {}
