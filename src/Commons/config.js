const dotenv = require("dotenv");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(process.cwd(), ".test.env") });
} else {
  dotenv.config();
}

const config = {
  database: {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
  },

  app: {
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    port: process.env.PORT,
    debug: process.env.NODE_ENV === "development" ? { request: ["error"] } : {},
  },
};

module.exports = config;
