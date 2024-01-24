const express = require('express');
const prisma = require('../db.connection.js');
const {
    getAllUsers
} = require("./user.service.js");

const router = express.Router();

router.get("/", async (req, res) => {
    const users = await getAllUsers();
    res.send(users);
});



module.exports = router;