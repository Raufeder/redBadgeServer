require("dotenv").config();
const Express = require("express");
const db = require("./db");

const app = Express();

const user = require("./controllers/userController");

const middlewares = require("./middleware");

const controllers = require("./controllers");

app.use(middlewares.CORS);
app.use(Express.json());

app.use("/user", user);

// app.use("/route", middlewares.ValidateJWT, controllers.Route); 

app.use("/admin", middlewares.ValidateJWT, middlewares.Admin, controllers.Admin)

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