import express from "express";
import {readdirSync} from "fs";



// Create the express app
const app = express();
const cors = require('cors');
const db = require('./app/config/db.config.js');

// force: true will drop the table if it already exists (force is using only for development purposes.)
db.sequelize.sync().then(() => {
    console.log('Drop and Re-sync with { force: true }');
});

//applying middleware
app.use(express.json({limit: "5mb"}));

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
    credentials: true,
};

app.use(cors(corsOptions));

// route
readdirSync("./app/routes").map((r) => app.use("/api", require(`./app/routes/${r}`)));


//port
const port = process.env.PORT || 8000;   //process.env.PORT is defined in the local environment


app.listen(port, () => console.log(`Server is running on port ${port}`));
