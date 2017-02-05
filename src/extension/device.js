import { exec } from 'mz/child_process';

export async function listIosSimulators() {
  try {
    const [stdout] = await exec('xcrun simctl list devices | grep -iv unavailable | grep "("');
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

