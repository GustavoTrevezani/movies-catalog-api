import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OmdbService } from "../omdb/omdb.service";

@Injectable()
export class MoviesService {
  constructor(
    private prisma: PrismaService,
    private omdb: OmdbService,
  ) {}

  // Search OMDb by title
  async search(title: string) {
    const movies = await this.omdb.searchByTitle(title);

    return movies.map((movie: any) => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      type: movie.Type,
      poster: movie.Poster !== "N/A" ? movie.Poster : null,
    }));
  }

  // Ensures movie exists in DB (fetches from OMDb if not)
  private async ensureMovieExists(imdbId: string) {
    let movie = await this.prisma.movie.findUnique({ where: { id: imdbId } });

    if (!movie) {
      const data = await this.omdb.getByImdbId(imdbId);
      movie = await this.prisma.movie.create({
        data: {
          id: data.imdbID,
          title: data.Title,
          year: data.Year,
          type: data.Type,
          poster: data.Poster !== "N/A" ? data.Poster : null,
          plot: data.Plot !== "N/A" ? data.Plot : null,
        },
      });
    }

    return movie;
  }

  // ── FAVORITES ──────────────────────────────────────────────
  async addFavorite(userId: string, imdbId: string) {
    const movie = await this.ensureMovieExists(imdbId);

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_movieId: { userId, movieId: movie.id } },
    });
    if (existing) throw new ConflictException("Movie already in favorites");

    return this.prisma.favorite.create({ data: { userId, movieId: movie.id } });
  }

  async removeFavorite(userId: string, imdbId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_movieId: { userId, movieId: imdbId } },
    });
    if (!existing) throw new ConflictException("Movie not in favorites");

    return this.prisma.favorite.delete({
      where: { userId_movieId: { userId, movieId: imdbId } },
    });
  }

  async listFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { movie: true },
      orderBy: { movie: { title: "asc" } },
    });
  }

  // ── WATCHED ────────────────────────────────────────────────
  async addWatched(userId: string, imdbId: string) {
    const movie = await this.ensureMovieExists(imdbId);

    const existing = await this.prisma.watched.findUnique({
      where: { userId_movieId: { userId, movieId: movie.id } },
    });
    if (existing)
      throw new ConflictException("Movie already marked as watched");

    return this.prisma.watched.create({ data: { userId, movieId: movie.id } });
  }

  async removeWatched(userId: string, imdbId: string) {
    const existing = await this.prisma.watched.findUnique({
      where: { userId_movieId: { userId, movieId: imdbId } },
    });
    if (!existing) throw new ConflictException("Movie not marked as watched");

    return this.prisma.watched.delete({
      where: { userId_movieId: { userId, movieId: imdbId } },
    });
  }

  async listWatched(userId: string) {
    return this.prisma.watched.findMany({
      where: { userId },
      include: { movie: true },
      orderBy: { movie: { title: "asc" } },
    });
  }

  // ── ADMIN RANKINGS ─────────────────────────────────────────
  async mostFavorited() {
    const movies = await this.prisma.movie.findMany({
      where: {
        favorites: {
          some: {},
        },
      },
      include: { _count: { select: { favorites: true } } },
      orderBy: { favorites: { _count: "desc" } },
      take: 10,
    });

    return movies.map((movie) => ({
      movie: {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        type: movie.type,
        poster: movie.poster,
      },
      count: movie._count.favorites,
    }));
  }

  async mostWatched() {
    const movies = await this.prisma.movie.findMany({
      where: {
        watched: {
          some: {},
        },
      },
      include: { _count: { select: { watched: true } } },
      orderBy: { favorites: { _count: "desc" } },
      take: 10,
    });

    return movies.map((movie) => ({
      movie: {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        type: movie.type,
        poster: movie.poster,
      },
      count: movie._count.watched,
    }));
  }
}
