const express = require('express');

const server = express();

const router = require('./router.js');

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`
        <h2>API Running</h2>
    `);
});

server.use('/api/posts', router);

module.exports = server;