const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");
const MongoStore = require('connect-mongo'); // Use this if you want to store sessions in MongoDB


require("dotenv").config();

const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");



const db = require("./config/mongoose-connection");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    expressSession({
        resave: false,
        saveUnintialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET,

    })
);
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET || 'your-secret-key', // Set this in your .env file
    resave: false,
    saveUninitialized: false, // Set according to your use case
    store: new MongoStore({ url: process.env.MONGODB_URI }), // Ensure you have the right MongoDB URI
}));
app.use(flash());
app.use(express.static(path.join(__dirname, "public"))); // Corrected __dirname
app.set("view engine", "ejs");

app.use("/", indexRouter)
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
