const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const url = process.env.MONGODB_URI;

mongoose
	.connect(url)
	.then(() => {
		console.log("connected to:", url);
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 3,
		unique: true,
	},
	number: {
		type: String,
		required: true,
		minLength: 8,
	},
});

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Person", personSchema);
