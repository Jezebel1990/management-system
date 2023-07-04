import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';


const app = express();
app.use(cors(
{
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}
));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "signup"
})



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null,Date.now().toString() + "_" + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFormats = ['image/png', 'image/jpg', 'image/jpeg'];
    if(allowedFormats.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
 };


const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});



connection.connect(function(err) {
    if (err) {
      console.error('Error connecting to database: ' + err.stack);
      return;
    }
    console.log('Successful connection to the database.');
  });
  

app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM employee";
    connection.query(sql, (err, result) => {
        if(err) return res.json({ Error: "Get employee error in sql" });
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?";
    connection.query(sql, [id], (err, result) => {
        if(err) return res.json({ Error: "Get employee error in sql" });
        return res.json({Status: "Success", Result: result})
    })
})

app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const salary = req.body.salary;
    const sql = "UPDATE employee SET salary = ? WHERE id = ?";
    connection.query(sql, [salary, id], (err, result) => {
        if(err) return res.json({ Error: "Update employee error in SQL" });
        return res.json({Status: "Success"}) 
   })
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM employee WHERE id = ?";
    connection.query(sql, [id], (err, result) => {
        if(err) {
        return res.status(500).json({ Error: "Delete employee error in SQL" });
        }
        return res.json({ status: "Success" });
    } );
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({ Error: "You are no Authenticated" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) return res.json({Error: "Token wrong"});
            req.role = decoded.role;
            req.id = decoded.id;
            next();
        }
        )
    }

}

app.get('/dashboard',verifyUser, (req, res) => {
  return res.json({Status: "Success", role: req.role, id: req.id})
})
app.get('/adminCount', (req, res) => {
    const sql = "Select count(id) as admin from users";
    connection.query(sql, (err, result) => {
        if(err) return res.json({ Error: "Error in running query" });
        return res.json(result);
    })
})

app.get('/employeeCount', (req, res) => {
    const sql = "Select count(id) as employee from employee";
    connection.query(sql, (err, result) => {
        if(err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/salary',(req, res) => {
    const sql = "Select sum(salary) as sumOfSalary from employee";
    connection.query(sql, (err, result) => {
        if(err) return res.json({ Error: "Error in running query" });
        return res.json(result);
    })
})


app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    connection.query(sql, [req.body.email, req.body.password], (err, result) => {
    if(err) return res.json({ Status: "Error", Error: "Error in running query" });
    if(result.length > 0) {
        const id = result[0].id;
        const token = jwt.sign({ role: "admin" }, "jwt-secret-key", { expiresIn: '1d' });
        res.cookie('token', token);
        return res.json({ Status: "Success" })
        } else {
        return res.json({ Status: "Error", Error: "Wrong Email or Password" });
 }
    });
});

app.post('/employeelogin', (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
    return res.status(400).json({ Status: "Error", Error: "Email and password are required" });
   }

    const sql = "SELECT * FROM employee WHERE email = ?";
    connection.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ Status: "Error", Error: "Error in running query" });
        }
        if (result.length > 0) {
            bcrypt.compare(password.toString(), result[0].password, (err, response) => {
                if (err) {
                    return res.status(500).json({ Status: "Error", Error: "password error" });
                }
                if (response) {
                    const token = jwt.sign({ id: result[0].id }, "jwt-secret-key", { expiresIn: '3d' });
                    res.cookie('token', token);
                    return res.json({ Status: "Success", id: result[0].id });
                } else {
                    const errorMessage = "Wrong Email or Password";
                    return res.status(401).json({ Status: "Error", Error: "Wrong Email or Password" });
                }
            });
        } else {
            const errorMessage = "Wrong Email or  Password";
            return res.status(401).json({ Status: "Error", Error: "Wrong Email or Password" });
        }
    });
});



// app.get('/employee/:id', (req, res) => {
//     const id = req.params.id;
//     const sql = "SELECT * FROM employee where id = ?";
//     connection.query(sql, [id], (err, result) => {
//         if(err) return res.json({Error: "Get employee error in sql"});
//         return res.json({Status: "Success", Result: result})
//     })
// })


app.get('/profile', (req, res) => {
    const email = req.query.email;
    const sql = 'SELECT * FROM users WHERE email = ? AND (role = "admin" OR role = "funcionario")';
    connection.query(sql, [email], (err, result) => {
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
      });
    });



app.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({Status: "Success"});
})


app.post('/create', upload.single('image'),async (req, res) => {
  const { name, email, password, address, salary} = req.body;
  const image = req.file.filename;

  const sql = "INSERT INTO employee (`name`, `email`, `password`, `address`, `salary`, `image`) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [name, email, password, address, salary, image];

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
});


app.listen(8080, () => {
    console.log("Server running on port 8080");
});