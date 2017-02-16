// This file is managed by Shoutem CLI
// You should not change it
import pack from './package.json';

export const screens = {};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
