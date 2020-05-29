'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProgressHandler = createProgressHandler;

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

var _spinner = require('./spinner');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createProgressBar(msg, { total }) {
  return new _progress2.default(`   ${msg} [:bar] :percent (remaining :etas)`, {
    total,
    clear: true,
    width: 20,
    renderThrottle: 50
  });
}

function createProgressHandler({ msg, total, onFinished = () => {} }) {
  let bar = null;

  if (total) {
    bar = createProgressBar(msg, { total });
  }

  return state => {
    // finished!
    if (!state) {
      if (bar) {
        bar.terminate();
        bar = null;
      }
      onFinished();
      return;
    }
    let { length, total } = state;
    total = total || 0;

    // total length not known until now
    if (bar === null) {
      if (total > 0) {
        bar = createProgressBar(msg, { total });
      } else {
        bar = (0, _spinner.startSpinner)(msg);
        bar.tick = () => {};
        bar.terminate = () => {
          bar.stop();
        };
      }
    }

    bar.tick(length);
    if (bar.complete) {
      onFinished();
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9wcm9ncmVzcy1iYXIuanMiXSwibmFtZXMiOlsiY3JlYXRlUHJvZ3Jlc3NIYW5kbGVyIiwiY3JlYXRlUHJvZ3Jlc3NCYXIiLCJtc2ciLCJ0b3RhbCIsIlByb2dyZXNzQmFyIiwiY2xlYXIiLCJ3aWR0aCIsInJlbmRlclRocm90dGxlIiwib25GaW5pc2hlZCIsImJhciIsInN0YXRlIiwidGVybWluYXRlIiwibGVuZ3RoIiwidGljayIsInN0b3AiLCJjb21wbGV0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFlZ0JBLHFCLEdBQUFBLHFCOztBQWZoQjs7OztBQUNBOzs7O0FBRUEsU0FBU0MsaUJBQVQsQ0FBMkJDLEdBQTNCLEVBQWdDLEVBQUVDLEtBQUYsRUFBaEMsRUFBMkM7QUFDekMsU0FBTyxJQUFJQyxrQkFBSixDQUNKLE1BQUtGLEdBQUksb0NBREwsRUFFTDtBQUNFQyxTQURGO0FBRUVFLFdBQU8sSUFGVDtBQUdFQyxXQUFPLEVBSFQ7QUFJRUMsb0JBQWdCO0FBSmxCLEdBRkssQ0FBUDtBQVNEOztBQUVNLFNBQVNQLHFCQUFULENBQStCLEVBQUVFLEdBQUYsRUFBT0MsS0FBUCxFQUFjSyxhQUFhLE1BQU0sQ0FBRSxDQUFuQyxFQUEvQixFQUFzRTtBQUMzRSxNQUFJQyxNQUFNLElBQVY7O0FBRUEsTUFBSU4sS0FBSixFQUFXO0FBQ1RNLFVBQU1SLGtCQUFrQkMsR0FBbEIsRUFBdUIsRUFBRUMsS0FBRixFQUF2QixDQUFOO0FBQ0Q7O0FBRUQsU0FBT08sU0FBUztBQUNkO0FBQ0EsUUFBSSxDQUFDQSxLQUFMLEVBQVk7QUFDVixVQUFJRCxHQUFKLEVBQVM7QUFDUEEsWUFBSUUsU0FBSjtBQUNBRixjQUFNLElBQU47QUFDRDtBQUNERDtBQUNBO0FBQ0Q7QUFDRCxRQUFJLEVBQUVJLE1BQUYsRUFBVVQsS0FBVixLQUFvQk8sS0FBeEI7QUFDQVAsWUFBUUEsU0FBUyxDQUFqQjs7QUFFQTtBQUNBLFFBQUlNLFFBQVEsSUFBWixFQUFrQjtBQUNoQixVQUFJTixRQUFRLENBQVosRUFBZTtBQUNiTSxjQUFNUixrQkFBa0JDLEdBQWxCLEVBQXVCLEVBQUNDLEtBQUQsRUFBdkIsQ0FBTjtBQUNELE9BRkQsTUFFTztBQUNMTSxjQUFNLDJCQUFhUCxHQUFiLENBQU47QUFDQU8sWUFBSUksSUFBSixHQUFXLE1BQU0sQ0FBRSxDQUFuQjtBQUNBSixZQUFJRSxTQUFKLEdBQWdCLE1BQU07QUFBRUYsY0FBSUssSUFBSjtBQUFZLFNBQXBDO0FBQ0Q7QUFDRjs7QUFFREwsUUFBSUksSUFBSixDQUFTRCxNQUFUO0FBQ0EsUUFBSUgsSUFBSU0sUUFBUixFQUFrQjtBQUNoQlA7QUFDRDtBQUNGLEdBNUJEO0FBNkJEIiwiZmlsZSI6InByb2dyZXNzLWJhci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9ncmVzc0JhciBmcm9tICdwcm9ncmVzcyc7XHJcbmltcG9ydCB7IHN0YXJ0U3Bpbm5lciB9IGZyb20gJy4vc3Bpbm5lcic7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVQcm9ncmVzc0Jhcihtc2csIHsgdG90YWwgfSkge1xyXG4gIHJldHVybiBuZXcgUHJvZ3Jlc3NCYXIoXHJcbiAgICBgICAgJHttc2d9IFs6YmFyXSA6cGVyY2VudCAocmVtYWluaW5nIDpldGFzKWAsXHJcbiAgICB7XHJcbiAgICAgIHRvdGFsLFxyXG4gICAgICBjbGVhcjogdHJ1ZSxcclxuICAgICAgd2lkdGg6IDIwLFxyXG4gICAgICByZW5kZXJUaHJvdHRsZTogNTBcclxuICAgIH1cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJvZ3Jlc3NIYW5kbGVyKHsgbXNnLCB0b3RhbCwgb25GaW5pc2hlZCA9ICgpID0+IHt9IH0pIHtcclxuICBsZXQgYmFyID0gbnVsbDtcclxuXHJcbiAgaWYgKHRvdGFsKSB7XHJcbiAgICBiYXIgPSBjcmVhdGVQcm9ncmVzc0Jhcihtc2csIHsgdG90YWwgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc3RhdGUgPT4ge1xyXG4gICAgLy8gZmluaXNoZWQhXHJcbiAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgIGlmIChiYXIpIHtcclxuICAgICAgICBiYXIudGVybWluYXRlKCk7XHJcbiAgICAgICAgYmFyID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgICBvbkZpbmlzaGVkKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCB7IGxlbmd0aCwgdG90YWwgfSA9IHN0YXRlO1xyXG4gICAgdG90YWwgPSB0b3RhbCB8fCAwO1xyXG5cclxuICAgIC8vIHRvdGFsIGxlbmd0aCBub3Qga25vd24gdW50aWwgbm93XHJcbiAgICBpZiAoYmFyID09PSBudWxsKSB7XHJcbiAgICAgIGlmICh0b3RhbCA+IDApIHtcclxuICAgICAgICBiYXIgPSBjcmVhdGVQcm9ncmVzc0Jhcihtc2csIHt0b3RhbH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJhciA9IHN0YXJ0U3Bpbm5lcihtc2cpO1xyXG4gICAgICAgIGJhci50aWNrID0gKCkgPT4ge307XHJcbiAgICAgICAgYmFyLnRlcm1pbmF0ZSA9ICgpID0+IHsgYmFyLnN0b3AoKSB9O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYmFyLnRpY2sobGVuZ3RoKTtcclxuICAgIGlmIChiYXIuY29tcGxldGUpIHtcclxuICAgICAgb25GaW5pc2hlZCgpO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuIl19