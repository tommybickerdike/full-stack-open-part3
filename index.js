const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
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

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

const generateId = () => {
	return Math.floor(Math.random() * (100000000000 - 1));
};

app.get("/api/persons", (request, result) => {
	result.json(persons);
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

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((person) => person.id !== id);

	response.status(204).end();
});

app.post("/api/persons", (request, response) => {
	const body = request.body;

	const newPerson = {
		id: generateId(),
		name: body.name,
		number: body.number,
	};

	const checkDuplicate = persons.find((person) => person.name === body.name);

	if (!newPerson.name || !newPerson.number) {
		response.status(400);
		response.json({ error: "Missing name and/or number" });
	} else if (checkDuplicate) {
		response.status(400);
		response.json({ error: "Name already exists" });
	} else {
		persons = persons.concat(newPerson);
		response.status(201);
		response.json(newPerson);
	}
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
