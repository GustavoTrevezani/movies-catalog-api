import { Injectable, BadRequestException } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class OmdbService {
  private readonly apiKey = process.env.OMDB_API_KEY;
  private readonly baseUrl = "https://www.omdbapi.com";

  async searchByTitle(title: string) {
    try {
      const { data } = await axios.get(this.baseUrl, {
        params: { apikey: this.apiKey, s: title, type: "movie" },
      });

      if (data.Response === "False") {
        throw new BadRequestException(data.Error || "Movie not found");
      }

      return data.Search;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(
        "OMDb API is unavailable. Try again later.",
      );
    }
  }

  async getByImdbId(imdbId: string) {
    try {
      const { data } = await axios.get(this.baseUrl, {
        params: { apikey: this.apiKey, i: imdbId, plot: "short" },
      });

      if (data.Response === "False") {
        throw new BadRequestException(data.Error || "Movie not found on OMDb");
      }

      return data;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(
        "OMDb API is unavailable. Try again later.",
      );
    }
  }
}
