const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const conn = require("./db");
const userSignupRoutes = require("./routes/signup");
const userSigninRoutes = require("./routes/signin");
const userPostRoutes = require("./routes/post");
const userRoutes = require("./routes/search")
const followingusercontent = require('./routes/followingcontent')



conn();

const app = express();
app.use(bodyParser.json());
app.use(cors());



app.use("/signup", userSignupRoutes);
app.use("/signin", userSigninRoutes);
app.use("/post", userPostRoutes);
app.use('/user',userRoutes)
app.use('/followinguser',followingusercontent)





app.listen('3001',()=>{
  console.log(`Server is running `);
})