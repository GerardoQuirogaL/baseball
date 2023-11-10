const express = require('express')
const router = express.Router();
const {listbaseball, baseballByID, addpark, deleteUser, updateName_Park, signInuser} = require ('../controllers/baseball');
const { updateRow } = require('../models/baseball');

router.get('/', listbaseball);
router.get('/:park',baseballByID); 
router.post('/', signInuser);
router.put('/', addpark);
router.patch('/:id', updateName_Park);
router.delete('/:id', deleteUser);

module.exports = router

