const strip = require("strip-comments");
const fs = require("fs");
const path = require("path");

function walk(dir, callback) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full, callback);
    } else if (/\.(ts|tsx)$/.test(path.extname(full))) {
      callback(full);
    }
  }
}

function stripCommentsInDir(dir) {
  walk(dir, (file) => {
    const content = fs.readFileSync(file, "utf8");
    const stripped = strip(content);
    fs.writeFileSync(file, stripped, "utf8");
    console.log("Stripped:", file);
  });
}

stripCommentsInDir("app");
stripCommentsInDir("components");
stripCommentsInDir("lib");
stripCommentsInDir("prisma");
