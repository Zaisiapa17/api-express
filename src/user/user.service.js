const prisma = require("../db.connection.js");
const {
    findUsers
} = require("./user.repository.js");

const getAllUsers = async () => {
    const users = await findUsers();

    return users;
};

module.exports = {
    getAllUsers
};