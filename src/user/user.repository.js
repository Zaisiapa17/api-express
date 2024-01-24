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

const insertUser = async (userData) => {
    const user = await prisma.user.create({
        data: {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            image: userData.image,
        },
    });

    return user;
};

module.exports = {
    findUsers,
    findUserById,
    insertUser
};