# Shoutem CLI

Shoutem CLI is a command line tool which helps you build Shoutem extensions.

You can read more about CLI in our [documentation](http://shoutem.github.io/docs/extensions/reference/cli)

## Local Development

For local development there are three ways of approaching this:

#### 1. Compiling and running from the repository

1. Run `npm i` inside repository
2. Run `node path/to/build/shoutem.js <command>`, where `<command>` is the command you're testing

After making changes to the code, you can run `rm -rf build && npm run build` to recompile and then continue using step 2 described above.

#### 2. Editing global node_modules

While messy and harder to keep track of changes (since you can't see the diff directly), this has proven effective. You can make changes in your global `node_modules` directory on your machine in the `src` directory, then re-build the CLI using `npm run build` within the `cli` directory (where the package.json is).

#### 3. Installing via git commit hash

Prerequisites:

- babel-cli v6.8.0 installed globally on your machine
- commit should have `package.json` edited in such a way that the `prepare` script is replaced with a `preinstall` script

You can see the changes you've made with your code and how they affect the CLI by using `npm i -g shoutem/cli#<commit_hash>`, e.g.:
`npm i -g shoutem/cli#6874qbr`

This can also be used for testing before release, unlike the other two methods.

**NOTE:** Once a release is ready, make sure to turn the preinstall script back into a prepare script as users may not have babel-cli installed.
