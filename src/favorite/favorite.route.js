const express = require('express');
const {AddOrDeleteFavorite} = require("./favorite.service");
const router = express.Router();

router.post('/', AddOrDeleteFavorite);

module.exports = router;