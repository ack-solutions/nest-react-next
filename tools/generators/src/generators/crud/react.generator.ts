import { generateFiles, getProjects, names, ProjectConfiguration, Tree } from '@nx/devkit';
import { join } from 'path';

import { PluginGeneratorSchema } from './schema';
import { addExportStatement } from '../../utils/add-export-statement';
import { toTitleCase } from '../../utils/to-title-case';


export class ReactGenerator {

    projects: Map<string, ProjectConfiguration>;

    names: {
        name: string;
        title: string;
        className: string;
        propertyName: string;
        constantName: string;
        fileName: string;
    };

    constructor(private tree: Tree, private options: PluginGeneratorSchema) {
        this.projects = getProjects(this.tree);
        this.names = {
            ...names(this.options.name),
            title: toTitleCase(this.options.name),
        };
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
            'apps/admin/src/app', // Destination where the custom files should go
            {
                tmpl: '',
                ...this.names,
                columns: this.options.columns,
            }, // Data to pass to the template (e.g., the library name)
        );

        // Generate files in react core lib
        generateFiles(
            this.tree,
            join(__dirname, 'files', 'react-core'), // Path to your custom template files
            'libs/react-core/src/lib', // Destination where the custom files should go
            {
                tmpl: '',
                ...this.names,
                columns: this.options.columns,
            }, // Data to pass to the template (e.g., the library name)
        );
    }

    addExportStatement() {
        // Add Export in types
        addExportStatement(this.tree, `${this.projects.get('types').root}/src/index.ts`, `export * from './lib/${this.names.fileName}';`);

        // Add Export in react core
        addExportStatement(this.tree, `${this.projects.get('react-core').root}/src/lib/query-hooks/index.ts`, `export * from './use-${this.names.fileName}';`);
        addExportStatement(this.tree, `${this.projects.get('react-core').root}/src/lib/services/index.ts`, `export * from './${this.names.fileName}.service';`);
    }

}
