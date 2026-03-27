import { IsString } from "class-validator";

export class AddMovieDto {
  @IsString()
  imdbId!: string;
}
