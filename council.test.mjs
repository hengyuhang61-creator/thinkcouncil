import { test } from "node:test";
import { strict as assert } from "node:assert";
import { deliberate, request } from "./council.mjs";

const input = {question: "Should the pilot become a permanent program?", records: ["E1 source note"]};
const methodIds = ["alternatives", "provenance", "tradeoffs"];
const model = async (instruction, context) => {
  if (instruction.startsWith("Choose")) return {perspectives: methodIds.map((method) => ({
    method, judgment: "Compare the pilot and its baseline.", tradeoff: "Delay versus identification.", refs: ["E1"],
  }))};
  if (instruction.startsWith("Cross")) {
    assert.equal(context.perspectives.length, 3);
    return {
      exchanges: [0, 1].map((index) => ({route: methodIds[index] + " > " + methodIds[index + 1],
        question: "Which period was comparable?", answer: "This is not described.", refs: ["E1"]})),
      unknowns: [{unknown: "Baseline", evidenceNeeded: "Pre-pilot data"}],
    };
  }
  assert.equal(context.exchanges.length, 2);
  return {recommendation: "Run a controlled extension.", rationale: "A baseline is missing.", dissent: "Cost.", reconsiderWhen: "After one paired cohort.", refs: ["E1"]};
};

test("runs all three dependent passes and keeps source records", async () => {
  const output = await deliberate(input, model);
  assert.equal(output.docket.records[0].id, "E1");
  assert.equal(output.conclusion.refs[0], "E1");
});

test("rejects forged evidence and malformed submissions", async () => {
  assert.throws(() => request({...input, records: [""]}));
  const bad = async (instruction, context) => {
    const answer = await model(instruction, context);
    answer.perspectives[0].refs = ["E99"];
    return answer;
  };
  await assert.rejects(deliberate(input, bad), /outside this docket/);
});
