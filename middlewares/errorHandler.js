const getUserName = require('../models/User').getUserName;

module.exports = async function (req,res,next){
    var passVal = false;
    var userName = "";

    if(req.session._id){
        passVal = true;
        userName = await getUserName(req.session._id);
    }

    console.log(userName);
    res.status(404).render('./errorPages/notFound',{title: 'Error', pass:passVal, user : userName});
}