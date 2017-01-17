export default {
  env: {
    install: {
      alreadyExists: () => 'Mobile environment already exists, try `shoutem env update`',
      complete: pkgJson => `Mobile environment v${pkgJson.version} installation complete. ` +
        'You can now run `shoutem run-ios` or `shoutem run-android`',
    },
    update: {
      missingEnv: () => 'Mobile environment does not exist, try `shoutem env install` first',
      alreadyLatest: version => `Already at latest version ${version}. Use \`shoutem env install -f\` to reinstall.`,
      complete: pkgJson => `Mobile environment updated to version ${pkgJson.version}. ` +
      'You can now run `shoutem run-ios` or `shoutem run-android`'
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
    complete: () => 'Extension initialized.',
    invalidName: name => 'Name must not contain any special characters, spaces or capital letters.',
    suggestName: suggestion => `Try something like ${suggestion}`,
    requestInfo: () => 'Enter information about your extension. Press `return` to accept (default) values.',
    nonEmpty: () => 'Couldn’t initialize extension in non-empty folder. ' +
      'Please, clear the folder and run the initialization process again.'
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
    alreadyLinked: () => 'Extension already linked',
    complete: () => 'Extension successfully linked. Please, kill the packager before running the app.'
  },
  login: {
    complete: dev => `Registered as \`${dev.name}\`.`,
    credentialsPrompt: () => 'Enter your Shoutem credentials.',
    loggedIn: credentials => `\nLogged in as \`${credentials.username}\`.`
  },
  logout: {
    complete: () => 'Local credentials cleared.'
  },
  page: {
    add: {
      complete: ({ pageName, path }) => `Page ${pageName} is created in \`${ path }\` folder!`
    }
  },
  publish: {
    complete: extJson => `Version \`${extJson.version}\` of \`${extJson.name}\` extension was published!`,
    failed: detail => `Publish failed: ${detail}`,
    publishInfo: extJson => `Publishing extension \`${extJson.name}\` version \`${extJson.version}\``
  },
  push: {
    complete: () => 'Success!',
    missingPackageJson: list => `Warning: directories ${list} couldn't be pushed due to missing package.json.`,
    failureSuggestion: () => 'Warning: Check whether both server and app directory have a valid package.json file.',
    uploadingInfo: extJson => `Uploading \`${extJson.title}\` extension to Shoutem...`
  },
  schema: {
    add: {
      complete: (name, path) => `File \`${path}\` is created.`,
      alreadyExists: schemaName => `Schema "${schemaName}" already exists. Pick another name.`
    }
  },
  screen: {
    add: {
      complete: (screenName, path) => `File \`${path}\` is created.`,
      alreadyExists: screenName => `Screen "${screenName}" already exists. Pick another name.`
    }
  },
  shortcut: {
    add: {
      complete: shortcutName => `\`${shortcutName}\` shortcut is created.`,
      alreadyExists: shortcutName => `Shortcut "${shortcutName}" already exists. Pick another name.`
    }
  },
  theme: {
    add: {
      complete: (themeName, path) => `File \`${path}\` is created.`,
      alreadyExists: themeName => `Theme \`${themeName}\` already exists. Pick another name.`
    }
  },
  unlink: {
    notLinked: () => 'This extension is not linked to the mobile environment. There is nothing to unlink.',
    complete: () => 'Extension successfully unlinked. Please, kill the packager before running the app.'
  },
  use: {
    complete: (serverEnv, developer) => `Using server \`${serverEnv}\` as user ${developer.name}.`,
    invalidEnv: serverEnv => `${serverEnv} is not a valid option\nRun shoutem use -h for possible options.`,
    show: serverEnv => `Using server \`${serverEnv}\`:`,
  },
  run: {
    missingId: () => 'Shoutem app id is required for the first run.',
    info: (platform, config) => `Running ${platform} shoutem app with id ${config.appId}`,
    complete: platform => `Finished running ${platform} app.`,
    missingConfig: () => 'Mobile environment wasn\'t correctly installed. Please run `shoutem env install -f` to reinstall'
  },
  show: {
    missingEnv: () => 'No shoutem env was set. Please run shoutem env install.',
    version: packageJson => `Mobile environment version: ${packageJson.version}`,
    app: config => `Currently used shoutem app id: ${config.appId}`,
    missingApp: () => 'No shoutem app is currently used.',
    missingExtensions: () => 'No local extension is currently linked',
    listExtensions(extensionsInfo) {
      return 'Linked extensions:\n' +
        extensionsInfo
          .map(ext => `  ${ext.name} v${ext.version} @${ext.dir}`)
          .join('\n')
    }
  },
  pack: {
    missingBuildTask: dir => `Skipping build for \`${dir}\` due to missing build task`
  },
  yarn: {
    missing: () => 'Missing yarn command. Please install yarn by running `npm install -g yarn`.',
    outdated: (minVersion) => `Yarn version outdated. Please update yarn to v${minVersion} or newer by running \`npm install -g yarn\``
  },
  reactNative: {
    killPackager: () => 'Use `shoutem run-ios --ignore-packager` or kill the packager process before running the app',
    missing: () => 'Missing react-native command. Please install react-native by running \`npm install -g react-native-cli\`.'
  },
  cocoapods: {
    missing: () => 'Missing pods command. Please install cocoa pods by running \`sudo gem install cocoapods\`.'
  },
  ios: {
    notOnMac: () => 'Unfortunately, Apple only lets you develop for iOS on a Mac. However, ' +
      'you can develop an application, test it on Android and see how it works on iPhone in Shoutem Builder!'
  },
  node: {
    outdated: minVersion => `Your node version is too old. Please update node to version ${minVersion} or newer`
  },
  version: {
    updateRequired: () => 'You are running an outdated version of shoutem CLI.\nPlease update to latest version by running `npm install -g @shoutem/cli` or `sudo npm install -g @shoutem/cli`'
  }
}
