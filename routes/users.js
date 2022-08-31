const express = require('express');
const { getUser, getUsers, createUser, deleteUser, updateUser, } = require('../controllers/users');
const router = express.Router({mergeParams: true});

const User = require('../models/Users')
const advancedResults = require('../middleware/advanceResults');
const { protect, authorize } = require('../middleware/auth');


router.use(protect);
router.use(authorize('admin'));
router.route('/').get(advancedResults(User), getUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;