import { Request, Response } from "express";
import { googlePlacesService } from "../services/mapsService";
import { sendError, sendSuccess } from '../utils/requestHandlers';

class mapsController {

  async searchPlaces(req: Request, res: Response) {
    try {
      const { query, type } = req.query;

      if (!query) {
        return sendError(res, "El parámetro 'query' es obligatorio", 400);
      }

      const places = await googlePlacesService.searchPlaces(query as string, type as string);
      sendSuccess(res, places);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  async getPlaceDetails(req: Request, res: Response) {
    try {
      const { place_id } = req.query;

      if (!place_id) {
        return sendError(res, "El parámetro 'place_id' es obligatorio", 400);
      }

      const details = await googlePlacesService.getPlaceDetails(place_id as string);
      sendSuccess(res, details);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
}

export const googlePlacesController = new mapsController();
