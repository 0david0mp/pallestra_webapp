const express = require('express');
const authMiddleware = require('./authMiddleware');
const apiRoutes = require('./routes/api');

const app = express();
const port = 8000;

// -------------------- middleware
app.use(express.json());
app.use(apiRoutes);

app.use(express.static("public"));
app.use('/private', authMiddleware, express.static("private"));

// middleware for not found files
app.use((req, res, next) => {
    res.on('finish', () => {
        let d = new Date();
        console
            .log(`[${d.getDate()}/${d.getMonth()}/${d.getYear()} ` +
                `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]: ` +
                `${req.ip} : error 404 on : ${req.url}`)
    });
    next();
});

app.use((req, res) => {
    res.status(404).send('invalid url');
});

// start server
app.listen(port, () => {
    console.log("app listening on http://0.0.0.0:" + port)
});
