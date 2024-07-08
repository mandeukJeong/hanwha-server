const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const url = process.env.MONGO_URI;
let connectDB = new MongoClient(url).connect();

module.exports = connectDB;
