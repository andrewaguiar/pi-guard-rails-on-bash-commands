import { isToolCallEventType } from "@mariozechner/pi-coding-agent";
import { allowlist } from "./allowlist";

export default function (pi) {
  pi.on("tool_call", async (event, ctx) => {
    if (!isToolCallEventType("bash", event)) {
      return undefined;
    }

    const command = event.input.command;

    // Allow commands matching the allowlist — no confirmation needed.
    for (const entry of allowlist) {
      if (entry.regex.test(command)) {
        return undefined;
      }
    }

    // No terminal UI: block unknown commands.
    if (!ctx.hasUI) {
      return {
        block: true,
        reason: "Bash commands are not allowed in headless mode",
      };
    }

    const display = command.length > 120 ? `${command.slice(0, 120)}…` : command;

    const ok = await ctx.ui.confirm(
      "Allow bash command?",
      `${display}\n\nRun this command?`,
    );

    return ok ? undefined : { block: true, reason: "Command rejected by user" };
  });
}
