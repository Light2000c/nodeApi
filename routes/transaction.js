const express = require('express');

const router = express.Router();
const { getUserTransaction, getTransactionById } = require('../controllers/transactionController');

router.get("", getUserTransaction);
router.get("/:request_id", getTransactionById);


module.exports = router;