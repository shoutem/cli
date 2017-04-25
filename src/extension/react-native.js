import { spawn } from 'child-process-promise';
import msg from '../user_messages';
import { exec, fork } from 'mz/child_process';
import commandExists from './command-exists';
import streamMatcher from './stream-matcher';
import merge2 from 'merge2';

export async function ensureInstalled() {
  try {
    if (!await commandExists('react-native')) {
      await spawn('npm', ['install', '-g', 'react-native-cli'], { stdio: 'inherit', shell: true })
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
    { cwd, stdio: 'inherit', shell: true },
  );
}

export async function run(cwd, platform) {
  await spawn(
    'react-native',
    [`run-${platform}`],
    { cwd, stdio: 'inherit', shell: true }
  );
}

export function startPackager(cwd, { resolveOnReady = false }) {
  const spawned = spawn('react-native', ['start'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd,
      shell: true,
      env: { ...process.env, FORCE_COLOR: true }
    }
  );

  const { childProcess } = spawned;

  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);

  if (!resolveOnReady) {
    return spawned;
  }

  return streamMatcher(
    merge2([childProcess.stdout, childProcess.stderr]),
    { pattern: 'React packager ready.', inactivityTimeout: 11000 }
  ).then(() => ({ childProcess }));
}
