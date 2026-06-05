import type { GraphEdge } from '../../src/types';

// Regex patterns to detect internal imports
const JS_TS_IMPORT_REGEX = /(?:import|export)\s+?(?:(?:[\w*\s{},]*)\s+from\s+)?['"](\.\.?\/[^'"]+)['"]/g;
const JS_TS_REQUIRE_REGEX = /require\(['"](\.\.?\/[^'"]+)['"]\)/g;
const PYTHON_FROM_IMPORT_REGEX = /^\s*from\s+(\.\.?[\w.]+)\s+import/gm;
const GO_RELATIVE_IMPORT_REGEX = /import\s+['"](\.\.?\/[^'"]+)['"]/g;

/**
 * Normalize a path array containing relative segments like '.' and '..'
 */
function resolveRelativePath(baseDir: string, relativePath: string): string {
  const baseParts = baseDir ? baseDir.split('/') : [];
  const relParts = relativePath.split('/');
  const combined = [...baseParts, ...relParts];
  
  const result: string[] = [];
  for (const part of combined) {
    if (part === '.' || part === '') continue;
    if (part === '..') {
      result.pop();
    } else {
      result.push(part);
    }
  }
  return result.join('/');
}

/**
 * Extracts raw import paths from a file's content based on its extension
 */
export function extractRawImports(path: string, content: string): string[] {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  const imports: string[] = [];

  if (['ts', 'tsx', 'js', 'jsx'].includes(ext)) {
    let match;
    // Reset regex state
    JS_TS_IMPORT_REGEX.lastIndex = 0;
    while ((match = JS_TS_IMPORT_REGEX.exec(content)) !== null) {
      imports.push(match[1]);
    }
    JS_TS_REQUIRE_REGEX.lastIndex = 0;
    while ((match = JS_TS_REQUIRE_REGEX.exec(content)) !== null) {
      imports.push(match[1]);
    }
  } else if (ext === 'py') {
    let match;
    PYTHON_FROM_IMPORT_REGEX.lastIndex = 0;
    while ((match = PYTHON_FROM_IMPORT_REGEX.exec(content)) !== null) {
      // Python imports use dots, e.g. ..utils.helper -> convert to relative path
      const dots = match[1].match(/^\.+/)?.[0] ?? '';
      const pathPart = match[1].substring(dots.length).replace(/\./g, '/');
      const relPath = (dots === '.' ? './' : '../'.repeat(dots.length - 1)) + pathPart;
      imports.push(relPath);
    }
  } else if (ext === 'go') {
    let match;
    GO_RELATIVE_IMPORT_REGEX.lastIndex = 0;
    while ((match = GO_RELATIVE_IMPORT_REGEX.exec(content)) !== null) {
      imports.push(match[1]);
    }
  }

  return Array.from(new Set(imports));
}

/**
 * Resolves raw import paths to exact repository file paths
 */
export function resolveImports(
  importingFile: string,
  rawImports: string[],
  allFilePaths: Set<string>
): string[] {
  const parts = importingFile.split('/');
  parts.pop(); // Remove file name to get base directory
  const baseDir = parts.join('/');
  const resolved: string[] = [];

  for (const raw of rawImports) {
    const resolvedPath = resolveRelativePath(baseDir, raw);

    // Try resolving with common extensions
    const candidates = [
      resolvedPath,
      `${resolvedPath}.tsx`,
      `${resolvedPath}.ts`,
      `${resolvedPath}.jsx`,
      `${resolvedPath}.js`,
      `${resolvedPath}/index.tsx`,
      `${resolvedPath}/index.ts`,
      `${resolvedPath}/index.js`,
      `${resolvedPath}.py`,
      `${resolvedPath}.go`,
    ];

    let matched = false;
    for (const candidate of candidates) {
      if (allFilePaths.has(candidate)) {
        resolved.push(candidate);
        matched = true;
        break;
      }
    }

    // Fallback: prefix match if no exact match (e.g. static assets, styling)
    if (!matched) {
      for (const filePath of allFilePaths) {
        if (filePath.startsWith(resolvedPath + '.')) {
          resolved.push(filePath);
          break;
        }
      }
    }
  }

  return Array.from(new Set(resolved));
}

/**
 * Build imports edges between files in the repository
 */
export function buildImportEdges(
  fileContents: Record<string, string>,
  allFilePaths: string[]
): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const filePathsSet = new Set(allFilePaths);

  for (const [path, content] of Object.entries(fileContents)) {
    const raw = extractRawImports(path, content);
    const resolved = resolveImports(path, raw, filePathsSet);

    for (const target of resolved) {
      // Don't import self
      if (path === target) continue;
      
      edges.push({
        id: `e:file:${path}->file:${target}`,
        source: `file:${path}`,
        target: `file:${target}`,
        type: 'imports',
      });
    }
  }

  return edges;
}
