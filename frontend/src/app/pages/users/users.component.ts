import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MovieService } from "../../services/movie.service";
import { UserWithMovies } from "../../models/movie.model";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-text mb-2">User Management</h1>
        <p class="text-text-muted">Search and view user information</p>
      </div>

      <!-- Search Section -->
      <div class="card p-6 mb-8">
        <form (ngSubmit)="searchUsers()" class="flex gap-3">
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
              placeholder="Procure pelo email..."
              class="input-field pl-12" />
          </div>
          <button
            type="submit"
            [disabled]="isLoading()"
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
              Procurar
            }
          </button>
        </form>
      </div>

      <!-- Results Section -->
      @if (users().length > 0) {
        <div class="space-y-6">
          @for (user of users(); track user.id) {
            <div class="card overflow-hidden">
              <!-- User Header -->
              <div class="p-6 border-b border-border">
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-lg font-bold text-white">
                    {{ getUserInitials(user.email) }}
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-text">{{ user.email }}</h3>
                    <p class="text-sm text-text-muted">
                      Membro desde {{ formatDate(user.createdAt) }}
                    </p>
                  </div>
                  <span class="badge-primary">{{ user.role }}</span>
                </div>
              </div>

              <!-- User Movies -->
              <div class="p-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <!-- Favorites -->
                  <div>
                    <h4
                      class="font-medium text-text mb-3 flex items-center gap-2">
                      <svg
                        class="w-5 h-5 text-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                      </svg>
                      Favorites ({{ user.favorites?.length || 0 }})
                    </h4>
                    @if (user.favorites && user.favorites.length > 0) {
                      <div class="space-y-2 max-h-48 overflow-y-auto">
                        @for (userMovie of user.favorites; track userMovie.id) {
                          <div
                            class="flex items-center gap-3 p-2 bg-surface-hover rounded-lg">
                            <div
                              class="w-10 h-14 rounded overflow-hidden bg-background flex-shrink-0">
                              @if (
                                userMovie.movie.poster &&
                                userMovie.movie.poster !== "N/A"
                              ) {
                                <img
                                  [src]="userMovie.movie.poster"
                                  [alt]="userMovie.movie.title"
                                  class="w-full h-full object-cover" />
                              }
                            </div>
                            <div class="flex-1 min-w-0">
                              <p class="text-sm font-medium text-text truncate">
                                {{ userMovie.movie.title }}
                              </p>
                              <p class="text-xs text-text-muted">
                                {{ userMovie.movie.year }}
                              </p>
                            </div>
                          </div>
                        }
                      </div>
                    } @else {
                      <p class="text-sm text-text-muted">No favorites</p>
                    }
                  </div>

                  <!-- Watched -->
                  <div>
                    <h4
                      class="font-medium text-text mb-3 flex items-center gap-2">
                      <svg
                        class="w-5 h-5 text-success"
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
                      Watched ({{ user.watched?.length || 0 }})
                    </h4>
                    @if (user.watched && user.watched.length > 0) {
                      <div class="space-y-2 max-h-48 overflow-y-auto">
                        @for (userMovie of user.watched; track userMovie.id) {
                          <div
                            class="flex items-center gap-3 p-2 bg-surface-hover rounded-lg">
                            <div
                              class="w-10 h-14 rounded overflow-hidden bg-background flex-shrink-0">
                              @if (
                                userMovie.movie.poster &&
                                userMovie.movie.poster !== "N/A"
                              ) {
                                <img
                                  [src]="userMovie.movie.poster"
                                  [alt]="userMovie.movie.title"
                                  class="w-full h-full object-cover" />
                              }
                            </div>
                            <div class="flex-1 min-w-0">
                              <p class="text-sm font-medium text-text truncate">
                                {{ userMovie.movie.title }}
                              </p>
                              <p class="text-xs text-text-muted">
                                {{ userMovie.movie.year }}
                              </p>
                            </div>
                          </div>
                        }
                      </div>
                    } @else {
                      <p class="text-sm text-text-muted">No watched movies</p>
                    }
                  </div>
                </div>
              </div>
            </div>
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-text mb-2">No users found</h3>
          <p class="text-text-muted">Try searching with a different email</p>
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-text mb-2">Search for Users</h3>
          <p class="text-text-muted">Enter an email to find users</p>
        </div>
      }
    </div>
  `,
})
export class UsersComponent {
  searchQuery = "";
  users = signal<UserWithMovies[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);

  constructor(private movieService: MovieService) {}

  searchUsers(): void {
    this.isLoading.set(true);
    this.hasSearched.set(true);

    const query = this.searchQuery?.trim() || undefined;

    this.movieService.searchUsers(query).subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: () => {
        this.users.set([]);
        this.isLoading.set(false);
      },
    });
  }

  getUserInitials(email: string): string {
    return email.split("@")[0].charAt(0).toUpperCase();
  }

  formatDate(dateString?: string): string {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  }
}
