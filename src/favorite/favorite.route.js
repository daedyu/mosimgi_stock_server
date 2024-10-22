const express = require('express');
const {AddOrDeleteFavorite} = require("./favorite.service");
const router = express.Router();

router.get('/', AddOrDeleteFavorite);

module.exports = router;