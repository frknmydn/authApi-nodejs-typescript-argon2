import { Request, Response, NextFunction } from "express";
import { apiResponseTimeHistogram } from '../utils/metrics';

const responseTimeMW = (req: Request, res:Response, time: number) => {
    if(req?.route?.path){
        apiResponseTimeHistogram.observe({
            method: req.method,
            route: req.route.path,
            status_code: res.statusCode
        },time * 1000)
    }
}

export default responseTimeMW;
