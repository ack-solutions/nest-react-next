import { generateFiles, getProjects, names, ProjectConfiguration, Tree } from "@nx/devkit";
import { PluginGeneratorSchema } from "./schema";
import { join } from "path";


export class ReactGenerator {
    projects: Map<string, ProjectConfiguration>;
    names: { name: string; className: string; propertyName: string; constantName: string; fileName: string; };

    constructor(private tree: Tree, private options: PluginGeneratorSchema) {
        this.projects = getProjects(this.tree);
        this.names = names(this.options.name);
    }
    async run() {
        const { generateReact } = this.options;
        if (generateReact) {
            await this.generateFiles();
            this.addExportStatement();
        }

    }


    generateFiles() {
        generateFiles(
            this.tree,
            join(__dirname, 'files', 'react'), // Path to your custom template files
            `apps/admin/src/app`, // Destination where the custom files should go
            { tmpl: '', ...this.names, columns: this.options.columns } // Data to pass to the template (e.g., the library name)
        );
    }


    addExportStatement(){
        const indexPath = `${this.projects.get('types').root}/src/index.ts`;

        // Check if index.ts exists
        if (!this.tree.exists(indexPath)) {
            throw new Error(`index.ts not found at ${indexPath}`);
        }

        // Read the current content of index.ts
        const currentContent = this.tree.read(indexPath, 'utf-8').trim();

        // Add the new export line (if it doesn't already exist)
        const newExportLine = `export * from './lib/${this.names.fileName}';`;
        if (!currentContent.includes(newExportLine)) {
            const updatedContent = `${currentContent}\n${newExportLine}\n`;
            this.tree.write(indexPath, updatedContent);
        }
    }

}