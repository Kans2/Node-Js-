const fs = require("fs");
const os = require("os");
const chalk = require("chalk");
const inquirer = require("inquirer");

const prompt = inquirer.createPromptModule();

prompt([ 
   {
         type:"input",
         name:"pokemon",
         message:"Enter any five pokemon name"
   },
])
// const yargs = require("yargs");
// const {argv} = yargs(process.argv);


console.log(process.argv);
// console.log(os.EOL);
//console.log(os.arch());
// console.log(__filename);
// console.log(os.cpus.length);
// console.log(os.cpus.length > 0 ? cpus[0].model : 'N/A');
// console.log(os.freemem());
// console.log(os.type());
// console.log(os.uptime());
// console.log(os.platform());
// console.log(os.release());


//bin - name : index.js , npm i -g , 
const getSytemdetailes = () =>{
      //os info
      const whatos = os.type();
      const platform = os.platform();
      const release = os.release();


      //cpu info
      // CPU Info
      const cpus = os.cpus();
      const cpuModel = cpus.length > 0 ? cpus[0].model : 'N/A'; // Get model name
      const cpuCores = cpus.length;                               // Get core count
      const cpuArchitecure = os.arch();
     
     //uptime
     const uptime = os.uptime();
     const freem = os.freemem();
   //object sending
     return({
        whatos,
        platform,
        release,
        cpuModel,
        cpuCores,
        cpuArchitecure,
        uptime,
        freem
     })

}


const writelogs = () =>{
   try{
     console.log("Getting System data....");
    const data =  getSytemdetailes();
    const filelog = "./log.txt";
    const fileExists = fs.existsSync(filelog);

    //converting to string
    const logEntry = Object.values(data).join(',') + '\n';

    let contentToWrite = '';

    // Adding header only if the file does not exist
        if (!fileExists) {
            const header = Object.keys(data).join(',') + '\n';
            contentToWrite += header;
        }

        contentToWrite += logEntry;

        // Using fs.appendFileSync synchronously (no callback)
        fs.appendFileSync(filelog, contentToWrite);
         // Success message (Removed chalk styling)
        console.log(`\n✅ System details logged successfully to ${filelog}`);

        // Display sample data to confirm successful logging (Removed chalk styling)
        console.log('\n--- Logged Data Snippet ---'); 
        console.log(`Timestamp: ${data.timestamp}`);
        console.log(`CPU Model: ${data.cpuModel}`);
        console.log(`Free Memory: ${(data.freem / 1024 / 1024).toFixed(2)} MB`);
        console.log('----------------------------\n');
   }catch(err){
        console.log(err);
   }
}

//fetch(argv.pokemon);


writelogs();