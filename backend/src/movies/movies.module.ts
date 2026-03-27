import { Module } from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { MoviesController } from "./movies.controller";
import { OmdbModule } from "../omdb/omdb.module";

@Module({
  imports: [OmdbModule],
  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModule {}
