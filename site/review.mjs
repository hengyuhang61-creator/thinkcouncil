export const types = {record:"Source record", derived:"Derived result", hypothesis:"Hypothesis"};
export const roles = {a:"Supports A", b:"Supports B", limit:"Limits the claim"};

export function review(docket) {
  const {question, a, b, evidence} = docket;
  if (![question, a, b].every((text) => text.trim())) {
    throw new Error("Enter a question and two distinct options.");
  }
  if (a.trim().toLowerCase() === b.trim().toLowerCase()) throw new Error("Enter two distinct options.");
  if (!evidence.length || evidence.some((row) =>
    !row.claim.trim() || !row.source.trim() || !Object.hasOwn(types, row.type) || !Object.hasOwn(roles, row.role))) {
    throw new Error("Add at least one complete evidence row with a source.");
  }

  const numbered = evidence.map((row, i) => ({...row, id: i + 1}));
  const qualified = numbered.filter((row) => row.type !== "hypothesis");
  const supportA = qualified.filter((row) => row.role === "a");
  const supportB = qualified.filter((row) => row.role === "b");
  const limits = qualified.filter((row) => row.role === "limit");
  const hypotheses = numbered.filter((row) => row.type === "hypothesis");

  const show = (group) => group.length ? group.map(({id}) => "E" + id).join(", ") : "no entries";
  let decision = "INSUFFICIENT SUPPORT";
  let summary = "The docket contains no source record or derived result supporting either option.";
  if (supportA.length && supportB.length) {
    decision = "CONTESTED";
    summary = "Both options have recorded support. Resolve the disputed assumptions using a comparable criterion before choosing.";
  } else if (supportA.length || supportB.length) {
    const side = supportA.length ? "A" : "B";
    decision = "PROVISIONAL " + side;
    summary = (side === "A" ? a : b) + ". This applies within the submitted evidence scope.";
  }
  if (limits.length) summary += " Carry the limits in " + show(limits) + " into any public claim.";

  return {
    question, decision, summary, numbered,
    alternatives: "Recorded support for A: " + show(supportA) + ". Recorded support for B: " + show(supportB) + ". Ask whether either route achieves the requested outcome at lower cost or with a reversible step.",
    challenge: "Claim limits: " + show(limits) + ". Hypotheses: " + show(hypotheses) + ". Ask which observation could reverse the preferred option or make its current claim too broad.",
    provenance: "Trace each decision-driving claim to its source, date and conditions. Resolve or disclose " + show(limits) + ". The tool records user-supplied evidence labels and leaves source verification to the reader.",
  };
}
