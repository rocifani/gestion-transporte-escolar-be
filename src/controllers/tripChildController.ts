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

    async getTripChildByTripId(req: Request, res: Response){
        try{
            const tripId = Number(req.params['trip_id']);
            const trip_childs= await tripChildService.getTripChildByTripId(tripId);
            sendSuccess(res, trip_childs);

        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async getTripChildById(req: Request, res: Response){
        try{
            const tripChildId = Number(req.params['trip_child_id']);
            const trip_child= await tripChildService.getTripChildById(tripChildId);
            sendSuccess(res, trip_child);
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

    async deleteTripChild(req: Request, res: Response){
        try{
            const tripChildId = Number(req.params['trip_child_id']);
            const deleted = await tripChildService.deleteTripChild(tripChildId);
            sendSuccess(res, deleted);
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }
}

export default new TripController();