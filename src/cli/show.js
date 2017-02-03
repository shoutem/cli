import show from '../commands/show.js';

export const command = 'show';
export const description = 'Show current mobile environment and list of linked extensions';
export async function handler() {
  try {
    await show();
  } catch (err) {
    console.log(err.message || err);
  }
}
