import os from 'os';
import path from 'path';
import fs from 'fs';
import writefile from 'writefile';

const serverEnvNamePath = path.join(os.homedir(), '.shoutem', 'server-env');

export function getHostEnvName() {
  try {
    return fs.readFileSync(serverEnvNamePath, 'utf8');
  } catch (err) {
    return 'production';
  }
}

export async function setHostEnvName(name) {
  await writefile(serverEnvNamePath, name);
}
