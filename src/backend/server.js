const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "admin",
  host: "localhost",
  password: "admin",
  database: "test",
});

db.connect();

/* Middleware for Authenticating User Token */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt.decode(token);
  // console.log("Token:", token);
  // console.log("Decoded Token:", decodedToken);
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      // console.log(err);
      return res.sendStatus(403);
    } else {
      // console.log(user);
      req.user = user;
      next();
    }
  });
}

app.post("/register-customer", (req, res) => {
  let mem_password = req.body.mem_password;
  db.beginTransaction((err) => {
    if (err) {
      res.json({
        status: "400",
        message: "Error starting transaction",
      });
    }
    bcrypt.hash(mem_password, SALT_ROUNDS, (err, hash) => {
      const memberSql =
        "INSERT INTO member (mem_type, mem_username, mem_password) VALUES (?, ?, ?)";
      const memberValues = [0, req.body.mem_username, hash];

      db.query(memberSql, memberValues, (err, result) => {
        if (err) {
          db.rollback(() => {
            res.json({
              status: "400",
              message: "Error inserting data into member table",
            });
          });
        }

        const customerSql =
          "INSERT INTO customer (mem_id, cust_name, cust_Lname, cust_tel, cust_email) VALUES (?, ?, ?, ?,?)";
        const customerValues = [
          result.insertId,
          req.body.cust_name,
          req.body.cust_Lname,
          req.body.cust_tel,
          req.body.cust_email,
        ];

        db.query(customerSql, customerValues, (err, result) => {
          if (err) {
            db.rollback(() => {
              res.json({
                status: "400",
                message: "Error inserting data into customer table",
              });
            });
          }

          db.commit((err) => {
            if (err) {
              db.rollback(() => {
                res.json({
                  status: "400",
                  message: "Error committing transaction",
                });
              });
            }

            res.json({
              status: "200",
              message: "Insertion member and customer successful",
            });
          });
        });
      });
    });
  });
});

app.post("/register-ownerstore", (req, res) => {
  db.beginTransaction((err) => {
    if (err) {
      res.json({
        status: "400",
        message: "Error starting transaction",
      });
    }

    const memberSql =
      "INSERT INTO member (mem_type, mem_username, mem_password) VALUES (?, ?, ?)";
    const memberValues = [1, req.body.mem_username, req.body.mem_password];

    db.query(memberSql, memberValues, (err, result) => {
      if (err) {
        db.rollback(() => {
          res.json({
            status: "400",
            message: "Error inserting data into member table",
          });
        });
      }

      const ownerstoreSql =
        "INSERT INTO ownerstore (mem_id, owner_name, ower_Lname, owner_tel, owner_email) VALUES (?, ?, ?, ?,?)";
      const ownerstoreValues = [
        result.insertId,
        req.body.owner_name,
        req.body.ower_Lname,
        req.body.owner_tel,
        req.body.owner_email,
      ];

      db.query(ownerstoreSql, ownerstoreValues, (err, result) => {
        if (err) {
          db.rollback(() => {
            res.json({
              status: "400",
              message: "Error inserting data into ownerstore table",
            });
          });
        }

        db.commit((err) => {
          if (err) {
            db.rollback(() => {
              res.json({
                status: "400",
                message: "Error committing transaction",
              });
            });
          }

          res.json({
            status: "200",
            message: "Insertion member and ownerstore successful",
          });
        });
      });
    });
  });
});

/* API for Processing Runner Authorization */
app.post("/login", (req, res) => {
  let username = req.body.mem_username;
  let user_password = req.body.mem_password;
  let query = `SELECT * FROM member WHERE mem_username = '${username}'`;
  db.query(query, (err, rows) => {
    if (err) {
      console.log(err);
      res.json({
        status: "400",
        message: "Error querying from test db",
      });
    } else {
      let db_password = rows[0].mem_password;
      bcrypt.compare(user_password, db_password, (err, result) => {
        if (result) {
          let payload = {
            mem_type: rows[0].mem_type,
            mem_id: rows[0].mem_id,
            mem_username: rows[0].mem_username,
          };
          // console.log(payload);
          let token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" });
          res.send({ token });
        } else {
          console.log(err);
          res.send("Invalid username / password");
        }
      });
    }
  });
});

app.get("/members-check-username", (req, res) => {
  let mem_username = req.query.mem_username;
  db.query(
    `SELECT mem_username FROM member where mem_username="${mem_username}"`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/profile", authenticateToken, (req, res) => {
  let mem_id = req.user.mem_id;
  db.query(`SELECT * FROM customer where mem_id=${mem_id}`, (err, result) => {
    if (result) {
      res.send(result[0]);
      // console.log(result[0]);
    } else {
      // console.log(err);
      res.send(err.data);
    }
  });
});

app.get("/store", (req, res) => {
  db.query(`SELECT * FROM store`, (err, result) => {
    if (result) {
      // console.log(result);
      res.send(result);
      // console.log(result[0]);
    } else {
      // console.log(err);
      res.send(err.data);
    }
  });
});

app.post("/store-filter1", (req, res) => {
  let type = req.body.type;
  db.query(`SELECT * FROM store Where store_religion='${type}'`, (err, result) => {
    if (result) {
      // console.log(result);
      res.send(result);
      // console.log(result[0]);
    } else {
      // console.log(err);
      res.send(err.data);
    }
  });
});

app.listen(port, () => {
  console.log("CORS-enabled web server listening on port 4000");
});
