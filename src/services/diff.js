import _ from 'lodash';
import path from 'path';
import { diffLines } from 'diff';
import fs from 'fs-extra';
import mkdirp from 'mkdirp-promise';
import confirm from './confirmer';

export async function applyDiffLog(diffLog) {
  await Promise.all(_.map(diffLog, async (newValue, filePath) => {
    await mkdirp(path.join(filePath, '..'));
    await fs.writeFile(filePath, newValue, 'utf8');
  }));
}

function indentLinesWith(str, indent) {
  return str.split('\n').map(line => indent + line).join('\n');
}

export async function offerChanges({ diffLog, postRunActions }) {
  const changes = await Promise.all(_.map(diffLog, async (fileContent, filePath) => {
    try {
      const oldContent = await fs.readFile(filePath, 'utf8');
      if (oldContent === fileContent) {
        return { type: 'nochange', filePath };
      }
      return { diff: diffLines(oldContent, fileContent), type: 'modify', filePath };
    } catch (e) {
      return { type: 'add', filePath };
    }
  }));

  const sortedChanges = _.sortBy(changes, ['type', 'filePath']);

  sortedChanges.forEach(({ type, filePath, diff }) => {
    const localPath = path.relative(process.cwd(), filePath);
    if (type === 'nochange') {
      return;
    }

    if (type === 'add') {
      console.log(`${localPath} created`.green);
      return;
    }

    console.log(`${localPath} modified:`);
    diff.forEach(({ added, removed, value }, index) => {
      if (!value) {
        return;
      }
      if (added) {
        console.log(indentLinesWith(value, `  [+]  `).green)
      } else if (removed) {
        console.log(indentLinesWith(value, `  [-]  `).red);
      } else if (index > 0 && index < diff.length - 1) {
        console.log('  [ ]  ...');
      }
    });
  });

  await applyDiffLog(diffLog);
  await Promise.all(_.map(postRunActions, action => action()));
}
