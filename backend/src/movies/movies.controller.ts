import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { AddMovieDto } from "./dto/addMovies.dto";
import { JwtAuthGuard } from "../auth/jwtAuth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("movies")
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  // COMUM: search OMDb
  @Get("search")
  search(@Query("title") title: string) {
    return this.moviesService.search(title);
  }

  // COMUM: favorites
  @Post("favorites")
  addFavorite(@Request() req: any, @Body() dto: AddMovieDto) {
    return this.moviesService.addFavorite(req.user.id, dto.imdbId);
  }

  @Delete("favorites/:imdbId")
  removeFavorite(@Request() req: any, @Param("imdbId") imdbId: string) {
    return this.moviesService.removeFavorite(req.user.id, imdbId);
  }

  @Get("favorites")
  listFavorites(@Request() req: any) {
    return this.moviesService.listFavorites(req.user.id);
  }

  // COMUM: watched
  @Post("watched")
  addWatched(@Request() req: any, @Body() dto: AddMovieDto) {
    return this.moviesService.addWatched(req.user.id, dto.imdbId);
  }

  @Delete("watched/:imdbId")
  removeWatched(@Request() req: any, @Param("imdbId") imdbId: string) {
    return this.moviesService.removeWatched(req.user.id, imdbId);
  }

  @Get("watched")
  listWatched(@Request() req: any) {
    return this.moviesService.listWatched(req.user.id);
  }

  // ADMIN: rankings
  @Roles("ADMIN")
  @Get("rankings/favorites")
  mostFavorited() {
    return this.moviesService.mostFavorited();
  }

  @Roles("ADMIN")
  @Get("rankings/watched")
  mostWatched() {
    return this.moviesService.mostWatched();
  }
}
