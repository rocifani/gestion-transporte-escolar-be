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

  async geocodeAddress(address: string) {
    try {
      const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address,
          key: GOOGLE_MAPS_API_KEY,
        },
      });
    
      const location = response.data.results[0].geometry.location;
    
      return {
        address: response.data.results[0].formatted_address,
        lat: location.lat,
        lng: location.lng,
      };
    } catch (error: any) {
      throw new Error("Error en la API de Google Geocoding: " + error.message);
    }
  }

  async geocodeAddresses(direcciones: string[]) {
    const resultados: { address: string; lat: number; lng: number }[] = [];
  
    for (const direccion of direcciones) {
      try {
        const coordenada = await this.geocodeAddress(direccion);
        resultados.push(coordenada);
      } catch (error: any) {
        throw new Error("Error: " + error.message);
      }
    }
  
    return resultados;
  };
}

export default new mapsService();
