const express = require('express');
const mongoose = require("mongoose");
const dotenv = require('dotenv'); 
const cookieParser = require("cookie-parser");
const cors = require("cors");

// app.use(express.json());

dotenv.config();

const app = express();

//set up server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`You application is running in ${PORT}`);
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials:true,
}));

// connect mongoDB
mongoose.connect(process.env.MDB_CONNECT,{
            useNewUrlParser: true, // d tute
            useCreateIndex: true,
            useUnifiedTopology: true
}, (err) => {
    if (err) return console.error(err);
    console.log('Connected to MongoDB');
} );

// set up routes
app.use("/auth", require("./routes/userRouter"));
app.use("/project", require("./routes/projectRouter"));



