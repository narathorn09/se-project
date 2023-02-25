const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
// app.use(express.static("./public"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "system_order",
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

// page RegisterCustomer ################################################################################################
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

// page RegisterOwnerStore ################################################################################################
app.post("/register-ownerstore", (req, res) => {
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
      const memberValues = [1, req.body.mem_username, hash];

      db.query(memberSql, memberValues, (err, result1) => {
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
          result1.insertId,
          req.body.owner_name,
          req.body.ower_Lname,
          req.body.owner_tel,
          req.body.owner_email,
        ];

        db.query(ownerstoreSql, ownerstoreValues, (err, result2) => {
          if (err) {
            db.rollback(() => {
              res.json({
                status: "400",
                message: "Error inserting data into ownerstore table",
              });
            });
          }
          // const mem_forkey_store = result
          const storeSql =
            "INSERT INTO store (mem_id, store_name, store_details, store_religion) VALUES (?, ?, ?, ?)";
          const storeValues = [
            result1.insertId,
            req.body.store_name,
            req.body.store_details,
            req.body.store_religion,
          ];

          db.query(storeSql, storeValues, (err, result) => {
            if (err) {
              db.rollback(() => {
                res.json({
                  status: "400",
                  message: "Error inserting data into store table",
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
  });
});

// page Login ################################################################################################
/* API for Processing Runner Authorization */
app.post("/login", (req, res) => {
  let username = req.body.mem_username;
  let user_password = req.body.mem_password;
  console.log("username", username);
  console.log("user_password", user_password);
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
      console.log("db_password", db_password);
      bcrypt.compare(user_password, db_password, (err, result) => {
        console.log("err", err);
        console.log("result", result);
        if (result) {
          let payload = {
            mem_type: rows[0].mem_type,
            mem_id: rows[0].mem_id,
            mem_username: rows[0].mem_username,
          };
          console.log("payload", payload);
          let token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" });
          res.send({ token });
        } else {
          // console.log("error", err);
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

app.post("/members-check-memtype", (req, res) => {
  let mem_username = req.body.mem_username;
  db.query(
    `SELECT mem_type FROM member where mem_username="${mem_username}"`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
// page Profile ################################################################################################
app.post("/profile", authenticateToken, (req, res) => {
  let type = req.body.type;
  let mem_id = req.user.mem_id;
  let query1 =
    type === "cust"
      ? `SELECT * FROM customer where mem_id=${mem_id}`
      : `SELECT * FROM ownerstore where mem_id=${mem_id}`;
  console.log(type);
  console.log(query1);
  db.query(query1, (err, result) => {
    if (result) {
      res.send(result[0]);
      // console.log(result[0]);
    } else {
      // console.log(err);
      res.send(err.data);
    }
  });
});
// page HomeCust ################################################################################################
app.post("/store-all", (req, res) => {
  let store_name = req.body.store_name;
  db.query(
    `SELECT * FROM store WHERE store_name LIKE '%${store_name}%'`,
    (err, result) => {
      if (result) {
        res.send(result);
      } else {
        res.send(err.data);
      }
    }
  );
});

app.post("/store-search", (req, res) => {
  let store_name = req.body.store_name;
  let store_religion = req.body.store_religion;
  db.query(
    `SELECT * FROM store WHERE store_name LIKE '%${store_name}%' and store_religion = '${store_religion}'`,
    (err, result) => {
      if (result) {
        res.send(result);
      } else {
        res.send(err.data);
      }
    }
  );
});

app.post("/store-select", (req, res) => {
  let store_id = req.body.store_id;
  console.log(store_id);
  db.query(`SELECT * FROM store where store_id=${store_id}`, (err, result) => {
    if (result) {
      console.log(result);
      res.send(result);
    } else {
      console.log(err);
      res.send(err.data);
    }
  });
});

app.post("/list-menu-store-select", (req, res) => {
  let store_id = req.body.store_id;
  console.log(store_id);
  db.query(`SELECT * FROM menu where store_id=${store_id}`, (err, result) => {
    if (result) {
      console.log(result);
      res.send(result);
    } else {
      console.log(err);
      res.send(err.data);
    }
  });
});

// app.get("/get-store-id"),authenticateToken, (req, res) => {
//     let mem_id = req.user.mem_id;
//     console.log(mem_id);
//     let getStoreId = `SELECT store_id FROM store where mem_id=${mem_id}`;
//     db.query(getStoreId, (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(result);
//         res.send("result" ,result);
//       }
//     });
//   };
// page Cart ################################################################################################
app.post("/cust-add-order", authenticateToken, (req, res) => {
  console.log(req.body[0].store_id);
  let mem_id = req.user.mem_id;

  db.beginTransaction((err) => {
    if (err) {
      res.json({
        status: "400",
        message: "Error starting transaction",
      });
    }
    let query1 = `SELECT cust_id FROM customer where mem_id=${mem_id}`;

    db.query(query1, (err, result1) => {
      if (err) {
        db.rollback(() => {
          res.json({
            status: "400",
            message: "Error get cust_id from customer table",
          });
        });
      }
      let total_price = req.query.total_price;
      let cust_id = result1[0].cust_id;
      let store_id = req.body[0].store_id;
      const orderSql =
        "INSERT INTO orders (cust_id, store_id, order_price, order_status, order_qwaiting, order_cookingstatus) VALUES (?, ?, ?, ?, ?, ?)";
      const orderValues = [cust_id, store_id, total_price, "0", 0, "0"];
      db.query(orderSql, orderValues, (err, result2) => {
        if (err) {
          db.rollback(() => {
            res.json({
              status: "400",
              message: "Error insert data into orders table",
            });
          });
        }
        let order_id = result2.insertId;
        const orderdetailSql =
          "INSERT INTO orderdetail (order_id , menu_id, menu_amount, menu_type) VALUES (?, ?, ?, ?)";
        let errorFlag = false; // flag to keep track of errors
        let numProcessed = 0; // counter to keep track of number of items processed
        for (let i = 0; i < req.body.length; i++) {
          let orderdetailValues = [
            order_id,
            req.body[i].menu_id,
            req.body[i].menu_num,
            req.body[i].menu_type,
          ];
          db.query(orderdetailSql, orderdetailValues, (err, results) => {
            if (err) {
              db.rollback(() => {
                errorFlag = true;
                res.json({
                  status: "400",
                  message: "Error inserting data into orderdetail table",
                });
              });
            }
            numProcessed++;
            if (numProcessed === req.body.length) {
              if (errorFlag) {
                db.rollback(() => {
                  return;
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
                  message: "Insertion order and orderdetail successful",
                });
              });
            }
          });
        }
      });
    });
  });
});
// page OrderCust ################################################################################################
app.post("/list-order", authenticateToken, (req, res) => {
  let mem_id = req.user.mem_id;
  db.beginTransaction((err) => {
    if (err) {
      res.json({
        status: "400",
        message: "Error starting transaction",
      });
    }
    let query1 = `SELECT cust_id FROM customer where mem_id=${mem_id}`;

    db.query(query1, (err, result1) => {
      if (err) {
        db.rollback(() => {
          res.json({
            status: "400",
            message: "Error get cust_id from customer table",
          });
        });
      }
      let cust_id = result1[0].cust_id;
      const listorderSql = `SELECT * FROM orders WHERE cust_id=${cust_id}`;
      db.query(listorderSql, (err, result2) => {
        if (err) {
          db.rollback(() => {
            res.json({
              status: "400",
              message: "Error get data from orders table",
            });
          });
        }
        console.log(result2);

        db.commit((err) => {
          if (err) {
            db.rollback(() => {
              res.json({
                status: "400",
                message: "Error committing transaction",
              });
            });
          }

          res.json(result2);
        });
      });
    });
  });
});

app.get("/orderdetail/:order_id", (req, res) => {
  let order_id = req.params.order_id;
  db.query(
    `SELECT * FROM orderdetail WHERE order_id=${order_id}`,
    (err, result) => {
      if (result) {
        res.send(result);
      } else {
        res.send(err.data);
      }
    }
  );
});

app.get("/menu-name/:menu_id", (req, res) => {
  let menu_id = req.params.menu_id;
  db.query(
    `SELECT menu_name FROM menu WHERE menu_id=${menu_id}`,
    (err, result) => {
      if (result) {
        res.send(result);
      } else {
        res.send(err.data);
      }
    }
  );
});

app.get("/store-name/:store_id", (req, res) => {
  let store_id = req.params.store_id;
  console.log("store_id =", store_id);
  db.query(
    `SELECT store_name FROM store WHERE store_id=${store_id}`,
    (err, result) => {
      if (result) {
        res.send(result);
      } else {
        res.send(err.data);
      }
    }
  );
});
// page stroe ################################################################################################

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "uploads/"); // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

app.post("/add-menu", authenticateToken, upload.single("file"), (req, res) => {
  let file = req.file?.filename
    ? req.file?.filename
    : "food default image.webp";
  let mem_id = req.user.mem_id;

  db.beginTransaction((err) => {
    if (err) {
      res.json({
        status: "400",
        message: "Error starting transaction",
      });
    }
    db.query(
      `SELECT store_id FROM store where mem_id=${mem_id}`,
      (err, result) => {
        let store_id = result[0].store_id;
        // console.log(store_id);
        if (err) {
          db.rollback(() => {
            res.json({
              status: "400",
              message: "Error get data from store table",
            });
          });
        }

        let addMenuSQL =
          "INSERT INTO menu (store_id ,menu_name, menu_price,menu_photo) VALUES (?, ?, ?,?)";
        let memberValues = [
          store_id,
          req.body.menu_name,
          req.body.menu_price,
          file,
        ];

        db.query(addMenuSQL, memberValues, (err, result) => {
          if (err) {
            db.rollback(() => {
              res.json({
                status: "400",
                message: "Error insert data into menu table",
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
              message: "Get store id and insertion menu successful",
            });
          });
        });
      }
    );
  });
});

app.delete("/delete-menu/:id", (req, res) => {
  let id = req.params.id;
  console.log("id", id);
  db.query(`DELETE FROM menu WHERE menu_id=${id}`, (err, result) => {
    if (result) {
      console.log(result);
      res.send(result);
    } else {
      console.log(err);
      res.send(err.data);
    }
  });
});

app.put(
  "/update-menu",
  authenticateToken,
  upload.single("file"),
  (req, res) => {
    console.log(req.body);
    const { menu_id, menu_name, menu_price, origin_filename } = req.body;
    let newPhto = req.file?.filename ? req.file?.filename : origin_filename;
    let query = `UPDATE menu SET menu_name = "${menu_name}", menu_price = ${menu_price}, menu_photo="${newPhto}" WHERE menu_id=${menu_id}`;
    console.log(query);
    db.query(query, (err, result) => {
      if (result) {
        // console.log(result);
        res.send(result);
        // console.log(result[0]);
      } else {
        // console.log(err);
        res.send(err.data);
      }
    });
  }
);

app.get("/store-detail", authenticateToken, (req, res) => {
  let mem_id = req.user.mem_id;
  db.query(`SELECT * FROM store where mem_id=${mem_id}`, (err, result) => {
    if (result) {
      console.log(result);
      res.send(result);
    } else {
      console.log(err);
      res.send(err.data);
    }
  });
});

app.get("/list-menu", authenticateToken, (req, res) => {
  let mem_id = req.user.mem_id;
  db.beginTransaction((err) => {
    if (err) {
      res.json({
        status: "400",
        message: "Error starting transaction",
      });
    }
    db.query(
      `SELECT store_id FROM store where mem_id=${mem_id}`,
      (err, result) => {
        let store_id = result[0].store_id;
        // console.log(store_id);
        if (err) {
          db.rollback(() => {
            res.json({
              status: "400",
              message: "Error get data from store table",
            });
          });
        }

        let getMenuSQL = `SELECT * FROM menu where store_id=${store_id}`;

        db.query(getMenuSQL, (err, result) => {
          if (err) {
            db.rollback(() => {
              res.json({
                status: "400",
                message: "Error get menu from menu table",
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
            res.send(result);
            // res.json({
            //   status: "200",
            //   message: "Get menu successful",
            // });
          });
        });
      }
    );
  });
});

app.listen(port, () => {
  console.log("CORS-enabled web server listening on port 4000");
});
