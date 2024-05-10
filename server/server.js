require("dotenv").config();
const cors = require("cors");
const express = require("express");
const dbConnect = require("./src/config/dbConnect");
const cookieParrser = require("cookie-parser");
const authRoute = require("./src/routes/auth")

const app = express();
app.use(cookieParrser());
const port = process.env.PORT || 8888;
app.use(cors());

// đọc hiểu data mà client gửi lên
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();

app.use("/", (req, res) => {
  res.send("Server success");
});
app.listen(port, () => {
  console.log("Server running on the port:", +port);
});

app.use("api/auth",authRoute)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err,req,res,next)=>{
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'
  res.status(statusCode).json({
    success:false,
    statusCode,
    message
  })
})