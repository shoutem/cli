import Promise from 'bluebird';
import ps from 'ps-node';

const lookup = Promise.promisify(ps.lookup);
const kill = Promise.promisify(ps.kill);

export default async function (name) {
  const adbs = await lookup({
    command: name
  });

  await Promise.all(adbs.map(adb => kill(adb.pid)));

  return adbs;
}
