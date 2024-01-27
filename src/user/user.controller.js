const express = require('express');
const prisma = require('../db.connection.js');
const multer = require('multer');
const path = require('path');


const {
    getAllUsers,
    getUserById,
    createUser,
    deleteUserById,
    storage
} = require("./user.service.js");


const upload = multer({ storage: storage });
const router = express.Router();



router.get("/", async (req, res) => {
    const users = await getAllUsers();
    res.send(users);
});

router.get("/image/:image", async (req, res) => {
    const imageName = req.params.image;
    const imagePath = path.join(__dirname, '..', 'files_upload/crop', imageName);
    // console.log(imagePath);
    res.sendFile(imagePath);
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

router.post("/", upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
        const newUserData = req.body;
        const newUserImage = req.files;
        const user = await createUser(newUserData, newUserImage);

        // const metadata = await sharp(newUserImage.image[0].path).metadata();
        // console.log(metadata);

        res.send({
            data: user,
            message: "create user success",
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        await deleteUserById(parseInt(userId));

        res.send("user deleted");
    } catch (error) {
        res.status(400).send(error.message);
    }
});




module.exports = router;