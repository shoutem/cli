import os from 'os';
import path from 'path';
import { exec } from 'mz/child_process';

export async function listIosSimulators() {
  try {
    const [stdout] = await exec('xcrun simctl list devices | grep -iv unavailable | grep "(" | grep -i iphone');
    const devices = stdout.split('\n').filter(d => d);
    return devices.map(d => d.substr(0, d.indexOf('(')).trim());
  } catch (err) {
    if (err.code === 1) {
      return [];
    }
    throw err;
  }
}

export async function listIosDevices() {
  try {
    const [stdout] = await exec('instruments -s devices | grep -vi simulator | grep -vi known | grep "("');
    const devices = stdout.split('\n').filter(d => d);
    return devices.map(d => d.substr(0, d.indexOf('(')).trim());
  } catch (err) {
    if (err.code === 1) {
      return [];
    }
    throw err;
  }
}

const androidSdkPath = path.join(os.homedir(), 'Library', 'Android', 'sdk');

export async function listAndroidSimulators() {
  const avdManagerPath = path.join(androidSdkPath, 'tools', 'bin', 'avdmanager');

  const [stdout] = await exec(`${avdManagerPath} list avd`);
  const devicesLines = stdout.split('\n').filter(l => l.indexOf('Name: ') > -1);
  return devicesLines.map(line => line.substr(line.indexOf("Name: ") + 6));
}

export async function createAndroidDevice() {

}