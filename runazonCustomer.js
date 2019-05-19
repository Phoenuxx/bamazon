var mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "root",
  database: "runazon_db"
});


connection.connect(function (err) {
  if (err) throw err;
  startUp();
});


function populateInv() {
  var query = "SELECT * FROM inventory"
  connection.query(query, function (err, res) {

    tableValues = [['Id', 'Product', 'Department', 'Price', 'Stock']]
    for (let i = 0; i < res.length; i++) {
      tableValues
        .push([res[i].item_id, res[i].product_name,
        res[i].department_name, res[i].price, res[i].stock_quantity]);
    }
    console.table(tableValues[0], tableValues.slice(1));
    selectProduct();
  });
}

function startUp() {
  inquirer
    .prompt({
      name: 'autho',
      type: 'list',
      message: "Good Evening Runner, please select your account authorization level",
      choices: ['Customer', 'Manager', 'Supervisor', 'Exit']
    })
    .then(function (answer) {
      var userLevel = answer.autho;
      if (userLevel === 'Customer') {
        populateInv();
      } else if (userLevel === 'Manager') {
        managerLogin();
      } else if (userLevel === 'Supervisor') {
        supervisorLogin();
      } else {
        endGame();
      }
    });
}

function selectProduct() {
  inquirer
    .prompt([
      {
        name: 'id',
        type: 'input',
        message: "Ah a valued Customer, I see. Which of my wares are you in need of tonight?"
      },
      {
        name: 'qty',
        type: 'input',
        message: 'Yes well out with it, how many do you need? And you better have the credits for it...'
      }])
    .then(function (answer) {

      var query = "SELECT * FROM inventory WHERE item_id=" + answer.id;

      connection.query(query, function (err, res) {
        var currentProductId = answer.id;
        var productPrice = res[0].price;
        var purchaseAmount = parseInt(answer.qty);
        var parsePrice = parseInt(productPrice);
        var totalPrice = parsePrice * purchaseAmount;
        stockQty = res[0].stock_quantity;
        if (purchaseAmount <= stockQty) {
          makePurchase(stockQty, purchaseAmount, currentProductId, totalPrice);
          console.log('good quantity');
        } else if (purchaseAmount > stockQty) {
          refusePurchase();
        }
      });
    });
};

function makePurchase(stock, customerPurchase, product, cost) {
  connection.query("UPDATE inventory SET stock_quantity=" + (stock - customerPurchase) + " WHERE item_id=" + product,
    function (err, res) {
      console.log("That'll cost ya " + cost + " credits runner. See me after your run. Well, if ya manage to find anythin' worth sellin' that is...");
      connection.end();
    });
};

function refusePurchase() {
  console.log("Look, I know you don't have to count much to be a runner, but it sure would make my life easier...");
  inquirer
    .prompt(
      {
        name: 'mulligan',
        type: 'confirm',
        message: "So, you want to try this again? Maybe ask for something I can actually help you with this time?"
      }).then(function (answer) {
        mulligan = answer.mulligan;
        if (mulligan === true) {
          populateInv();
        } else if (mulligan === false) {
          console.log("Alright then, but don't forget to stop by before your next run, never hurts to be prepared... ");
          endGame();
        }
      })

}

function endGame() {
  console.log("Disconnecting from Runner's Virtual Market....");
  console.log("Encrypting data...");
  // When you want to know how things really work, study them when they're coming apart... - WIlliam Gibson
  console.log("Ẅ̴̰́h̶̟͠ẽ̵̝ņ̴̾ ̶͚̉y̶̹͆o̴͈͂ù̷̮ ̷̖̃w̶͖̃a̸͓̋n̷̙̓t̵̮͝ ̷̳͌ẗ̴͍ỏ̵̤ ̵͉͊k̶̼̆n̸̨̆o̵̜̒ẘ̴̞ ̷̩̿h̵͓̏o̷̭͂ẁ̶̼ ̷͇̀ẗ̶̻́h̸̖͝i̴̗͐n̴̛̦g̶̘̈́s̸̱̎ ̴̠͋r̴̛͔ḙ̴̔a̴̼̋l̵̜͐l̶̖͊y̸̰͋ ̵͚̃w̶̧̌o̶̙̽r̴͖͋k̶̦̈́,̴͍́ ̷̡̐s̶̛̰t̷͍͝ü̷͍d̷̳͑y̸͈͋ ̸͙̕t̷̛̪h̶̩̒é̷̬m̸͈͊ ̴͖̈w̵̗̅ḥ̸͆e̶͈͊n̷̼͘ ̵̣͛t̶͓̕h̶̨͠ȅ̴̤y̸̻̕'̶̰̓ṙ̵̻e̸͗͜ ̸̳͠c̵̯̏o̴͚̓m̸̗̄ḭ̷͂n̸̟̋g̴̭̚ ̷̧͌ą̵̈́p̶̞̅â̶̼ř̶̮ṫ̷̤.̷̦̀.̷̛̟.̴̝̈́ ̸̘̉-̷͓͊ ̵̹͗W̴̛̘i̶͎̊l̷̦͠l̷̦̽ǐ̷̭a̶̦͂m̵̳̄ ̴̖̊G̷̦̊i̶̲͝b̶͕̅s̶̨͌o̴͍͝n̸̛̮");
  connection.end();
};

