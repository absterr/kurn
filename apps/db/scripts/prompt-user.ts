import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";

export async function prompt(question: string) {
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

export async function promptHidden(question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    stdout.write(question);
    let input = "";

    const onData = (char: Buffer) => {
      const c = char.toString("utf8");
      switch (c) {
        case "\n":
        case "\r":
        case "\u0004": // Ctrl+D
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener("data", onData);
          stdout.write("\n");
          resolve(input);
          break;
        case "\u0003": // Ctrl+C
          stdin.setRawMode(false);
          stdout.write("\n");
          reject(new Error("Cancelled"));
          break;
        case "\u007f": // Backspace
          if (input.length > 0) {
            input = input.slice(0, -1);
          }
          break;
        default:
          input += c;
          break;
      }
    };

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    stdin.on("data", onData);
  });
}
