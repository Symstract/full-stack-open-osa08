const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dns = require("node:dns/promises");

// Without this, the following error is thrown:
// ECONNREFUSED _mongodb._tcp.cluster0.wfpyx82.mongodb.net
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectToDatabase = async (uri) => {
  console.log("connecting to database URI:", uri);

  try {
    await mongoose.connect(uri);
    console.log("connected to MongoDB");
  } catch (error) {
    console.log("error connection to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
