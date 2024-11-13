import { generateFiles, getProjects, names, Tree } from "@nx/devkit";
import { PluginGeneratorSchema } from "./schema";
import { libraryGenerator } from "@nx/nest";
import { join } from "path";

export class ApiGenerator {
    constructor(private tree: Tree, private options: PluginGeneratorSchema) {

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
}