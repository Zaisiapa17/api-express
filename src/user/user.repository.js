const prisma = require("../db.connection.js");

const findUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
};

const findUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    return user;
};

module.exports = {
    findUsers,
    findUserById
};