var AWS = require("aws-sdk");
var fs = require('fs');
var inquirer = require("inquirer");


AWS.config.update({
    region: "us-west-2"
});



var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing movies into DynamoDB. Please wait.");


//question list on shell
var questions = [
 {
    type: "input",
    name: "concurrency",
    message: "please input desired test concurrency :",
    default: 100
  },
  {
    type: "input",
    name: "timer",
    message: "please input desired test time by Seconds :",
    default: 50000
  },

]

//设置命令行交互
inquirer
  .prompt(questions)
  .then(answers => {
      var concurrence = answers.concurrence   

      var timer = answers.timer  
      //设置每秒并发
      var myInterval=setInterval(sendDataConcurrent,1000, concurrence);
      //设置执行时间，执行时间过后会stop掉上面的并发
      setTimeout(()=>{
        clearTimeout(myInterval);
      }, timer) 
});




// 模拟一次api网络请求花费1s
async function _a_ddb_put(result) {
  return new Promise((resolve, reject) => {
  	var params = {
        TableName: "Movies",
        Item: {
            "year":  result,
            "title": result+"121",
            "info":  result+"222",
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add movie", result, ". Error JSON:", JSON.stringify(err, null, 2));
           reject();
       } else {
       	   counter++
           console.log("PutItem succeeded:", result, " #######time is :", new Date().getMinutes(), ":",new Date().getSeconds());
		   resolve();
       }
    });
   	
  });
}

async function sendDataConcurrent(concurrency) {
  const t1 = Date.now();
  const promises = [];
  for (let i = 1; i <= concurrency; i += 1) {
    promises.push(_a_ddb_put(i));
  }
  const result = await Promise.all(promises)
  const t2 = Date.now();
  console.log(`total cost: ${t2 - t1}ms.`);
  return result;
}



