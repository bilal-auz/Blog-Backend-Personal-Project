/*
checks if the index(page) is more/less than how much it should be

and remov one, use it in array indexing
*/
module.exports = function (page, length){
    console.log(`length: ${length}`);
    if(page <= 0 || !page){
        return 0;
    }else if(page >= length){
        return length-1;
    }else{
        return page-1;
    }
};