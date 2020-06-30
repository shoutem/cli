import 'colors';

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
      'You can now run `shoutem run-ios` or `shoutem run-android`.'
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
    nonEmpty: () => 'Couldn’t initialize extension in non-empty folder. ' +
      'Please, clear the folder and run the initialization process again.'
  },
  install: {
    complete: () => 'Extension installed.',
    completeOntoNew: app => `Extension installed onto newly created \`${app}\` application.`,
    seeNewInBrowser: url => `See it in a browser: ${url}.`,
    notExtensionDir: () => 'No extension found. Try using `shoutem push` before installing.'
  },
  uninstall: {
    missingExtension: () => 'The extension does not exist. It should be pushed using `shoutem push` first.',
    missingInstallation: () => 'Extension not installed.',
    complete: () => 'Extension uninstalled.'
  },
  link: {
    alreadyLinked: () => 'Directory already linked.',
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
      complete: ({ pageName, path }) => `Page ${pageName} is created in \`${ path }\` folder!`
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
    uploadingInfo: (extJson, env) =>
      `Uploading ${extJson.title.cyan} extension to ${env === 'production' ? 'Shoutem' : env}...`
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
      complete: () => 'Directories successfully unlinked. Please, kill the packager before running the app.',
    },
  },
  use: {
    complete: (serverEnv, developer) => `Using server \`${serverEnv}\`` + (developer ? ` as user ${developer.name}.` : '.'),
    invalidEnv: serverEnv => `${serverEnv} is not a valid option\nRun shoutem use -h for possible options.`,
    show: serverEnv => `Using server \`${serverEnv}\`.`,
  },
  run: {
    missingId: () => 'Shoutem app id is required for the first run.',
    info: (platform, config) => `Running ${platform} Shoutem app with id ${config.appId}.`,
    complete: platform => `Finished running ${platform} app.`,
    missingConfig: () => 'Mobile environment wasn\'t correctly installed. Please run `shoutem env install -f` to reinstall.',
    killPackagerAndAdb: () => 'Could not clean up the build directory. Please check that react-packager and adb are not running.'
  },
  show: {
    missingEnv: () => 'No shoutem env was set. Please run shoutem env install.',
    version: packageJson => `Mobile environment version: ${packageJson.version}.`,
    app: config => `Currently used Shoutem app id: ${config.appId}.`,
    missingApp: () => 'No Shoutem app is currently used.',
    missingExtensions: () => 'No local extension is currently linked.',
    listExtensions: paths => 'Linked directories:\n' + paths.map(path => `  ${path}`).join('\n'),
  },
  pack: {
    missingBuildTask: dir => `Skipping build for \`${dir}\` due to missing build task.`
  },
  reactNative: {
    killPackager: () => 'Use `shoutem run-ios --ignore-packager` or kill the packager process before running the app.',
    missing: () => 'Missing react-native command. Please install react-native by running \`npm install -g react-native-cli\`.'
  },
  cocoapods: {
    missing: () => 'Missing pods command. Please install cocoa pods by running \`sudo gem install cocoapods\`.'
  },
  ios: {
    notOnMac: () => 'Unfortunately, Apple only lets you develop for iOS on a Mac. However, ' +
      'you can develop an application, test it on Android and see how it works on iPhone in the Shoutem Builder!'
  },
  node: {
    outdated: minVersion => `Your node version is too old. Please update node to version ${minVersion} or newer.`
  },
  version: {
    updateRequired: () => 'WARNING: This is an outdated version of the Shoutem CLI. Do you want to update it?'
  }
}
