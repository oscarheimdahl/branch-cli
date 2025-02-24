# Switch Branch

CLI tool to preview and select recent git branches.

![demo gif](demo.gif)

## Installation Mac

- Go to [releases](https://github.com/oscarheimdahl/switch-branch/releases) and download the latest version.
- Make the binary executable: `chmod +x switch-branch`
- Move the binary to your path: `mv switch-branch /usr/local/bin`
- Done! ✅

## How it works

It simply runs the following commands for you:

```
git for-each-ref --sort=-committerdate
git checkout {selectedBranch}
```
