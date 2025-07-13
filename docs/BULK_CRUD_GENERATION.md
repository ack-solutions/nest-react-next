# Bulk CRUD Generation

This document describes the bulk CRUD generation system that allows you to generate multiple CRUD entities from a single configuration file.

## Overview

The bulk CRUD generation system provides:
- **Unified Configuration**: Define multiple entities in a single JSON file
- **Conflict Resolution**: Handle existing files with multiple resolution strategies
- **Batch Processing**: Generate multiple entities with a single command
- **Consistent Structure**: Ensure all entities follow the same patterns

## Configuration Structure

### Basic Configuration

```json
{
    "version": "1.0.0",
    "project": {
        "name": "My Project"
    },
    "defaults": {
        "crudType": "custom",
        "generateApi": true,
        "generateReact": true,
        "generateTypes": true,
        "softDelete": true,
        "bulkOperations": true,
        "search": true
    },
    "entities": [
        // Entity definitions...
    ]
}
```

### Entity Configuration

```json
{
    "name": "product",
    "description": "Product management entity",
    "columns": [
        {
            "name": "title",
            "type": "string",
            "length": 255,
            "validation": {
                "required": true,
                "minLength": 3,
                "maxLength": 255
            }
        },
        {
            "name": "categoryId",
            "type": "uuid",
            "nullable": true,
            "relationship": {
                "type": "belongsTo",
                "entity": "category",
                "foreignKey": "categoryId"
            }
        }
    ],
    "features": {
        "softDelete": true,
        "bulkOperations": true,
        "search": true,
        "export": true,
        "fileUpload": false
    }
}
```

## Relationship Configuration

Relationships are defined directly in the column configuration, eliminating the need for a separate relationships section:

### BelongsTo Relationship
```json
{
    "name": "categoryId",
    "type": "uuid",
    "relationship": {
        "type": "belongsTo",
        "entity": "category",
        "foreignKey": "categoryId"
    }
}
```

### HasMany Relationship
```json
{
    "name": "userId",
    "type": "uuid",
    "relationship": {
        "type": "hasMany",
        "entity": "order",
        "foreignKey": "userId"
    }
}
```

### ManyToMany Relationship
```json
{
    "name": "tagId",
    "type": "uuid",
    "relationship": {
        "type": "manyToMany",
        "entity": "tag",
        "pivotTable": "product_tags"
    }
}
```

## Column Types

Supported column types:
- `string` - Variable length string
- `text` - Long text content
- `number` - Numeric values
- `boolean` - True/false values
- `date` - Date values
- `enum` - Enumerated values
- `uuid` - UUID values

## Validation Options

```json
{
    "validation": {
        "required": true,
        "minLength": 2,
        "maxLength": 100,
        "min": 0,
        "max": 999,
        "email": true
    }
}
```

## Features

Each entity can enable/disable features:
- `softDelete` - Soft delete functionality
- `bulkOperations` - Bulk create/update/delete
- `search` - Search functionality
- `export` - Data export capabilities
- `fileUpload` - File upload support

## Usage

### Generate All Entities
```bash
nx g @nx/workspace:crud-bulk
```

### Generate Specific Entities
```bash
nx g @nx/workspace:crud-bulk --entities=product,category
```

### Custom Configuration File
```bash
nx g @nx/workspace:crud-bulk --configFile=my-config.json
```

## Conflict Resolution

When existing files are found, the system provides several resolution options:

### Interactive Mode (Default)
```bash
nx g @nx/workspace:crud-bulk --interactive
```

### Automatic Resolution
```bash
# Skip existing files
nx g @nx/workspace:crud-bulk --conflictResolution=skip

# Update existing files
nx g @nx/workspace:crud-bulk --conflictResolution=update

# Create backups before updating
nx g @nx/workspace:crud-bulk --conflictResolution=backup
```

### Force Generation
```bash
nx g @nx/workspace:crud-bulk --force
```

## Examples

### E-commerce System
```json
{
    "version": "1.0.0",
    "project": {
        "name": "E-commerce Platform"
    },
    "entities": [
        {
            "name": "product",
            "columns": [
                {
                    "name": "title",
                    "type": "string",
                    "length": 255,
                    "validation": { "required": true }
                },
                {
                    "name": "price",
                    "type": "number",
                    "validation": { "required": true, "min": 0 }
                },
                {
                    "name": "categoryId",
                    "type": "uuid",
                    "relationship": {
                        "type": "belongsTo",
                        "entity": "category"
                    }
                }
            ]
        },
        {
            "name": "category",
            "columns": [
                {
                    "name": "name",
                    "type": "string",
                    "length": 100,
                    "unique": true,
                    "validation": { "required": true }
                }
            ]
        }
    ]
}
```

### Task Management System
```json
{
    "version": "1.0.0",
    "project": {
        "name": "Task Management"
    },
    "entities": [
        {
            "name": "task",
            "columns": [
                {
                    "name": "title",
                    "type": "string",
                    "validation": { "required": true }
                },
                {
                    "name": "status",
                    "type": "enum",
                    "enum": ["pending", "in_progress", "completed"],
                    "default": "pending"
                },
                {
                    "name": "assigneeId",
                    "type": "uuid",
                    "nullable": true,
                    "relationship": {
                        "type": "belongsTo",
                        "entity": "user"
                    }
                }
            ]
        }
    ]
}
```

## Best Practices

1. **Consistent Naming**: Use consistent naming conventions across entities
2. **Validation**: Define appropriate validation rules for each column
3. **Relationships**: Use clear foreign key naming (e.g., `categoryId`, `userId`)
4. **Features**: Only enable features that are actually needed
5. **Defaults**: Use project defaults to reduce configuration duplication
6. **Documentation**: Add descriptions to entities for better understanding

## Troubleshooting

### Common Issues

1. **Missing Dependencies**: Ensure all referenced entities exist in the configuration
2. **Type Mismatches**: Verify column types match validation rules
3. **Naming Conflicts**: Use unique entity and column names
4. **Circular Dependencies**: Avoid circular relationship references

### Debugging

Enable verbose output for detailed generation logs:
```bash
nx g @nx/workspace:crud-bulk --verbose
```

Use dry-run mode to preview changes:
```bash
nx g @nx/workspace:crud-bulk --dryRun
```
