'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.loginUser = loginUser;
exports.ensureUserIsLoggedIn = ensureUserIsLoggedIn;

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _authService = require('../clients/auth-service');

var _extensionManager = require('../clients/extension-manager');

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _services = require('../../config/services');

var _services2 = _interopRequireDefault(_services);

var _logger = require('../services/logger');

var logger = _interopRequireWildcard(_logger);

var _cacheEnv = require('../services/cache-env');

var cache = _interopRequireWildcard(_cacheEnv);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function resolveCredentials(args) {
  if (args.credentials) {
    return await parseCredentials(args.credentials);
  }
  return await promptUserCredentials(args);
}

function parseCredentials(credentials) {
  const parts = credentials.split(':');
  return {
    email: _lodash2.default.get(parts, '[0]'),
    password: _lodash2.default.get(parts, '[1]')
  };
}

function promptUserCredentials(args = {}) {
  if (!args.email || !args.password) {
    console.log(_user_messages2.default.login.credentialsPrompt(_services2.default.appBuilder));
  }

  const questions = [{
    name: 'email',
    message: 'Email',
    when: () => !args.email
  }, {
    name: 'password',
    message: 'Password',
    type: 'password',
    when: () => !args.password
  }];

  return _inquirer2.default.prompt(questions);
}

function promptDeveloperName() {
  /* eslint no-confusing-arrow: 0 */
  console.log('Enter developer name.');
  return _inquirer2.default.prompt({
    name: 'devName',
    message: 'Developer name',
    validate: value => value ? true : 'Developer name cannot be blank.'
  }).then(answer => answer.devName);
}

/**
 * Checks cache to see if user is already logged in with a given email
 */

async function userAlreadyLoggedIn(email) {
  const developer = await cache.getValue('developer');

  return developer && developer.email === email;
}

/**
 * Asks user to enter credentials, verifies those credentials with authentication
 * service, and saves the received API token locally for further requests.
 */
async function loginUser(args) {
  const credentials = await resolveCredentials(args);

  if (await userAlreadyLoggedIn(credentials.email)) {
    console.log("Already logged in with given email.");
    return;
  }

  const refreshToken = await (0, _authService.getRefreshToken)(credentials);
  await (0, _authService.authorizeRequests)(refreshToken);

  let developer = null;
  try {
    developer = await (0, _extensionManager.getDeveloper)();
  } catch (err) {
    if (err.statusCode === 404) {
      developer = await (0, _extensionManager.createDeveloper)((await promptDeveloperName()));
    } else {
      throw err;
    }
  }

  console.log(_user_messages2.default.login.complete(developer));
  logger.info('logged in as developer', developer);

  return cache.setValue('developer', _extends({}, developer, { email: credentials.email }));
}

/**
 * Asks user for email and password if refreshToken is not already cached
 * @param shouldThrow Should an error be thrown if user is not logged in or should user be asked for credentials
 */
