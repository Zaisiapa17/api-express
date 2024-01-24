const prisma = require("../db.connection.js");

const findUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
};


module.exports = {
    findUsers
};