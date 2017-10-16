import toPath from 'lodash.topath';

export default function bracketsToDots(pathString) {
  return toPath(pathString).join('.');
}
