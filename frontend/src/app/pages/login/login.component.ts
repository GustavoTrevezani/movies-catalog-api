import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { errorTranslations } from "../../shared/i18n/error";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-background px-4">
      <div class="w-full max-w-md">
        <div class="card p-8">
          <div class="text-center mb-8">
            <div
              class="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-text">Bem vindo de volta</h1>
            <p class="text-text-muted mt-2">Entre em sua conta de filmes</p>
          </div>

          <form
            [formGroup]="loginForm"
            (ngSubmit)="onSubmit()"
            class="space-y-5">
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-text mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="input-field"
                placeholder="Enter your email" />
              @if (
                loginForm.get("email")?.touched &&
                loginForm.get("email")?.errors?.["required"]
              ) {
                <p class="text-error text-sm mt-1">Email é obrigatório</p>
              }
              @if (
                loginForm.get("email")?.touched &&
                loginForm.get("email")?.errors?.["email"]
              ) {
                <p class="text-error text-sm mt-1">Formato de email inválido</p>
              }
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-text mb-1.5">
                Senha
              </label>
              <input
                type="password"
                id="password"
                formControlName="password"
                class="input-field"
                placeholder="Coloque sua senha" />
              @if (
                loginForm.get("password")?.touched &&
                loginForm.get("password")?.errors?.["required"]
              ) {
                <p class="text-error text-sm mt-1">Senha é obrigatória</p>
              }
            </div>

            @if (errorMessage()) {
              <div class="bg-error/10 border border-error/30 rounded-lg p-3">
                <p class="text-error text-sm">{{ errorMessage() }}</p>
              </div>
            }

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading()"
              class="btn-primary w-full flex items-center justify-center gap-2">
              @if (isLoading()) {
                <svg
                  class="animate-spin h-5 w-5"
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
                Acessando...
              } @else {
                Entrar
              }
            </button>
          </form>

          <p class="text-center text-text-muted mt-6">
            Não tem uma conta?
            <a
              routerLink="/register"
              class="text-primary hover:text-primary-hover font-medium">
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal("");

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set("");

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(["/movies"]);
      },
      error: (error) => {
        const msg = error.message || "Erro desconhecido";
        this.errorMessage.set(errorTranslations[msg] || msg);
        this.isLoading.set(false);
      },
    });
  }
}
