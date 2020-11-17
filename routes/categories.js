/**
 * Categories API
 */

// Node Modules
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { v1: uuidv1 } = require('uuid');
const _ = require('lodash');
// Middleware
const auth = require('../middleware/auth');
// Models
const User = require('../models/User');
const Category = require('../models/Category');
// Multer
const multer = require('multer');
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/uploads/img/categories');
	},
	filename: (req, file, cb) => {
		const fileExtension = file.mimetype.split('/');
		cb(null, uuidv1() + `.${fileExtension[1]}`);
	}
});
const fileFilter = (req, file, cb) => {
	// reject file
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 6
	},
	fileFilter: fileFilter
});

// @route     POST server/categories
// @desc      Create categories
// @access    Private
router.post(
	'/',
	[
		auth,
		upload.single('categoryImage'),
		check('title', 'Enter a category name').notEmpty(),
		check('description', 'Describe the category').notEmpty()
	],
	async (req, res) => {
		// check if validation errors exist and response with 400 if true
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		// save request content
		const title = req.body.title.toLowerCase();
		const description = req.body.description;
		let image;
		// save image path
		if (!req.file) {
			return res.status(400).json({ msg: 'Upload an image file' });
		} else {
			image = req.file.path;
		}

		try {
			// instantiate new category
			const category = new Category({
				image,
				title,
				description
			});

			// save category
			await category.save();

			// response
			res.json({ msg: `${category.title[0].toUpperCase() + category.title.slice(1)} category created successfully` });

			// catch error & send response
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ msg: 'Server Error' });
			res.status(500).send('Server error');
		}
	}
);

// @route     GET server/categories
// @desc      Get categories all; by id; rand; limit
// @access    Public
router.get('/', async (req, res) => {
	// save request content
	const { id, rand, limit } = req.query;

	//console.log(id);

	try {
		// return all categories
		if (!id) {
			const categories = await Category.find({});

			// send error response
			if (!categories) {
				return res.status(200).json({ msg: 'No category was found' });

				// send response
			} else {
				let categoryMap = [];
				categories.forEach(category => {
					categoryMap.push(category);
				});
				// send random with limit
				if (rand && limit) {
					categoryMap = _.sampleSize(categoryMap, limit);
					// send random without limit
				} else if (rand) {
					categoryMap = _.shuffle(categoryMap);
				}
				res.send(categoryMap);
			}

			// return searched category
		} else {
			const category = await Category.findById(id);

			// send error response
			if (!category) {
				return res.status(200).json({ msg: 'No category was found' });

				// send response
			} else {
				res.json(category);
			}
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: 'Server Error' });
		res.status(500).send('Server error');
	}
});

// export router
module.exports = router;
