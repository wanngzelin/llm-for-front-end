import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default () => {
  const env = process.env.NODE_ENV || 'development';
  const YAML_CONFIG_FILENAME = `../../config.${env}.yaml`;

  return yaml.load(readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf-8')) as Record<string, any>
}