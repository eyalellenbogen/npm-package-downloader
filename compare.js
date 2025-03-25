var dircompare = require('dir-compare');
var fs = require('fs');
var options = { compareSize: true };
var path1 = './existing';
var path2 = './output';
var res = dircompare.compareSync(path1, path2, options);
console.log('equal: ' + res.equal);
console.log('distinct: ' + res.distinct);
console.log('left: ' + res.left);
console.log('right: ' + res.right);
console.log('differences: ' + res.differences);
console.log('same: ' + res.same);
var format = require('util').format;
const files = res.diffSet.filter(function (entry) {
    return entry.type1 === 'missing' && entry.type2 === 'file';
});
const outpath = './output2';
if (!fs.existsSync(outpath)) {
    fs.mkdirSync(outpath);
}

files.forEach(function (entry) {
    var source = entry.path2 + '/' + entry.name2;
    var dest = outpath + '/' + entry.name2;
    console.log('copying %s to %s', source, dest);
    fs.copyFileSync(source, dest);
});
