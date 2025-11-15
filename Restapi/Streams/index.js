const fs = require("fs");

const readblestream  = fs.createReadStream("./game.txt",{
    encoding:"utf-8",
});

const writeblestream = fs.createWriteStream("./game.txt");