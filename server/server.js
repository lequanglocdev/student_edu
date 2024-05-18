require("dotenv").config();
const cors = require("cors");
const express = require('express')
const dbConnect = require("./config/dbConnect");
const  cookieParser = require("cookie-parser")

const authRoute = require("./routes/auth")

const userRoute = require("./routes/user")
const courseRoute = require("./routes/course")
const app = express();
const port = process.env.PORT || 8888;
app.use(cors());

// đọc hiểu data mà client gửi lên
app.use(express.json());

app.use(cookieParser())
dbConnect();

app.listen(port, () => {
  console.log("Server is running on port", port);
});


app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)
app.use("/api/course",courseRoute)


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