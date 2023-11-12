const express = require('express')
const router = express.Router();
const {listbaseball, baseballByID, addpark, deleteBaseball, updateName_Park} = require ('../controllers/baseball');

router.get('/', listbaseball);
router.get('/:park',baseballByID); 
router.put('/', addpark);
router.patch('/:park', updateName_Park);
router.delete('/:park', deleteBaseball);

module.exports = router

