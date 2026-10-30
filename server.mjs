import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const paths = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/app.js", ["app.js", "application/javascript; charset=utf-8"]],
]);
const port = Number(process.env.PORT || 4173);
createServer(async (request, response) => {
  const [file, type] = paths.get(new URL(request.url, "http://localhost").pathname) || [];
  if (!file) { response.writeHead(404).end("Not found"); return; }
  try {
    response.writeHead(200, { "Content-Type": type });
    response.end(await readFile(join(root, file)));
  } catch {
    response.writeHead(500).end("Could not load file");
  }
}).listen(port, "127.0.0.1", () => console.log(`Portfolio preview: http://127.0.0.1:${port}`));
