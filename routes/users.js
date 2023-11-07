const express = require('express')
const router = express.Router();
const {listUsers, listUsersByID, addUser, deleteUser, updateUser, signInuser} = require ('../controllers/users');
const { updateRow } = require('../models/users');

router.get('/', listUsers);
router.get('/:id',listUsersByID); 
router.post('/', signInuser);
router.put('/', addUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router

