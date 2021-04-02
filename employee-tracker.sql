DROP DATABASE IF EXISTS employee_db;
CREATE database employee_db;

USE employee_db;

CREATE TABLE Department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(8, 2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL, 
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id)
);

-- Code for use later
-- DELETE FROM `employee_db`.`Employee` WHERE (`id` = '1');
-- DELETE FROM `employee_db`.`Employee` WHERE (`id` = '2');
-- DELETE FROM `employee_db`.`Employee` WHERE (`id` = '3');
-- DELETE FROM `employee_db`.`Employee` WHERE (`id` = '4');