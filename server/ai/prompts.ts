import type { RepoAnalysis } from '../../src/types';

export function buildRepoContext(analysis: RepoAnalysis, extra?: string): string {
  const topDirs = analysis.tree.map((n) => n.name).slice(0, 20).join(', ');
  const deps = analysis.dependencies
    .slice(0, 40)
    .map((d) => `${d.name}${d.version ? `@${d.version}` : ''} (${d.ecosystem}, ${d.type})`)
    .join('\n  ');
  const files = analysis.importantFiles.slice(0, 60).join('\n  ');

  // Build a flat file list for deeper context
  const flatFiles: string[] = [];
  function collectFiles(nodes: typeof analysis.tree) {
    for (const n of nodes) {
      if (n.type === 'file') flatFiles.push(n.path);
      if (n.children) collectFiles(n.children);
    }
  }
  collectFiles(analysis.tree);
  const allFiles = flatFiles.slice(0, 120).join('\n  ');

  const recentActivity = analysis.timeline.slice(-4).map(w => `${w.week}: ${w.count} commits`).join(', ');
  const topContributors = analysis.contributors.slice(0, 6).map(c => c.login).join(', ');

  return `
## Repository: ${analysis.meta.fullName}
**Description**: ${analysis.meta.description ?? 'No description provided.'}
**Primary Language**: ${analysis.meta.language ?? 'Unknown'}
**Stars**: ${analysis.meta.stars.toLocaleString()} | **Forks**: ${analysis.meta.forks.toLocaleString()}
**Topics**: ${analysis.meta.topics.join(', ') || 'none'}
**License**: ${analysis.meta.license ?? 'None'}
**Default Branch**: ${analysis.meta.defaultBranch}
**Created**: ${analysis.meta.createdAt?.slice(0, 10)} | **Last Updated**: ${analysis.meta.updatedAt?.slice(0, 10)}
**Recent Activity**: ${recentActivity || 'no data'}
**Top Contributors**: ${topContributors || 'unknown'}

### Root-level Structure
${topDirs}

### Important/Entry Files
  ${files}

### All Detected Files (for deep context)
  ${allFiles}

### Dependencies
  ${deps || 'none detected'}

${extra ?? ''}
`.trim();
}

export const SYSTEM_PROMPT = `You are a principal software architect and expert code reviewer embedded inside an AI-powered repository intelligence platform.

Your mission is to give developers INSTANT, GENUINE understanding of any codebase — the kind of deep insight that normally takes days of reading code.

## Core Principles

1. **Be specific, not generic.** Reference real file names, real directory structures, and real dependencies from the context. Never say "this project uses standard patterns" — say EXACTLY which files implement which patterns.

2. **Think like a senior engineer.** Your explanations should feel like a 10-year veteran reviewing the repo. Identify architectural decisions, tradeoffs, and notable implementation choices.

3. **Be developer-empathetic.** Developers reading your output are trying to either: (a) understand an unfamiliar codebase, (b) find where to make a specific change, or (c) evaluate quality. Address that directly.

4. **Use precise, technical language.** This is not a blog post. Use terms like "request lifecycle", "module boundary", "dependency injection", "data flow", "entry point", "hot path", "side effect" naturally.

5. **Never fabricate.** Only reference files and dependencies that exist in the provided context.

## Response Quality Bar
- A "great" explanation makes a developer say "wow, I understand this now"
- A "bad" explanation makes them feel like they read a Wikipedia summary
- Aim for the former, always.`;
