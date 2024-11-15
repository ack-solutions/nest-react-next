import { formatFiles, generateFiles, getProjects, joinPathFragments, names, ProjectConfiguration, Tree } from "@nx/devkit";
import { PluginGeneratorSchema } from "./schema";
import { libraryGenerator, moduleGenerator } from "@nx/nest";
import { join } from "path";

export class ApiGenerator {
  
    projects: Map<string, ProjectConfiguration>;
    names: { name: string; className: string; propertyName: string; constantName: string; fileName: string; };

    constructor(private tree: Tree, private options: PluginGeneratorSchema) {
        this.projects = getProjects(this.tree);
        this.names = names(this.options.name);
    }

    async run() {
        const projects = getProjects(this.tree);
        const { name, generateApi } = this.options;

        const libName = `${name}-api`
        const isCreated = projects.has(libName)
        if (!isCreated && generateApi) {
            // await libraryGenerator(this.tree, {
            //     name: libName,
            //     directory: `packages/${name}/api`,
            //     importPath: `@ackplus-inventory/${name}/api`,
            //     publishable: true,
            //     buildable: true,
            // });

            // this.tree.delete(`packages/${name}/api/src/lib`)
            await this.generateFiles();
            this.importModuleInAppModule();
            this.addEntityInAllEntityArray();
        }


    }


    generateFiles() {
        const { name } = this.options;
        const { className, fileName, propertyName } = names(name); // Normalize the name for various cases

        generateFiles(
            this.tree,
            join(__dirname, 'files', 'api'), // Path to your custom template files
            `apps/api/src/app/modules`, // Destination where the custom files should go
            { tmpl: '', name, className, fileName, propertyName, columns: this.options.columns } // Data to pass to the template (e.g., the library name)
        );
    }

    generateEnumFileContent(enumName: string, enumValues: string[]): string {
        return `export enum ${enumName} { \n \t${enumValues.map((value) => `${value.toUpperCase()} = '${value}'`).join(',\n')} \n}`;
    }


    importModuleInAppModule() {
        const apiModulePath = joinPathFragments(this.projects.get('api').root, 'src', 'app', 'api.module.ts');
        if (!this.tree.exists(apiModulePath)) {
            throw new Error(`api.module.ts not found at ${apiModulePath}`);
        }

        // Read the current content of `api.module.ts`
        let content = this.tree.read(apiModulePath, 'utf-8');

        // Define module details
        const moduleName = `${this.names.className}Module`;
        const modulePath = `./modules/${this.names.fileName}/${this.names.fileName}.module`;
        const importStatement = `import { ${moduleName} } from '${modulePath}';\n`;

        // Step 1: Add the import statement if not already present
        if (!content.includes(importStatement)) {
            // Add the import at the top
            const importSection = content.match(/^import\s+.*;/gm); // Match all import statements
            if (importSection) {
                const lastImportIndex = content.lastIndexOf(importSection[importSection.length - 1]);
                content =
                    content.slice(0, lastImportIndex + importSection[importSection.length - 1].length + 1).trim() +
                    `\n${importStatement}` +
                    content.slice(lastImportIndex + importSection[importSection.length - 1].length + 1);
            } else {
                content = `${importStatement}\n${content}`;
            }
        }

        // Step 2: Add the module to the imports array if not already present
        const importsArrayRegex = /imports:\s*\[(.*?)\]/s;
        content = content.replace(importsArrayRegex, (match, imports) => {
            // Parse existing imports and remove empty entries or trailing commas
            const importsList = imports
                .split(',')
                .map((item) => item.trim())
                .filter((item) => item && item !== ''); // Remove empty entries

            // Add the new module if not already in the list
            if (!importsList.includes(moduleName)) {
                importsList.push(moduleName);
            }

            // Return the formatted imports list
            return `imports: [\n    ${importsList.join(',\n    ')},\n]`;
        });

        // Step 3: Write the updated content back to `api.module.ts`
        this.tree.write(apiModulePath, content);
    }



    addEntityInAllEntityArray() {
        const allEntityFilePath = joinPathFragments(this.projects.get('api').root, 'src', 'app', 'core', 'entities.ts');

        if (!this.tree.exists(allEntityFilePath)) {
            throw new Error(`entities.ts not found at ${allEntityFilePath}`);
        }

        // Read the current content of `entities.ts`
        let content = this.tree.read(allEntityFilePath, 'utf-8');
        console.log('Original Content:', content); // Debugging: Log the file content

        // Define entity details
        const entityName = `${this.names.className}`;
        const entityPath = `./modules/${this.names.fileName}/${this.names.fileName}.entity`;
        const importStatement = `import { ${entityName} } from '${entityPath}';`;

        // Step 1: Add the import statement if not already present
        if (!content.includes(importStatement)) {
            content = `${importStatement}\n${content}`;
        }

        // Step 2: Use improved regex to find and modify the AllEntities array
        const allEntitiesRegex = /export\s+const\s+AllEntities\s*=\s*\[\s*([\s\S]*?)\s*,?\s*\];/m; // Adjusted regex
        const match = content.match(allEntitiesRegex);
        console.log('Regex Match:', match); // Debugging: Log the match result

        if (match) {
            // Parse the existing entities array
            const existingEntities = match[1]
                .split(',')
                .map((item) => item.trim())
                .filter((item) => item); // Remove empty entries

            // Add the new entity if not already in the array
            if (!existingEntities.includes(entityName)) {
                existingEntities.push(entityName);
            }

            // Reformat the AllEntities array with proper indentation
            const formattedEntities = existingEntities.map((e) => `    ${e}`).join(',\n');
            content = content.replace(
                allEntitiesRegex,
                `export const AllEntities = [\n${formattedEntities},\n];`
            );
        } else {
            // Step 3: If `AllEntities` does not exist, create it
            content += `\nexport const AllEntities = [\n    ${entityName},\n];\n`;
        }

        console.log('Updated Content:', content); // Debugging: Log the updated content

        // Step 4: Write the updated content back to `entities.ts`
        this.tree.write(allEntityFilePath, content);
    }



}