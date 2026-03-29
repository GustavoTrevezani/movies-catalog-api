import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MovieCardComponent } from "../../components/movie-card/movie-card.component";
import { MovieService } from "../../services/movie.service";
import { Movie } from "../../models/movie.model";
import { ErrorService } from "../../services/error.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-text mb-2">Filmes</h1>
        <p class="text-text-muted">Pesquise pelo nome em inglês dos filmes!</p>
      </div>

      <!-- Search Section -->
      <div class="card p-6 mb-8">
        <form (ngSubmit)="searchMovies()" class="flex gap-3">
          <div class="flex-1 relative">
            <svg
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              name="searchQuery"
              placeholder="Harry Potter..."
              class="input-field pl-12" />
          </div>
          <button
            type="submit"
            [disabled]="isLoading() || !searchQuery.trim()"
            class="btn-primary flex items-center gap-2">
            @if (isLoading()) {
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Procurando...
            } @else {
              Enviar
            }
          </button>
        </form>
      </div>

      <!-- Results Section -->
      @if (movies().length > 0) {
        <div class="mb-4 flex items-center justify-between">
          <p class="text-text-muted">
            Achado
            <span class="text-text font-medium">{{ movies().length }}</span>
            resultados para "{{ searchQuery }}"
          </p>
        </div>
        <div
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          @for (movie of movies(); track movie.id) {
            <app-movie-card
              [movie]="movie"
              (favorite)="addToFavorites($event)"
              (watched)="addToWatched($event)" />
          }
        </div>
      } @else if (hasSearched() && !isLoading()) {
        <div class="card p-12 text-center">
          <div
            class="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              class="w-10 h-10 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-text mb-2">
            Desculpe não achei seu filme
          </h3>
          <p class="text-text-muted">
            Tente procurar usando diferentes palavras-chave
          </p>
        </div>
      } @else if (!hasSearched()) {
        <div class="card p-12 text-center">
          <div
            class="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              class="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-text mb-2">Procure filmes</h3>
          <p class="text-text-muted">
            Procure pelo seus filmes preferidos para começar
          </p>
        </div>
      }

      <!-- Toast Notification -->
      @if (toastMessage()) {
        <div
          class="fixed bottom-6 right-6 z-[9999] px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up text-white"
          [ngClass]="{
            'bg-green-500': toastType() === 'success',
            'bg-orange-500': toastType() === 'error',
          }">
          <!-- Ícone sucesso -->
          @if (toastType() === "success") {
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7" />
            </svg>
          }

          <!-- Ícone erro -->
          @if (toastType() === "error") {
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          }

          {{ toastMessage() }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes slide-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-slide-up {
        animation: slide-up 0.3s ease-out;
      }
    `,
  ],
})
export class DashboardComponent {
  searchQuery = "";
  movies = signal<Movie[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);
  toastMessage = signal("");
  toastType = signal<"success" | "error">("success");

  constructor(
    private movieService: MovieService,
    private errorService: ErrorService,
  ) {}
  private toastTimeout?: ReturnType<typeof setTimeout>;

  searchMovies(): void {
    if (!this.searchQuery.trim()) return;

    this.isLoading.set(true);
    this.hasSearched.set(true);

    this.movieService.searchMovies(this.searchQuery).subscribe({
      next: (movies) => {
        this.movies.set(movies);
        this.isLoading.set(false);
      },
      error: () => {
        this.movies.set([]);
        this.isLoading.set(false);
      },
    });
  }

  addToFavorites(movie: Movie): void {
    this.movieService.addToFavorites(movie.id).subscribe({
      next: () => this.showToast("Filme adicionado aos favoritos", "success"),
      error: (err) => {
        const message = this.errorService.extractMessage(err);
        const translated = this.errorService.translate(message);

        this.showToast(translated, "error");
      },
    });
  }

  addToWatched(movie: Movie): void {
    this.movieService.addToWatched(movie.id).subscribe({
      next: () => this.showToast("Filme adicionado aos assistidos", "success"),
      error: (err) => {
        const message = this.errorService.extractMessage(err);
        const translated = this.errorService.translate(message);

        this.showToast(translated, "error");
      },
    });
  }

  private showToast(
    message: string,
    type: "success" | "error" = "success",
  ): void {
    this.toastMessage.set(message);
    this.toastType.set(type);

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastMessage.set("");
    }, 3000);
  }
}
