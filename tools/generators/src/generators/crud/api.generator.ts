import { generateFiles, getProjects, joinPathFragments, names, ProjectConfiguration, Tree } from "@nx/devkit";
import { join } from "path";

import { PluginGeneratorSchema } from "./schema";
import { addImportStatement } from "../../utils/add-import-statement";
import { appendArrayItem } from "../../utils/append-array-item";


export class ApiGenerator {

    projects: Map<string, ProjectConfiguration>;
    names: { name: string; className: string; propertyName: string; constantName: string; fileName: string; };

    constructor(private tree: Tree, private options: PluginGeneratorSchema) {
        this.projects = getProjects(this.tree);
        this.names = names(this.options.name);
    }

    async run() {
        const { generateApi } = this.options;
        if (generateApi) {
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
            {
                tmpl: '',
                name,
                className,
                fileName,
                propertyName,
                columns: this.options.columns 
            } // Data to pass to the template (e.g., the library name)
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

        // Add the import statement if not already present
        content = addImportStatement(content, importStatement)

        // Add the module to the imports array if not already present
        content = appendArrayItem(content, 'Modules', moduleName)

        // Write the updated content back to `api.module.ts`
        this.tree.write(apiModulePath, content);
    }

    addEntityInAllEntityArray() {
        const allEntityFilePath = joinPathFragments(this.projects.get('api').root, 'src', 'app', 'core', 'entities.ts');

        if (!this.tree.exists(allEntityFilePath)) {
            throw new Error(`entities.ts not found at ${allEntityFilePath}`);
        }

        // Read the current content of `entities.ts`
        let content = this.tree.read(allEntityFilePath, 'utf-8');

        // Define entity details
        const entityName = `${this.names.className}`;
        const entityPath = `../modules/${this.names.fileName}/${this.names.fileName}.entity`;
        const importStatement = `import { ${entityName} } from '${entityPath}';`;

        // Add the import statement if not already present
        content = addImportStatement(content, importStatement)

        // Add the entity to the array if not already present
        content = appendArrayItem(content, 'AllEntities', entityName)

        // Write the updated content back to the file
        this.tree.write(allEntityFilePath, content);
    }


}