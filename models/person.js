const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
	.connect(url)
	.then(() => {
		console.log("error connecting to:", url);
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

module.exports = mongoose.model("Person", personSchema);
