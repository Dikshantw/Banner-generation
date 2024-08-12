require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 5000;
const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

const db = mysql.createConnection({
  host: db_host,
  user: db_user,
  password: db_password,
  database: db_name,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to the database.");
  }
});
app.post("/add_banner", (req, res) => {
  const sql = "INSERT INTO banner (`description`, `timer`) VALUES (?, ?)";
  const values = [req.body.description, req.body.timer];
  console.log("SQL Query:", sql);
  console.log("Values:", values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.json({ message: "Something unexpected has occurred: " + err });
    }
    return res.json({ success: "Banner added successfully" });
  });
});

app.get("/banners", (req, res) => {
  const sql = "SELECT * FROM banner";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.get("/get_banner/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM banner WHERE `id`= ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

app.post("/edit_banner/:id", (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE banner SET `description`=?, `timer`=? WHERE id=?";
  const values = [req.body.description, req.body.timer, id];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Banner updated successfully" });
  });
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM banner WHERE id=?";
  const values = [id];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Banner updated successfully" });
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port} `);
});
