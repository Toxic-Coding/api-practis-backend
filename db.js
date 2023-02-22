const mongoose = require('mongoose');

/* The connection string to the database. */
const Uri = 'mongodb+srv://adil:wWybEYr14c5LtPCa@cluster0.wwxmokz.mongodb.net/mynotebook'
 
mongoose.set('strictQuery',false);
/**
 * It connects to the database.
 */
const connectDb = ()=>{
    mongoose.connect(Uri).then((db)=>{
        console.log('connected to dstsbsde');
    }).catch((err)=>{
        console.log(`some error: ${err}`);
    })
}


module.exports = connectDb