const prisma = require("../db.connection.js");
const fs = require('fs');

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

const insertUser = async (userData, userImage) => {
    const user = await prisma.user.create({
        data: {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            image: userImage.image[0].filename,
        },
    });

    return user;
};

const deleteUser = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });
    
    const filename = user.image;
    const filepath = `./src/files_upload/crop/${filename}`;

    await fs.unlink(filepath, (err) => {
        if (err) {
            throw err;
        }
    });

    await prisma.user.delete({
        where: {
            id,
        },
    });
};

module.exports = {
    findUsers,
    findUserById,
    insertUser,
    deleteUser
};