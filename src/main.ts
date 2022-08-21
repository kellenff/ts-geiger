import core from "@actions/core";
import { spawn } from "node:child_process";
import kloc from "kloc";

const main = async () => {
  const srcPath = core.getInput("srcDirectory");

  const results = await new Promise<number>((resolve, reject) => {
    let count = 0;
    const grep = spawn("grep", ["-r", "'@ts-ignore'", srcPath]);
    const wc = spawn("wc", ["-l"], { stdio: [grep.stdout, "pipe", "pipe"] });

    wc.stdout.on("data", (d) => {
      const parsed = parseInt(d.toString(), 10);

      if (!isNaN(parsed)) {
        count = parsed;
      }
    });

    wc.on("close", (code) => {
      if (code === 0) {
        resolve(count);
      } else {
        reject(new Error(`grep returned non-zero status code ${code}`));
      }
    });
  });

  const totalLines = await kloc(srcPath);

  core.setOutput("tsIgnoreCount", results);
  core.setOutput("totalLineCount", totalLines);
};

main().catch((err) => {
  core.setFailed(err instanceof Error ? err : "unknown error occurred");
});
