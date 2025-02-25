# Switch Branch

CLI tool to preview and switch to recent git branches.

![demo gif](demo.gif)

## Installation Mac

- Go to [releases](https://github.com/oscarheimdahl/switch-branch/releases) and download the latest version.
- Make the binary executable: `chmod +x switch-branch`
- Include it in your path, one way: `mv switch-branch /usr/local/bin`
- Done! ✅

## How it works

It simply runs the following commands for you:

```
git for-each-ref --sort=-committerdate
git checkout {selectedBranch}
```

## Flags

You can change color of the header (because of course you can...)

`-b` or `--bg` or `--background` followed by [0-255](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797)

For example:

```
switch-branch -c 120
```

Will use a fresh minty green for your selected branch. 👌
