import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div class="w-full max-w-md">
        <div class="bg-slate-800 rounded-lg shadow-xl p-8">
          <h1 class="text-2xl font-bold text-white mb-6 text-center">
            Redefinir Senha
          </h1>

          <!-- Step 1: Request Token -->
          @if (!tokenReceived()) {
            <form [formGroup]="requestForm" (ngSubmit)="onRequestToken()">
              <div class="mb-4">
                <label class="block text-slate-300 text-sm font-medium mb-2">
                  Seu Email
                </label>
                <input
                  type="email"
                  formControlName="email"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Digite seu email" />
                @if (
                  requestForm.get("email")?.invalid &&
                  requestForm.get("email")?.touched
                ) {
                  <p class="text-red-400 text-sm mt-1">
                    Email precisa ser válido
                  </p>
                }
              </div>

              @if (requestError()) {
                <div
                  class="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                  {{ requestError() }}
                </div>
              }

              <button
                type="submit"
                [disabled]="requestForm.invalid || isRequestLoading()"
                class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors">
                @if (isRequestLoading()) {
                  <span class="flex items-center justify-center gap-2">
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
                    solicitando...
                  </span>
                } @else {
                  solicitar token de redefinição
                }
              </button>
            </form>
          }

          <!-- Step 2: Reset Password with Token -->
          @if (tokenReceived()) {
            <div
              class="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg">
              <p class="text-green-400 text-sm font-medium mb-2">
                Token gerado com sucesso!
              </p>
              <p class="text-slate-300 text-xs mb-2">
                Aqui irá mostrar o token para facilitar os testes, mas em um
                cenário real ele seria enviado por email.
              </p>
              <div class="flex items-center gap-2">
                <code
                  class="flex-1 text-amber-400 px-3 py-2 rounded text-sm font-mono break-all">
                  {{ generatedToken() }}
                </code>
                <button
                  type="button"
                  (click)="copyToken()"
                  class="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                  title="Copy token">
                  @if (copied()) {
                    <svg
                      class="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7" />
                    </svg>
                  } @else {
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  }
                </button>
              </div>
            </div>

            <form [formGroup]="resetForm" (ngSubmit)="onResetPassword()">
              <div class="mb-4">
                <label class="block text-slate-300 text-sm font-medium mb-2">
                  Seu email
                </label>
                <input
                  type="email"
                  [value]="requestForm.get('email')?.value"
                  disabled
                  class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed" />
              </div>

              <div class="mb-4">
                <label class="block text-slate-300 text-sm font-medium mb-2">
                  Seu Token
                </label>
                <input
                  type="text"
                  formControlName="token"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                  placeholder="Cole seu token aqui!" />
                @if (
                  resetForm.get("token")?.invalid &&
                  resetForm.get("token")?.touched
                ) {
                  <p class="text-red-400 text-sm mt-1">Token é obrigatório</p>
                }
              </div>

              <div class="mb-4">
                <label class="block text-slate-300 text-sm font-medium mb-2">
                  Nova Senha
                </label>
                <input
                  type="password"
                  formControlName="newPassword"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Digite a nova senha" />
                @if (
                  resetForm.get("newPassword")?.invalid &&
                  resetForm.get("newPassword")?.touched
                ) {
                  <p class="text-red-400 text-sm mt-1">
                    Senha precisa ter ao menos 6 caracteres
                  </p>
                }
              </div>

              <div class="mb-6">
                <label class="block text-slate-300 text-sm font-medium mb-2">
                  Confirme nova senha
                </label>
                <input
                  type="password"
                  formControlName="confirmPassword"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Digite novamente a senha" />
                @if (passwordMismatch()) {
                  <p class="text-red-400 text-sm mt-1">Senhas não coincidem</p>
                }
              </div>

              @if (resetError()) {
                <div
                  class="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                  {{ resetError() }}
                </div>
              }
              @if (resetSuccess()) {
                <div
                  class="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm">
                  Password reset successfully! Redirecting to login...
                </div>
              }

              <button
                type="submit"
                [disabled]="
                  resetForm.invalid || passwordMismatch() || isResetLoading()
                "
                class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors">
                @if (isResetLoading()) {
                  <span class="flex items-center justify-center gap-2">
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
                    Carregando...
                  </span>
                } @else {
                  Confirmar
                }
              </button>

              <button
                type="button"
                (click)="resetToStep1()"
                class="w-full mt-3 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors">
                Solicitar novo token
              </button>
            </form>
          }

          <p class="mt-6 text-center text-slate-400 text-sm">
            Lembrou da senha?
            <a
              routerLink="/login"
              class="text-indigo-400 hover:text-indigo-300 font-medium">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent {
  requestForm: FormGroup;
  resetForm: FormGroup;

  isRequestLoading = signal(false);
  isResetLoading = signal(false);
  requestError = signal("");
  resetError = signal("");
  resetSuccess = signal(false);
  tokenReceived = signal(false);
  generatedToken = signal("");
  copied = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.requestForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });

    this.resetForm = this.fb.group({
      token: ["", Validators.required],
      newPassword: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required],
    });
  }

  passwordMismatch(): boolean {
    const password = this.resetForm.get("newPassword")?.value;
    const confirm = this.resetForm.get("confirmPassword")?.value;
    return confirm && password !== confirm;
  }

  onRequestToken(): void {
    if (this.requestForm.invalid) return;

    this.isRequestLoading.set(true);
    this.requestError.set("");

    this.authService
      .requestPasswordReset({ email: this.requestForm.value.email })
      .subscribe({
        next: (response: any) => {
          this.isRequestLoading.set(false);
          this.generatedToken.set(response?.token || "");
          this.tokenReceived.set(true);
        },
        error: (error) => {
          this.isRequestLoading.set(false);
          this.requestError.set(error.error?.message || "Email inválido");
        },
      });
  }

  onResetPassword(): void {
    if (this.resetForm.invalid || this.passwordMismatch()) return;

    this.isResetLoading.set(true);
    this.resetError.set("");

    this.authService
      .resetPassword({
        token: this.resetForm.value.token,
        newPassword: this.resetForm.value.newPassword,
      })
      .subscribe({
        next: () => {
          this.isResetLoading.set(false);
          this.resetSuccess.set(true);
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 2000);
        },
        error: (error) => {
          this.isResetLoading.set(false);
          this.resetError.set(
            error.error?.message || "Falha ao redefinir senha",
          );
        },
      });
  }

  copyToken(): void {
    navigator.clipboard.writeText(this.generatedToken());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  resetToStep1(): void {
    this.tokenReceived.set(false);
    this.generatedToken.set("");
    this.resetForm.reset();
    this.resetError.set("");
    this.resetSuccess.set(false);
  }
}
