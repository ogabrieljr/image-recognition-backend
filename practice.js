const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex")({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "postgres",
		password: "1234",
		database: "image-recognition"
	}
});
const bcrypt = require("bcrypt-nodejs");

knex.select("*").from("users");
// .then(data => console.log(data));

app.use(cors());
app.use(bodyParser.json());
app.listen(3000);

app.get("", (req, res) => {
	res.json(database.users);
});
app.post("/signin", (req, res) => {
	knex
		.select("email", "hash")
		.from("login")
		.where("email", "=", req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return knex
					.select("*")
					.from("users")
					.where("email", "=", req.body.email)
					.then(user => {
						res.json(user[0]);
					})
					.catch(err => res.status(400).json("unable to get user"));
			} else {
				res.status(400).json("wrong");
			}
		})
		.catch(err => res.status(400).json("wrong"));
});
app.post("/register", (req, res) => {
	const { name, email, password } = req.body;
	const hash = bcrypt.hashSync(password);
	knex
		.transaction(trx => {
			trx
				.insert({
					hash: hash,
					email: email
				})
				.into("login")
				.returning("email")
				.then(loginEmail => {
					return trx("users")
						.returning("*")
						.insert({
							name,
							email: loginEmail[0],
							joined: new Date()
						})
						.then(user => {
							res.json(user[0]);
						});
				})
				.then(trx.commit)
				.catch(trx.rollback);
		})
		.catch(err => res.status(400).json("unable to register"));
});
app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	knex
		.select("*")
		.from("users")
		.where({
			id: id
		})
		.then(user => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json("not found");
			}
		});
});
app.put("/image", (req, res) => {
	const { id } = req.body;
	knex("users")
		.where("id", "=", id)
		.increment("entries", 1)
		.returning("entries")
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json("not ok"));
});
