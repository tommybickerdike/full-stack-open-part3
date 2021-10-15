require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use(
	morgan(function (tokens, req, res) {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, "content-length"),
			"-",
			tokens["response-time"](req, res),
			"ms",
			tokens.response(req, res),
		].join(" ");
	})
);

morgan.token("response", function (request, response) {
	return JSON.stringify(request.body);
});

app.get("/api/persons", (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get("/api/info", (request, result) => {
	const timeStamp = new Date(Date.now());
	result.send(
		`<p>Phonebook has info for ${persons.length} people</p><p>${timeStamp}</p>`
	);
});

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((person) => person.id === id);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.delete("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
	const body = request.body;

	const newPerson = new Person({
		name: body.name,
		number: body.number,
	});

	if (newPerson.name === undefined || newPerson.number === undefined) {
		response.status(400);
		response.json({ error: "Missing name and/or number" });
	} else {
		newPerson.save().then((savedNote) => {
			response.status(201);
			response.json(savedNote);
		});
	}
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
