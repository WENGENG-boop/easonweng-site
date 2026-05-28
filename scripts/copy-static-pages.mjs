import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const pages = [
  ["index.html", "_static-pages/home.html"],
  ["admin.html", "_static-pages/admin.html"],
  ["index.html", "index.html"],
  ["admin.html", "admin.html"],
  ["admin.html", "admin/index.html"],
];

for (const [source, destination] of pages) {
  const target = join(".open-next", "assets", destination);
  mkdirSync(join(target, ".."), { recursive: true });
  copyFileSync(join(".next", "server", "app", source), target);
}
