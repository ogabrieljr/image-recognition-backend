const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.listen(3000);
const database = {
	users: [
		{
			id: "1",
			name: "NAME",
			email: "EMAIL",
			password: "PASSWORD",
			entries: 0,
			joined: new Date()
		},
		{
			id: "2",
			name: "NAME2",
			email: "EMAIL2",
			password: "PASSWORD2",
			entries: 0,
			joined: new Date()
		}
	]
};
app.get("", (req, res) => {
	res.json(database.users);
});
app.post("/signin", (req, res) => {
	const { name, password } = req.body;
	if (
		name === database.users[0].name &&
		password === database.users[0].password
	) {
		res.json("ok");
	} else {
		res.status(400).json("not found");
	}
});
app.post("/register", (req, res) => {
	const { name, email, password } = req.body;
	database.users.push({
		id: 3,
		name,
		email,
		password,
		entries: 0,
		joined: new Date()
	});
	res.json(database.users[database.users.length - 1]);
});
app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	for (const i of database.users) {
		if (id === i.id) {
			return res.json(i);
		}
	}
	res.status(400).json("not found");
});
app.put("/images", (req, res) => {
	const { id } = req.body;
	for (const i of database.users) {
		if (id === i.id) {
			i.entries++;
			return res.json(i.entries);
		}
	}
	res.json("not found");
});
