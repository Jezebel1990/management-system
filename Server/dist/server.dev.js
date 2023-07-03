"use strict";

var _express = _interopRequireDefault(require("express"));

var _mysql = _interopRequireDefault(require("mysql"));

var _cors = _interopRequireDefault(require("cors"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use((0, _cookieParser["default"])());
app.use(_express["default"].json());

var connection = _mysql["default"].createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'signup'
});

connection.connect(function (err) {
  if (err) {
    console.error("Error in Connection");
  } else {
    console.log("Connected");
  }
});
app.post('/login', function (req, res) {
  var sql = "SELECT * FROM users Where email = ?, AND password = ?";
  con.query(sql, [req.body.email, req.body.password], function (err, result) {
    if (err) return res.json({
      Status: "Error"
    });

    if (result.length > 0) {
      return res.json({
        Status: "Success"
      });
    } else {
      return res.json({
        Status: "Error",
        Error: "Wrong Email or Password"
      });
    }
  });
});
app.listen(8080, function () {
  console.log("Running");
});