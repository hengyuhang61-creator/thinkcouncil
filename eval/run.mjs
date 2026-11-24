import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { deliberate, localModel } from "../council.mjs";
import { review } from "../site/review.mjs";

const cases = JSON.parse(await readFile(new URL("./cases.json", import.meta.url), "utf8"));
const model = localModel(Number(process.env.COUNCIL_MODEL_PORT ?? 8080));
const label = process.env.COUNCIL_MODEL_LABEL;
if (!label || !process.argv[2]) throw new Error("Set COUNCIL_MODEL_LABEL and pass a new output JSON path.");

const outputs = [];
for (const item of cases) {
  const input = {question: item.question, records: item.records};
  let baseline;
  try {
    baseline = review({question: item.question, a: item.a, b: item.b,
      evidence: item.records.map((record, i) => ({claim: record, source: "Scenario record E" + (i + 1), type: "record", role: item.roles[i]}))});
  } catch (error) {
    baseline = {rejected: error.message};
  }
  const started = performance.now();
  let output, error;
  try {
    output = await deliberate(input, model);
  } catch (failure) {
    error = failure.message;
  }
  outputs.push({id: item.id, title: item.title, input, model: label, criteria: item.criteria, baseline,
    seconds: Math.round((performance.now() - started) / 100) / 10, output, error});
  console.log(item.id, output ? "OK" : error, outputs.at(-1).seconds + "s");
}
await writeFile(resolve(process.argv[2]), JSON.stringify(outputs, null, 2) + "\n", {flag: "wx"});
if (outputs.some((item) => !item.output)) process.exitCode = 1;
