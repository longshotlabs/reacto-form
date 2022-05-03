import bracketsToDots from "./bracketsToDots";
export default function filterErrorsForNames(errors, names, exact) {
  if (!Array.isArray(errors) || !Array.isArray(names)) return []; // Accept paths that may contain brackets or dots, making them all dots

  names = names.map(name => bracketsToDots(name));
  return errors.filter(error => {
    var errorName = bracketsToDots(error.name);
    return names.some(name => {
      if (name === errorName) return true;
      return !exact && errorName.startsWith("".concat(name, "."));
    });
  });
}