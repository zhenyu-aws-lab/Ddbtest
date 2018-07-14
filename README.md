This repo is used for testing global table replication latency with different cocurrency and timer setting
=========

Prerequsite 
-----

* A AWS account 
* A EC2 Instance with DDBWriteAccess 
* Install git on EC2
* Install node on EC2


### 1.Git clone this repository
`
[ec2-user@**** ~]$ git clone https://github.com/zhenyu-aws-lab/Ddbtest.git`


###### 进入项目目录 & 安装本node程序相关的依赖包
`[root@*** ec2-user]# cd Ddbtest/
[root@*** Ddbtest]# npm install
npm WARN saveError ENOENT: no such file or directory, open '/home/ec2-user/Ddbtest/package.json'
npm WARN enoent ENOENT: no such file or directory, open '/home/ec2-user/Ddbtest/package.json'
npm WARN Ddbtest No description
npm WARN Ddbtest No repository field.
npm WARN Ddbtest No README data
npm WARN Ddbtest No license field.

up to date in 0.235s`

### 2.Create Table

##### 设定实验Region
本实验默认在Oregan进行，如果需要修改，请修改MoviesCreateTable.js & loadDataConcurrent.js 下述部分中的**region**
`AWS.config.update({
  region: "us-west-2"
});`
##### 在项目目录执行以下命令，得到输出

`root@ip-172-31-17-57 Ddbtest]# node MoviesCreateTable.js
Created table. Table description JSON: {
  "TableDescription": {
    "AttributeDefinitions": [
      {
        "AttributeName": "title",
        "AttributeType": "S"
      },
      {
        "AttributeName": "year",
        "AttributeType": "N"
      }
    ],
    "TableName": "Movies",
    "KeySchema": [
      {
        "AttributeName": "year",
        "KeyType": "HASH"
      },
      {
        "AttributeName": "title",
        "KeyType": "RANGE"
      }
    ],
    "TableStatus": "CREATING",
    "CreationDateTime": "2018-07-14T07:02:05.556Z",
    "ProvisionedThroughput": {
      "NumberOfDecreasesToday": 0,
      "ReadCapacityUnits": 10,
      "WriteCapacityUnits": 10
    },
    "TableSizeBytes": 0,
    "ItemCount": 0,
    "TableArn": "arn:aws:dynamodb:us-west-2:269562551342:table/Movies",
    "TableId": "0f52c126-9400-4b71-a4ea-5c67894be424"
  }
}`

### 3.Test with different setting



