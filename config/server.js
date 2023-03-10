const mongoose = require('mongoose');


mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/Rento",{useNewUrlParser: true , useUnifiedTopology:true});
var db = mongoose.connection;
db.on("error", function(error){ console.log(error);});
db.once('open',()=>{console.log("connected to database"); });




