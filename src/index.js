
const express = require('express');
const dotenv = require('dotenv');
const app = express();
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
dotenv.config();

const PORT = process.env.PORT;


app.get('/api', ( req, res ) => {
    res.send('hello world');
    prisma.user.
})


app.listen(PORT, ( err, res) => {
    console.log('running API in port: ' + PORT);
})
