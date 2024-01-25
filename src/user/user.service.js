const prisma = require("../db.connection.js");
const {
    findUsers,
    findUserById,
    insertUser,
    deleteUser
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

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUserById
};