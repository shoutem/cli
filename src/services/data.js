import mzfs from "mz/fs";

export async function readJsonFile(filePath) {
  try {
    return JSON.parse(await mzfs.readFile(filePath, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    err.message = `Could not read file ${filePath}\n${err.message}`;
    throw err;
  }
}

export async function writeJsonFile(json, filePath) {
  const str = `${JSON.stringify(json, null, 2)}\n`;
  await mzfs.writeFile(filePath, str, 'utf8');
  return str;
}
