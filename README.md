# Mlm

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/next?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/OR8o5hlYsR)


## Run tasks

To run the dev server for your app, use:

```sh
npx nx dev web
```

To create a production bundle:

```sh
npx nx build web
```

To see all available targets to run for a project, run:

```sh
npx nx show project web --web
```

## 🚀 Bulk CRUD Generation

This project includes a powerful bulk CRUD generation system that allows you to define multiple entities and generate full-stack CRUD operations from a single configuration file.

### Quick Start

1. **Copy the example configuration**:
   ```bash
   cp crud.config.example.json crud.config.json
   ```

2. **Edit the configuration** to define your entities, columns, and relationships

3. **Generate all entities**:
   ```bash
   # Generate all entities from config
   npm run g:crud-bulk

   # Or generate specific entities
   npm run g:crud-bulk -- --entities=product,category

   # Preview what will be generated
   npm run g:crud-bulk -- --dryRun=true

   # Handle conflicts automatically
   npm run g:crud-bulk -- --conflictResolution=skip    # Skip existing
   npm run g:crud-bulk -- --conflictResolution=update  # Overwrite existing
   npm run g:crud-bulk -- --conflictResolution=backup  # Update with backup
   ```

### Features

- **📋 Configuration-driven**: Define all entities in a single JSON file
- **🔄 Bulk generation**: Generate multiple CRUD operations at once
- **🎯 Selective generation**: Generate specific entities only
- **🔍 Validation**: Comprehensive config validation with helpful error messages
- **⚡ Conflict resolution**: Smart handling of existing files with multiple options
- **📊 Relationships**: Support for belongsTo, hasMany, and manyToMany relationships
- **🎨 UI customization**: Configure table styles, forms, and interactions
- **🔒 Permissions**: Role-based access control configuration
- **📱 Responsive**: Mobile-friendly generated components
- **🔧 Extensible**: Support for custom validators and features

### Documentation

For detailed documentation, see:
- [BULK_CRUD_GENERATION.md](./BULK_CRUD_GENERATION.md) - Complete guide
- [crud.config.example.json](./crud.config.example.json) - Example configuration

### Example Usage

```bash
# Generate a simple task management system
npm run g:crud-bulk

# Generate e-commerce entities
npm run g:crud-bulk -- --entities=product,category,order

# Use custom config file
npm run g:crud-bulk -- --configFile=my-project.config.json

# Update existing entities with backup
npm run g:crud-bulk -- --conflictResolution=backup --createBackup=true

# Non-interactive mode
npm run g:crud-bulk -- --interactive=false --conflictResolution=update
```

## 🛠️ Individual CRUD Generation

For generating individual entities:

```bash
# Generate single CRUD entity
npm run g:crud product

# With custom options
npm run g:crud product --features.softDelete=true --uiOptions.addEditMode=page
```

To see all available targets to run for a project, run:

```sh
npx nx show project web
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/next:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/react:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/next?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
