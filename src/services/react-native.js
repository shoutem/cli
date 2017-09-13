import Promise from 'bluebird';
import { spawn } from 'child-process-promise';
import msg from '../user_messages';
import commandExists from './command-exists';
import streamMatcher from './stream-matcher';

export async function ensureInstalled() {
  try {
    if (!await commandExists('react-native')) {
      await spawn('npm', ['install', '-g', 'react-native-cli'], { stdio: 'inherit', shell: true })
    }
  } catch (err) {
    throw new Error(msg.reactNative.missing());
  }
}

export async function startPackager(cwd) {
  const spawned = spawn('react-native', ['start'], {
      stdio: ['inherit', 'pipe', 'inherit'],
      cwd,
      shell: true,
      env: { ...process.env, FORCE_COLOR: true }
    }
  );

  const { childProcess } = spawned;

  childProcess.stdout.pipe(process.stdout);

  // Promise.race() is required to avoid unhandled promise
  // rejection if react-packager fails before becoming 'ready'
  await Promise.race([
    streamMatcher(childProcess.stdout, 'Loading dependency graph, done'),
    spawned
  ]);

  return { packagerProcess: spawned };
}
