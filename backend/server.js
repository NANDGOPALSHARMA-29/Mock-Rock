const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const interviewRoutes = require("./routes/interviewRoutes");


app.use(cors());
app.use(express.json());

app.use("/api/interview", interviewRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Mock & Rock Backend is running!"
    });
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});