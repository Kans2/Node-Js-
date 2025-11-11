const path = require("path");

// console.log(__filename);
// console.log(__dirname);

//console.log(path.basename(__filename));
//console.log(path.basename(__dirname));


// console.log(path.extname(__filename));
// console.log(path.extname(__dirname));

//console.log(path.parse(__filename));   detailed info

// console.log(path.format(path.parse(__dirname)));

// console.log(path.isAbsolute(__dirname));

// console.log(path.join("one","two","three"));1
// console.log(path.join(__dirname,"\newfolder"));


console.log(path.resolve(__dirname,"data.json"));

console.log(path.resolve("data.json"));

console.log(path.resolve("\data.json"));