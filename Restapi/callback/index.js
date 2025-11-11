
function processUser(name, callback) {
  console.log(`1. Processing user: ${name}`);
  // Execute the callback function
  callback();
}

function greetUser() {
  console.log("2. Hello and welcome!");
}

processUser("Vishwa",greetUser);