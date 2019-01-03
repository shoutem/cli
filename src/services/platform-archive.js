import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import ignore from 'ignore';
import tmp from 'tmp-promise';
import Promise from 'bluebird';
import archiver from 'archiver';
import decompress from 'decompress';
import confirmer from './confirmer';
import { getPlatformRootDir } from './platform';
import { isValidPlatformUrl } from './validation';
import { downloadFileFollowRedirect } from './download';
import { listDirectoryContent, readLinesInFile } from './file';

const SHOUTEM_IGNORE_FILE_NAME = '.shoutemignore';
const ARCHIVE_FORMAT = 'zip';

const DEFAULT_SHOUTEM_IGNORE = `
# we don't neet it
.git
# node modules will get installed during the build process of the app
node_modules
# Shoutem platform should not come with any extensions or config file
extensions
config
config.json

# the following are build folders which will be recreated while building the app
ios/Pods

`;

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

      const ignores = await this.loadIgnoreList();

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

  async validateShoutemIgnore() {
    const ignoreFilePath = path.join(this.path, SHOUTEM_IGNORE_FILE_NAME);

    const ignoreExists = await fs.pathExists(ignoreFilePath);
    if (!ignoreExists) {
      console.log('WARNING: missing or empty .shoutemignore file!');
      if (await confirmer('Do you want to create a default .shoutemignore file?')) {
        await fs.writeFile(ignoreFilePath, DEFAULT_SHOUTEM_IGNORE);
      } else {
        console.log('WARNING: Packing everything up, please make sure your folder does not contain any unneeded files');
      }
    }
  }

  async loadIgnoreList() {
    const ignoreFilePath = path.join(this.path, SHOUTEM_IGNORE_FILE_NAME);
    const shoutemIgnores = readLinesInFile(ignoreFilePath);

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
