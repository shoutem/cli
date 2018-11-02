import _ from 'lodash';
import fs from 'fs';
import path from 'path';

export function readLinesInFile(path) {
  if (!fs.existsSync(path)) {
    return [];
  }

  const fileContent = fs.readFileSync(path).toString('utf-8');
  const lines = fileContent.split(/[\r\n]+/).filter(line => !_.isEmpty(line));

  return lines;
}

export function listDirectoryContent(dir, relative = false) {
  let filepaths = fs.readdirSync(dir)
    .reduce((files, file) => {
      const name = path.join(dir, file);
      const isDirectory = fs.statSync(name).isDirectory();
      return isDirectory ? [...files, ...listDirectoryContent(name)] : [...files, name];
    }, []);

  if (relative) {
    // +1 because the directory names and with a slash which we don't want
    filepaths = filepaths.map(filepath => filepath.substring(dir.length + 1));
  }

  return filepaths;
}
