const express = require('express');
const prisma = require('../db.connection.js');
const {
    getAllUsers,
    getUserById,
    createUser
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

router.post("/", async (req, res) => {
    try {
        const newUserData = req.body;
        const user = await createUser(newUserData);

        res.send({
            data: user,
            message: "create user success",
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});






module.exports = router;