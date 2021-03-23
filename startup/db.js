const mongoose = require('mongoose');
const config = require('config');
//mongodb://localhost/TheBlog
module.exports = function (){
    mongoose.connect(config.get('db'), {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify: false})
        .then(() => console.log('Connected to Database'))
        .catch(err => console.log('Database is down, Error', err.message))
    ;
}