async function ensureUserIsLoggedIn(shouldThrow = false) {
  const developer = await cache.getValue('developer');
  if (developer) {
    return developer;
  }

  if (shouldThrow) {
    throw new Error('Not logged in, use `shoutem login` command to login');
  } else {
    return await loginUser();
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9sb2dpbi5qcyJdLCJuYW1lcyI6WyJsb2dpblVzZXIiLCJlbnN1cmVVc2VySXNMb2dnZWRJbiIsImxvZ2dlciIsImNhY2hlIiwicmVzb2x2ZUNyZWRlbnRpYWxzIiwiYXJncyIsImNyZWRlbnRpYWxzIiwicGFyc2VDcmVkZW50aWFscyIsInByb21wdFVzZXJDcmVkZW50aWFscyIsInBhcnRzIiwic3BsaXQiLCJlbWFpbCIsIl8iLCJnZXQiLCJwYXNzd29yZCIsImNvbnNvbGUiLCJsb2ciLCJtc2ciLCJsb2dpbiIsImNyZWRlbnRpYWxzUHJvbXB0IiwidXJscyIsImFwcEJ1aWxkZXIiLCJxdWVzdGlvbnMiLCJuYW1lIiwibWVzc2FnZSIsIndoZW4iLCJ0eXBlIiwiaW5xdWlyZXIiLCJwcm9tcHQiLCJwcm9tcHREZXZlbG9wZXJOYW1lIiwidmFsaWRhdGUiLCJ2YWx1ZSIsInRoZW4iLCJhbnN3ZXIiLCJkZXZOYW1lIiwidXNlckFscmVhZHlMb2dnZWRJbiIsImRldmVsb3BlciIsImdldFZhbHVlIiwicmVmcmVzaFRva2VuIiwiZXJyIiwic3RhdHVzQ29kZSIsImNvbXBsZXRlIiwiaW5mbyIsInNldFZhbHVlIiwic2hvdWxkVGhyb3ciLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFtRXNCQSxTLEdBQUFBLFM7UUFnQ0FDLG9CLEdBQUFBLG9COztBQW5HdEI7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWUMsTTs7QUFDWjs7SUFBWUMsSzs7Ozs7O0FBRVosZUFBZUMsa0JBQWYsQ0FBa0NDLElBQWxDLEVBQXdDO0FBQ3RDLE1BQUlBLEtBQUtDLFdBQVQsRUFBc0I7QUFDcEIsV0FBTyxNQUFNQyxpQkFBaUJGLEtBQUtDLFdBQXRCLENBQWI7QUFDRDtBQUNELFNBQU8sTUFBTUUsc0JBQXNCSCxJQUF0QixDQUFiO0FBQ0Q7O0FBRUQsU0FBU0UsZ0JBQVQsQ0FBMEJELFdBQTFCLEVB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REFBVixDQUFOO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBTyxNQUFNN0MsV0FBYjtBQUNEO0FBQ0YiLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW5xdWlyZXIgZnJvbSAnaW5xdWlyZXInO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBhdXRob3JpemVSZXF1ZXN0cywgZ2V0UmVmcmVzaFRva2VuIH0gZnJvbSAnLi4vY2xpZW50cy9hdXRoLXNlcnZpY2UnO1xyXG5pbXBvcnQgeyBnZXREZXZlbG9wZXIsIGNyZWF0ZURldmVsb3BlciB9IGZyb20gJy4uL2NsaWVudHMvZXh0ZW5zaW9uLW1hbmFnZXInO1xyXG5pbXBvcnQgbXNnIGZyb20gJy4uL3VzZXJfbWVzc2FnZXMnO1xyXG5pbXBvcnQgdXJscyBmcm9tICcuLi8uLi9jb25maWcvc2VydmljZXMnO1xyXG5pbXBvcnQgKiBhcyBsb2dnZXIgZnJvbSAnLi4vc2VydmljZXMvbG9nZ2VyJztcclxuaW1wb3J0ICogYXMgY2FjaGUgZnJvbSAnLi4vc2VydmljZXMvY2FjaGUtZW52JztcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHJlc29sdmVDcmVkZW50aWFscyhhcmdzKSB7XHJcbiAgaWYgKGFyZ3MuY3JlZGVudGlhbHMpIHtcclxuICAgIHJldHVybiBhd2FpdCBwYXJzZUNyZWRlbnRpYWxzKGFyZ3MuY3JlZGVudGlhbHMpXHJcbiAgfVxyXG4gIHJldHVybiBhd2FpdCBwcm9tcHRVc2VyQ3JlZGVudGlhbHMoYXJncyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlQ3JlZGVudGlhbHMoY3JlZGVudGlhbHMpIHtcclxuICBjb25zdCBwYXJ0cyA9IGNyZWRlbnRpYWxzLnNwbGl0KCc6Jyk7XHJcbiAgcmV0dXJuIHtcclxuICAgIGVtYWlsOiBfLmdldChwYXJ0cywgJ1swXScpLFxyXG4gICAgcGFzc3dvcmQ6IF8uZ2V0KHBhcnRzLCAnWzFdJyksXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvbXB0VXNlckNyZWRlbnRpYWxzKGFyZ3MgPSB7fSkge1xyXG4gIGlmICghYXJncy5lbWFpbCB8fCAhYXJncy5wYXNzd29yZCkge1xyXG4gICAgY29uc29sZS5sb2cobXNnLmxvZ2luLmNyZWRlbnRpYWxzUHJvbXB0KHVybHMuYXBwQnVpbGRlcikpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcXVlc3Rpb25zID0gW3tcclxuICAgIG5hbWU6ICdlbWFpbCcsXHJcbiAgICBtZXNzYWdlOiAnRW1haWwnLFxyXG4gICAgd2hlbjogKCkgPT4gIWFyZ3MuZW1haWwsXHJcbiAgfSwge1xyXG4gICAgbmFtZTogJ3Bhc3N3b3JkJyxcclxuICAgIG1lc3NhZ2U6ICdQYXNzd29yZCcsXHJcbiAgICB0eXBlOiAncGFzc3dvcmQnLFxyXG4gICAgd2hlbjogKCkgPT4gIWFyZ3MucGFzc3dvcmQsXHJcbiAgfV07XHJcblxyXG4gIHJldHVybiBpbnF1aXJlci5wcm9tcHQocXVlc3Rpb25zKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJvbXB0RGV2ZWxvcGVyTmFtZSgpIHtcclxuICAvKiBlc2xpbnQgbm8tY29uZnVzaW5nLWFycm93OiAwICovXHJcbiAgY29uc29sZS5sb2coJ0VudGVyIGRldmVsb3BlciBuYW1lLicpO1xyXG4gIHJldHVybiBpbnF1aXJlci5wcm9tcHQoe1xyXG4gICAgbmFtZTogJ2Rldk5hbWUnLFxyXG4gICAgbWVzc2FnZTogJ0RldmVsb3BlciBuYW1lJyxcclxuICAgIHZhbGlkYXRlOiB2YWx1ZSA9PiB2YWx1ZSA/IHRydWUgOiAnRGV2ZWxvcGVyIG5hbWUgY2Fubm90IGJlIGJsYW5rLicsXHJcbiAgfSkudGhlbihhbnN3ZXIgPT4gYW5zd2VyLmRldk5hbWUpO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2tzIGNhY2hlIHRvIHNlZSBpZiB1c2VyIGlzIGFscmVhZHkgbG9nZ2VkIGluIHdpdGggYSBnaXZlbiBlbWFpbFxyXG4gKi9cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHVzZXJBbHJlYWR5TG9nZ2VkSW4oZW1haWwpIHtcclxuICBjb25zdCBkZXZlbG9wZXIgPSBhd2FpdCBjYWNoZS5nZXRWYWx1ZSgnZGV2ZWxvcGVyJyk7XHJcblxyXG4gIHJldHVybiAoZGV2ZWxvcGVyICYmIGRldmVsb3Blci5lbWFpbCA9PT0gZW1haWwpO1xyXG59XHJcblxyXG4vKipcclxuICogQXNrcyB1c2VyIHRvIGVudGVyIGNyZWRlbnRpYWxzLCB2ZXJpZmllcyB0aG9zZSBjcmVkZW50aWFscyB3aXRoIGF1dGhlbnRpY2F0aW9uXHJcbiAqIHNlcnZpY2UsIGFuZCBzYXZlcyB0aGUgcmVjZWl2ZWQgQVBJIHRva2VuIGxvY2FsbHkgZm9yIGZ1cnRoZXIgcmVxdWVzdHMuXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW5Vc2VyKGFyZ3MpIHtcclxuICBjb25zdCBjcmVkZW50aWFscyA9IGF3YWl0IHJlc29sdmVDcmVkZW50aWFscyhhcmdzKTtcclxuXHJcbiAgaWYgKGF3YWl0IHVzZXJBbHJlYWR5TG9nZ2VkSW4oY3JlZGVudGlhbHMuZW1haWwpKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkFscmVhZHkgbG9nZ2VkIGluIHdpdGggZ2l2ZW4gZW1haWwuXCIpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcmVmcmVzaFRva2VuID0gYXdhaXQgZ2V0UmVmcmVzaFRva2VuKGNyZWRlbnRpYWxzKTtcclxuICBhd2FpdCBhdXRob3JpemVSZXF1ZXN0cyhyZWZyZXNoVG9rZW4pO1xyXG5cclxuICBsZXQgZGV2ZWxvcGVyID0gbnVsbDtcclxuICB0cnkge1xyXG4gICAgZGV2ZWxvcGVyID0gYXdhaXQgZ2V0RGV2ZWxvcGVyKCk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBpZiAoZXJyLnN0YXR1c0NvZGUgPT09IDQwNCkge1xyXG4gICAgICBkZXZlbG9wZXIgPSBhd2FpdCBjcmVhdGVEZXZlbG9wZXIoYXdhaXQgcHJvbXB0RGV2ZWxvcGVyTmFtZSgpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKG1zZy5sb2dpbi5jb21wbGV0ZShkZXZlbG9wZXIpKTtcclxuICBsb2dnZXIuaW5mbygnbG9nZ2VkIGluIGFzIGRldmVsb3BlcicsIGRldmVsb3Blcik7XHJcblxyXG4gIHJldHVybiBjYWNoZS5zZXRWYWx1ZSgnZGV2ZWxvcGVyJywgeyAuLi5kZXZlbG9wZXIsIGVtYWlsOiBjcmVkZW50aWFscy5lbWFpbCB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFza3MgdXNlciBmb3IgZW1haWwgYW5kIHBhc3N3b3JkIGlmIHJlZnJlc2hUb2tlbiBpcyBub3QgYWxyZWFkeSBjYWNoZWRcclxuICogQHBhcmFtIHNob3VsZFRocm93IFNob3VsZCBhbiBlcnJvciBiZSB0aHJvd24gaWYgdXNlciBpcyBub3QgbG9nZ2VkIGluIG9yIHNob3VsZCB1c2VyIGJlIGFza2VkIGZvciBjcmVkZW50aWFsc1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuc3VyZVVzZXJJc0xvZ2dlZEluKHNob3VsZFRocm93ID0gZmFsc2UpIHtcclxuICBjb25zdCBkZXZlbG9wZXIgPSBhd2FpdCBjYWNoZS5nZXRWYWx1ZSgnZGV2ZWxvcGVyJyk7XHJcbiAgaWYgKGRldmVsb3Blcikge1xyXG4gICAgcmV0dXJuIGRldmVsb3BlcjtcclxuICB9XHJcblxyXG4gIGlmIChzaG91bGRUaHJvdykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgbG9nZ2VkIGluLCB1c2UgYHNob3V0ZW0gbG9naW5gIGNvbW1hbmQgdG8gbG9naW4nKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGF3YWl0IGxvZ2luVXNlcigpO1xyXG4gIH1cclxufVxyXG4iXX0=