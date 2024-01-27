const prisma = require("../db.connection.js");
const fs = require('fs');
const sharp = require('sharp');


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

    await sharp(userImage.image[0].path)
        .metadata()
        .then(async (metadata) => {
            // Check if either width or height is less than 500
            if (metadata.width < 500 || metadata.height < 500) {
                // Calculate scale factor to ensure both width and height reach 500
                const scaleFactor = Math.max(500 / metadata.width, 500 / metadata.height);

                // Scale the image to a minimum of 500 for both width and height
                await sharp(userImage.image[0].path)
                    .resize({
                        width: Math.ceil(metadata.width * scaleFactor),
                        height: Math.ceil(metadata.height * scaleFactor),
                    })
                    .toFile('src/files_upload/crop/' + userImage.image[0].filename); // Overwrite the original file

                // Update metadata after scaling
                metadata = await sharp(userImage.image[0].path).metadata();
            }


            // Calculate the crop area based on the scaled dimensions
            const cropWidth = Math.min(metadata.width, 500);
            const cropHeight = Math.min(metadata.height, 500);
            const left = (metadata.width - cropWidth) / 2;
            const top = (metadata.height - cropHeight) / 2;

            // Proceed with extraction using updated dimensions
            return sharp(userImage.image[0].path)
                .extract({
                    left: left,
                    top: top,
                    width: cropWidth,
                    height: cropHeight,
                })
                .toFile('src/files_upload/crop/' + userImage.image[0].filename, (err, info) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(info);
                        fs.unlink(userImage.image[0].path, (err) => {
                            if (err) {
                                throw err;
                            }
                        });
                    }
                });
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

const editUser = async (id, userData, userImage) => {
    const userfetch = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!userfetch) {
        if (userImage) {
            await fs.unlinkSync(userImage.image[0].path);
        }
        return {
            "error":"user not found"
        }
    }
    
    const filename = userfetch.image;
    const filepath = `./src/files_upload/crop/${filename}`;

    await fs.unlink(filepath, (err) => {
        if (err) {
            throw err;
        }
    });
    
    const user = await prisma.user.update({
        where: {
            id: parseInt(id),
        },
        data: {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            image: userImage.image[0].filename,
        },
    });

    await sharp(userImage.image[0].path)
    .metadata()
    .then(async (metadata) => {
        // Check if either width or height is less than 500
        if (metadata.width < 500 || metadata.height < 500) {
            // Calculate scale factor to ensure both width and height reach 500
            const scaleFactor = Math.max(500 / metadata.width, 500 / metadata.height);

            // Scale the image to a minimum of 500 for both width and height
            await sharp(userImage.image[0].path)
                .resize({
                    width: Math.ceil(metadata.width * scaleFactor),
                    height: Math.ceil(metadata.height * scaleFactor),
                })
                .toFile('src/files_upload/crop/' + userImage.image[0].filename); // Overwrite the original file

            // Update metadata after scaling
            metadata = await sharp(userImage.image[0].path).metadata();
        }


        // Calculate the crop area based on the scaled dimensions
        const cropWidth = Math.min(metadata.width, 500);
        const cropHeight = Math.min(metadata.height, 500);
        const left = (metadata.width - cropWidth) / 2;
        const top = (metadata.height - cropHeight) / 2;

        // Proceed with extraction using updated dimensions
        return sharp(userImage.image[0].path)
            .extract({
                left: left,
                top: top,
                width: cropWidth,
                height: cropHeight,
            })
            .toFile('src/files_upload/crop/' + userImage.image[0].filename, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(info);
                    fs.unlink(userImage.image[0].path, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                }
            });
    });

    return user;
};

module.exports = {
    findUsers,
    findUserById,
    insertUser,
    deleteUser,
    editUser
};