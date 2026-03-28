import { Component, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MovieCardComponent } from "../../components/movie-card/movie-card.component";
import { MovieService } from "../../services/movie.service";
import { AuthService } from "../../services/auth.service";
import { Movie, UserMovie } from "../../models/movie.model";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Profile Header -->
      <div class="card p-6 mb-8">
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {{ userInitials }}
          </div>
          <div>
            <h1 class="text-2xl font-bold text-text">
              {{ authService.user()?.email || "Carregando..." }}
            </h1>
            <div class="flex items-center gap-2 mt-1">
              <span class="badge-primary">{{ authService.user()?.role }}</span>
              <span class="text-sm text-text-muted"
                >Membro desde
                {{ formatDate(authService.user()?.createdAt) }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-border mb-6">
        <div class="flex gap-4">
          <button
            (click)="activeTab.set('favorites')"
            [class]="
              activeTab() === 'favorites' ? 'tab-btn-active' : 'tab-btn'
            ">
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              Favoritos ({{ favorites().length }})
            </span>
          </button>
          <button
            (click)="activeTab.set('watched')"
            [class]="activeTab() === 'watched' ? 'tab-btn-active' : 'tab-btn'">
            <span class="flex items-center gap-2">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Assistidos ({{ watched().length }})
            </span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="flex items-center justify-center py-12">
          <svg
            class="animate-spin h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      } @else {
        <!-- Favorites Tab -->
        @if (activeTab() === "favorites") {
          @if (favorites().length > 0) {
            <div
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              @for (userMovie of favorites(); track userMovie.id) {
                <app-movie-card
                  [movie]="userMovie.movie"
                  [isRemoveMode]="true"
                  (remove)="removeFromFavorites($event)" />
              }
            </div>
          } @else {
            <div class="card p-12 text-center">
              <div
                class="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  class="w-10 h-10 text-text-muted"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-text mb-2">
                Sem favoritos por enquanto
              </h3>
              <p class="text-text-muted">
                Comece a adicionar filmes à sua lista de favoritos
              </p>
            </div>
          }
        }

        <!-- Watched Tab -->
        @if (activeTab() === "watched") {
          @if (watched().length > 0) {
            <div
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              @for (userMovie of watched(); track userMovie.id) {
                <app-movie-card
                  [movie]="userMovie.movie"
                  [isRemoveMode]="true"
                  (remove)="removeFromWatched($event)" />
              }
            </div>
          } @else {
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-text mb-2">
                Sem filmes assistidos
              </h3>
              <p class="text-text-muted">
                Marque filmes como assistidos para vê-los aqui
              </p>
            </div>
          }
        }
      }

      <!-- Toast Notification -->
      @if (toastMessage()) {
        <div
          class="fixed bottom-6 right-6 bg-success text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
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
          {{ toastMessage() }}
        </div>
      }
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  activeTab = signal<"favorites" | "watched">("favorites");
  favorites = signal<UserMovie[]>([]);
  watched = signal<UserMovie[]>([]);
  isLoading = signal(true);
  toastMessage = signal("");

  constructor(
    private movieService: MovieService,
    public authService: AuthService,
  ) {}

  get userInitials(): string {
    const email = this.authService.user()?.email || "";
    return email.split("@")[0].charAt(0).toUpperCase();
  }

  formatDate(dateString?: string): string {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    forkJoin([
      this.movieService.getFavorites(),
      this.movieService.getWatched(),
      this.authService.getMe(),
    ]).subscribe({
      next: ([favorites, watched]) => {
        this.favorites.set(favorites || []);
        this.watched.set(watched || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  removeFromFavorites(movie: Movie): void {
    this.movieService.removeFromFavorites(movie.id).subscribe({
      next: () => {
        this.favorites.update((items) =>
          items.filter((item) => item.movieId !== movie.id),
        );
        this.showToast("Removed from favorites");
      },
      error: (err) => this.showToast(err.message),
    });
  }

  removeFromWatched(movie: Movie): void {
    this.movieService.removeFromWatched(movie.id).subscribe({
      next: () => {
        this.watched.update((items) =>
          items.filter((item) => item.movieId !== movie.id),
        );
        this.showToast("Removed from watched");
      },
      error: (err) => this.showToast(err.message),
    });
  }

  private showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => this.toastMessage.set(""), 3000);
  }
}
