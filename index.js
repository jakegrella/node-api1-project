// 🌕   commonJS
const express = require('express');
const shortid = require('shortid');

const server = express();

// 🌕   CONFIGURE SERVER
server.use(express.json());

// 🌕   FAKE DATA
let users = [
	{
		id: shortid.generate(),
		name: 'Jane Doe',
		bio: "Not Tarzan's Wife, another Jane",
	},
];

// 🌕   HELPER FUNCTION
const User = {
	createNew(user) {
		const newUser = { id: shortid.generate(), ...user };
		users.push(newUser);
		return newUser;
	},
	getAll() {
		return users;
	},
	getById(id) {
		return users.find((user) => user.id === id);
	},
	delete(id) {
		const user = users.find((user) => user.id === id);
		if (user) users = users.filter((u) => u.id !== id);
		return user;
	},
	update(id, changes) {
		const user = users.find((user) => user.id === id);
		if (!user) return null;
		else {
			const updatedUser = { id, ...changes };
			users = users.map((u) => {
				if (u.id === id) return updatedUser;
				else return u;
			});
			return updatedUser;
		}
	},
};

// 🌕   ENDPOINTS
// post - creates user - /api/users
server.post('/api/users', (req, res) => {
	const user = req.body;
	if (!user.name || !user.bio) {
		res
			.status(400)
			.json({ errorMessage: 'Please provide name and bio for the user.' });
	} else if (user.name && user.bio) {
		const newUser = User.createNew(user);
		console.log('newUser', newUser);
		res.status(201).json(newUser);
	} else {
		res.status(500).json({
			errorMessage: 'There was an error while saving the user to the database.',
		});
	}
});

// get - returns all users - /api/users
server.get('/api/users', (req, res) => {
	const users = User.getAll();
	if (users.length) res.status(200).json(users);
	else
		res
			.status(500)
			.json({ errorMessage: 'The users information could not be retrieved.' });
});

// get - returns user with specified id - /api/users/:id
server.get('/api/users/:id', (req, res) => {
	const { id } = req.params;
	const user = User.getById(id);
	if (user) res.status(200).json(user);
	else if (!user)
		res
			.status(404)
			.json({ errorMessage: 'The user with the specified ID does not exist.' });
	else
		res
			.status(500)
			.json({ errorMessage: 'The user information could not be retrieved.' });
});

server.delete('/api/users/:id', (req, res) => {
	const { id } = params;
	const deleted = User.delete(id);

	if (deleted) {
		res.status(202).json(deleted);
	} else {
		res
			.status(404)
			.json({ message: 'The user with the specified ID does not exist.' });
	}
});

server.put('/api/users/:id', (req, res) => {
	const changes = req.body;
	const { id } = res.params;
	const updatedUser = User.update(id, changes);
	if (updatedUser) {
		res.status(200).json(updatedUser);
	} else {
		res
			.status(404)
			.json({ errorMessage: 'Please provide name and bio for the user.' });
	}
});

// catch-all
server.use('*', (req, res) => {
	res.status(404).json({ errorMessage: '404 catch-all' });
});

// 🌕   START SERVER
server.listen(5000, () => {
	console.log('listening on port 5000');
});
