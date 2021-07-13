const { onShutdown } = require("node-graceful-shutdown");
const { connect, closeConnection } = require('./src/utils/database');
const app = require('./src/config/express');
const recordRoutes = require('./src/routes/recordRoute')
const CustomError = require('./src/utils/customError');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');

class Start{
    constructor(){
        this.port = process.env.PORT || 8000;
    }

    async connectDB(){
        const connectionUri = process.env.DEFAULT_DATABASE_URI;
        if(!connectionUri){
            throw new CustomError("A database connection uri must be provided.");
        }

        if(connectionUri && !connectionUri.startsWith('mongodb')){
            throw new CustomError("Please confirm that the URI starts with the right protocol")
        }
        await connect(connectionUri);
    }

    setAppRoutes(){
        app.use(`/guide`, swaggerUI.serve, swaggerUI.setup(swaggerFile));
        app.use(`/healthCheck`, (_, res) => res.status(200).json({ok: true, message: "Server up! Go to /guide to see usage guide."}));
        app.use('/records', recordRoutes);
        app.use((_, _, next) => {
            var err = new CustomError('Not Found', 404);
            err.status = 404;
            next(err);
        });
    }

    listenOnApp(){
        app.listen(this.port, () => {
            console.info(`${new Date().toISOString()}: app listening on ${this.port}`)
        })
    }

    handleCloseUp(){
        onShutdown("http-server", async function () {
            closeConnection();
            process.exit();
        });          
    }

    async startExpress(){
        try {
            await this.connectDB();
            this.setAppRoutes();
            this.listenOnApp();
            this.handleCloseUp();
        } catch (e) {
            console.error(`${__filename}: Fatal error while starting up app: ${e && e.message}`)
        }
        
    }
}

module.exports = Start;