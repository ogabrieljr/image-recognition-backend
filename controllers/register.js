const handleRegister = (req, res, knex, bcrypt) => {
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
};

module.exports = {
	handleRegister
};
