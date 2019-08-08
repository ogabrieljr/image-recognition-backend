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
		id: 1,
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
	database.users.forEach(user => {
		if (user.id === id) {
			res.json(user);
		} else {
			res.json("no user");
		}
	});
});

/*
res = working
signin = post = sucess/fail
register = post = user
profile/:userID = GET = user
image = PUT = user

*/
