const prisma = require("../db.connection.js");
const {
    findUsers,
    findUserById
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

module.exports = {
    getAllUsers,
    getUserById
};