import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
const read = async (file) => (await readFile(file, "utf8")).replace(/\r\n/g, "\n");
const [shell, css, app, player, ui, config, seed, entry] = await Promise.all([
  read("src/layouts/HomeShell.vue"),
  read("src/styles/home.css"),
  read("src/homeApp.js"),
  read("src/music/player.js"),
  read("src/music/ui.js"),
  read("src/config.js"),
  read("src/music/seed.json"),
  read("index.html"),
]);
let template = shell.match(/<template>\n([\s\S]*?)\n<\/template>/)[1];
const defaults = (await import("../src/config.js")).site;
for (const key of ["name", "hero.intro", "hero.description"]) {
  const value = key.split(".").reduce((obj, part) => obj[part], defaults);
  template = template.replaceAll(
    "{{ site." + key + " }}",
    String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;"),
  );
}
template = template
  .replaceAll(
    ":alt=\"site.name + '的头像'\"",
    'alt="' + defaults.name + '的头像"',
  )
  .replaceAll(
    ":aria-label=\"'关于' + site.name\"",
    'aria-label="关于' + defaults.name + '"',
  );
const clean = (code) =>
  code
    .replace(/^import[\s\S]*?from\s+["'][^"']+["'];?\s*\n/gm, "")
    .replace(/^export default .*?\n/gm, "")
    .replace(/^export /gm, "");
let appCode = clean(app);
const assets = JSON.parse(await read("src/assets.json"));
for (const key of Object.keys(assets)) {
  const bytes = await readFile("public" + assets[key]);
  assets[key] = "data:image/webp;base64," + bytes.toString("base64");
}
appCode = "const ASSETS = " + JSON.stringify(assets) + ";\n" + appCode;
const head = entry.match(/<head>([\s\S]*?)<\/head>/)[1];
const configCode = clean(config).replace(
  "import.meta.env?.VITE_CONFIG",
  "'{}'",
);
const script = [
  configCode,
  clean(player),
  "const seed=" + seed.trim() + ";",
  clean(ui),
  appCode,
  "initHomepage();",
].join("\n");
const output = process.argv[2] || "dist/chunhezi_home.html";
await mkdir(path.dirname(output), { recursive: true });
await writeFile(
  output,
  '<!doctype html>\n<html lang="zh-CN">\n<head>' +
    head +
    "<style>" +
    css +
    "</style></head>\n<body>" +
    template +
    "<script>\n" +
    script.replaceAll("</script", "<\\/script") +
    "\n</script></body></html>\n",
);
console.log("Exported " + output);
