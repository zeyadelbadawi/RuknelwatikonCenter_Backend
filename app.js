const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./db"); // Import the MongoDB connection
const cors = require("cors"); // Add this line

const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration: Allow frontend to access the backend
const corsOptions = {
  origin: "http://localhost:3000", // Change this URL to your frontend's URL
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions)); // Apply CORS with configured options

// Serve static files from the 'public' folder
app.use("/uploads/physical-therapy/exam",express.static(path.join(__dirname, 'uploads','physical-therapy','exam'))); 
app.use("/uploads/physical-therapy/plan",express.static(path.join(__dirname, 'uploads','physical-therapy','plan'))); 
app.use("/uploads/DRAST-7ALA/plan",express.static(path.join(__dirname, 'uploads','DRAST-7ALA','plan'))); 
app.use("/uploads/school-plan/plan",express.static(path.join(__dirname, 'uploads','school-plan','plan'))); 
app.use("/uploads/Speech/exam",express.static(path.join(__dirname, 'uploads','Speech','exam'))); 
app.use("/uploads/Speech/plan",express.static(path.join(__dirname, 'uploads','Speech','plan')));
app.use("/uploads/ABA/exam",express.static(path.join(__dirname, 'uploads','ABA','exam'))); 
app.use("/uploads/ABA/plan",express.static(path.join(__dirname, 'uploads','ABA','plan')));
app.use("/uploads/Occupational-therapy/exam",express.static(path.join(__dirname, 'uploads','Occupational-therapy','exam'))); 
app.use("/uploads/Occupational-therapy/plan",express.static(path.join(__dirname, 'uploads','Occupational-therapy','plan')));
app.use("/uploads/Special-Education/exam",express.static(path.join(__dirname, 'uploads','Special-Education','exam'))); 
app.use("/uploads/Special-Education/plan",express.static(path.join(__dirname, 'uploads','Special-Education','plan')));

// Middleware
app.use(express.static("public"));
app.use(expressLayouts);
app.set("layout", "./layout/layout");
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Set up views directory and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Static files
app.use("/css", express.static(__dirname + "public/css"));
app.use("/fonts", express.static(__dirname + "public/fonts"));
app.use("/images", express.static(__dirname + "public/images"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/webfonts", express.static(__dirname + "public/webfonts"));

// Import Router File & Define All Routes
const pageRouter = require("./routes/routes");
pageRouter(app); // Pass the app object to the pageRouter function

// Start the server
const PORT = process.env.PORT || 8070;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));