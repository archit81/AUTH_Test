const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/routes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server Listening on port", PORT));

mongoose.connect(
	process.env.MONGODB_CONNECTION_STRING,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(err) => {
		if (err) throw err;
		else console.log("MongoDB connection established");
	}
);

app.use("/api", userRouter);
