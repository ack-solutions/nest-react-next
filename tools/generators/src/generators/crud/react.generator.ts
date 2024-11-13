import { generateFiles, getProjects, names, Tree } from "@nx/devkit";
import { PluginGeneratorSchema } from "./schema";
import { libraryGenerator } from "@nx/react";
import path from "path";

export class ReactGenerator {
    constructor(private tree: Tree, private options: PluginGeneratorSchema) {

    }
    async run() {
        const projects = getProjects(this.tree);
        const { name, generateReact } = this.options;

        const libName = `${name}-react`
        const isCreated = projects.has(libName)
        if (!isCreated && generateReact) {
            // await libraryGenerator(this.tree, {
            //     name: libName,
            //     directory: `packages/${name}/react`,
            //     importPath: `@ackplus-inventory/${name}/react`,
            //     publishable: true,
            //     buildable: true,
            //     bundler: 'vite',
            //     unitTestRunner: 'vitest',
            //     linter: 'none',
            //     style: 'none'
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
            path.join(__dirname, 'files', 'react'), // Path to your custom template files
            `apps/admin/src/app`, // Destination where the custom files should go
            { tmpl: '', name, className, fileName, propertyName, columns: this.options.columns } // Data to pass to the template (e.g., the library name)
        );
    }

}