'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listenStream = listenStream;
function listenStream(stream, handler, size) {
  let total = 0;

  stream.on('data', ({ length }) => {
    total += length;
    handler({
      total,
      length,
      percent: size ? (total / size * 100).toFixed(2) : null
    });
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9zdHJlYW0tbGlzdGVuZXIuanMiXSwibmFtZXMiOlsibGlzdGVuU3RyZWFtIiwic3RyZWFtIiwiaGFuZGxlciIsInNpemUiLCJ0b3RhbCIsIm9uIiwibGVuZ3RoIiwicGVyY2VudCIsInRvRml4ZWQiXSwibWFwcGluZ3MiOiI7Ozs7O1FBQWdCQSxZLEdBQUFBLFk7QUFBVCxTQUFTQSxZQUFULENBQXNCQyxNQUF0QixFQUE4QkMsT0FBOUIsRUFBdUNDLElBQXZDLEVBQTZDO0FBQ2xELE1BQUlDLFFBQVEsQ0FBWjs7QUFFQUgsU0FBT0ksRUFBUCxDQUFVLE1BQVYsRUFBa0IsQ0FBQyxFQUFFQyxNQUFGLEVBQUQsS0FBZ0I7QUFDaENGLGFBQVNFLE1BQVQ7QUFDQUosWUFBUTtBQUNORSxXQURNO0FBRU5FLFlBRk07QUFHTkMsZUFBU0osT0FBTyxDQUFDQyxRQUFRRCxJQUFSLEdBQWUsR0FBaEIsRUFBcUJLLE9BQXJCLENBQTZCLENBQTdCLENBQVAsR0FBd0M7QUFIM0MsS0FBUjtBQUtELEdBUEQ7QUFRRCIsImZpbGUiOiJzdHJlYW0tbGlzdGVuZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gbGlzdGVuU3RyZWFtKHN0cmVhbSwgaGFuZGxlciwgc2l6ZSkge1xyXG4gIGxldCB0b3RhbCA9IDA7XHJcblxyXG4gIHN0cmVhbS5vbignZGF0YScsICh7IGxlbmd0aCB9KSA9PiB7XHJcbiAgICB0b3RhbCArPSBsZW5ndGg7XHJcbiAgICBoYW5kbGVyKHtcclxuICAgICAgdG90YWwsXHJcbiAgICAgIGxlbmd0aCxcclxuICAgICAgcGVyY2VudDogc2l6ZSA/ICh0b3RhbCAvIHNpemUgKiAxMDApLnRvRml4ZWQoMik6IG51bGxcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcbiJdfQ==