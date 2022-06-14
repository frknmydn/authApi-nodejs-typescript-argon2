require("dotenv").config();

import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import createServer from './utils/createServer';

const host = config.get<string>("host")
const port = config.get<number>("port")
const app = createServer();


connectToDb().then(() => {
   app.listen(port,host,() =>{
      log.info(`Server started on port ${port}`);
      log.info(`Server started on ${process.env.NODE_ENV} environment`);   
   });
}).catch((errMessage) => {
   log.error(`Server failed to start with this error message: ${errMessage}`);
})
