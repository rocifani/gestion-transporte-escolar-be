import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../utils/requestHandlers';
import tripChildService from '../services/tripChildService';

class TripController {

    async getTripChildByUserId(req: Request, res: Response){
        try{
            const userId = Number(req.userId);
            const trip_childs= await tripChildService.getTripChildByUserId(userId);
            sendSuccess(res, trip_childs);

        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async getTripChildByChildId(req: Request, res: Response){
        try{
            const childId = Number(req.params['child_id']);
            const trip_childs= await tripChildService.getTripChildByChildId(childId);
            sendSuccess(res, trip_childs);

        }
        catch(error: any){
            sendError(res, error.message);
        }
    }
}

export default new TripController();