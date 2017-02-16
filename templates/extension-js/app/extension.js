// This file is managed by Shoutem CLI
// You should not change it
import pack from './package.json';
{{{screensImports}}}

export const screens = {
{{screensNames}}
};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
