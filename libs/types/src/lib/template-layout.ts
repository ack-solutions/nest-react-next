export interface ITemplateLayout {
    id?: string;
    name?: string;
    displayName?: string;
    description?: string;
    type?: TemplateLayoutTypeEnum;
    engine?: TemplateLayoutEngineEnum;
    language?: TemplateLayoutLanguageEnum;
    content?: string;
    scope?: string;
    scopeId?: string;
    locale?: string;
    previewContext?: Record<string, any>;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum TemplateLayoutTypeEnum {
    EMAIL = 'email',
    SMS = 'sms',
    PUSH = 'push',
    PDF = 'pdf'
}
export enum TemplateLayoutEngineEnum {
    NUNJUCKS = 'njk',
    HANDLEBARS = 'hbs',
    EJS = 'ejs',
    PUG = 'pug'
}
export enum TemplateLayoutLanguageEnum {
    MJML = 'mjml',
    HTML = 'html',
    MARKDOWN = 'md',
    TEXT = 'txt'
}

export interface ITemplateLayoutGetInput {
    scope?: string;
    scopeId?: string;
    type?: TemplateLayoutTypeEnum;
    locale?: string;
    excludeNames?: string[];
}

export interface IRenderTemplateLayoutInput {
    content?: string;
    language?: TemplateLayoutLanguageEnum;
    engine?: TemplateLayoutEngineEnum;
    context?: Record<string, any>;
}