function managerLogin() {
  inquirer
    .prompt([{
      name: 'user',
      type: 'input',
      message: 'Please input Username: '
    },
    {
      name: 'pass',
      type: 'password',
      message: 'Please input Password: ',
      mask: '*'
    }
    ]).then(function (answers) {
      manager = answers.user;
      if (answers.pass == "password") {
        console.log('Good Evening Manager: ' + manager);
        managerAction(manager);
      } else {
        console.log('incorrect password, now shutting down all systems to avoid unauthorized intrusion...')
        endGame();
      }
    })
}

function supervisorLogin() {
  inquirer
    .prompt([{
      name: 'user',
      type: 'input',
      message: 'Please input Username: '
    },
    {
      name: 'pass',
      type: 'password',
      message: 'Please input Password: ',
      mask: '*'
    }
    ]).then(function (answers) {
      if (answers.pass == "123abc") {
        console.log('Good Evening Supervisor: ' + answers.user);
      } else {
        console.log('incorrect password, now shutting down all systems to avoid intrusion...')
        connection.end();
      }
    })
}

function managerAction(manager) {
  inquirer
    .prompt([{
      name: "action",
      type: "list",
      message: "So what's on the agenda Manager " + manager + "?",
      choices: ["View Products", "View Low Inventory", "Add To Stock", "Add New Product"]
    }]).then(function (answer) {
      action = answer.action
      if (action == "View Products") {
        managerView(manager);
      } else if ( action == "View Low Inventory") {
        managerLowInv(manager);
      } else if ( action == "Add To Stock") {
        addManager(manager);
      } else if ( action == "Add New Product") {

      } else if ( action == "View Low Inventory") {
      }
    });
}


function managerView(manager) {
  var query = "SELECT * FROM inventory"
  connection.query(query, function (err, res) {
    if (err) throw err;
    tableValues = [['Id', 'Product', 'Department', 'Price', 'Stock']]
    for (let i = 0; i < res.length; i++) {
      tableValues
        .push([res[i].item_id, res[i].product_name,
        res[i].department_name, res[i].price, res[i].stock_quantity]);
    }
    console.table(tableValues[0], tableValues.slice(1));
    managerAction(manager);
});
};

function managerLowInv(manager) {
  var query = "SELECT * FROM inventory WHERE stock_quantity < 5"
  connection.query(query, function (err, res) {
    if (err) throw err;
    tableValues = [['Id', 'Product', 'Department', 'Price', 'Stock']]
    for (let i = 0; i < res.length; i++) {
      tableValues
        .push([res[i].item_id, res[i].product_name,
        res[i].department_name, res[i].price, res[i].stock_quantity]);
    }
    console.table(tableValues[0], tableValues.slice(1));
    managerAction(manager);
  });
};

function addManager(manager) {
  inquirer
    .prompt([{
      name:'item',
      type:'input',
      message: "Which item would you like to add stock to?(id)"
    },
    {
      name: 'qty',
      type:'input',
      message:'How much merch do you want to add Manager' + manager + "?"
    }]).then(function(answers){ 
      product = answers.item;
      newStock = answers.qty
  connection.query("UPDATE inventory SET stock_quantity+" + newStock + " WHERE item_id=" + product,
    function (err, res) {

    });
    console.table(tableValues[0], tableValues.slice(1));
    managerAction(manager);
  });
}