import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + "_" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFormats = ['image/png', 'image/jpg', 'image/jpeg'];
  if (allowedFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

pool.getConnection((err, conn) => {
  if (err) console.error(err);
  console.log("Connected successfully");
});

app.get('/getEmployee', (req, res) => {
  const sql = "SELECT * FROM employee";
  new Promise((resolve, reject) => {
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  })
    .then(result => {
      return res.json({ Status: "Success", Result: result });
    })
    .catch(error => {
      return res.json({ Error: "Get employee error in SQL" });
    });
});

app.get('/get/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee where id = ?";
  new Promise((resolve, reject) => {
    pool.query(sql, [id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  })
    .then(result => {
      return res.json({ Status: "Success", Result: result });
    })
    .catch(error => {
      return res.json({ Error: "Get employee error in SQL" });
    });
});

app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const salary = req.body.salary;
  const sql = "UPDATE employee SET salary = ? WHERE id = ?";
  new Promise((resolve, reject) => {
    pool.query(sql, [salary, id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  })
    .then(() => {
      return res.json({ Status: "Success" });
    })
    .catch(error => {
      return res.json({ Error: "Update employee error in SQL" });
    });
});

app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM employee WHERE id = ?";
  new Promise((resolve, reject) => {
    pool.query(sql, [id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  })
    .then(() => {
      return res.json({ status: "Success" });
    })
    .catch(error => {
      return res.status(500).json({ Error: "Delete employee error in SQL" });
    });
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) return res.json({ Error: "Token wrong" });
      req.role = decoded.role;
      req.id = decoded.id;
      next();
    });
  }
};

app.get('/dashboard', verifyUser, (req, res) => {
  return res.json({ Status: "Success", role: req.role, id: req.id });
});

app.get('/adminCount', (req, res) => {
    const sql = "SELECT COUNT(id) AS admin FROM users";
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ Error: "Error in running query" });
      }
      return res.json(result);
    });
  });
  
  app.get('/employeeCount', (req, res) => {
    const sql = "SELECT COUNT(id) AS employee FROM employee";
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ Error: "Error in running query" });
      }
      return res.json(result);
    });
  });
  
  app.get('/salary', (req, res) => {
    const sql = "SELECT SUM(salary) AS sumOfSalary FROM employee";
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ Error: "Error in running query" });
      }
      return res.json(result);
    });
  });
  

app.post('/login', (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  new Promise((resolve, reject) => {
    pool.query(sql, [req.body.email, req.body.password], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  })
    .then(result => {
      if (result.length > 0) {
        bcrypt.compare(req.body.password.toString(), result[0].password, (err, response) => {
          if (err) return res.json({ Error: "Password error" });
          const id = result[0].id;
          const token = jwt.sign({ role: "admin" }, "jwt-secret-key", { expiresIn: '1d' });
          res.cookie('token', token);
          return res.json({ Status: "Success" });
        });
      } else {
        return res.json({ Status: "Error", Error: "Wrong Email or Password" });
      }
    })
    .catch(error => {
      return res.json({ Status: "Error", Error: "Error in running query" });
    });
});

app.post('/employeelogin', (req, res) => {
  const sql = "SELECT * FROM employee WHERE email = ?";
  new Promise((resolve, reject) => {
    pool.query(sql, [req.body.email], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  })
    .then(result => {
      if (result.length > 0) {
        bcrypt.compare(req.body.password.toString(), result[0].password, (err, response) => {
          if (err) return res.json({ Error: "Password error" });
          const token = jwt.sign({ id: result[0].id }, "jwt-secret-key", { expiresIn: '1d' });
          res.cookie('token', token);
          return res.json({ Status: "Success", id: result[0].id });
        });
      } else {
        return res.json({ Status: "Error", Error: "Wrong Email or Password" });
      }
    })
    .catch(error => {
      return res.json({ Status: "Error", Error: "Error in running query" });
    });
});

app.get('/profile', (req, res) => {
    const email = req.query.email;
    const sql = 'SELECT * FROM users WHERE email = ?';
    pool.query(sql, [email], (err, result) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Error in profile' });
      }
  
      if (result.length > 0) {
        const profile = {
          email: result[0].email,
          role: result[0].role
        };
        return res.json(profile);
      } else {
        return res.status(404).json({ error: 'Profile not found.' });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error in profile' });
    });
  });
  
  

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: "Success" });
});

app.post('/create', upload.single('image'), async (req, res) => {
  const { name, email, password, address, salary } = req.body;
  const image = req.file.filename;

  const sql = "INSERT INTO employee (`name`, `email`, `password`, `address`, `salary`, `image`) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [name, email, password, address, salary, image];

  new Promise((resolve, reject) => {
    pool.query(sql, values, (error, results, fields) => {
      if (error) reject(error);
      resolve(results);
    });
  })
    .then(() => {
      return res.status(200).json({
        error: false,
        message: "Upload and insertion of data successfully completed!"
      });
    })
    .catch(error => {
      console.error('Error inserting data: ' + error.stack);
      return res.status(400).json({
        error: true,
        message: "Error inserting data into the database."
      });
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default pool;
