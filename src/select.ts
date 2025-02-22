import select from "@inquirer/select";

type BranchTimeStamp = {
  name: string;
  lastCheckedOut: string;
};

export const selectBranch = async (branches: BranchTimeStamp[]) => {
  const longestNameLength = longestBranchName(branches);

  console.log(longestNameLength);

  return await select({
    message: "Select branch to checkout\n  Branch        Last visited",
    theme: {
      helpMode: "never",
      icon: {
        cursor: "→",
      },
      style: {
        highlight: (str: string) => str,
        answer: (str: string) => "123" + str,
        key: (str: string) => "123" + str,
      },
      prefix: "",
    },
    loop: false,
    pageSize: 25,
    choices: branches.map((branch) => ({
      name: `${branch.name} - ${branch.lastCheckedOut}`,
      value: branch.name,
    })),
  });
};

const longestBranchName = (branches: BranchTimeStamp[]) => {
  return branches.reduce((prev, curr) => (prev > curr ? prev : curr)).name
    .length;
};
