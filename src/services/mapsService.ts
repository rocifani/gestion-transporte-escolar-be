import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

class mapsService {
  // Buscar lugares con un tipo específico (ej: "school")
  async searchPlaces(query: string, type?: string) {
    try {
      const response = await axios.get("https://maps.googleapis.com/maps/api/place/textsearch/json", {
        params: {
          query,
          type,
          language: "es", 
          key: GOOGLE_MAPS_API_KEY,
        },
      });

      return response.data.results.map((place: any) => ({
        place_id: place.place_id,
        name: place.name,
        address: place.formatted_address,
      }));
    } catch (error: any) {
      throw new Error("Error en la API de Google Places: " + error.message);
    }
  }

  // Obtener detalles de un lugar usando place_id
  async getPlaceDetails(place_id: string) {
    try {
      const response = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
        params: {
          place_id,
          key: GOOGLE_MAPS_API_KEY,
        },
      });

      return {
        address: response.data.result.formatted_address,
        lat: response.data.result.geometry.location.lat,
        lng: response.data.result.geometry.location.lng,
      };
    } catch (error: any) {
      throw new Error("Error en la API de Google Place Details: " + error.message);
    }
  }
}

export default new mapsService();
