import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MovieService } from "../../services/movie.service";
import { UserWithMovies } from "../../models/movie.model";
import { AuthService } from "../../services/auth.service";
import { ErrorService } from "../../services/error.service";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-text mb-2">
          Gerenciamento de Usuários
        </h1>
        <p class="text-text-muted">
          Procure e visualize informações dos usuários
        </p>
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
                <!-- Button Delete User -->
                <button
                  type="button"
                  (click)="confirmDeleteUser(user.id)"
                  class="px-3 py-1 rounded-lg bg-error text-white hover:bg-error/90 text-sm">
                  Deletar
                </button>
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
                      Favoritado ({{ user.favorites.length || 0 }})
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
                      <p class="text-sm text-text-muted">
                        Sem filmes favoritos
                      </p>
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
                      Assistidos ({{ user.watched.length || 0 }})
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
                      <p class="text-sm text-text-muted">
                        Sem filmes assistidos
                      </p>
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
          <h3 class="text-xl font-semibold text-text mb-2">
            Encontre Usuários
          </h3>
          <p class="text-text-muted">Digite um email para encontrar usuários</p>
        </div>
      }
    </div>
    @if (confirmUserId()) {
      <div
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div class="bg-surface p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h2 class="text-lg font-bold mb-3">Confirmar exclusão</h2>
          <p class="text-sm text-text-muted mb-4">
            Tem certeza que deseja deletar este usuário?
          </p>

          <div class="flex justify-end gap-3">
            <button
              (click)="confirmUserId.set(null)"
              class="px-4 py-2 bg-gray-300 rounded-lg">
              Cancelar
            </button>

            <button
              (click)="deleteUserConfirmed()"
              class="px-4 py-2 bg-error text-white rounded-lg">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Icon Toast -->

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
  `,
})
export class UsersComponent {
  searchQuery = "";
  users = signal<UserWithMovies[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);
  toastMessage = signal("");
  toastType = signal<"success" | "error">("success");
  confirmUserId = signal<string | null>(null);

  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private errorService: ErrorService,
  ) {}
  private toastTimeout?: ReturnType<typeof setTimeout>;
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

  confirmDeleteUser(userId: string) {
    this.confirmUserId.set(userId);
  }

  deleteUserConfirmed() {
    const userId = this.confirmUserId();
    if (!userId) return;

    this.authService.deleteAccountAdmin(userId).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== userId));
        this.showToast("Conta excluída com sucesso", "success");
        this.confirmUserId.set(null);
      },
      error: (err) => {
        const message = this.errorService.extractMessage(err);
        const translated = this.errorService.translate(message);
        this.showToast(translated, "error");
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
