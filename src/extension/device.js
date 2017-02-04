import { exec } from 'mz/child_process';

export async function listIosSimulators() {
  const [stdout] = await exec('xcrun simctl list devices | grep -iv unavailable | grep "("');
  const devices = stdout.split('\n').filter(d => d);
  return devices.map(d => d.substr(0, d.indexOf('(')).trim());
}

export async function listIosDevices() {
  const [stdout] = await exec('instruments -s devices | grep -vi simulator | grep -vi known | grep "("');
  const devices = stdout.split('\n').filter(d => d);
  return devices.map(d => d.substr(0, d.indexOf('(')).trim());
}
