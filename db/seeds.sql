INSERT INTO Departments (name)
VALUES ("Clothing"),
       ("Sports"),
       ("Refreshments"),
       ("Snacks");

INSERT INTO Roles (title, salary, department_id)
VALUES ("Cashier", 20000, 1),
       ("Coach", 45000, 2),
       ("MixTender", 55000, 3),
       ("Vendor", 25000, 4);

INSERT INTO Employees (first_name, last_name, role_id, manager_id)
VALUES ("Troy", "Wood", 1, NULL),
       ("Mike", "Green", 1, 1), 
       ("Thomas", "Harmon", 2, NULL),
       ("Dan", "Tramell", 2, 3),
       ("Paul", "Aldama", 3, NULL),
       ("Cindy", "Reyes", 3, 5),
       ("Angie", "Liz", 4, NULL),
       ("Evan", "Baxter", 4, 7);