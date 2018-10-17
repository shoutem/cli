import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp-promise';
import ignore from 'ignore';
import Promise from 'bluebird';
import decompress from 'decompress';
import archiver from 'archiver';
import { isValidPlatformUrl } from './validation';
import { getPlatformRootDir } from './platform';
import { listDirectoryContent, readLinesInFile } from './file';
import { downloadFileFollowRedirect } from './donwload';

const SHOUTEM_IGNORE_FILE_NAME = '.shoutemignore';
const ARCHIVE_FORMAT = 'zip';

class ArchiveProvider {
  constructor() {
    this.archiveData = {
      path: null,
      temporaryDir: null,
      initialized: false,
    };
  }

  isInitialized() {
    return this.archiveData.initialized;
  }
}

class RemoteArchiveProvider extends ArchiveProvider {
  constructor(url) {
    super();
    this.url = url;
  }

  getType() {
    return 'remote';
  }

  async getArchivePath() {
    const data = await this.getArchiveData();
    return data.path;
  }

  async getPlatformJsonPath() {
    const data = await this.getArchiveData();

    const extractDirectory = path.join(data.temporaryDir.path, 'extracted');
    await decompress(data.path, extractDirectory);

    const zipContent = fs.readdirSync(extractDirectory);
    if (_.size(zipContent) !== 1
      || !_.first(zipContent)
      || !fs.lstatSync(path.join(extractDirectory, _.first(zipContent))).isDirectory()
    ) {
      throw new Error('Platform archive must contain a single directory');
    }

    const platformJsonPath = path.join(extractDirectory, _.first(zipContent), 'platform', 'platform.json');
    if (!fs.pathExists(platformJsonPath)) {
      throw new Error('Platform archive is missing platform/platform.json');
    }

    return platformJsonPath;
  }

  async getPlatformJson() {
    const platformJsonPath = await this.getPlatformJsonPath();
    const platformJsonFile = fs.readFileSync(platformJsonPath);
    const jsonContent = JSON.parse(platformJsonFile);

    return jsonContent;
  }

  async getArchiveData() {
    if (!this.isInitialized()) {
      const temporaryDir = await tmp.dir();

      const destinationDir = temporaryDir.path;
      const platformFileName = `platform.${ARCHIVE_FORMAT}`;

      await downloadFileFollowRedirect(this.url, { directory: destinationDir, filename: platformFileName });

      this.archiveData = {
        path: path.join(destinationDir, platformFileName),
        temporaryDir,
        initialized: true,
      };
    }

    return this.archiveData;
  }

  cleanUp() {
    if (this.isInitialized()) {
      this.archiveData = {
        path: null,
        temporaryDir: null,
        initialized: false,
      };
    }
  }
}

class LocalArchiveProvider extends ArchiveProvider {
  constructor(path) {
    super();
    this.path = path;
  }

  getType() {
    return 'local';
  }

  async getArchivePath() {
    const data = await this.getArchiveData();
    return data.path;
  }

  async getPlatformJsonPath() {
    const platformJsonFile = fs.readFileSync(path.join(this.path, 'platform', 'platform.json'));
    return platformJsonFile;
  }

  async getPlatformJson() {
    const platformJsonFile = await this.getPlatformJsonPath();
    const jsonContent = JSON.parse(platformJsonFile);

    return jsonContent;
  }

  async getArchiveData() {
    if (!this.isInitialized()) {
      const temporaryDir = await tmp.dir();

      const destinationDir = temporaryDir.path;
      const platformFileName = `platform.${ARCHIVE_FORMAT}`;

      const ignores = this.loadIgnoreList();

      const platformJson = await this.getPlatformJson();
      const rootDirectoryName = `platform-${platformJson.version}`;

      await packItUp(this.path, destinationDir, platformFileName, ignores, rootDirectoryName);

      this.archiveData = {
        path: path.join(destinationDir, platformFileName),
        temporaryDir,
        initialized: true,
      };
    }

    return this.archiveData;
  }

  cleanUp() {
    if (this.isInitialized()) {
      this.archiveData = {
        path: null,
        temporaryDir: null,
        initialized: false,
      };
    }
  }

  loadIgnoreList() {
    const ignoreFilePath = path.join(this.path, SHOUTEM_IGNORE_FILE_NAME);
    const shoutemIgnores = readLinesInFile(ignoreFilePath);

    if(_.isEmpty(shoutemIgnores)) {
      console.log("WARNING: missing or empty .shoutemignore file!\nPacking everything into the platform archive...")
    }

    // no need to remove comments, 'ignores' does that for us
    return ignore().add(shoutemIgnores);
  }
}

export function packItUp(sourcePath, destinationDir, platformFileName, ignores, rootDirectoryName) {
  return new Promise((resolve, reject) => {
    const archive = archiver(ARCHIVE_FORMAT);

    archive.on('error', (err) => {
      reject(err);
    });

    const output = fs.createWriteStream(path.join(destinationDir, platformFileName));
    archive.pipe(output);

    output.on('close', () => {
      resolve();
    });

    const files = listDirectoryContent(sourcePath, true);

    // create a root directory in archive
    archive.append(null, { name: `${rootDirectoryName}/` });

    files.forEach((file) => {
      const ignoreTest = ignores.test(file);
      if (!ignoreTest.ignored) {
        archive
          .append(fs.createReadStream(file), { name: `${rootDirectoryName}/${file}` });
      }
    });

    archive.finalize();
  });
}

export async function createPlatformArchiveProvider(url) {
  if (!_.isEmpty(url) && isValidPlatformUrl(url)) {
    return new RemoteArchiveProvider(url);
  }

  const platformDir = await getPlatformRootDir(process.cwd(), { shouldThrow: false });
  if (platformDir != null) {
    return new LocalArchiveProvider(platformDir);
  }

  return null;
}
