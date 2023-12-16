const mongoose = require('mongoose');

const connectToDatabase = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/Travel", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const conn = mongoose.connection;

    conn.on('connected', function () {
        console.log("DB connected");
    });

    return conn; // Return the connection object
};

module.exports = connectToDatabase;
