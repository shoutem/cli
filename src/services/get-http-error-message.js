export const httpErrorCodeMessages = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Long',
  429: 'Too Many Requests',
  444: 'No Response (Nginx)',
  499: 'Client Closed Request (Nginx)',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  522: 'Connection timed out',
  524: 'A timeout occurred',
  598: 'Network read timeout error',
  599: 'Network connect timeout error',
};

export function getHttpErrorMessage(errorCode) {
  const code = parseInt(errorCode, 10);
  const infoLink = `https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#${code}`;
  const message =
    httpErrorCodeMessages[code] ||
    `see ${infoLink} for more info about this error`;

  return `Error ${code} (${message})`;
}
