"use strict";

var _express = _interopRequireDefault(require("express"));

var _mysql = _interopRequireDefault(require("mysql"));

var _cors = _interopRequireDefault(require("cors"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _multer = _interopRequireDefault(require("multer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use((0, _cors["default"])({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));
app.use((0, _cookieParser["default"])());
app.use(_express["default"].json());
app.use(_express["default"]["static"]('public'));

var connection = _mysql["default"].createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "signup"
});

var storage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now().toString() + "_" + file.originalname);
  }
});

var fileFilter = function fileFilter(req, file, cb) {
  var allowedFormats = ['image/png', 'image/jpg', 'image/jpeg'];

  if (allowedFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = (0, _multer["default"])({
  storage: storage,
  fileFilter: fileFilter
});
connection.connect(function (err) {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }

  console.log('Successful connection to the database.');
});
app.get('/getEmployee', function (req, res) {
  var sql = "SELECT * FROM employee";
  connection.query(sql, function (err, result) {
    if (err) return res.json({
      Error: "Get employee error in sql"
    });
    return res.json({
      Status: "Success",
      Result: result
    });
  });
});
app.get('/get/:id', function (req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM employee where id = ?";
  connection.query(sql, [id], function (err, result) {
    if (err) return res.json({
      Error: "Get employee error in sql"
    });
    return res.json({
      Status: "Success",
      Result: result
    });
  });
});
app.put('/update/:id', function (req, res) {
  var id = req.params.id;
  var salary = req.body.salary;
  var sql = "UPDATE employee SET salary = ? WHERE id = ?";
  connection.query(sql, [salary, id], function (err, result) {
    if (err) return res.json({
      Error: "Update employee error in SQL"
    });
    return res.json({
      Status: "Success"
    });
  });
});
app["delete"]('/delete/:id', function (req, res) {
  var id = req.params.id;
  var sql = "DELETE FROM employee WHERE id = ?";
  connection.query(sql, [id], function (err, result) {
    if (err) {
      return res.status(500).json({
        Error: "Delete employee error in SQL"
      });
    }

    return res.json({
      status: "Success"
    });
  });
});

var verifyUser = function verifyUser(req, res, next) {
  var token = req.cookies.token;

  if (!token) {
    return res.json({
      Error: "You are no Authenticated"
    });
  } else {
    _jsonwebtoken["default"].verify(token, "jwt-secret-key", function (err, decoded) {
      if (err) return res.json({
        Error: "Token wrong"
      });
      req.role = decoded.role;
      req.id = decoded.id;
      next();
    });
  }
};

app.get('/dashboard', verifyUser, function (req, res) {
  return res.json({
    Status: "Success",
    role: req.role,
    id: req.id
  });
});
app.get('/adminCount', function (req, res) {
  var sql = "Select count(id) as admin from users";
  connection.query(sql, function (err, result) {
    if (err) return res.json({
      Error: "Error in running query"
    });
    return res.json(result);
  });
});
app.get('/employeeCount', function (req, res) {
  var sql = "Select count(id) as employee from employee";
  connection.query(sql, function (err, result) {
    if (err) return res.json({
      Error: "Error in runnig query"
    });
    return res.json(result);
  });
});
app.get('/salary', function (req, res) {
  var sql = "Select sum(salary) as sumOfSalary from employee";
  connection.query(sql, function (err, result) {
    if (err) return res.json({
      Error: "Error in running query"
    });
    return res.json(result);
  });
});
app.post('/login', function (req, res) {
  var sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  connection.query(sql, [req.body.email, req.body.password], function (err, result) {
    if (err) return res.json({
      Status: "Error",
      Error: "Error in running query"
    });

    if (result.length > 0) {
      var id = result[0].id;

      var token = _jsonwebtoken["default"].sign({
        role: "admin"
      }, "jwt-secret-key", {
        expiresIn: '1d'
      });

      res.cookie('token', token);
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
app.post('/employeelogin', function (req, res) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;

  if (!email || !password) {
    return res.status(400).json({
      Status: "Error",
      Error: "Email and password are required"
    });
  }

  var sql = "SELECT * FROM employee WHERE email = ?";
  connection.query(sql, [email], function (err, result) {
    if (err) {
      return res.status(500).json({
        Status: "Error",
        Error: "Error in running query"
      });
    }

    if (result.length > 0) {
      _bcrypt["default"].compare(password.toString(), result[0].password, function (err, response) {
        if (err) {
          return res.status(500).json({
            Status: "Error",
            Error: "password error"
          });
        }

        if (response) {
          var token = _jsonwebtoken["default"].sign({
            id: result[0].id
          }, "jwt-secret-key", {
            expiresIn: '3d'
          });

          res.cookie('token', token);
          return res.json({
            Status: "Success",
            id: result[0].id
          });
        } else {
          var errorMessage = "Wrong Email or Password";
          return res.status(401).json({
            Status: "Error",
            Error: "Wrong Email or Password"
          });
        }
      });
    } else {
      var errorMessage = "Wrong Email or  Password";
      return res.status(401).json({
        Status: "Error",
        Error: "Wrong Email or Password"
      });
    }
  });
}); // app.get('/employee/:id', (req, res) => {
//     const id = req.params.id;
//     const sql = "SELECT * FROM employee where id = ?";
//     connection.query(sql, [id], (err, result) => {
//         if(err) return res.json({Error: "Get employee error in sql"});
//         return res.json({Status: "Success", Result: result})
//     })
// })

app.get('/profile', function (req, res) {
  var email = req.query.email;
  var sql = 'SELECT * FROM users WHERE email = ? AND (role = "admin" OR role = "funcionario")';
  connection.query(sql, [email], function (err, result) {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({
        error: 'Error in profile'
      });
    }

    if (result.length > 0) {
      var profile = {
        email: result[0].email,
        role: result[0].role
      };
      return res.json(profile);
    } else {
      return res.status(404).json({
        error: 'Profile not found.'
      });
    }
  });
});
app.get('/logout', function (req, res) {
  res.clearCookie('token');
  return res.json({
    Status: "Success"
  });
});
app.post('/create', upload.single('image'), function _callee(req, res) {
  var _req$body2, name, email, password, address, salary, image, sql, values;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body2 = req.body, name = _req$body2.name, email = _req$body2.email, password = _req$body2.password, address = _req$body2.address, salary = _req$body2.salary;
          image = req.file.filename;
          sql = "INSERT INTO employee (`name`, `email`, `password`, `address`, `salary`, `image`) VALUES (?, ?, ?, ?, ?, ?)";
          values = [name, email, password, address, salary, image];
          connection.query(sql, values, function (error, results, fields) {
            if (error) {
              console.error('Error inserting data: ' + error.stack);
              return res.status(400).json({
                erro: true,
                mensagem: "Error inserting data into database."
              });
            }

            return res.status(200).json({
              erro: false,
              mensagem: "Upload and insertion of data successfully completed!"
            });
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.listen(8080, function () {
  console.log("Server running on port 8080");
});