DROP DATABASE IF EXISTS  runazon_db;

CREATE DATABASE runazon_db;

USE runazon_db;

CREATE TABLE inventory ( 
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(20) NOT NULL,
department_name VARCHAR(20),
price DECIMAL(5,2) NOT NULL,
stock_quantity INT(2) NOT NULL,
PRIMARY KEY (item_id)
);


INSERT INTO inventory(product_name, department_name, price, stock_quantity)
VALUE('Excalibur (deck)', 'Electronics', 699.99, 1), ('Jazz', 'Pharmaceuticals', 5, 342), ('Urban Mage Cloak', 'Clothing', 120, 16) ;

SELECT * FROM inventory;