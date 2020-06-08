const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const connection = require('./src/helpers/mysql');
const helper = require('./src/helpers/index');

connection.connect(function (error) {
  if (error) throw error;
  console.log("database has conenected!");
});

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get("/products", function (request, response) {
  connection.query("SELECT * FROM products", function (error, result) {
    if (error) {

      return helper.response(response, 'fail', 'Internal Server Error', result, 500);
    };
    return helper.response(response, 'success', result, 200);
  });
});

app.post("/products", function (request, response) {
  const setData = request.body;
  console.log(request.body);
  connection.query("INSERT INTO products SET ?", setData, function (error, result) {
    if (error) {
      console.log(error);
      return helper.response(response, 'fail', 'Internal Server Error', result, 500);
    };

    const newData = {
      id: result.insertId,
      ...setData
    };
    return helper.response(response, 'success', newData, 200);
  });
});

app.put("/products/:id", function (request, response) {
  const setData = request.body;
  const id = request.params.id;
  connection.query("UPDATE products SET ? WHERE id=?", [setData, id], function (error, result) {
    if (error) {
      console.log(error);
      return helper.response(response, 'fail', 'Internal Server Error', result, 500);
    };

    const updateData = {
      ...id,
      ...setData
    };
    return helper.response(response, 'success', updateData, 200);
  });
});

app.delete("/products/:id", function (request, response) {
  const id = request.params.id;
  connection.query("DELETE FROM products WHERE id=?", id, function (error, result) {
    if (error) {
      console.log(error);
      return helper.response(response, 'fail', 'Internal Server Error', result, 500);
    };

    const deleteData = {
      ...id
    };
    return helper.response(response, 'success', deleteData, 200);
  });
});

app.listen(3000, function () {
  console.log("posApp-Api Runing At Port 3000!");
});