# Item Colection Node Application
A simple CRUD (Create, Read, Update, Delete) application built with plain Node.js — no frameworks.
It manages items with attributes: name, price, size (s, m, l), and id.
Data is stored locally in a data.json file.

# Features

Create new items

Read all items

Update an existing item by ID

Delete an item by ID

Handles errors for invalid input or missing items


# Technologies

Node.js (no external frameworks)

File System (fs) module for data storage

# Server runs on
http://localhost:3000

# Testing the API

All routes can be tested using:
Thunder Client (VS Code extension)
Postman

GET http://localhost:3000/items

GET http://localhost:3000/items/ID 

POST http://localhost:3000/items → Body: { "name": "Item1" }

PUT http://localhost:3000/items/ID → Body: { "name": "UpdatedItem" }

DELETE http://localhost:3000/items/ID