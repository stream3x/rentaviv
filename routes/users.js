/**
 * Users API
 */

// Node Modules
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
// Config
const config = require('config');
// Models
const User = require('../models/User');
const e = require('express');
// const { json } = require('express');

// @route     POST api/users/register
// @desc      Register a user
// @access    Public
router.post(
	'/register',
	[
		check('firstname', 'Please enter your first name').notEmpty(),
		check('lastname', 'Please enter your last name').notEmpty(),
		check('address', 'Please enter your address').notEmpty(),
		check('zipCode', 'Please enter your zip code').notEmpty(),
		check('city', 'Please enter your city').notEmpty(),
		check('country', 'Please choose a country from the list').notEmpty(),
		check('phone', 'Please enter a valid phone number').isNumeric(),
		check('email', 'Please include a valid email').isEmail(),
		check('username', 'Please enter a username').notEmpty(),
		check('username', 'Username can not be longer than 16 characters').isLength({ max: 18 }),
		check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
		check('password', 'Your password can not be longer than 30 characters').isLength({ max: 30 })
	],
	async (req, res) => {
		// check if validation errors exist and response with 400 if true
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		// save request content
		const { firstname, lastname, address, zipCode, city, country, phone, email, username, password } = req.body;

		// create user and save to db
		try {
			// check if user already exists
			let emailExists = await User.findOne({ email });
			if (emailExists) {
				return res.status(400).json({ msg: 'Email already exists' });
			}

			// check if username already exists
			let existingUsername = await User.findOne({ username });
			if (existingUsername) {
				return res.status(400).json({ msg: 'Username is already taken' });
			}

			// instantiate new user
			user = new User({
				firstname,
				lastname,
				address,
				zipCode,
				city,
				country,
				phone,
				email,
				username,
				password
			});

			// hash password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);

			// save user
			await user.save();

			// create payload
			const payload = {
				user: {
					id: user.id
				}
			};

			// generate web token & send response
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: '1h'
				},
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);

			// catch error & send response
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ msg: 'Server Error' });
			res.status(500).send('Server Error');
		}
	}
);

// @route     GET api/users/check
// @desc      Check if user exists
// @access    Public
router.get('/check', async (req, res) => {
	// save request content
	const { email, username, id } = req.query;

	try {
		// search db for email username and id
		let emailRes;
		let usernameRes;
		let idRes;
		if (email) {
			emailRes = await User.findOne({ email });
		}
		if (username) {
			usernameRes = await User.findOne({ username });
		}
		if (ObjectId.isValid(id)) {
			idRes = await User.findById(id);
		} else if (id && !ObjectId.isValid(id)) {
			return res.status(400).json({ msg: 'User id is invalid' });
		}

		// response
		if (idRes) {
			res.json({ msg: 'User found' });
		} else if (emailRes && usernameRes) {
			res.json({ msg1: 'Email found', msg2: 'Username found' });
		} else if (emailRes) {
			res.json({ msg: 'Email found' });
		} else if (usernameRes) {
			res.json({ msg: 'Username found' });
		} else {
			return res.status(200).json({ msg: 'No user was found' });
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
		res.status(500).send('Server error');
	}
});

// @route     GET api/users/get
// @desc      Get user by id
// @access    Public
router.get('/get', async (req, res) => {
	// save request content
	const { id } = req.query;

	try {
		// search db id
		let user;
		if (ObjectId.isValid(id)) {
			user = await User.findById(id);
		} else {
			return res.status(400).json({ msg: 'User id is invalid' });
		}

		// send response
		if (!user) {
			return res.status(200).json({ msg: 'No user was found' });
		} else {
			// create payload
			const payload = {
				user: {
					_id: user._id,
					username: user.username,
					city: user.city,
					bio: user.bio,
					avatarUrl: user.avatarUrl,
					positiveKarma: user.positiveKarma,
					negativeKarma: user.negativeKarma,
					date: user.date
				}
			};
			// send response
			res.json(payload);
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
		res.status(500).send('Server error');
	}
});

// export router
module.exports = router;
