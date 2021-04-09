const mongoClient = require("mongodb").MongoClient;
const uri = "";
const database = "";

const client = mongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

const connect = async(dbName = database) => {
    const conn = await client.connect();
    db = conn.db(dbName)
    return client;
}

const getDbRef = () => {
    return db ? db : new Error("Error de conexion");    
}

module.exports.connect = connect;
module.exports.db = getDbRef;