// Common types
export type CrudType = 'ackplus'; // Only @ackplus/nest-crud is supported now
export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'text' | 'uuid' | 'file';
export type RelationshipType = 'belongsTo' | 'hasMany' | 'manyToMany';
export type ConflictResolution = 'ask' | 'skip' | 'update' | 'backup';

// Base interfaces
export interface PluginGeneratorSchema {
  name: string;
  crudType: CrudType;
  generateApi: boolean;
  generateReact: boolean;
  generateTypes?: boolean;
  addColumns?: boolean;
  columns?: Column[];
  features?: Features;
}

export interface Column {
  name: string;
  type: ColumnType;
  nullable?: boolean;
  unique?: boolean;
  enum?: string[]; // Only for enum type
  // Computed properties (added during processing)
  tsType?: string;
  swaggerType?: string;
  validationDecorators?: string[];
  columnOptionsString?: string;
  enumValues?: string[];
  normalizeName?: NormalizedName;
}

export interface NormalizedName {
  className: string;
  propertyName: string;
  fileName: string;
}

export interface Features {
  softDelete?: boolean; // Only configurable feature - others are always enabled
}

// Processed interfaces
export interface ProcessedColumn extends Column {
  tsType: string;
  swaggerType: string;
  validationDecorators: string[];
  columnOptionsString: string;
  enumValues?: string[];
  normalizeName: NormalizedName;
}

export interface ProcessedSchema extends PluginGeneratorSchema {
  // Computed properties
  className: string;
  propertyName: string;
  fileName: string;
  columns: ProcessedColumn[];
  features: Required<Features>;
}
