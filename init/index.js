const mongoose=require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_url="mongodb://127.0.0.1:27017/sachin";
main()
    .then(()=>{
        console.log("connected to db");
    }).catch((err)=>{
        console.log(err);
    });

    async function main(){
        await mongoose.connect(Mongo_url);
    }

    const initDB =  async ()=>{
       await Listing.deleteMany({});
       initData.data=initData.data.map((obj)=>({...obj,owner:'65e9eaa5f7d55da4f1b91a7e'}))
        await Listing.insertMany(initData.data);
        console.log("data has been initilised in index.js")
    };
initDB();
