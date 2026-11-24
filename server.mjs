import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { deliberate, localModel, request } from "./council.mjs";

const site = fileURLToPath(new URL("./site", import.meta.url));
const port = Number(process.env.COUNCIL_PORT ?? 8000);
const model = localModel(Number(process.env.COUNCIL_MODEL_PORT ?? 8080));
const origin = "http://127.0.0.1:" + port;
const mime = {html: "text/html", css: "text/css", mjs: "text/javascript", json: "application/json"};
let busy = false;

const reply = (response, status, body, type = "application/json") => {
  response.writeHead(status, {"Content-Type": type + "; charset=utf-8", "X-Content-Type-Options": "nosniff"});
  response.end(type === "application/json" ? JSON.stringify(body) : body);
};

createServer(async (req, response) => {
  if (req.headers.host !== "127.0.0.1:" + port) {
    reply(response, 403, {error: "Use the displayed loopback URL."});
    return;
  }
  const pathname = new URL(req.url, origin).pathname;
  if (req.method === "POST" && pathname === "/api/hearing") {
    if (req.headers.origin !== origin || req.headers["content-type"] !== "application/json") {
      reply(response, 403, {error: "Submit from this local page."});
      return;
    }
    if (busy) {
      reply(response, 429, {error: "A hearing is already running."});
      return;
    }
    busy = true;
    try {
      req.setEncoding("utf8");
      let body = "";
      for await (const chunk of req) {
        body += chunk;
        if (body.length > 10_000) {
          reply(response, 413, {error: "The docket is too large."});
          return;
        }
      }
      let payload;
      try {
        payload = JSON.parse(body);
        request(payload);
      } catch (error) {
        reply(response, 400, {error: error.message});
        return;
      }
      reply(response, 200, await deliberate(payload, model));
    } catch (error) {
      reply(response, 502, {error: "Local hearing failed. Check llama-server and retry. " + error.message});
    } finally {
      busy = false;
    }
    return;
  }
  if (req.method !== "GET") {
    reply(response, 405, {error: "Unsupported request."});
    return;
  }
  const path = resolve(site, "." + (pathname === "/" ? "/index.html" : pathname));
  const type = mime[path.split(".").at(-1)];
  if (!path.startsWith(site + sep) || !type) {
    reply(response, 404, {error: "Page unavailable."});
    return;
  }
  try {
    const contents = await readFile(path, "utf8");
    reply(response, 200, type === "application/json" ? JSON.parse(contents) : contents, type);
  } catch {
    reply(response, 404, {error: "Page unavailable."});
  }
}).listen(port, "127.0.0.1", () => console.log("ThinkCouncil " + origin));
