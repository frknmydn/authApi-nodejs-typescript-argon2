import mongoose from 'mongoose';
import config from "config";
import log from './logger';


async function connectToDb(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const dbUri = config.get<string>("dbUri");
    
        try{
            mongoose.connect(dbUri).then(() => {
                resolve();
            })
            .catch((err: any) => {
                reject(err.message);
            });
        }
        catch(err: any){
            reject(err.message);
        }
    });
}

export default connectToDb;