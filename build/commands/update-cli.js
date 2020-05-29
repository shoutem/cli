'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _npmjs = require('../services/npmjs');

var _services = require('../../config/services');

var _services2 = _interopRequireDefault(_services);

var _user_messages = require('../user_messages');

var _user_messages2 = _interopRequireDefault(_user_messages);

var _childProcessPromise = require('child-process-promise');

var _package = require('../../package.json');

var _confirmer = require('../services/confirmer');

var _confirmer2 = _interopRequireDefault(_confirmer);

var _cache = require('../services/cache');

var cache = _interopRequireWildcard(_cache);

var _spinner = require('../services/spinner');

require('colors');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function confirmUpdate() {
  if ((await cache.getValue('updateConfirmed')) === false) {
    return false;
  }

  const updateConfirmed = await (0, _confirmer2.default)(_user_messages2.default.version.updateRequired());
  await cache.setValue('updateConfirmed', false, 24 * 3600);

  return updateConfirmed;
}

exports.default = async function () {
  if (await (0, _spinner.spinify)((0, _npmjs.isLatest)(_services2.default.cliAppUri, _package.version), 'Checking for CLI update...')) {
    return false;
  }

  const updateConfirmed = await confirmUpdate();

  if (!updateConfirmed) {
    console.log('Warning: This is an outdated version of shoutem CLI'.bold.yellow);
    console.log('Install the new one with: `npm install -g @shoutem/cli`. You might need to run it with `sudo` prefix.'.yellow);
    return false;
  }

  try {
    await (0, _childProcessPromise.spawn)('npm', ['install', '-g', '@shoutem/cli'], { stdio: 'inherit' });
  } catch (err) {
    if (process.platform !== 'win32') {
      console.log('Current user does not have permissions to update shoutem CLI. Using sudo...');
      await (0, _childProcessPromise.spawn)('sudo', ['npm', 'install', '-g', '@shoutem/cli'], { stdio: 'inherit' });
    } else {
      throw err;
    }
  }

  console.log('Update complete');
  await (0, _childProcessPromise.spawn)('shoutem', process.argv.filter((_, index) => index > 1), { stdio: 'inherit' });

  return true;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy91cGRhdGUtY2xpLmpzIl0sIm5hbWVzIjpbImNhY2hlIiwiY29uZmlybVVwZGF0ZSIsImdldFZhbHVlIiwidXBkYXRlQ29uZmlybWVkIiwibXNnIiwidmVyc2lvbiIsInVwZGF0ZVJlcXVpcmVkIiwic2V0VmFsdWUiLCJhcGlVcmxzIiwiY2xpQXBwVXJpIiwiY29uc29sZSIsImxvZyIsImJvbGQiLCJ5ZWxsb3ciLCJzdGRpbyIsImVyciIsInByb2Nlc3MiLCJwbGF0Zm9ybSIsImFyZ3YiLCJmaWx0ZXIiLCJfIiwiaW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOztJQUFZQSxLOztBQUNaOztBQUNBOzs7Ozs7QUFFQSxlQUFlQyxhQUFmLEdBQStCO0FBQzdCLE1BQUksT0FBTUQsTUFBTUUsUUFBTixDQUFlLGlCQUFmLENBQU4sTUFBNEMsS0FBaEQsRUFBdUQ7QUFDckQsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsUUFBTUMsa0JBQWtCLE1BQU0seUJBQVFDLHdCQUFJQyxPQUFKLENBQVlDLGNBQVosRUFBUixDQUE5QjtBQUNBLFFBQU1OLE1BQU1PLFFBQU4sQ0FBZSxpQkFBZixFQUFrQyxLQUFsQyxFQUF5QyxLQUFLLElBQTlDLENBQU47O0FBRUEsU0FBT0osZUFBUDtBQUNEOztrQkFFYyxrQkFBa0I7QUFDL0IsTUFBSSxNQUFNLHNCQUFRLHFCQUFTSyxtQkFBUUMsU0FBakIsRUFBNEJKLGdCQUE1QixDQUFSLEVBQThDLDRCQUE5QyxDQUFWLEVBQXVGO0FBQ3JGLFdBQU8sS0FBUDtBQUNEOztBQUVELFFBQU1GLGtCQUFrQixNQUFNRixlQUE5Qjs7QUFFQSxNQUFJLENBQUNFLGVBQUwsRUFBc0I7QUFDcEJPLFlBQVFDLEdBQVIsQ0FBWSxzREFBc0RDLElBQXRELENBQTJEQyxNQUF2RTtBQUNBSCxZQUFRQyxHQUFSLENBQVksd0dBQXdHRSxNQUFwSDtBQUNBLFdBQU8sS0FBUDtBQUNEOztBQUVELE1BQUk7QUFDRixVQUFNLGdDQUFNLEtBQU4sRUFBYSxDQUFDLFNBQUQsRUFBWSxJQUFaLEVBQWtCLGNBQWxCLENBQWIsRUFBZ0QsRUFBRUMsT0FBTyxTQUFULEVBQWhELENBQU47QUFDRCxHQUZELENBRUUsT0FBT0MsR0FBUCxFQUFZO0FBQ1osUUFBSUMsUUFBUUMsUUFBUixLQUFxQixPQUF6QixFQUFrQztBQUNoQ1AsY0FBUUMsR0FBUixDQUFZLDZFQUFaO0FBQ0EsWUFBTSxnQ0FBTSxNQUFOLEVBQWMsQ0FBQyxLQUFELEVBQVEsU0FBUixFQUFtQixJQUFuQixFQUF5QixjQUF6QixDQUFkLEVBQXdELEVBQUVHLE9BQU8sU0FBVCxFQUF4RCxDQUFOO0FBQ0QsS0FIRCxNQUdPO0FBQ0wsWUFBTUMsR0FBTjtBQUNEO0FBQ0Y7O0FBRURMLFVBQVFDLEdBQVIsQ0FBWSxpQkFBWjtBQUNBLFFBQU0sZ0NBQU0sU0FBTixFQUFpQkssUUFBUUUsSUFBUixDQUFhQyxNQUFiLENBQW9CLENBQUNDLENBQUQsRUFBSUMsS0FBSixLQUFjQSxRQUFRLENBQTFDLENBQWpCLEVBQStELEVBQUVQLE9BQU8sU0FBVCxFQUEvRCxDQUFOOztBQUVBLFNBQU8sSUFBUDtBQUNELEMiLCJmaWxlIjoidXBkYXRlLWNsaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzTGF0ZXN0IH0gZnJvbSAnLi4vc2VydmljZXMvbnBtanMnO1xyXG5pbXBvcnQgYXBpVXJscyBmcm9tICcuLi8uLi9jb25maWcvc2VydmljZXMnO1xyXG5pbXBvcnQgbXNnIGZyb20gJy4uL3VzZXJfbWVzc2FnZXMnO1xyXG5pbXBvcnQgeyBzcGF3biB9IGZyb20gJ2NoaWxkLXByb2Nlc3MtcHJvbWlzZSc7XHJcbmltcG9ydCB7IHZlcnNpb24gfSBmcm9tICcuLi8uLi9wYWNrYWdlLmpzb24nO1xyXG5pbXBvcnQgY29uZmlybSBmcm9tICcuLi9zZXJ2aWNlcy9jb25maXJtZXInO1xyXG5pbXBvcnQgKiBhcyBjYWNoZSBmcm9tICcuLi9zZXJ2aWNlcy9jYWNoZSc7XHJcbmltcG9ydCB7IHNwaW5pZnkgfSBmcm9tICcuLi9zZXJ2aWNlcy9zcGlubmVyJztcclxuaW1wb3J0ICdjb2xvcnMnO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gY29uZmlybVVwZGF0ZSgpIHtcclxuICBpZiAoYXdhaXQgY2FjaGUuZ2V0VmFsdWUoJ3VwZGF0ZUNvbmZpcm1lZCcpID09PSBmYWxzZSkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgdXBkYXRlQ29uZmlybWVkID0gYXdhaXQgY29uZmlybShtc2cudmVyc2lvbi51cGRhdGVSZXF1aXJlZCgpKTtcclxuICBhd2FpdCBjYWNoZS5zZXRWYWx1ZSgndXBkYXRlQ29uZmlybWVkJywgZmFsc2UsIDI0ICogMzYwMCk7XHJcblxyXG4gIHJldHVybiB1cGRhdGVDb25maXJtZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBpZiAoYXdhaXQgc3BpbmlmeShpc0xhdGVzdChhcGlVcmxzLmNsaUFwcFVyaSwgdmVyc2lvbiksICdDaGVja2luZyBmb3IgQ0xJIHVwZGF0ZS4uLicpKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBjb25zdCB1cGRhdGVDb25maXJtZWQgPSBhd2FpdCBjb25maXJtVXBkYXRlKCk7XHJcblxyXG4gIGlmICghdXBkYXRlQ29uZmlybWVkKSB7XHJcbiAgICBjb25zb2xlLmxvZygnV2FybmluZzogVGhpcyBpcyBhbiBvdXRkYXRlZCB2ZXJzaW9uIG9mIHNob3V0ZW0gQ0xJJy5ib2xkLnllbGxvdyk7XHJcbiAgICBjb25zb2xlLmxvZygnSW5zdGFsbCB0aGUgbmV3IG9uZSB3aXRoOiBgbnBtIGluc3RhbGwgLWcgQHNob3V0ZW0vY2xpYC4gWW91IG1pZ2h0IG5lZWQgdG8gcnVuIGl0IHdpdGggYHN1ZG9gIHByZWZpeC4nLnllbGxvdyk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICB0cnkge1xyXG4gICAgYXdhaXQgc3Bhd24oJ25wbScsIFsnaW5zdGFsbCcsICctZycsICdAc2hvdXRlbS9jbGknXSwgeyBzdGRpbzogJ2luaGVyaXQnIH0pO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICd3aW4zMicpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0N1cnJlbnQgdXNlciBkb2VzIG5vdCBoYXZlIHBlcm1pc3Npb25zIHRvIHVwZGF0ZSBzaG91dGVtIENMSS4gVXNpbmcgc3Vkby4uLicpO1xyXG4gICAgICBhd2FpdCBzcGF3bignc3VkbycsIFsnbnBtJywgJ2luc3RhbGwnLCAnLWcnLCAnQHNob3V0ZW0vY2xpJ10sIHsgc3RkaW86ICdpbmhlcml0JyB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnNvbGUubG9nKCdVcGRhdGUgY29tcGxldGUnKTtcclxuICBhd2FpdCBzcGF3bignc2hvdXRlbScsIHByb2Nlc3MuYXJndi5maWx0ZXIoKF8sIGluZGV4KSA9PiBpbmRleCA+IDEpLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcbiJdfQ==