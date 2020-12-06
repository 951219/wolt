const express = require('express');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});