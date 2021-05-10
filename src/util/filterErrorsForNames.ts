import { ValidationError } from '../types'
import bracketsToDots from './bracketsToDots'

/**
 * Filter the given errors array and return a copy where only errors for the
 * given field name are present.
 * @param errors Array of error objects
 * @param names Array of field names to look for
 * @param exact If false, fields under this field will also be included. Default is false.
 * @returns Filtered errors array
 */
export default function filterErrorsForNames (errors: ValidationError[], names: string[], exact?: boolean): ValidationError[] {
  if (!Array.isArray(errors) || !Array.isArray(names)) return []

  // Accept paths that may contain brackets or dots, making them all dots
  names = names.map((name) => bracketsToDots(name))

  return errors.filter((error) => {
    const errorName = bracketsToDots(error.name)
    return names.some((name) => {
      if (name === errorName) return true
      return exact !== true && errorName.startsWith(`${name}.`)
    })
  })
}
