import { Component, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MovieService } from "../../services/movie.service";
import { RankingItem } from "../../models/movie.model";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-ranking",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-text mb-2">Rankings Dos Filmes</h1>
        <p class="text-text-muted">
          Veja os filmes mais amados e assistidos pelos usuários
        </p>
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
              Mais Favoritados
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
              Mais assistidos
            </span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="flex items-center justify-center py-12">
          <svg
            class="animate-spin h-8 w-8 text-primary"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      } @else {
        <!-- Favorites Ranking -->
        @if (activeTab() === "favorites") {
          @if (mostFavorited().length > 0) {
            <div class="space-y-4">
              @for (
                item of mostFavorited();
                track item.movie?.id;
                let i = $index
              ) {
                <div class="card p-4 flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                    [ngClass]="{
                      'bg-yellow-500 text-black': i === 0,
                      'bg-gray-400 text-black': i === 1,
                      'bg-amber-700 text-white': i === 2,
                      'bg-surface-hover text-text-muted': i > 2,
                    }">
                    {{ i + 1 }}
                  </div>
                  <div
                    class="w-16 h-24 rounded overflow-hidden bg-surface-hover flex-shrink-0">
                    @if (item.movie.poster && item.movie.poster !== "N/A") {
                      <img
                        [src]="item.movie.poster"
                        [alt]="item.movie.title"
                        class="w-full h-full object-cover" />
                    }
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-text">
                      {{ item.movie.title }}
                    </h3>
                    <p class="text-sm text-text-muted">
                      {{ item.movie.year }}
                    </p>
                  </div>
                  <div class="text-right">
                    <span class="badge-accent"
                      >{{ item.count }} Favorito(s)</span
                    >
                  </div>
                </div>
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
              <h3 class="text-xl font-semibold text-text mb-2">No data yet</h3>
              <p class="text-text-muted">Nenhum filme ainda foi favoritado</p>
            </div>
          }
        }

        <!-- Watched Ranking -->
        @if (activeTab() === "watched") {
          @if (mostWatched().length > 0) {
            <div class="space-y-4">
              @for (
                item of mostWatched();
                track item.movie.id;
                let i = $index
              ) {
                <div class="card p-4 flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                    [ngClass]="{
                      'bg-yellow-500 text-black': i === 0,
                      'bg-gray-400 text-black': i === 1,
                      'bg-amber-700 text-white': i === 2,
                      'bg-surface-hover text-text-muted': i > 2,
                    }">
                    {{ i + 1 }}
                  </div>
                  <div
                    class="w-16 h-24 rounded overflow-hidden bg-surface-hover flex-shrink-0">
                    @if (item.movie.poster && item.movie.poster !== "N/A") {
                      <img
                        [src]="item.movie.poster"
                        [alt]="item.movie.title"
                        class="w-full h-full object-cover" />
                    }
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-text">
                      {{ item.movie.title }}
                    </h3>
                    <p class="text-sm text-text-muted">{{ item.movie.year }}</p>
                  </div>
                  <div class="text-right">
                    <span class="badge-success"
                      >{{ item.count }} assistido(s)</span
                    >
                  </div>
                </div>
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
              <h3 class="text-xl font-semibold text-text mb-2">No data yet</h3>
              <p class="text-text-muted">Nenhum filme ainda foi assistido</p>
            </div>
          }
        }
      }
    </div>
  `,
})
export class RankingComponent implements OnInit {
  activeTab = signal<"favorites" | "watched">("favorites");
  mostFavorited = signal<RankingItem[]>([]);
  mostWatched = signal<RankingItem[]>([]);
  isLoading = signal(true);

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    forkJoin({
      favorited: this.movieService.getMostFavorited(),
      watched: this.movieService.getMostWatched(),
    }).subscribe({
      next: ({ favorited, watched }) => {
        this.mostFavorited.set(
          (favorited || []).filter((item) => item.count > 0),
        );
        this.mostWatched.set((watched || []).filter((item) => item.count > 0));
        this.isLoading.set(false);
      },
      error: () => {
        this.mostFavorited.set([]);
        this.mostWatched.set([]);
        this.isLoading.set(false);
      },
    });
  }
}
