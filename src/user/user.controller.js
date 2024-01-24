const express = require('express');
const prisma = require('../db.connection.js');
const {
    getAllUsers,
    getUserById
} = require("./user.service.js");

const router = express.Router();

router.get("/", async (req, res) => {
    const users = await getAllUsers();
    res.send(users);
});

router.get("/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await getUserById(parseInt(userId));

        res.send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});



module.exports = router;