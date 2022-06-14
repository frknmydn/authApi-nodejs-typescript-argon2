import {Request, Response, NextFunction} from "express";


const checkPermission = (roles: Array<string>) => (req:Request, res:Response, next:NextFunction) => {
    const user = res.locals.user;
    
    if (!user) {
        return res.sendStatus(401);
    }
    if (!roles.includes(user.type)){
        return res.sendStatus(403);
    }
    next(); 
};

export default checkPermission;