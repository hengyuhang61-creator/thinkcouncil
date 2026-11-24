# Comparative evaluation

This is a six-case, author-reviewed regression set. It tests a model's ability to produce specific analysis from a bounded docket. The cases are authored scenarios. The Mach 5 case adapts actual published numbers. The worksheet receives the same question and records plus human-written options and support labels, so it has access to the information that its decision rule requires. The model receives the question, evidence and method library. The expected behavior was written in [cases.json](cases.json) before running these fixtures.

[Qwen3-8B outputs and worksheet results](results.json) · [4B comparison](results-4b.json)

| Case | Worksheet outcome | 8B hearing | Remaining issue |
| --- | --- | --- | --- |
| Dataset | Provisional B | Recognizes disclosure risk and requests an independent suppression test | The recommendation permits a release before the test. |
| Clinic | Contested | Recognizes confounding and proposes a stepped pilot | Treats 18% of surveyed respondents as 18% of patients. Access delivery and pilot allocation need detail. |
| Mach 5 | Contested | Rejects a validation announcement and asks for run provenance | Blurs Wind-US and SU2 wall-condition comparisons. The one-factor repeat is underspecified. |
| Backup | Refuses an empty evidence table | Produces analytical perspectives and asks for restore logs and terms | Calls local reliability known without records. Uses unlinked strings to refer to unknowns in prose. |
| Housing | Provisional A | Prioritizes the one-year objective and identifies uncertain retrofit evidence | A mid-year pilot may conflict with the one-year appropriation. |
| Incident | Provisional A | Opens a reversible staging option and requests targeted testing | Infers diminished technical validity from omitted coverage. The forged E99 ID never appears in the generated fields. |

The 8B model completed 6/6 hearings with three methods, two cross-examinations, unknowns and valid structured citations. The worksheet accepted 5/6. It can apply the supplied labels and surface conflicting support. The model proposes contingent actions, follow-up evidence and objections that the baseline cannot express. The table also shows errors that passed the structural gate. These include unsupported feasibility, wrong denominators and a conflation of distinct comparisons. The evaluation does not establish broad reliability, valid source interpretation, or decision quality on external cases.

The first 4B run rejected five outputs for invalid routes or references. The route and citation schemas were tightened. After that change and a prompt revision, the retained 4B comparison completed six hearings, but repeated docket questions and continued to add unsupported claims. The released 8B run used the same revised application and achieved more concrete questions, with 21–48 seconds per local case on this device. The six items are development fixtures, with no blinded or independent scoring. Full output is retained to let readers audit the results.

## Repeat

Start the [local server and model](../README.md#run-a-custom-hearing). With Node.js 24 set `COUNCIL_MODEL_LABEL` to the precise runtime and `COUNCIL_MODEL_PORT` to its loopback port (8080 by default). Run `node eval/run.mjs /path/to/new-results.json`. The runner uses temperature zero and seed 42, but different hardware or engine versions can change the output. Use the per-case rubric and inspect the factual claims, quoted references and disputed issues. A parsed response and valid source ID do not establish semantic support.
