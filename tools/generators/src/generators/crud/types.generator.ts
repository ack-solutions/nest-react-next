import { generateFiles, getProjects, names, ProjectConfiguration, Tree } from "@nx/devkit";
import { Column, PluginGeneratorSchema } from "./schema";
import { prompt } from 'enquirer';
import { join } from "path";

export class TypesGenerator {

    projects: Map<string, ProjectConfiguration>;
    names: { name: string; className: string; propertyName: string; constantName: string; fileName: string; };

    constructor(private tree: Tree, private options: PluginGeneratorSchema) {
        this.projects = getProjects(this.tree);
        this.names = names(this.options.name);
    }

    getColumns() {
        return this.options.columns;
    }

    async run() {
        const { generateApi } = this.options;
        if (generateApi) {

            this.options.columns = []
            if (this.options.addColumns) {
                const columns = await this.takeEntityColumns();
                this.options.columns = columns.map((value) => this.mapColumnData(value));
            }

            await this.generateFiles();
            this.addExportStatementInIndex()
        }
    }

    generateFiles() {
        const { name } = this.options;
        const { className, fileName, propertyName } = names(name); // Normalize the name for various cases

        generateFiles(
            this.tree,
            join(__dirname, 'files', 'types'), // Path to your custom template files
            `libs/types/src/lib`, // Destination where the custom files should go
            { tmpl: '', name, className, fileName, propertyName, columns: this.options.columns } // Data to pass to the template (e.g., the library name)
        );
    }


    async takeEntityColumns() {
        const columns: Column[] = [];
        let addMoreColumns = true;

        while (addMoreColumns) {
            const columnPrompt = await prompt<{
                columnName: string;
                columnType: string;
                enumValues: string[];
                nullable: string;
            }>([
                {
                    type: 'input',
                    name: 'columnName',
                    message: 'Enter column name:'
                },
                {
                    type: 'select',
                    name: 'columnType',
                    message: 'Select column type:',
                    choices: ['string', 'number', 'boolean', 'date', 'time', 'date-time', 'enum', 'text', 'json', 'uuid']
                },
                // {
                //     type: 'select',
                //     name: 'nullable',
                //     message: 'Is this column nullable?',
                //     choices: ['yes', 'no']
                // },
            ]);

            if (columnPrompt.columnType === 'enum') {
                columnPrompt.enumValues = await this.askForEnumValues();

            }

            if (columnPrompt.columnName && columnPrompt.columnName != '') {
                columns.push({
                    name: columnPrompt.columnName,
                    normalizeName: names(columnPrompt.columnName),
                    type: columnPrompt.columnType,
                    nullable: columnPrompt.nullable === 'yes',
                    enumValues: columnPrompt.enumValues,
                });

            }

            // If the user selects 'no', stop asking for more columns
            const { moreValues } = await prompt<{ moreValues: string }>({
                type: 'select',
                name: 'moreValues',
                message: 'Do you want to add another column?',
                choices: ['yes', 'no'],
            });
            addMoreColumns = moreValues === 'yes';
        }

        return columns;
    }

    async askForEnumValues() {

        const { enumValues } = await prompt<{ enumValues: string }>({
            type: 'input',
            name: 'enumValues',
            message: 'Enter enum values (comma-separated):',
            validate: (input) => input ? true : 'Enum values cannot be empty.'
        });

        return `${enumValues}`.split(',').map((val) => val.trim())
    }

    private mapColumnData(column: Column) {
        const mappedColumn = {
            ...column,
            tsType: '',
            validationDecorators: [],
            swaggerType: '',
            databaseType: null,
            columnOptionsString: '',
        };

        const columnOptions = {
            nullable: true, // column.nullable ,
            type: null
        };

        switch (column.type) {
        case 'text':
            mappedColumn.tsType = 'string';
            mappedColumn.validationDecorators.push('@IsString()');
            mappedColumn.swaggerType = 'String';
            columnOptions.type = 'text';
            break;
        case 'string':
            mappedColumn.tsType = 'string';
            mappedColumn.validationDecorators.push('@IsString()');
            mappedColumn.swaggerType = 'String';
            break;
        case 'number':
            mappedColumn.tsType = 'number';
            mappedColumn.validationDecorators.push('@IsNumber()');
            mappedColumn.swaggerType = 'Number';
            break;
        case 'boolean':
            mappedColumn.tsType = 'boolean';
            mappedColumn.validationDecorators.push('@IsBoolean()');
            mappedColumn.swaggerType = 'Boolean';
            break;
        case 'date-time':
            mappedColumn.tsType = 'Date';
            mappedColumn.validationDecorators.push('@IsDateString()');
            mappedColumn.swaggerType = 'String';
            break;
        case 'date':
            columnOptions.type = 'date';
            mappedColumn.tsType = 'Date';
            mappedColumn.validationDecorators.push('@IsDateString()');
            mappedColumn.swaggerType = 'String';
            break;
        case 'time':
            columnOptions.type = 'time';
            mappedColumn.tsType = 'string';
            mappedColumn.validationDecorators.push('@IsString()');
            mappedColumn.swaggerType = 'String';
            break;
        case 'enum':
            columnOptions.type = 'text';
            mappedColumn.enumValues = column.enumValues
            mappedColumn.tsType = `${names(this.options.name).className}${names(column.name).className}Enum`;
            mappedColumn.validationDecorators.push(`@IsEnum(${mappedColumn.tsType})`);
            mappedColumn.swaggerType = 'String';
            break;
        case 'uuid':
            mappedColumn.tsType = 'string';
            mappedColumn.validationDecorators.push('@IsUUID()');
            mappedColumn.swaggerType = 'String';
            break;
        case 'json':
            columnOptions.type = 'jsonb';
            mappedColumn.tsType = 'any';
            mappedColumn.swaggerType = 'any';
            break;
        default:
            mappedColumn.tsType = 'any';
            mappedColumn.swaggerType = 'any';
            break;
        }

        mappedColumn.columnOptionsString = this.mapColumnOptions(columnOptions);
        return mappedColumn;
    }

    private mapColumnOptions({ type, nullable }): string {
        const options = [];

        // Add type if exists
        if (type) {
            options.push(`type: '${type}'`);
        }

        // Add nullable if applicable
        if (nullable) {
            options.push('nullable: true');
        }

        // Join options into a comma-separated string
        return options?.length > 0 ? `{${options.join(', ')}}` : '';
    }



    private addExportStatementInIndex() {
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
