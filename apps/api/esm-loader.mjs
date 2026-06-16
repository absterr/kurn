import { resolve as tsNodeResolve, load, transformSource } from "ts-node/esm";
import * as tsConfigPaths from "tsconfig-paths";
import { pathToFileURL } from "node:url";
import path from "node:path";

const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig();

function aliasToPath(specifier) {
  for (const [pattern, targets] of Object.entries(paths)) {
    if (pattern.endsWith("/*") && specifier.startsWith(pattern.slice(0, -1))) {
      const rest = specifier.slice(pattern.length - 1);
      return path.join(absoluteBaseUrl, targets[0].slice(0, -1) + rest);
    }
    if (pattern === specifier) {
      return path.join(absoluteBaseUrl, targets[0]);
    }
  }
  return null;
}

export function resolve(specifier, context, nextResolve) {
  const aliased = aliasToPath(specifier);
  if (aliased) {
    return tsNodeResolve(pathToFileURL(aliased).href, context, nextResolve);
  }
  return tsNodeResolve(specifier, context, nextResolve);
}

export { load, transformSource };
