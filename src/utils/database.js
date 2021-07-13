const mongoose = require('mongoose');
const directoryName = __dirname
const connect = async (connectionUri) => {
  const connection = mongoose.connection 
  connection.on('connected', () => console.info(`${directoryName}:connect Successfully established connection with mongodb on ${connectionUri}`));
  connection.on('close', () => console.info(`${directoryName}:connect:close Connection to mongodb has been closed`));
  connection.on('error', (e) => console.error(`${directoryName}:connect:FATAL Connection to mongodb has thrown error with: ${e && e.message}`));
    console.info(`${directoryName}:connect opening connection to database`);
    await mongoose.connect(connectionUri, {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        }
    );
  return connection
};

module.exports = connect