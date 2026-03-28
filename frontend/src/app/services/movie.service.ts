import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError, of } from "rxjs";
import { map } from "rxjs/operators";
import {
  Movie,
  RankingItem,
  UserWithMovies,
  UserMovie,
} from "../models/movie.model";

@Injectable({
  providedIn: "root",
})
export class MovieService {
  private readonly API_URL = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  searchMovies(title: string): Observable<Movie[]> {
    return this.http
      .get<Movie | Movie[]>(`${this.API_URL}/movies/search`, {
        params: { title },
      })
      .pipe(
        map((response) => (Array.isArray(response) ? response : [response])),
        catchError((error) => {
          console.error("Search error:", error);
          return of([]);
        }),
      );
  }

  addToFavorites(imdbId: string): Observable<UserMovie> {
    return this.http
      .post<UserMovie>(`${this.API_URL}/movies/favorites`, { imdbId })
      .pipe(
        catchError((error) => {
          return throwError(
            () =>
              new Error(error.error?.message || "Failed to add to favorites"),
          );
        }),
      );
  }

  removeFromFavorites(imdbId: string): Observable<unknown> {
    return this.http.delete(`${this.API_URL}/favorites/${imdbId}`).pipe(
      catchError((error) => {
        return throwError(
          () =>
            new Error(
              error.error?.message || "Failed to remove from favorites",
            ),
        );
      }),
    );
  }

  getFavorites(): Observable<UserMovie[]> {
    return this.http
      .get<UserMovie[]>(`${this.API_URL}/movies/favorites`)
      .pipe(catchError(() => of([])));
  }

  addToWatched(imdbId: string): Observable<UserMovie> {
    return this.http
      .post<UserMovie>(`${this.API_URL}/movies/watched`, { imdbId })
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Failed to add to watched"),
          );
        }),
      );
  }

  removeFromWatched(imdbId: string): Observable<unknown> {
    return this.http.delete(`${this.API_URL}/movies/watched/${imdbId}`).pipe(
      catchError((error) => {
        return throwError(
          () =>
            new Error(error.error?.message || "Failed to remove from watched"),
        );
      }),
    );
  }

  getWatched(): Observable<UserMovie[]> {
    return this.http
      .get<UserMovie[]>(`${this.API_URL}/movies/watched`)
      .pipe(catchError(() => of([])));
  }

  // Admin endpoints
  getMostFavorited(): Observable<RankingItem[]> {
    return this.http
      .get<RankingItem[]>(`${this.API_URL}/movies/rankings/favorites`)
      .pipe(catchError(() => of([])));
  }

  getMostWatched(): Observable<RankingItem[]> {
    return this.http
      .get<RankingItem[]>(`${this.API_URL}/movies/rankings/watched`)
      .pipe(catchError(() => of([])));
  }

  searchUsers(query?: string): Observable<UserWithMovies[]> {
    const params: any = {};
    if (query && query.trim()) {
      params.query = query.trim();
    }

    return this.http
      .get<UserWithMovies[]>(`${this.API_URL}/users`, { params })
      .pipe(catchError(() => of([])));
  }
}
