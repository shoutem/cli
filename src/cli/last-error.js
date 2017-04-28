import { lastErrorPath } from '../clients/cli-paths';
import fs from 'mz/fs';

export const description = null;
export const command = 'last-error';
export async function handler() {
  try {
    console.log(await fs.readFile(await lastErrorPath(), 'utf-8'));
  } catch (err) {
    console.log('No error.');
  }
}
