var mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "runazon_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    displayInv();
  });


function displayInv() {
    var query = "SELECT * FROM inventory"
    // console.log("inventory");
    connection.query(query, function(err, res) {
    // console.log(res[0].item_id);

        var tableValues = [
            ['Id', 'Product'],
            // [res[0].item_id, res[0].product_name],
            // [res[1].item_id, res[1].product_name],
            // [res[2].item_id, res[2].product_name],
            // [res[3].item_id, res[3].product_name],
            // [res[4].item_id, res[4].product_name],
            // [res[5].item_id, res[5].product_name],
            // [res[6].item_id, res[6].product_name],
            // [res[7].item_id, res[7].product_name],
            // [res[8].item_id, res[8].product_name],
            // [res[9].item_id, res[9].product_name], 
        ]
        for (let i = 0; i < res.length; i++) {
            // console.log([res[i].item_id + ", " +  res[i].product_name]);
            testArr1 = [];
            testArr1.push(res[i].item_id);
            testArr2 = [];
            testArr2.push(res[i].product_name);
            tableValues.push(testArr1);
            tableValues.push(testArr2);
        }
        // console.log(tableValues);
        // console.table(tableValues[0], tableValues.slice(1));
        console.log(tableValues[0], tableValues.slice(1));
    });
    connection.end();
  }
