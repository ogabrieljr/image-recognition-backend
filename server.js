const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex")({
	client: "pg",
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: true
	}
});
const bcrypt = require("bcrypt-nodejs");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const Clarifai = require("clarifai");

knex.select("*").from("users");
// .then(data => console.log(data));

app.use(cors());
app.use(bodyParser.json());
app.listen(process.env.PORT || 3000);

const clarifaiApp = new Clarifai.App({
	apiKey: "de6c435c4bc94e4394563714d9928850"
});

app.post("/imageurl", (req, res) => {
	clarifaiApp.models
		.initModel({
			id: Clarifai.FACE_DETECT_MODEL
		})
		.then(generalModel => {
			return generalModel.predict(req.body.input);
		})
		.then(data => res.json(data));
});

app.get("/", (req, res) => res.json("its working"));

app.post("/signin", signin.handleSignin(knex, bcrypt));

app.post("/register", (req, res) =>
	register.handleRegister(req, res, knex, bcrypt)
);

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
