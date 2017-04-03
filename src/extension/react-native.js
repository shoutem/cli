import { spawn } from 'superspawn';
import msg from '../user_messages';
import { exec, fork } from 'mz/child_process';
import commandExists from './command-exists';

export async function ensureInstalled() {
  try {
    if (!await commandExists('react-native')) {
      await spawn('npm', ['install', '-g', 'react-native-cli'], { stdio: 'inherit' })
    }
  } catch (err) {
    throw new Error(msg.reactNative.missing());
  }
}

export async function link(cwd = process.cwd()) {
  await ensureInstalled(cwd);
  await spawn(
    'react-native',
    ['link'],
    { cwd, stdio: 'inherit' }
  );
}

export async function ensurePackagerNotRunning() {
  const [stdout] = await exec("lsof -n -i4TCP:8081 | sed '1 d' | awk '{print $2}'");
  if (!stdout) {
    return;
  }

  throw new Error(msg.reactNative.killPackager());
}

export async function run(cwd, platform) {
  await spawn(
    'react-native',
    [`run-${platform}`],
    {cwd, stdio: 'inherit'}
  );
}

export async function killPackager() {
  if (process.platform === 'darwin') {
    await exec("lsof -n -i4TCP:8081 | sed '1 d' | awk '{print $2}' | xargs kill -9");
  }
}

export async function startPackager(cwd) {
  console.log('Packager is being run within this process. Please keep this process running if app is used in debug mode'.bold.yellow);
  await spawn('react-native', ['start'], { stdio: ['ignore', 'ignore', 'inherit'], cwd, detached: true })
}
