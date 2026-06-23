# pi-guard-rails-on-bash-commands

A [pi](https://github.com/mariozechner/pi-coding-agent) extension that prompts for confirmation before executing **any** bash command, with an allowlist of safe read-only commands that pass through automatically.

## Installation

```bash
pi install pi-guard-rails-on-bash-commands
```

If you want to customise the allowlist, clone the repo and use it as a [local extension](https://github.com/mariozechner/pi-coding-agent) instead.

## How it works

When pi invokes a bash tool:

1. The command is checked against the allowlist in `allowlist.ts`.
2. Matching commands **pass through** immediately — no prompt.
3. In TUI mode, everything else shows a **confirmation dialog**.
4. In headless mode (no TUI), everything else is **blocked outright** with no user prompt.

```
┌─ Allowlist match? ──→ allowed (no prompt)
│
├─ TUI + no match ──→ "Allow bash command?" confirm dialog
│
└─ Headless + no match ──→ blocked
```

### Headless safety

If pi is running in a terminal only (no interactive UI), any unrecognised command is blocked with the message:

> Bash commands are not allowed in headless mode

This prevents a model from accidentally running destructive commands when no one is watching.

### `find` special handling

The `find` command is allowlisted only when it does **not** include `-delete`, `-exec`, or `-ok` flags. A `find` with these flags will trigger the confirmation prompt.

```
find . -name "*.ts"          → allowed (read-only)
find . -name "*.ts" -delete  → prompts for confirmation
```

## Allowlist

Safe, read-only commands are pre-approved. The built-in categories and examples:

| Category | Examples |
|----------|----------|
| **Filesystem read** | `ls`, `cat`, `head`, `tail`, `less`, `file`, `stat`, `du`, `df`, `wc`, `which`, `realpath`, `readlink`, `locate` |
| **Find (read-only)** | `find` (blocked if `-delete`/`-exec`/`-ok` are present) |
| **Git read-only** | `status`, `log`, `show`, `diff`, `ls-files`, `blame`, `rev-parse`, `describe`, `cat-file`, `grep`, `shortlog`, `merge-base`, `cherry`, `verify-commit`, `ls-remote`, `archive` |
| **Process info** | `ps`, `pgrep`, `pidof`, `top`, `htop`, `uptime` |
| **Network info** | `ping`, `dig`, `nslookup`, `host`, `ss`, `netstat`, `ip addr/link/route`, `nmcli`, `whois` |
| **System info** | `uname`, `hostname`, `whoami`, `id`, `pwd`, `env`, `date`, `lsblk`, `lscpu`, `lspci`, `lsusb`, `tty`, `arch`, `nproc` |
| **Help / docs** | `man`, `info`, `help`, `whatis`, `apropos` |
| **Text processing** | `grep`/`rg`, `awk`, `sort`, `uniq`, `cut`, `tr`, `diff`, `wc`, `sed` (blocked if `-i`), `patch --dry-run`, `xxd`, `md5sum`, `sha*sum` |
| **Docker read-only** | `docker ps/images/info/inspect/logs/stats/top/diff/history`, `docker compose ps/config/logs/ls` |
| **Misc/Shell** | `echo`, `printf`, `clear`, `history`, `true`, `false` |

## Customising the allowlist

Edit `allowlist.ts`, then use the extension locally (clone + link) instead of installing the published package. Each allowlist entry has two fields:

| Field | Description |
|-------|-------------|
| `regex` | Regular expression matched against the full command string |
| `label` | Human-readable description |

```ts
export const allowlist: AllowEntry[] = [
  { regex: /^ls\b/,            label: "List directory" },
  { regex: /^git\s+status\b/,  label: "Git status" },
  { regex: /^npm\s+run\b/,     label: "npm run scripts" },   // add your own
];
```

- Use `^` to anchor at the start of the command.
- Everything else (including `git push`, `npm install`, `rm`, etc.) will prompt for confirmation.

## License

MIT
