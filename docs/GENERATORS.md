# Enhanced CRUD Generator

This enhanced CRUD generator provides a comprehensive, configurable solution for generating full-stack CRUD operations across your NestJS API, React admin interface, and shared libraries.

## 🚀 Features

### Core Capabilities
- **API Generation**: Complete NestJS modules with entities, services, controllers
- **React Components**: Admin interface with tables, forms, and dialogs
- **Shared Libraries**: TypeScript types and React Query hooks
- **Customizable**: Extensive configuration options for different use cases

### Enhanced Features
- ✅ **Soft Delete Support**: Optional soft delete functionality
- ✅ **Bulk Operations**: Mass actions for delete, restore, export
- ✅ **File Upload**: Integrated file upload handling
- ✅ **Status Filtering**: Dynamic status-based filtering
- ✅ **Audit Trail**: Track changes and modifications
- ✅ **Permission Control**: Role-based access control
- ✅ **Multiple UI Modes**: Dialog, page, or drawer interfaces
- ✅ **Export Functionality**: Data export capabilities
- ✅ **Search Integration**: Built-in search functionality

## 📋 Usage

### Basic Usage
```bash
# Generate a simple CRUD
nx g @libs/generators:crud product

# Generate with custom options
nx g @libs/generators:crud product --no-generateApi --features.softDelete=false
```

### Interactive Mode
The generator will prompt you for configuration options:

```bash
nx g @libs/generators:crud
```

You'll be asked about:
- Entity name
- API generation
- React components generation
- TypeScript types generation
- Feature toggles (soft delete, bulk operations, etc.)
- UI preferences (table style, add/edit mode)
- Permission settings

## ⚙️ Configuration Options

### Basic Options
- `name`: Entity name (e.g., 'product', 'user')
- `generateApi`: Generate NestJS API module
- `generateReact`: Generate React components and hooks
- `generateTypes`: Generate TypeScript types
- `addColumns`: Add custom columns/fields

### Feature Toggles
- `features.softDelete`: Enable soft delete functionality
- `features.bulkOperations`: Enable bulk operations
- `features.statusFilter`: Add status filtering
- `features.fileUpload`: Enable file upload support
- `features.audit`: Enable audit trail

### UI Options
- `uiOptions.tableStyle`: Table display style ('card', 'table', 'grid')
- `uiOptions.addEditMode`: Add/Edit interface mode ('dialog', 'page', 'drawer')
- `uiOptions.enableSearch`: Enable search functionality
- `uiOptions.enableExport`: Enable data export

### Permission Settings
- `permissions.requireAuth`: Require authentication
- `permissions.roles`: Required roles (array of strings)

## 🏗️ Generated Structure

### API Module (`apps/api/src/app/modules/{entity}`)
```
entity/
├── entity.entity.ts      # TypeORM entity with validations
├── entity.service.ts     # Service extending CrudService
├── entity.controller.ts  # Controller extending CrudController
├── entity.module.ts      # NestJS module
└── dto/
    └── entity.dto.ts     # Data transfer objects
```

### React Components (`apps/admin/src/app`)
```
pages/entity/
└── entity-list-page.tsx  # Main list page

sections/entity/
├── entity-list-table.tsx # Data table component
├── add-edit-entity-dialog.tsx # Form dialog
└── entity-status-label.tsx    # Status display
```

### Shared Libraries
```
libs/types/src/lib/
└── entity.ts             # TypeScript interfaces

libs/react-core/src/lib/
├── services/entity.service.ts  # API service
└── query-hooks/use-entity.ts   # React Query hooks
```

## 🎯 Best Practices

### Column Configuration
When adding columns, consider:
- **String/Text**: Use for names, descriptions, content
- **Number**: For quantities, prices, IDs
- **Boolean**: For flags, status indicators
- **Date/DateTime**: For timestamps, schedules
- **Enum**: For predefined options
- **JSON**: For flexible metadata

### Feature Selection
- **Soft Delete**: Enable for data that needs recovery
- **Bulk Operations**: Essential for admin interfaces
- **File Upload**: For entities with attachments
- **Status Filter**: When entities have distinct states
- **Audit Trail**: For compliance and tracking

### UI Mode Selection
- **Dialog**: Quick edits, simple forms
- **Page**: Complex forms, multi-step processes
- **Drawer**: Side panels, contextual editing

## 🔧 Customization

### Adding Custom Fields
The generator supports various field types with automatic validation:

```typescript
// String field with validation
@IsString()
@Column()
title: string;

// Enum field with options
@IsEnum(StatusEnum)
@Column({ type: 'text' })
status: StatusEnum;

// File upload field
@Column({ nullable: true })
avatar?: string;
```

### Extending Generated Services
```typescript
// Add custom methods to generated service
export class ProductService extends CrudService<Product> {
  async findByCategory(category: string) {
    return this.productRepo.find({ where: { category } });
  }
}
```

### Customizing UI Components
```tsx
// Extend generated table with custom columns
const columns: DataTableColumn<IProduct>[] = [
  ...generatedColumns,
  {
    name: 'custom',
    label: 'Custom Action',
    render: (row) => <CustomButton product={row} />
  }
];
```

## 🚨 Typography Component Integration

Following your user rules about typography consistency:

The generator creates components that use consistent typography patterns:
- No hardcoded font sizes, line heights, or weights
- Leverages existing Typography components
- Maintains consistent text styling across all generated components
- Uses semantic typography variants (h1, h2, body1, body2, etc.)

Example generated component:
```tsx
<Typography variant="h6" component="h1">
  {title}
</Typography>
<Typography variant="body2" color="text.secondary">
  {description}
</Typography>
```

## 🎨 Small and Reusable Components

All generated components follow the principle of being small and reusable:
- Single responsibility components
- Proper prop interfaces
- Composable architecture
- Consistent naming conventions

## 📝 Examples

### E-commerce Product CRUD
```bash
nx g @libs/generators:crud product \
  --features.softDelete=true \
  --features.bulkOperations=true \
  --features.fileUpload=true \
  --features.statusFilter=true \
  --uiOptions.addEditMode=page \
  --permissions.roles=ADMIN,MANAGER
```

### Simple Blog Post CRUD
```bash
nx g @libs/generators:crud post \
  --features.softDelete=false \
  --features.bulkOperations=false \
  --uiOptions.addEditMode=dialog \
  --permissions.requireAuth=false
```

### User Management CRUD
```bash
nx g @libs/generators:crud user \
  --features.softDelete=true \
  --features.bulkOperations=true \
  --features.fileUpload=true \
  --features.audit=true \
  --uiOptions.addEditMode=page \
  --permissions.roles=SUPER_ADMIN
```

## 🐛 Troubleshooting

### Common Issues
1. **Import Errors**: Ensure all dependencies are installed
2. **Type Errors**: Check TypeScript configuration
3. **Route Conflicts**: Verify unique entity names
4. **Permission Issues**: Confirm role configuration

### ESLint Integration
The generator automatically runs ESLint fixes on generated files to ensure code quality and consistency.

## 🔄 Migration from Old Generator

The enhanced generator is backward compatible with existing configurations. To migrate:

1. Update your generator commands to use new options
2. Review generated files for new features
3. Update existing CRUDs to use new patterns
4. Test thoroughly in development environment

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeORM Documentation](https://typeorm.io/)
- [Material-UI Documentation](https://mui.com/)

---

This enhanced CRUD generator provides a solid foundation for rapid development while maintaining code quality, consistency, and scalability across your full-stack application.
