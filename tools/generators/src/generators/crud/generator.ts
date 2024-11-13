import {
  formatFiles,
  Tree,
} from '@nx/devkit';
import { PluginGeneratorSchema } from './schema';
import { ApiGenerator } from './api.generator';
import { ReactGenerator } from './react.generator';
import { TypesGenerator } from './types.generator';


export async function pluginGenerator(tree: Tree, options: PluginGeneratorSchema) {



  const typesGenerator = new TypesGenerator(tree, options);
  await typesGenerator.run()
  options.columns = typesGenerator.getColumns();

  const apiGenerator = new ApiGenerator(tree, options);
  await apiGenerator.run()


  const reactGenerator = new ReactGenerator(tree, options);
  await reactGenerator.run()


  await formatFiles(tree);
}


export default pluginGenerator;
