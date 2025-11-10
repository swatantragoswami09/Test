import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import postmanToOpenApi from "postman-to-openapi";
import mongoose from "mongoose";
import path from "path";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import passport from "passport";
import cookieSession from "cookie-session";
import keys from './config/keys'
import './services/passport'

// require("./cronFunds/cron");
const morgan = require("morgan");

require("dotenv").config();

const csrfProtection = csrf({ cookie: true });

// create express app
const app = express();

// db connection
mongoose
  // .connect(process.env.DATABASE, {
  .connect('mongodb://127.0.0.1:27017/edemy?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2', {
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
    // useCreateIndex: false,
  })
  .then(() => console.log("DB CONNECTED!!"))
  .catch((err) => console.log("DB CONNECTION ERROR->", err));

// apply middlewares
app.use(cors());
app.use(bodyParser.json({
  verify: function (req, res, buf) {
    req.rawBody = buf;
  }
}));
app.use(express.json({ limit: "1GB" }));
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log("this is middle ware");
  next();
});
app.use(cookieParser());

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

// route
readdirSync("./routes").map((r) => {
  app.use("/api", require(`./routes/${r}`));
});

// csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

//swagger Documentation
postmanToOpenApi(
  "postman/Edemy-API.postman_collection.json",
  path.join("postman/swagger.yml"),
  {
    defaultTag: "General",
  }
)
  .then((data) => {
    let result = YAML.load("postman/swagger.yml");
    result.servers[0].url = "/";
    app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(result));
  })
  .catch((e) => {
    console.log("Swagger Generation stopped due to some error");
  });

// port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
