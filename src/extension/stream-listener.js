export function listenStream(stream, handler, size) {
  let total = 0;

  handler({
    total,
    percent: 0
  });

  stream.on('data', ({ length }) => {
    total += length;
    handler({
      total,
      increment: length,
      percent: size ? (total / size * 100).toFixed(2): null
    });
  });
}
