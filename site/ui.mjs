import { example } from "./example.mjs";
import { review, roles, types } from "./review.mjs";

const form = document.querySelector("#docket");
const list = form.querySelector("#rows");
const sel = (root, field) => root.querySelector('[name="' + field + '"]');

function addRow(record = {claim:"", source:"", type:"record", role:"a"}) {
  const row = document.querySelector("#row").content.firstElementChild.cloneNode(true);
  for (const [name, map] of [["type", types], ["role", roles]]) {
    sel(row, name).replaceChildren(...Object.entries(map).map(([value,label]) => new Option(label, value)));
  }
  for (const [name,value] of Object.entries(record)) sel(row, name).value = value;
  row.querySelector(".remove").addEventListener("click", () => {
    row.remove();
    if (!list.children.length) addRow();
    list.querySelector('input')?.focus();
  });
  list.append(row);
  return sel(row, "claim");
}

function openExample() {
  for (const name of ["question", "a", "b"]) sel(form, name).value = example[name];
  list.replaceChildren();
  example.evidence.forEach(addRow);
  render(example);
}

function sourceLink(source) {
  try {
    const url = new URL(source);
    if (url.protocol === "https:" || url.protocol === "http:") {
      const link = document.createElement("a");
      link.href = url.href;
      link.textContent = url.hostname + " ↗";
      link.title = url.href;
      return link;
    }
  } catch {
    // A citation may be descriptive text.
  }
  return document.createTextNode(source);
}

function render(docket) {
  const output = review(docket);
  document.querySelector("#error").textContent = "";
  for (const field of ["decision", "summary", "alternatives", "challenge", "provenance"]) {
    document.querySelector("#" + field).textContent = output[field];
  }
  document.querySelector("#review-title").textContent = output.question;
  document.querySelector("#citations").replaceChildren(...output.numbered.map((entry) => {
    const item = document.createElement("li");
    item.append("E" + entry.id + " · " + types[entry.type] + " · " + roles[entry.role] + " — " + entry.claim + " · ",
      sourceLink(entry.source));
    return item;
  }));
}

document.querySelector("#add").addEventListener("click", () => addRow().focus());
document.querySelector("#example").addEventListener("click", openExample);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const docket = Object.fromEntries(["question", "a", "b"].map((key) => [key, sel(form, key).value]));
    docket.evidence = [...list.children].map((row) => Object.fromEntries(
      ["claim", "source", "type", "role"].map((key) => [key, sel(row, key).value])
    ));
    render(docket);
    document.querySelector("#review-title").focus();
  } catch (error) {
    document.querySelector("#error").textContent = error.message;
  }
});
openExample();
