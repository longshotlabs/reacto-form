import toPath from 'lodash/toPath'

/**
 * Convert bracket path notation to dot path notation
 */
export default function bracketsToDots (pathString: string): string {
  return toPath(pathString).join('.')
}
