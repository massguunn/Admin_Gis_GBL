// Definisi Library yang digunakan
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("req-flash");
const app = express();
const methodOverride = require("method-override");

//mengunakan method override
app.use(methodOverride("_method"));

// Definisi lokasi file router
const loginRoutes = require("./src/routes/router-login");
const registerRoutes = require("./src/routes/router-register");
const appRoutes = require("./src/routes/router-app");
const adminRoutes = require("./src/routes/router-admin");
const alatMusikRoutes = require("./src/routes/router-alatMusik");

// Configurasi dan gunakan library
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware untuk menyajikan file statis (tanpa prefix /public)
app.use(express.static(path.join(__dirname, "public")));
console.log("Serving static files from:", path.join(__dirname, "public"));

// Configurasi library session
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "t@1k0ch3ng",
    name: "secretName",
    cookie: {
      sameSite: true,
      maxAge: 600000,
    },
  })
);

app.use(flash());

// Setting folder views
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

// Gunakan routes yang telah didefinisikan
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/", appRoutes);
app.use("/", adminRoutes);
app.use("/alatMusik", alatMusikRoutes);
app.use((req, res, next) => {
  res.locals.url = req.protocol + "://" + req.get("host");
  next();
});

// Jalankan server
app.listen(3000, () => {
  console.log("Server Berjalan di Port : " + 3000);
});
