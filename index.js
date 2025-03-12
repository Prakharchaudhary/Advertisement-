const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");


require("dotenv").config();

const app = express();
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ limit: '4mb', extended: true }));
app.use(express.static("public"));
// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE", allowedHeaders: "Content-Type,Authorization" }));

// Connect Database
connectDB();

app.get("/", (req,res)=>{res.send("hell0")})
// Import Routes
const indivisual_Routes = require("./routes/indivisual_partner_route");
const company_partner_route = require("./routes/company_partner_route");

app.use("/api/indivisual", indivisual_Routes);
app.use("/api/company", company_partner_route);


// module.exports = app;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
