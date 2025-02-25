export type BranchTimeStamp = {
  name: string;
  lastCommit: string;
};

export type SelectOption = {
  name: string;
  spacing: string;
  lastCommit: string;
};

export const longestBranchName = (branches: BranchTimeStamp[]) => {
  return branches.reduce((prev, curr) =>
    prev.name.length > curr.name.length ? prev : curr
  ).name.length;
};

export const longestCommitLength = (branches: BranchTimeStamp[]) =>
  branches.reduce((prev, curr) =>
    prev.lastCommit.length > curr.lastCommit.length ? prev : curr
  ).lastCommit.length;
