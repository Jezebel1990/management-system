import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'jsonwebtoken'

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'je245b13',
    database: 'signup'
})

connection.connect(function(err) {
    if(err) {
        console.error("Error in Connection");
    } else {
        console.log("Connected");
    }
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users Where email = ?, AND password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
 if(err) return res.json({Status: "Error"});
 if(result.length > 0) {
    return res.json({Status: "Success"})
 } else {
    return res.json({Status: "Error", Error: "Wrong Email or Password"});
 }
    } )
})

app.listen(8081, () => {
    console.log("Running");
})