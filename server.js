require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors')
const app = express();

const PORT = process.env.PORT || 4000;


//database connection
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/admin',require('./Routes/route'));



app.use(errorHandler)

mongoose.connection.once("open", () => {
  console.log("Connected to mongodb");
  app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}...`);
  });
});
