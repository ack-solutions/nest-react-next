import { Inject, Injectable } from '@nestjs/common';
import * as nunjucks from 'nunjucks';

import { NUNJUCKS_ENV } from './nunjucks.constants';


@Injectable()
export class NunjucksService {

    constructor(
        @Inject(NUNJUCKS_ENV) private env: nunjucks.Environment,
    ) { }

    getEnvironment(): nunjucks.Environment {
        return this.env;
    }

    // Render a template with a context
    render(templateName: string, context: Record<string, any>): string {
        if (!this.env) {
            throw new Error('Nunjucks environment not initialized. Call initialize() first.');
        }
        return this.env.render(templateName, context);
    }

}
