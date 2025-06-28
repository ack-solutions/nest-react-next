export interface ITemplate {
    id?: string;
    name?: string;
    displayName?: string;
    description?: string;
    type?: TemplateTypeEnum;
    engine?: TemplateEngineEnum;
    language?: TemplateLanguageEnum;
    subject?: string;
    content?: string;
    templateLayoutName?: string;
    scope?: string;
    scopeId?: string;
    locale?: string;
    previewContext?: Record<string, any>;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum TemplateTypeEnum {
    EMAIL = 'email',
    SMS = 'sms',
    PUSH = 'push',
    PDF = 'pdf'
}
export enum TemplateEngineEnum {
    NUNJUCKS = 'njk',
    HANDLEBARS = 'hbs',
    EJS = 'ejs',
    PUG = 'pug'
}
export enum TemplateLanguageEnum {
    MJML = 'mjml',
    HTML = 'html',
    MARKDOWN = 'md',
    TEXT = 'txt'
}

export interface ITemplateGetInput {
    scope?: string;
    scopeId?: string;
    type?: TemplateTypeEnum;
    locale?: string;
    excludeNames?: string[];
}

export interface IRenderTemplateInput {
    content?: string;
    language?: TemplateLanguageEnum;
    engine?: TemplateEngineEnum;
    context?: Record<string, any>;
    templateLayoutId?: string;
}
