import { fetchFileContents, fetchRepoInfo } from '../github/fetch-tree';

export async function getRepoFileContent(
  owner: string,
  repo: string,
  path: string,
  branch?: string,
): Promise<{ path: string; content: string; sha: string }> {
  const info = await fetchRepoInfo(owner, repo, branch);
  const contents = await fetchFileContents(owner, repo, [path], info.sha);
  const content = contents[path];
  if (content === undefined) {
    throw new Error('File not found or too large to display.');
  }
  return { path, content, sha: info.sha };
}
