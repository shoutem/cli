import { spawn } from 'superspawn';
import msg from '../user_messages';
import { exec } from 'mz/child_process';

export async function ensureInstalled(cwd) {
  try {
    await spawn('react-native', ['-v'], { cwd });
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
