const connect = require('./src/utils/database');
const app = require('./src/config/express');
class Start{
    constructor(){
        this.port = process.env.PORT || 8000;
    }

    async connectDB(){
        const connectionUri = process.env.DEFAULT_DATABASE_URI;
        if(!connectionUri){
            throw new Error("A database connection uri must be provided.");
        }

        if(connectionUri && !connectionUri.startsWith('mongodb')){
            throw new Error("Please confirm that the URI starts with the right protocol")
        }
        await connect(connectionUri);
    }

    setAppRoutes(){

    }

    listenOnApp(){
        app.listen(this.port, () => {
            console.info(`${new Date().toISOString()} app listening on ${this.port}`)
        })
    }
    async startExpress(){
        await this.connectDB();
        this.setAppRoutes();
        this.listenOnApp();
    }
}

module.exports = Start;