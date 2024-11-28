export interface PluginGeneratorSchema {
  name: string;
  generateApi: boolean;
  generateReact: boolean;
  addColumns?: boolean;
  columns?: Column[];
}


interface Column {
  name: string;
  type: string;
  nullable: boolean;
  tsType?: string;
  validationDecorators?: string[];
  swaggerType?: string;
  enumValues?: string[];
  columnOptionsString?: string;
  normalizeName: {
    name: string;
    className: string;
    propertyName: string;
    constantName: string;
    fileName: string;
  }
}
