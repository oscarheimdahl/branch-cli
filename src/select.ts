import { Ask } from "@sallai/ask";
import color, { green, gray, white, italic } from "@sallai/iro";

const removePreviousLine = "\x1b[1A\x1b[K";
const ask = new Ask({ prefix: "" });

type BranchTimeStamp = {
  name: string;
  lastCheckedOut: string;
};

export const selectBranch = async (branches: BranchTimeStamp[]) => {
  const longestNameLength = Math.max(longestBranchName(branches), 10);

  const activePrefix = color("git checkout ", green);
  const inactivePrefix = " ".repeat("git checkout ".length);

  const branchTitle = color("Branch", white);
  const titleSpacing = " ".repeat(longestNameLength - "Branch".length);
  const lastVisitedTitle = color("Last visited", white);
  const title = `${inactivePrefix}${branchTitle}${titleSpacing}${lastVisitedTitle}`;

  const rowMap = new Map<string, string>();
  const buildRow = (name: string, lastCheckedOut: string) => {
    const spacing = " ".repeat(longestNameLength - name.length);
    rowMap.set(name, spacing + lastCheckedOut);
    return name;
  };

  const choices = branches.map((branch) => ({
    message: buildRow(branch.name, branch.lastCheckedOut),
    value: branch.name,
  }));

  try {
    const res = await ask.select({
      name: "selection",
      message: title,
      choices: [{ message: "", disabled: true }, ...choices],
      disabledFormatter: () => "-",
      activeFormatter: (branchName: string) => {
        return (
          activePrefix +
          color(branchName, green) +
          color(rowMap.get(branchName)!, white)
        );
      },
      inactiveFormatter: (branchName: string) => {
        return (
          inactivePrefix +
          color(branchName, gray) +
          color(rowMap.get(branchName)!, gray)
        );
      },
    } as const);

    console.log(removePreviousLine.repeat(4));
    Deno.exit(0);
  } catch {
    Deno.exit(0);
  }
};

const longestBranchName = (branches: BranchTimeStamp[]) => {
  return branches.reduce((prev, curr) =>
    prev.name.length > curr.name.length ? prev : curr
  ).name.length;
};
