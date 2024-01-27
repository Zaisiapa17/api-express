const prisma = require("../db.connection.js");
const multer = require('multer');
// const fs = require('fs');
const {
    findUsers,
    findUserById,
    insertUser,
    deleteUser,
    editUser
} = require("./user.repository.js");


const getAllUsers = async () => {
    const users = await findUsers();
    const data = {
        "users": users,
        "status": "success"
    }

    return data;
};

const getUserById = async (id) => {
    const user = await findUserById(id);
    const data = {
        "user": user,
        "status": "success"
    }

    if (!user) {
        throw Error("User not found");
    }

    return data;
};

const createUser = async (newUserData, newUserImage) => {
    const user = await insertUser(newUserData, newUserImage);

    return user;
};

const deleteUserById = async (userId) => {
    await getUserById(userId);
    await deleteUser(userId);
};

const editUserById = async (id, userData, userImage) => {
    // await getUserById(id);

    const user = await editUser(id, userData, userImage)

    return user;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/files_upload/img');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
    }
});

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUserById,
    editUserById,
    storage
};