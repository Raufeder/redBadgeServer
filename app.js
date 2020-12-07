require("dotenv").config();
const Express = require("express");
const db = require("./db");

const app = Express();

const user = require("./controllers/userController");
const admin = require("./controllers/adminController");
const route = require("./controllers/routeController");

const middlewares = require("./middleware");

app.use(middlewares.CORS);
app.use(Express.json());

app.use("/user", user);

app.use("/routes", middlewares.ValidateJWT, route);

app.use("/admin", middlewares.ValidateJWT, middlewares.Admin, admin);

app.get("/", (req, res) => {
    res.json({
      message: "Welcome to the to be named rock climbing app!",
    });
  });

  db.authenticate()
  .then(() => db.sync())
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log(`[server]: App is listening on localhost:${process.env.PORT}`);
    })
  )
  .catch((e) => {
    console.log("[server]: Server Crashed");
    console.log(e);
  });