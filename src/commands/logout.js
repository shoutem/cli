import LocalDataClient from '../clients/local-data';
import fs from 'mz/fs';

export async function logout() {
  const client = new LocalDataClient();

  try {
    await fs.unlink(await client.getTokenFilePath());
  } catch (err) {}

  try {
    await fs.unlink(await client.getDeveloperFilePath());
  } catch (err) {}
}
