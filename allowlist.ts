export interface AllowEntry {
  regex: RegExp;
  label: string;
}

// Commands matching these patterns are allowed through without confirmation.
// Everything else prompts for confirmation.
export const allowlist: AllowEntry[] = [
  // ── Filesystem: read-only ──
  { regex: /^(ls|dir|vdir)\b/, label: "List directory" },
  { regex: /^(cat|head|tail|less|more|zcat|bzcat|zless)\b/, label: "Read file" },
  { regex: /^(file|stat|wc|du|df|realpath|readlink|dirname|basename)\b/, label: "File info" },
  { regex: /^(which|whereis|type|command\s+-v|locate)\b/, label: "Locate command/file" },
  { regex: /^find\b(?!.*-(delete|exec|ok)\b)/, label: "Find files (read-only)" },

  // ── Git: read-only subcommands ──
  {
    regex: /^git\s+(status|log|show|diff|ls-files|rev-parse|rev-list|cat-file|describe|blame|ls-remote|archive|grep|shortlog|merge-base|range-diff|whatchanged|verify-commit|verify-tag|help|--help|-h|cherry)\b/,
    label: "Git (read-only)",
  },

  // ── Process info ──
  { regex: /^(ps|pgrep|pidof|pwdx|top|htop|atop|uptime)\b/, label: "Process info" },

  // ── Network info ──
  { regex: /^(ping|ping6|tracepath|dig|nslookup|host|whois)\b/, label: "Network query" },
  { regex: /^(ss|netstat|ifconfig|ip\s+(a|addr|link|route|neigh|netns))\b/, label: "Network info" },
  { regex: /^(arp|route|iwconfig|nmcli\s+(device|connection)\s+show)\b/, label: "Network info" },

  // ── System info ──
  { regex: /^(uname|hostname|hostnamectl(\s+status)?|whoami|who|w|users|last|lastb)\b/, label: "System info" },
  { regex: /^(id|groups|pwd|env|printenv|tty|arch|nproc|lscpu|lsmem|lspci|lsusb|lsblk(\s+-[a-z]*f)?|lshw)\b/, label: "Hardware/sys info" },
  { regex: /^(date|cal|uptime|timedatectl(\s+status)?)\b/, label: "Date/time" },
  { regex: /^(echo|printf|true|false|yes)\b/, label: "Output" },
  { regex: /^(clear|reset|history)(\s|$)/, label: "Terminal" },

  // ── Help / docs ──
  { regex: /^(man|info|help|whatis|apropos|pinfo)\b/, label: "Documentation" },

  // ── Text processing (read-only, no in-place) ──
  { regex: /^(grep|egrep|fgrep|rg)\b/, label: "Search text" },
  { regex: /^(awk|sed\s+(?!.*-i\b)|sort|uniq|cut|tr|wc|nl|paste|join|expand|unexpand|fmt|fold|rev|tac)\b/, label: "Text processing" },
  { regex: /^(diff|comm|cmp|sdiff|patch\s+--dry-run)\b/, label: "Compare files" },
  { regex: /^(xxd|od|hexdump|strings|base32|base64|md5sum|sha\S+sum|cksum)\b/, label: "Encode/inspect" },
  { regex: /^(column|tsort|shuf\s+.*-n)\b/, label: "Text formatting" },

  // ── Docker read-only ──
  { regex: /^docker\s+(ps|images|info|version|inspect|logs|stats|top|diff|history|search|context\s+ls|context\s+show|buildx\s+ls|buildx\s+inspect|compose\s+(ps|images|logs|config|top|version|ls))\b/, label: "Docker (read-only)" },
];
