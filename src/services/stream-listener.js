export function listenStream(stream, handler, size) {
  let total = 0;

  stream.on('data', ({ length }) => {
    total += length;
    handler({
      total,
      length,
      percent: size ? (total / size * 100).toFixed(2): null
    });
  });
}
