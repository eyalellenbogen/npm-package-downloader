var fs = require("fs");
const https = require("https");

var targetJson = require("./work/list2.json");
var webdaJson = require("./work/webda.json");

const deps = targetJson.dependencies;
const webda = webdaJson.dependencies;

const resultMap = new Map();
const webdaMap = new Map();

const npmjs = "https://registry.npmjs.org/";

function populateDependencySet(deps, targetMap, lookupMap) {
  for (var key in deps) {
    const d = deps[key];
    const name = convertNpmPackageNametoFileName(key, d.version);
    const resolved =
      d.resolved || npmjs + key + "/-/" + name;
    if (d.resolved && (!lookupMap || !lookupMap.get(name))) {
      targetMap.set(name, d.resolved);
    }
    if (d.dependencies) {
      populateDependencySet(deps[key].dependencies, targetMap, lookupMap);
    }
  }
}

function convertNpmPackageNametoFileName(name, version) {
  return name.replace("@", "").replace("/", "-") + "-" + version + ".tgz";
}

if (!fs.existsSync("output")) {
  fs.mkdirSync("output");
}

populateDependencySet(webda, webdaMap);
console.log('previous deps:', webdaMap.size);
populateDependencySet(deps, resultMap, webdaMap);
console.log("new deps:", resultMap.size);

resultMap.forEach((value, key) => {
  let filename = "output/" + key;

  let file = fs.createWriteStream(filename);
  https
    .get(value, function (response) {
      response.pipe(file);
    })
    .on("error", function (e) {
      console.log(e);
    });
});

console.log("fetching deps:", resultMap.size);
