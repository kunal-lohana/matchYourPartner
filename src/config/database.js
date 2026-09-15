const mongoose = require("mongoose");
const url = "mongodb+srv://rajatrao000_db_user:d6RywkRNYDlmpyOE@kforevernode.grebre2.mongodb.net/matchYourPartner";

const connectDB = async() => {
    await mongoose.connect(url);
}

module.exports = { connectDB };



