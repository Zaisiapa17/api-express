const express = require('express');
const prisma = require('../db.connection.js');
const multer = require('multer')
const sharp = require('sharp');
const fs = require('fs');


const {
    getAllUsers,
    getUserById,
    createUser,
    deleteUserById
} = require("./user.service.js");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/files_upload/img');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
    }
});

const upload = multer({ storage: storage });


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

router.post("/", upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
    try {
        const newUserData = req.body;
        const newUserImage = req.files;
        const user = await createUser(newUserData, newUserImage);

        const metadata = await sharp(newUserImage.image[0].path).metadata();
        console.log(metadata);

        await sharp(newUserImage.image[0].path)
            .metadata()
            .then(function (metadata) {
                return sharp(newUserImage.image[0].path)
                    .extract({
                        width: 500,
                        height: 500,
                        left: (metadata.width - 200) / 2,
                        top: (metadata.height - 200) / 2
                    })
                    .toFile('src/files_upload/crop/' + newUserImage.image[0].filename, (err, info) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(info);
                            fs.unlink(newUserImage.image[0].path, (err) => {
                                if (err) {
                                    throw err;
                                }
                            });
                        }
                    });
            });

        console.log(newUserImage);

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