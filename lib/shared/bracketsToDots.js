import toPath from 'lodash/toPath';

export default function bracketsToDots(pathString) {
  return toPath(pathString).join('.');
}
