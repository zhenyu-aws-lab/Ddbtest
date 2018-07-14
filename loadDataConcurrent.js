var AWS = require("aws-sdk");
var fs = require('fs');
const inquirer = require("inquirer");
const log4js = require('log4js');


log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'result.log' } },
  categories: { default: { appenders: ['cheese'], level: 'info' } }
});

const logger = log4js.getLogger('cheese');


AWS.config.update({
    region: "us-west-2"
});



var docClient  = new AWS.DynamoDB.DocumentClient();

//docClient.setMaxListeners(0);

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
      var concurrency = answers.concurrency   

      var timer = answers.timer  
      console.log("answers",answers)

      //设置每秒并发
      var myInterval=setInterval(sendDataConcurrent,1000, concurrency);
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
           logger.error("Unable to add movie", result, ". Error JSON:", JSON.stringify(err, null, 2))
           console.error("Unable to add movie", result, ". Error JSON:", JSON.stringify(err, null, 2));
           reject(err);
       } else {
       	   
           logger.info("PutItem succeeded:", result, " #######time is :", new Date().getMinutes(), ":",new Date().getSeconds())
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
  console.log(`total cost: ${t2 - t1}ms.`)
  logger.info(`total cost: ${t2 - t1}ms.`)
  return result;
}

