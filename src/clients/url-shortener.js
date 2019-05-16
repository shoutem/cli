import request from 'request-promise';

export default function(url) {
  return request(`http://sh.outem.tk/generate/${url}`);
}
