import { methods } from "./methods.mjs";

const $ = (selector) => document.querySelector(selector);
const element = (tag, text, ...children) => {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  node.append(...children);
  return node;
};
const link = (title, href) => {
  const a = element("a", title);
  a.href = href;
  return a;
};
const local = location.hostname === "127.0.0.1";
const form = $("#hearing-form");
const scenarios = $("#scenarios");
const status = $("#status");
const submit = $("#submit");
let examples = [];

const recordLinks = (refs) => element("p", refs.length ? "Evidence " : "No supplied evidence cited.",
  ...refs.flatMap((ref) => [link(ref, "#" + ref), document.createTextNode(" ")]));
const line = (label, value) => element("p", "", element("strong", label + " "), value);

function render(output, label, qualityNote) {
  const {docket, perspectives, exchanges, unknowns, conclusion} = output;
  $("#result-title").textContent = docket.question;
  $("#run-label").textContent = label;
  const verdict = element("section", "", element("h3", "Recommendation"), element("p", conclusion.recommendation),
    line("Rationale", conclusion.rationale), line("Strongest dissent", conclusion.dissent),
    line("Reconsider when", conclusion.reconsiderWhen), recordLinks(conclusion.refs));
  verdict.className = "verdict";
  const views = element("section", "", element("h3", "Three perspectives"), ...perspectives.map((view) =>
    element("article", "", element("h4", "", link(methods[view.method].name, methods[view.method].source)),
      element("p", view.judgment), line("Tradeoff", view.tradeoff), recordLinks(view.refs))));
  const inquiries = element("section", "", element("h3", "Cross-examination"), ...exchanges.map((exchange) =>
    element("details", "", element("summary", methods[exchange.from].name + " questions " + methods[exchange.to].name),
      line("Question", exchange.question), line("Answer", exchange.answer), recordLinks(exchange.refs))));
  inquiries.querySelector("details").open = true;
  const gaps = element("section", "", element("h3", "What we still need to know"), ...unknowns.map((item) =>
    element("article", "", element("h4", item.unknown), line("Evidence to seek", item.evidenceNeeded))));
  const records = element("section", "", element("h3", "Evidence as submitted"), ...(docket.records.length ? docket.records.map(({id,text}) => {
    const record = element("p", "", element("strong", id + " "), text);
    record.id = id;
    return record;
  }) : [element("p", "This docket supplied no records.")]));
  const assessment = qualityNote ? [element("p", "", element("strong", "Evaluation note "), qualityNote)] : [];
  $("#outcome").replaceChildren(...assessment, verdict, views, inquiries, gaps, records);
  $("#result").setAttribute("aria-busy", "false");
}

function loadExample() {
  const item = examples[Number(scenarios.value)];
  if (!item) return;
  form.elements.question.value = item.input.question;
  form.elements.records.value = item.input.records.join("\n");
  render(item.output, "Recorded model run · " + item.model, item.qualityNote);
  status.textContent = "";
}

$("#mode").textContent = local ? "Custom hearings run on this device. Verify factual claims and evidence before acting." :
  "Public preview with recorded model hearings. Run a custom question with the local setup.";
form.elements.question.readOnly = !local;
form.elements.records.readOnly = !local;
submit.hidden = !local;
$("#method-list").replaceChildren(...Object.values(methods).map((method) =>
  element("article", "", element("h3", "", link(method.name, method.source)), element("p", method.procedure))));
scenarios.addEventListener("change", loadExample);
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!local) return;
  submit.disabled = scenarios.disabled = true;
  status.textContent = "Comparing perspectives, cross-examining and synthesizing…";
  $("#result").setAttribute("aria-busy", "true");
  try {
    const response = await fetch("api/hearing", {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({question: form.elements.question.value,
        records: form.elements.records.value.split("\n").map((line) => line.trim()).filter(Boolean)}),
    });
    const output = await response.json();
    if (!response.ok) throw new Error(output.error);
    render(output, "Live local model hearing");
    status.textContent = "Hearing complete.";
    $("#result-title").focus();
  } catch (error) {
    status.textContent = error.message;
  } finally {
    submit.disabled = scenarios.disabled = false;
    $("#result").setAttribute("aria-busy", "false");
  }
});

try {
  const response = await fetch("hearings.json");
  if (!response.ok) throw new Error("Recorded hearings could not be loaded.");
  examples = await response.json();
  if (!examples.length) throw new Error("No recorded hearings are available.");
  scenarios.replaceChildren(...examples.map((item, i) => new Option(item.title, i)));
  loadExample();
} catch (error) {
  status.textContent = error.message;
  $("#result").setAttribute("aria-busy", "false");
}
