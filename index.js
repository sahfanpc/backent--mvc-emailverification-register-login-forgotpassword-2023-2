const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());
const route = require('./routes/route');
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:4200'
}))

app.use("/", route);

mongoose.connect('mongodb://localhost:27017/DATA',
    {
        useNewUrlParser: true
    }).then(() => console.log("connected"))

app.listen(3002, () => {
    console.log("run::")
})