import request from 'request-promise';

export default async function (url) {
  return request(`http://sh.outem.tk/generate/${url}`);
}
