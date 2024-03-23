const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRouter = require("./routes/user");
const searchRouter = require("./routes/search");
// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use("/user", userRouter)
app.use("/search", searchRouter)
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
