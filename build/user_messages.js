'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('colors');

exports.default = {
  env: {
    install: {
      alreadyExists: () => 'Mobile environment already exists, try `shoutem env update`',
      complete: pkgJson => `Mobile environment v${pkgJson.version} installation complete. ` + 'You can now run `shoutem run-ios` or `shoutem run-android`'
    },
    update: {
      missingEnv: () => 'Mobile environment does not exist, try `shoutem env install` first',
      alreadyLatest: version => `Already at latest version ${version}. Use \`shoutem env install -f\` to reinstall.`,
      complete: pkgJson => `Mobile environment updated to version ${pkgJson.version}. ` + 'You can now run `shoutem run-ios` or `shoutem run-android`'
    },
    info: {
      downloading: version => `Downloading environment v${version}...`,
      downloaded: () => 'Mobile app downloaded, installing dependencies...',
      dependenciesInstalled: () => 'Dependencies installed, linking native dependencies...',
      linked: () => 'Native dependencies linked!'
    }
  },
  init: {
    missingName: () => 'Extensions must have a name.',
    complete: () => 'Extension initialized.'.green.bold,
    invalidName: name => 'Name must not contain any special characters, spaces or capital letters.',
    suggestName: suggestion => `Try something like ${suggestion}`,
    requestInfo: () => 'Enter information about your extension. Press `return` to accept (default) values.',
    nonEmpty: () => 'Couldn’t initialize extension in non-empty folder. ' + 'Please, clear the folder and run the initialization process again.'
  },
  install: {
    complete: () => 'Extension installed',
    completeOntoNew: app => `Extension installed onto newly created \`${app}\` application.`,
    seeNewInBrowser: url => `See it in browser: ${url}`,
    notExtensionDir: () => 'No extension found. Try `shoutem push` before installing.'
  },
  uninstall: {
    missingExtension: () => 'Extension does not exist. You must `shoutem push` it first.',
    missingInstallation: () => 'Extension not installed.',
    complete: () => 'Extension uninstalled.'
  },
  link: {
    alreadyLinked: () => 'Directory already linked',
    complete: () => 'Directory successfully linked. Please, kill the packager before running the app.'
  },
  login: {
    complete: dev => `Registered as \`${dev.name}\`.`,
    credentialsPrompt: url => `Enter your Shoutem credentials (obtained at ${url.bold}):`,
    loggedIn: credentials => `\nLogged in as \`${credentials.username}\`.`
  },
  logout: {
    complete: () => 'Successfully logged out.'
  },
  page: {
    add: {
      complete: ({ pageName, path }) => `Page ${pageName} is created in \`${path}\` folder!`
    }
  },
  publish: {
    complete: extJson => `Version ${extJson.version.cyan} of ${extJson.name.cyan} extension was published!`,
    failed: detail => `Publish failed: ${detail}`,
    publishInfo: extJson => `Publishing ${extJson.name.cyan} version ${extJson.version.cyan}...`
  },
  push: {
    complete: () => 'Success!'.green.bold,
    missingPackageJson: list => `Warning: directories ${list} couldn't be pushed due to missing package.json.`,
    failureSuggestion: () => 'Warning: Check whether both server and app directory have a valid package.json file.',
    uploadingInfo: (extJson, env) => `Uploading ${extJson.title.cyan} extension to ${env === 'production' ? 'Shoutem' : env}...`
  },
  schema: {
    add: {
      complete: (name, path) => `File \`${path}\` is created.`,
      alreadyExists: schemaName => `Schema "${schemaName}" already exists. Pick another name.`
    }
  },
  screen: {
    add: {
      complete: (screenName, path) => `Screen \`${screenName}\` created in file \`${path}\`!`,
      alreadyExists: screenName => `Screen "${screenName}" already exists. Pick another name.`
    }
  },
  shortcut: {
    add: {
      complete: shortcutName => `Shortcut \`${shortcutName}\` is created.`,
      alreadyExists: shortcutName => `Shortcut "${shortcutName}" already exists. Pick another name.`
    }
  },
  theme: {
    add: {
      complete: (themeName, path) => `File \`${path}\` is created.`
    }
  },
  unlink: {
    notLinked: () => 'This directory is not linked to the mobile environment. There is nothing to unlink.',
    complete: () => 'Unlink successful. Please, kill the packager before running the app.',
    all: {
      complete: () => 'Directories successfully unlinked. Please, kill the packager before running the app.'
    }
  },
  use: {
    complete: (serverEnv, developer) => `Using server \`${serverEnv}\`` + (developer ? ` as user ${developer.name}.` : '.'),
    invalidEnv: serverEnv => `${serverEnv} is not a valid option\nRun shoutem use -h for possible options.`,
    show: serverEnv => `Using server \`${serverEnv}\``
  },
  run: {
    missingId: () => 'Shoutem app id is required for the first run.',
    info: (platform, config) => `Running ${platform} shoutem app with id ${config.appId}`,
    complete: platform => `Finished running ${platform} app.`,
    missingConfig: () => 'Mobile environment wasn\'t correctly installed. Please run `shoutem env install -f` to reinstall',
    killPackagerAndAdb: () => 'Could not clean up the build directory. Please check that react-packager and adb are not running'
  },
  show: {
    missingEnv: () => 'No shoutem env was set. Please run shoutem env install.',
    version: packageJson => `Mobile environment version: ${packageJson.version}`,
    app: config => `Currently used shoutem app id: ${config.appId}`,
    missingApp: () => 'No shoutem app is currently used.',
    missingExtensions: () => 'No local extension is currently linked',
    listExtensions: paths => 'Linked directories:\n' + paths.map(path => `  ${path}`).join('\n')
  },
  pack: {
    missingBuildTask: dir => `Skipping build for \`${dir}\` due to missing build task`
  },
  yarn: {
    missing: () => 'Missing yarn command. Please install yarn by running `npm install -g yarn`.',
    outdated: minVersion => `Yarn version outdated. Please update yarn to v${minVersion} or newer by running \`npm install -g yarn\``
  },
  reactNative: {
    killPackager: () => 'Use `shoutem run-ios --ignore-packager` or kill the packager process before running the app',
    missing: () => 'Missing react-native command. Please install react-native by running \`npm install -g react-native-cli\`.'
  },
  cocoapods: {
    missing: () => 'Missing pods command. Please install cocoa pods by running \`sudo gem install cocoapods\`.'
  },
  ios: {
    notOnMac: () => 'Unfortunately, Apple only lets you develop for iOS on a Mac. However, ' + 'you can develop an application, test it on Android and see how it works on iPhone in Shoutem Builder!'
  },
  node: {
    outdated: minVersion => `Your node version is too old. Please update node to version ${minVersion} or newer`
  },
  version: {
    updateRequired: () => 'WARNING: This is an outdated version of shoutem CLI. Do you want to update it?'
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91c2VyX21lc3NhZ2VzLmpzIl0sIm5hbWVzIjpbImVudiIsImluc3RhbGwiLCJhbHJlYWR5RXhpc3RzIiwiY29tcGxldGUiLCJwa2dKc29uIiwidmVyc2lvbiIsInVwZGF0ZSIsIm1pc3NpbmdFbnYiLCJhbHJlYWR5TGF0ZXN0IiwiaW5mbyIsImRvd25sb2FkaW5nIiwiZG93bmxvYWRlZCIsImRlcGVuZGVuY2llc0luc3RhbGxlZCIsImxpbmtlZCIsImluaXQiLCJtaXNzaW5nTmFtZSIsImdyZWVuIiwiYm9sZCIsImludmFsaWROYW1lIiwibmFtZSIsInN1Z2dlc3ROYW1lIiwic3VnZ2VzdGlvbiIsInJlcXVlc3RJbmZvIiwibm9uRW1wdHkiLCJjb21wbGV0ZU9udG9OZXciLCJhcHAiLCJzZWVOZXdJbkJyb3dzZXIiLCJ1cmwiLCJub3RFeHRlbnNpb25EaXIiLCJ1bmluc3RhbGwiLCJtaXNzaW5nRXh0ZW5zaW9uIiwibWlzc2luZ0luc3RhbGxhdGlvbiIsImxpbmsiLCJhbHJlYWR5TGlua2VkIiwibG9naW4iLCJkZXYiLCJjcmVkZW50aWFsc1Byb21wdCIsImxvZ2dlZEluIiwiY3JlZGVudGlhbHMiLCJ1c2VybmFtZSIsImxvZ291dCIsInBhZ2UiLCJhZGQiLCJwYWdlTmFtZSIsInBhdGgiLCJwdWJsaXNoIiwiZXh0SnNvbiIsImN5YW4iLCJmYWlsZWQiLCJkZXRhaWwiLCJwdWJsaXNoSW5mbyIsInB1c2giLCJtaXNzaW5nUGFja2FnZUpzb24iLCJsaXN0IiwiZmFpbHVyZVN1Z2dlc3Rpb24iLCJ1cGxvYWRpbmdJbmZvIiwidGl0bGUiLCJzY2hlbWEiLCJzY2hlbWFOYW1lIiwic2NyZWVuIiwic2NyZWVuTmFtZSIsInNob3J0Y3V0Iiwic2hvcnRjdXROYW1lIiwidGhlbWUiLCJ0aGVtZU5hbWUiLCJ1bmxpbmsiLCJub3RMaW5rZWQiLCJhbGwiLCJ1c2UiLCJzZXJ2ZXJFbnYiLCJkZXZlbG9wZXIiLCJpbnZhbGlkRW52Iiwic2hvdyIsInJ1biIsIm1pc3NpbmdJZCIsInBsYXRmb3JtIiwiY29uZmlnIiwiYXBwSWQiLCJtaXNzaW5nQ29uZmlnIiwia2lsbFBhY2thZ2VyQW5kQWRiIiwicGFja2FnZUpzb24iLCJtaXNzaW5nQXBwIiwibWlzc2luZ0V4dGVuc2lvbnMiLCJsaXN0RXh0ZW5zaW9ucyIsInBhdGhzIiwibWFwIiwiam9pbiIsInBhY2siLCJtaXNzaW5nQnVpbGRUYXNrIiwiZGlyIiwieWFybiIsIm1pc3NpbmciLCJvdXRkYXRlZCIsIm1pblZlcnNpb24iLCJyZWFjdE5hdGl2ZSIsImtpbGxQYWNrYWdlciIsImNvY29hcG9kcyIsImlvcyIsIm5vdE9uTWFjIiwibm9kZSIsInVwZGF0ZVJlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7a0JBRWU7QUFDYkEsT0FBSztBQUNIQyxhQUFTO0FBQ1BDLHFCQUFlLE1BQU0sNkRBRGQ7QUFFUEMsZ0JBQVVDLFdBQVksdUJBQXNCQSxRQUFRQyxPQUFRLDBCQUF2QyxHQUNuQjtBQUhLLEtBRE47QUFNSEMsWUFBUTtBQUNOQyxrQkFBWSxNQUFNLG9FQURaO0FBRU5DLHFCQUFlSCxXQUFZLDZCQUE0QkEsT0FBUSxnREFGekQ7QUFHTkYsZ0JBQVVDLFdBQVkseUNBQXdDQSxRQUFRQyxPQUFRLElBQXpELEdBQ3JCO0FBSk0sS0FOTDtBQVlISSxVQUFNO0FBQ0pDLG1CQUFhTCxXQUFZLDRCQUEyQkEsT0FBUSxLQUR4RDtBQUVKTSxrQkFBWSxNQUFNLG1EQUZkO0FBR0pDLDZCQUF1QixNQUFNLHdEQUh6QjtBQUlKQyxjQUFRLE1BQU07QUFKVjtBQVpILEdBRFE7QUFvQmJDLFFBQU07QUFDSkMsaUJBQWEsTUFBTSw4QkFEZjtBQUVKWixjQUFVLE1BQU0seUJBQXlCYSxLQUF6QixDQUErQkMsSUFGM0M7QUFHSkMsaUJBQWFDLFFBQVEsMEVBSGpCO0FBSUpDLGlCQUFhQyxjQUFlLHNCQUFxQkEsVUFBVyxFQUp4RDtBQUtKQyxpQkFBYSxNQUFNLG9GQUxmO0FBTUpDLGNBQVUsTUFBTSx3REFDZDtBQVBF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QUE0SWJ4RixXQUFTO0FBQ1ArRixvQkFBZ0IsTUFBTTtBQURmO0FBNUlJLEMiLCJmaWxlIjoidXNlcl9tZXNzYWdlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnY29sb3JzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBlbnY6IHtcclxuICAgIGluc3RhbGw6IHtcclxuICAgICAgYWxyZWFkeUV4aXN0czogKCkgPT4gJ01vYmlsZSBlbnZpcm9ubWVudCBhbHJlYWR5IGV4aXN0cywgdHJ5IGBzaG91dGVtIGVudiB1cGRhdGVgJyxcclxuICAgICAgY29tcGxldGU6IHBrZ0pzb24gPT4gYE1vYmlsZSBlbnZpcm9ubWVudCB2JHtwa2dKc29uLnZlcnNpb259IGluc3RhbGxhdGlvbiBjb21wbGV0ZS4gYCArXHJcbiAgICAgICAgJ1lvdSBjYW4gbm93IHJ1biBgc2hvdXRlbSBydW4taW9zYCBvciBgc2hvdXRlbSBydW4tYW5kcm9pZGAnLFxyXG4gICAgfSxcclxuICAgIHVwZGF0ZToge1xyXG4gICAgICBtaXNzaW5nRW52OiAoKSA9PiAnTW9iaWxlIGVudmlyb25tZW50IGRvZXMgbm90IGV4aXN0LCB0cnkgYHNob3V0ZW0gZW52IGluc3RhbGxgIGZpcnN0JyxcclxuICAgICAgYWxyZWFkeUxhdGVzdDogdmVyc2lvbiA9PiBgQWxyZWFkeSBhdCBsYXRlc3QgdmVyc2lvbiAke3ZlcnNpb259LiBVc2UgXFxgc2hvdXRlbSBlbnYgaW5zdGFsbCAtZlxcYCB0byByZWluc3RhbGwuYCxcclxuICAgICAgY29tcGxldGU6IHBrZ0pzb24gPT4gYE1vYmlsZSBlbnZpcm9ubWVudCB1cGRhdGVkIHRvIHZlcnNpb24gJHtwa2dKc29uLnZlcnNpb259LiBgICtcclxuICAgICAgJ1lvdSBjYW4gbm93IHJ1biBgc2hvdXRlbSBydW4taW9zYCBvciBgc2hvdXRlbSBydW4tYW5kcm9pZGAnXHJcbiAgICB9LFxyXG4gICAgaW5mbzoge1xyXG4gICAgICBkb3dubG9hZGluZzogdmVyc2lvbiA9PiBgRG93bmxvYWRpbmcgZW52aXJvbm1lbnQgdiR7dmVyc2lvbn0uLi5gLFxyXG4gICAgICBkb3dubG9hZGVkOiAoKSA9PiAnTW9iaWxlIGFwcCBkb3dubG9hZGVkLCBpbnN0YWxsaW5nIGRlcGVuZGVuY2llcy4uLicsXHJcbiAgICAgIGRlcGVuZGVuY2llc0luc3RhbGxlZDogKCkgPT4gJ0RlcGVuZGVuY2llcyBpbnN0YWxsZWQsIGxpbmtpbmcgbmF0aXZlIGRlcGVuZGVuY2llcy4uLicsXHJcbiAgICAgIGxpbmtlZDogKCkgPT4gJ05hdGl2ZSBkZXBlbmRlbmNpZXMgbGlua2VkISdcclxuICAgIH1cclxuICB9LFxyXG4gIGluaXQ6IHtcclxuICAgIG1pc3NpbmdOYW1lOiAoKSA9PiAnRXh0ZW5zaW9ucyBtdXN0IGhhdmUgYSBuYW1lLicsXHJcbiAgICBjb21wbGV0ZTogKCkgPT4gJ0V4dGVuc2lvbiBpbml0aWFsaXplZC4nLmdyZWVuLmJvbGQsXHJcbiAgICBpbnZhbGlkTmFtZTogbmFtZSA9PiAnTmFtZSBtdXN0IG5vdCBjb250YWluIGFueSBzcGVjaWFsIGNoYXJhY3RlcnMsIHNwYWNlcyBvciBjYXBpdGFsIGxldHRlcnMuJyxcclxuICAgIHN1Z2dlc3ROYW1lOiBzdWdnZXN0aW9uID0+IGBUcnkgc29tZXRoaW5nIGxpa2UgJHtzdWdnZXN0aW9ufWAsXHJcbiAgICByZXF1ZXN0SW5mbzogKCkgPT4gJ0VudGVyIGluZm9ybWF0aW9uIGFib3V0IHlvdXIgZXh0ZW5zaW9uLiBQcmVzcyBgcmV0dXJuYCB0byBhY2NlcHQgKGRlZmF1bHQpIHZhbHVlcy4nLFxyXG4gICAgbm9uRW1wdHk6ICgpID0+ICdDb3VsZG7igJl0IGluaXRpYWxpemUgZXh0ZW5zaW9uIGluIG5vbi1lbXB0eSBmb2xkZXIuICcgK1xyXG4gICAgICAnUGxlYXNlLCBjbGVhciB0aGUgZm9sZGVyIGFuZCBydW4gdGhlIGluaXRpYWxpemF0aW9uIHByb2Nlc3MgYWdhaW4uJ1xyXG4gIH0sXHJcbiAgaW5zdGFsbDoge1xyXG4gICAgY29tcGxldGU6ICgpID0+ICdFeHRlbnNpb24gaW5zdGFsbGVkJyxcclxuICAgIGNvbXBsZXRlT250b05ldzogYXBwID0+IGBFeHRlbnNpb24gaW5zdGFsbGVkIG9udG8gbmV3bHkgY3JlYXRlZCBcXGAke2FwcH1cXGAgYXBwbGljYXRpb24uYCxcclxuICAgIHNlZU5ld0luQnJvd3NlcjogdXJsID0+IGBTZWUgaXQgaW4gYnJvd3NlcjogJHt1cmx9YCxcclxuICAgIG5vdEV4dGVuc2lvbkRpcjogKCkgPT4gJ05vIGV4dGVuc2lvbiBmb3VuZC4gVHJ5IGBzaG91dGVtIHB1c2hgIGJlZm9yZSBpbnN0YWxsaW5nLidcclxuICB9LFxyXG4gIHVuaW5zdGFsbDoge1xyXG4gICAgbWlzc2luZ0V4dGVuc2lvbjogKCkgPT4gJ0V4dGVuc2lvbiBkb2VzIG5vdCBleGlzdC4gWW91IG11c3QgYHNob3V0ZW0gcHVzaGAgaXQgZmlyc3QuJyxcclxuICAgIG1pc3NpbmdJbnN0YWxsYXRpb246ICgpID0+ICdFeHRlbnNpb24gbm90IGluc3RhbGxlZC4nLFxyXG4gICAgY29tcGxldGU6ICgpID0+ICdFeHRlbnNpb24gdW5pbnN0YWxsZWQuJ1xyXG4gIH0sXHJcbiAgbGluazoge1xyXG4gICAgYWxyZWFkeUxpbmtlZDogKCkgPT4gJ0RpcmVjdG9yeSBhbHJlYWR5IGxpbmtlZCcsXHJcbiAgICBjb21wbGV0ZTogKCkgPT4gJ0RpcmVjdG9yeSBzdWNjZXNzZnVsbHkgbGlua2VkLiBQbGVhc2UsIGtpbGwgdGhlIHBhY2thZ2VyIGJlZm9yZSBydW5uaW5nIHRoZSBhcHAuJ1xyXG4gIH0sXHJcbiAgbG9naW46IHtcclxuICAgIGNvbXBsZXRlOiBkZXYgPT4gYFJlZ2lzdGVyZWQgYXMgXFxgJHtkZXYubmFtZX1cXGAuYCxcclxuICAgIGNyZWRlbnRpYWxzUHJvbXB0OiB1cmwgPT4gYEVudGVyIHlvdXIgU2hvdXRlbSBjcmVkZW50aWFscyAob2J0YWluZWQgYXQgJHt1cmwuYm9sZH0pOmAsXHJcbiAgICBsb2dnZWRJbjogY3JlZGVudGlhbHMgPT4gYFxcbkxvZ2dlZCBpbiBhcyBcXGAke2NyZWRlbnRpYWxzLnVzZXJuYW1lfVxcYC5gXHJcbiAgfSxcclxuICBsb2dvdXQ6IHtcclxuICAgIGNvbXBsZXRlOiAoKSA9PiAnU3VjY2Vzc2Z1bGx5IGxvZ2dlZCBvdXQuJ1xyXG4gIH0sXHJcbiAgcGFnZToge1xyXG4gICAgYWRkOiB7XHJcbiAgICAgIGNvbXBsZXRlOiAoeyBwYWdlTmFtZSwgcGF0aCB9KSA9PiBgUGFnZSAke3BhZ2VOYW1lfSBpcyBjcmVhdGVkIGluIFxcYCR7IHBhdGggfVxcYCBmb2xkZXIhYFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcHVibGlzaDoge1xyXG4gICAgY29tcGxldGU6IGV4dEpzb24gPT4gYFZlcnNpb24gJHtleHRKc29uLnZlcnNpb24uY3lhbn0gb2YgJHtleHRKc29uLm5hbWUuY3lhbn0gZXh0ZW5zaW9uIHdhcyBwdWJsaXNoZWQhYCxcclxuICAgIGZhaWxlZDogZGV0YWlsID0+IGBQdWJsaXNoIGZhaWxlZDogJHtkZXRhaWx9YCxcclxuICAgIHB1Ymxpc2hJbmZvOiBleHRKc29uID0+IGBQdWJsaXNoaW5nICR7ZXh0SnNvbi5uYW1lLmN5YW59IHZlcnNpb24gJHtleHRKc29uLnZlcnNpb24uY3lhbn0uLi5gXHJcbiAgfSxcclxuICBwdXNoOiB7XHJcbiAgICBjb21wbGV0ZTogKCkgPT4gJ1N1Y2Nlc3MhJy5ncmVlbi5ib2xkLFxyXG4gICAgbWlzc2luZ1BhY2thZ2VKc29uOiBsaXN0ID0+IGBXYXJuaW5nOiBkaXJlY3RvcmllcyAke2xpc3R9IGNvdWxkbid0IGJlIHB1c2hlZCBkdWUgdG8gbWlzc2luZyBwYWNrYWdlLmpzb24uYCxcclxuICAgIGZhaWx1cmVTdWdnZXN0aW9uOiAoKSA9PiAnV2FybmluZzogQ2hlY2sgd2hldGhlciBib3RoIHNlcnZlciBhbmQgYXBwIGRpcmVjdG9yeSBoYXZlIGEgdmFsaWQgcGFja2FnZS5qc29uIGZpbGUuJyxcclxuICAgIHVwbG9hZGluZ0luZm86IChleHRKc29uLCBlbnYpID0+XHJcbiAgICAgIGBVcGxvYWRpbmcgJHtleHRKc29uLnRpdGxlLmN5YW59IGV4dGVuc2lvbiB0byAke2VudiA9PT0gJ3Byb2R1Y3Rpb24nID8gJ1Nob3V0ZW0nIDogZW52fS4uLmBcclxuICB9LFxyXG4gIHNjaGVtYToge1xyXG4gICAgYWRkOiB7XHJcbiAgICAgIGNvbXBsZXRlOiAobmFtZSwgcGF0aCkgPT4gYEZpbGUgXFxgJHtwYXRofVxcYCBpcyBjcmVhdGVkLmAsXHJcbiAgICAgIGFscmVhZHlFeGlzdHM6IHNjaGVtYU5hbWUgPT4gYFNjaGVtYSBcIiR7c2NoZW1hTmFtZX1cIiBhbHJlYWR5IGV4aXN0cy4gUGljayBhbm90aGVyIG5hbWUuYFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2NyZWVuOiB7XHJcbiAgICBhZGQ6IHtcclxuICAgICAgY29tcGxldGU6IChzY3JlZW5OYW1lLCBwYXRoKSA9PiBgU2NyZWVuIFxcYCR7c2NyZWVuTmFtZX1cXGAgY3JlYXRlZCBpbiBmaWxlIFxcYCR7cGF0aH1cXGAhYCxcclxuICAgICAgYWxyZWFkeUV4aXN0czogc2NyZWVuTmFtZSA9PiBgU2NyZWVuIFwiJHtzY3JlZW5OYW1lfVwiIGFscmVhZHkgZXhpc3RzLiBQaWNrIGFub3RoZXIgbmFtZS5gXHJcbiAgICB9XHJcbiAgfSxcclxuICBzaG9ydGN1dDoge1xyXG4gICAgYWRkOiB7XHJcbiAgICAgIGNvbXBsZXRlOiBzaG9ydGN1dE5hbWUgPT4gYFNob3J0Y3V0IFxcYCR7c2hvcnRjdXROYW1lfVxcYCBpcyBjcmVhdGVkLmAsXHJcbiAgICAgIGFscmVhZHlFeGlzdHM6IHNob3J0Y3V0TmFtZSA9PiBgU2hvcnRjdXQgXCIke3Nob3J0Y3V0TmFtZX1cIiBhbHJlYWR5IGV4aXN0cy4gUGljayBhbm90aGVyIG5hbWUuYFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgdGhlbWU6IHtcclxuICAgIGFkZDoge1xyXG4gICAgICBjb21wbGV0ZTogKHRoZW1lTmFtZSwgcGF0aCkgPT4gYEZpbGUgXFxgJHtwYXRofVxcYCBpcyBjcmVhdGVkLmBcclxuICAgIH1cclxuICB9LFxyXG4gIHVubGluazoge1xyXG4gICAgbm90TGlua2VkOiAoKSA9PiAnVGhpcyBkaXJlY3RvcnkgaXMgbm90IGxpbmtlZCB0byB0aGUgbW9iaWxlIGVudmlyb25tZW50LiBUaGVyZSBpcyBub3RoaW5nIHRvIHVubGluay4nLFxyXG4gICAgY29tcGxldGU6ICgpID0+ICdVbmxpbmsgc3VjY2Vzc2Z1bC4gUGxlYXNlLCBraWxsIHRoZSBwYWNrYWdlciBiZWZvcmUgcnVubmluZyB0aGUgYXBwLicsXHJcbiAgICBhbGw6IHtcclxuICAgICAgY29tcGxldGU6ICgpID0+ICdEaXJlY3RvcmllcyBzdWNjZXNzZnVsbHkgdW5saW5rZWQuIFBsZWFzZSwga2lsbCB0aGUgcGFja2FnZXIgYmVmb3JlIHJ1bm5pbmcgdGhlIGFwcC4nLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHVzZToge1xyXG4gICAgY29tcGxldGU6IChzZXJ2ZXJFbnYsIGRldmVsb3BlcikgPT4gYFVzaW5nIHNlcnZlciBcXGAke3NlcnZlckVudn1cXGBgICsgKGRldmVsb3BlciA/IGAgYXMgdXNlciAke2RldmVsb3Blci5uYW1lfS5gIDogJy4nKSxcclxuICAgIGludmFsaWRFbnY6IHNlcnZlckVudiA9PiBgJHtzZXJ2ZXJFbnZ9IGlzIG5vdCBhIHZhbGlkIG9wdGlvblxcblJ1biBzaG91dGVtIHVzZSAtaCBmb3IgcG9zc2libGUgb3B0aW9ucy5gLFxyXG4gICAgc2hvdzogc2VydmVyRW52ID0+IGBVc2luZyBzZXJ2ZXIgXFxgJHtzZXJ2ZXJFbnZ9XFxgYCxcclxuICB9LFxyXG4gIHJ1bjoge1xyXG4gICAgbWlzc2luZ0lkOiAoKSA9PiAnU2hvdXRlbSBhcHAgaWQgaXMgcmVxdWlyZWQgZm9yIHRoZSBmaXJzdCBydW4uJyxcclxuICAgIGluZm86IChwbGF0Zm9ybSwgY29uZmlnKSA9PiBgUnVubmluZyAke3BsYXRmb3JtfSBzaG91dGVtIGFwcCB3aXRoIGlkICR7Y29uZmlnLmFwcElkfWAsXHJcbiAgICBjb21wbGV0ZTogcGxhdGZvcm0gPT4gYEZpbmlzaGVkIHJ1bm5pbmcgJHtwbGF0Zm9ybX0gYXBwLmAsXHJcbiAgICBtaXNzaW5nQ29uZmlnOiAoKSA9PiAnTW9iaWxlIGVudmlyb25tZW50IHdhc25cXCd0IGNvcnJlY3RseSBpbnN0YWxsZWQuIFBsZWFzZSBydW4gYHNob3V0ZW0gZW52IGluc3RhbGwgLWZgIHRvIHJlaW5zdGFsbCcsXHJcbiAgICBraWxsUGFja2FnZXJBbmRBZGI6ICgpID0+ICdDb3VsZCBub3QgY2xlYW4gdXAgdGhlIGJ1aWxkIGRpcmVjdG9yeS4gUGxlYXNlIGNoZWNrIHRoYXQgcmVhY3QtcGFja2FnZXIgYW5kIGFkYiBhcmUgbm90IHJ1bm5pbmcnXHJcbiAgfSxcclxuICBzaG93OiB7XHJcbiAgICBtaXNzaW5nRW52OiAoKSA9PiAnTm8gc2hvdXRlbSBlbnYgd2FzIHNldC4gUGxlYXNlIHJ1biBzaG91dGVtIGVudiBpbnN0YWxsLicsXHJcbiAgICB2ZXJzaW9uOiBwYWNrYWdlSnNvbiA9PiBgTW9iaWxlIGVudmlyb25tZW50IHZlcnNpb246ICR7cGFja2FnZUpzb24udmVyc2lvbn1gLFxyXG4gICAgYXBwOiBjb25maWcgPT4gYEN1cnJlbnRseSB1c2VkIHNob3V0ZW0gYXBwIGlkOiAke2NvbmZpZy5hcHBJZH1gLFxyXG4gICAgbWlzc2luZ0FwcDogKCkgPT4gJ05vIHNob3V0ZW0gYXBwIGlzIGN1cnJlbnRseSB1c2VkLicsXHJcbiAgICBtaXNzaW5nRXh0ZW5zaW9uczogKCkgPT4gJ05vIGxvY2FsIGV4dGVuc2lvbiBpcyBjdXJyZW50bHkgbGlua2VkJyxcclxuICAgIGxpc3RFeHRlbnNpb25zOiBwYXRocyA9PiAnTGlua2VkIGRpcmVjdG9yaWVzOlxcbicgKyBwYXRocy5tYXAocGF0aCA9PiBgICAke3BhdGh9YCkuam9pbignXFxuJyksXHJcbiAgfSxcclxuICBwYWNrOiB7XHJcbiAgICBtaXNzaW5nQnVpbGRUYXNrOiBkaXIgPT4gYFNraXBwaW5nIGJ1aWxkIGZvciBcXGAke2Rpcn1cXGAgZHVlIHRvIG1pc3NpbmcgYnVpbGQgdGFza2BcclxuICB9LFxyXG4gIHlhcm46IHtcclxuICAgIG1pc3Npbmc6ICgpID0+ICdNaXNzaW5nIHlhcm4gY29tbWFuZC4gUGxlYXNlIGluc3RhbGwgeWFybiBieSBydW5uaW5nIGBucG0gaW5zdGFsbCAtZyB5YXJuYC4nLFxyXG4gICAgb3V0ZGF0ZWQ6IChtaW5WZXJzaW9uKSA9PiBgWWFybiB2ZXJzaW9uIG91dGRhdGVkLiBQbGVhc2UgdXBkYXRlIHlhcm4gdG8gdiR7bWluVmVyc2lvbn0gb3IgbmV3ZXIgYnkgcnVubmluZyBcXGBucG0gaW5zdGFsbCAtZyB5YXJuXFxgYFxyXG4gIH0sXHJcbiAgcmVhY3ROYXRpdmU6IHtcclxuICAgIGtpbGxQYWNrYWdlcjogKCkgPT4gJ1VzZSBgc2hvdXRlbSBydW4taW9zIC0taWdub3JlLXBhY2thZ2VyYCBvciBraWxsIHRoZSBwYWNrYWdlciBwcm9jZXNzIGJlZm9yZSBydW5uaW5nIHRoZSBhcHAnLFxyXG4gICAgbWlzc2luZzogKCkgPT4gJ01pc3NpbmcgcmVhY3QtbmF0aXZlIGNvbW1hbmQuIFBsZWFzZSBpbnN0YWxsIHJlYWN0LW5hdGl2ZSBieSBydW5uaW5nIFxcYG5wbSBpbnN0YWxsIC1nIHJlYWN0LW5hdGl2ZS1jbGlcXGAuJ1xyXG4gIH0sXHJcbiAgY29jb2Fwb2RzOiB7XHJcbiAgICBtaXNzaW5nOiAoKSA9PiAnTWlzc2luZyBwb2RzIGNvbW1hbmQuIFBsZWFzZSBpbnN0YWxsIGNvY29hIHBvZHMgYnkgcnVubmluZyBcXGBzdWRvIGdlbSBpbnN0YWxsIGNvY29hcG9kc1xcYC4nXHJcbiAgfSxcclxuICBpb3M6IHtcclxuICAgIG5vdE9uTWFjOiAoKSA9PiAnVW5mb3J0dW5hdGVseSwgQXBwbGUgb25seSBsZXRzIHlvdSBkZXZlbG9wIGZvciBpT1Mgb24gYSBNYWMuIEhvd2V2ZXIsICcgK1xyXG4gICAgICAneW91IGNhbiBkZXZlbG9wIGFuIGFwcGxpY2F0aW9uLCB0ZXN0IGl0IG9uIEFuZHJvaWQgYW5kIHNlZSBob3cgaXQgd29ya3Mgb24gaVBob25lIGluIFNob3V0ZW0gQnVpbGRlciEnXHJcbiAgfSxcclxuICBub2RlOiB7XHJcbiAgICBvdXRkYXRlZDogbWluVmVyc2lvbiA9PiBgWW91ciBub2RlIHZlcnNpb24gaXMgdG9vIG9sZC4gUGxlYXNlIHVwZGF0ZSBub2RlIHRvIHZlcnNpb24gJHttaW5WZXJzaW9ufSBvciBuZXdlcmBcclxuICB9LFxyXG4gIHZlcnNpb246IHtcclxuICAgIHVwZGF0ZVJlcXVpcmVkOiAoKSA9PiAnV0FSTklORzogVGhpcyBpcyBhbiBvdXRkYXRlZCB2ZXJzaW9uIG9mIHNob3V0ZW0gQ0xJLiBEbyB5b3Ugd2FudCB0byB1cGRhdGUgaXQ/J1xyXG4gIH1cclxufVxyXG4iXX0=