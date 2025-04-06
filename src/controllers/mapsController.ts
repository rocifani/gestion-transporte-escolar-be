import { Request, Response } from "express";
import mapsService from "../services/mapsService";
import { sendError, sendSuccess } from '../utils/requestHandlers';

class mapsController {

  async searchPlaces(req: Request, res: Response) {
    try {
      const { query, type } = req.query;

      if (!query) {
        return sendError(res, "El parámetro 'query' es obligatorio", 400);
      }

      const places = await mapsService.searchPlaces(query as string, type as string);
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

      const details = await mapsService.getPlaceDetails(place_id as string);
      sendSuccess(res, details);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  async geocodeAddress(req: Request, res: Response) {
    try {
      const { address } = req.query;

      if (!address) {
        return sendError(res, "El parámetro 'address' es obligatorio", 400);
      }

      const location = await mapsService.geocodeAddress(address as string);
      sendSuccess(res, location);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  async geocodeAddresses(_req: Request, res: Response) {
    try {
      // query para obtener direcciones del viaje
      // const addresses = await (); 

      // const { addresses } = req.body;

      const addresses =  [
        "Av. Corrientes 1234, CABA",
        "Av. Santa Fe 2000, CABA",
        "Av. Libertador 5000, CABA",
      ];

      if (!addresses || !Array.isArray(addresses)) {
        return sendError(res, "No se está recibiendo un array", 400);
      }

      const locations = await mapsService.geocodeAddresses(addresses as string[]);
      sendSuccess(res, locations);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
}

export default new mapsController();
