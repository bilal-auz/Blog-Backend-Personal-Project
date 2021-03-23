
module.exports = function (){
    process.on('uncaughtException', (ex)=>{
        console.log('uncaughtException');
        console.log(`Error: ${ex}`);
    });
    
    process.on('unhandledRejection', (ex)=>{
        console.log('unhandledRejection');
        console.log(`Error: ${ex} `);
    });
}