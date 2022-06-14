import cors from 'cors';
import express,{Request, Response} from "express";
import deserializeUser from '../middleware/deserializeUser';
import router from '../routes';
import bodyParser from "body-parser";
import { startMetricsServer } from './metrics';

import { apiResponseTimeHistogram } from '../utils/metrics';
import responseTime from 'response-time';
import responseTimeMW from '../middleware/responseTimeMiddleware';

function createServer() {
  const app = express();
  
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(responseTime(responseTimeMW));
  app.use(deserializeUser);
  app.use(router);

  startMetricsServer();

  
  return app;
}

export default createServer;
