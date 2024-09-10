const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017/crud';

let client;
 
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db();
}

module.exports = { connectToDatabase };



// const {MongoClient} =require('mongodb');
// const url="mongodb://127.0.0.1:27017"
// const dbConnect=async()=>{
//        const client=new MongoClient(url);
//        const db=client.db("netflix");
//        const collection=db.collection("users");
//        return collection;
// }

// module.exports=dbConnect;