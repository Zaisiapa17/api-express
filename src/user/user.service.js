const prisma = require("../db.connection.js");
const {
    findUsers,
    findUserById,
    insertUser
} = require("./user.repository.js");

const getAllUsers = async () => {
    const users = await findUsers();

    return users;
};

const getUserById = async (id) => {
    const User = await findUserById(id);

    if (!User) {
        throw Error("User not found");
    }

    return User;
};

const createUser = async (newUserData) => {
    const user = await insertUser(newUserData);

    return user;
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser
};