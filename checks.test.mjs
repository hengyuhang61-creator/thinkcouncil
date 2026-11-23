import assert from "node:assert/strict";
import test from "node:test";
import { review } from "./site/review.mjs";
import { example } from "./site/example.mjs";

test("the real publication question supports scoped release", () => {
  const result = review(example);
  assert.equal(result.decision, "PROVISIONAL A");
  assert.match(result.summary, /E2, E3/);
  assert.match(result.challenge, /Hypotheses: E4/);
  assert.equal(result.numbered.length, 4);
});
test("recorded support on both sides keeps the conflict open", () => {
  const changed = structuredClone(example);
  changed.evidence[3].type = "record";
  const result = review(changed);
  assert.equal(result.decision, "CONTESTED");
  assert.match(result.alternatives, /for B: E4/);
});
test("custom inputs can support B without any default example text", () => {
  const result = review({question:"Which test should we run?", a:"Only unit tests", b:"Probe the release",
    evidence:[{claim:"The deployed endpoint returns an old version.", source:"Observed version receipt", type:"record", role:"b"}]});
  assert.equal(result.question, "Which test should we run?");
  assert.equal(result.decision, "PROVISIONAL B");
  assert.match(result.summary, /Probe the release/);
});
test("hypotheses cannot establish either option, and missing sources fail", () => {
  const changed = structuredClone(example);
  changed.evidence[0].type = "hypothesis";
  assert.equal(review(changed).decision, "INSUFFICIENT SUPPORT");
  changed.evidence[0].source = "";
  assert.throws(() => review(changed), /complete evidence row/);
  assert.throws(() => review({...example, b:example.a.toUpperCase()}), /distinct options/);
});
