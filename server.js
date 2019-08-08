const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
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

app.listen(3000, () => {
	console.log("listen");
});
app.get("", (req, resp) => {
	resp.send(database.users);
});
app.post("/signin", (req, resp) => {
	if (
		req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password
	) {
		resp.json("sucess");
	} else {
		resp.status(400).json("error");
	}
});
app.post("/register", (req, res) => {
	const { name, email, password } = req.body;
	database.users.push({
		id: "3",
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});
	res.json(database.users[database.users.length - 1]);
});
app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	});
	if (!found) {
		res.status(400).json("not found");
	}
});
app.post("/images", (req, res) => {
	database.users.forEach(user => {
		const { id } = req.body;
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!found) {
		res.status(400).json("not found");
	}
});
