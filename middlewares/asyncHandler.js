const getUserName = require('../models/User').getUserName;

module.exports = function (handler){
    return async (req, res, next)=>{
        try{
            await handler(req,res)
        }catch(ex){
            var passVal = false;
            var userName = "";

            if(req.session._id){
                passVal = true;
                userName = await getUserName(req.session._id);
            } 
            
            console.log(ex.message);
            res.render('./errorPages/404',{title: 'Error', pass:passVal, user : userName});
        }
    }
}