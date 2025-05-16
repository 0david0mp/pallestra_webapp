const express = require('express');
const app = express();
const port = 8000;

// middleware
app.use(express.static("public"));

app.use((req, res, next) => {
    res.status(404).send('invalid url');
    next();
});

app.use((req, res) => {
    res.on('finish', () => {
        let d = new Date();
        console
            .log(`[${d.getDate()}/${d.getMonth()}/${d.getYear()} `+
                `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]:`+
                `${req.ip} : error 404 on : ${req.url}`)
    });
});


app.listen(port, () => {
    console.log("app listening on http://0.0.0.0:" + port)
    console.log("(i) only errors will be shown (fe. [timestamp]:ip url)")
});
