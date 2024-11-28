import {
  formatFiles,
  Tree,
} from '@nx/devkit';
import { PluginGeneratorSchema } from './schema';
import { ApiGenerator } from './api.generator';
import { ReactGenerator } from './react.generator';
import { TypesGenerator } from './types.generator';
import { execSync } from 'child_process';

export async function pluginGenerator(tree: Tree, options: PluginGeneratorSchema) {
  const typesGenerator = new TypesGenerator(tree, options);
  await typesGenerator.run()
  options.columns = typesGenerator.getColumns();

  const apiGenerator = new ApiGenerator(tree, options);
  await apiGenerator.run()


  const reactGenerator = new ReactGenerator(tree, options);
  await reactGenerator.run()

  await formatFiles(tree);
  
  return async () => {
    await runEslintOnFiles(tree);
  };

}

// Helper function to run ESLint on specific files
function runEslintOnFiles(tree) {

  const generatedFiles: string[] = []

  const changes = tree.listChanges();

  changes.forEach((change) => {
    if (change.type === 'CREATE' || change.type === 'UPDATE') {
      generatedFiles.push(change.path); // Add created/updated files to the list
    }
  });

 
  if (generatedFiles.length === 0) {
    console.log('No files to lint.');
    return;
  }

  try {
    console.log(`Running ESLint on the following files:\n${generatedFiles.join('\n')}`);
    console.log(`npx eslint ${generatedFiles.join(' ')} --fix`);
    execSync(`npx eslint ${generatedFiles.join(' ')} --fix`, { stdio: 'inherit' });
    console.log('ESLint completed successfully.');
  } catch (error) {
    console.error('ESLint encountered issues.', error);
  }
}

export default pluginGenerator;
