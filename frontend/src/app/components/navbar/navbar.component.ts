import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import {
  Validators,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  AbstractControl,
  FormsModule,
} from "@angular/forms";
import { ErrorService } from "../../services/error.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    FormsModule,
  ],
  template: `
    <nav
      class="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border z-50">
      <div
        class="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <!-- Logo -->
        <a routerLink="/movies" class="flex items-center gap-2">
          <div
            class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-white"
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
          <span class="font-bold text-text text-lg">MovieApp</span>
        </a>

        <!-- Navigation Links -->

        <div class="flex items-center gap-1">
          <!-- Movies Link -->
          <a
            routerLink="/movies"
            routerLinkActive="bg-surface-hover text-primary"
            class="btn-icon flex items-center gap-2 px-3 text-text-muted hover:text-text">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span class="hidden sm:inline">Descubra</span>
          </a>

          <!-- Admin Links -->

          @if (authService.isAdmin()) {
            <a
              routerLink="/ranking"
              routerLinkActive="bg-surface-hover text-primary"
              class="btn-icon flex items-center gap-2 px-3 text-text-muted hover:text-text"
              title="Rankings">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span class="hidden sm:inline">Ranking</span>
            </a>

            <a
              routerLink="/users"
              routerLinkActive="bg-surface-hover text-primary"
              class="btn-icon flex items-center gap-2 px-3 text-text-muted hover:text-text"
              title="Users">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="hidden sm:inline">Usuários</span>
            </a>
          }

          <!-- Profile Link -->

          <a
            routerLink="/profile"
            routerLinkActive="bg-surface-hover text-primary"
            class="btn-icon flex items-center gap-2 px-3 text-text-muted hover:text-text"
            title="Profile">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="hidden sm:inline">Perfil</span>
          </a>

          <!-- User Dropdown -->

          <div class="relative ml-2">
            <button
              (click)="isDropdownOpen.set(!isDropdownOpen())"
              class="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-hover transition-colors">
              <div
                class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-white">
                {{ userInitials }}
              </div>
              <svg
                class="w-4 h-4 text-text-muted transition-transform"
                [class.rotate-180]="isDropdownOpen()"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            @if (isDropdownOpen()) {
              <div
                class="absolute right-0 mt-2 min-w-[14rem] max-w-xs bg-surface rounded-lg border border-border shadow-xl">
                <div class="p-3 border-b border-border">
                  <p class="font-medium text-text">
                    <a
                      routerLink="/profile"
                      class="relative inline-block text-text hover:text-primary transition-colors duration-200
                      after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 
                    after:bg-primary after:transition-all after:duration-300 
                      hover:after:w-full">
                      {{ userEmailPrefix }}
                    </a>
                  </p>
                  <span class="text-xs text-text-muted">{{
                    authService.user()?.role
                  }}</span>
                </div>
                <div class="p-2 flex flex-col gap-1">
                  @if (authService.isAdmin()) {
                    <button
                      (click)="openCreateAdmin()"
                      class="w-full flex items-center gap-2 px-3 py-2 text-left text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      Criar Conta Admin
                    </button>
                  }
                  <!-- Change password-->

                  <button
                    (click)="openChangePassword()"
                    class="w-full flex items-center gap-2 px-3 py-2 text-left text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    Trocar Senha
                  </button>

                  <!-- Change logout-->

                  <button
                    (click)="logout()"
                    class="w-full flex items-center gap-2 px-3 py-2 text-left text-error hover:bg-error/10 rounded-lg transition-colors">
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Desconectar
                  </button>

                  <!-- Delete Account -->
                  <button
                    (click)="openDeleteModal()"
                    class="w-full flex items-center gap-2 px-3 py-2 text-left text-error hover:bg-error/10 rounded-lg transition-colors">
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Excluir conta
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </nav>

    <!-- Backdrop for closing dropdown -->
    @if (isDropdownOpen()) {
      <div class="fixed inset-0 z-40" (click)="isDropdownOpen.set(false)"></div>
    }
    <!-- Create Admin Modal -->

    <div
      *ngIf="isCreateAdminOpen()"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-surface rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 class="text-xl font-bold text-center mb-6">Criar Conta Admin</h2>

        <form
          [formGroup]="adminForm"
          (ngSubmit)="createAdmin()"
          class="flex flex-col gap-4">
          <!-- Email -->
          <div class="flex flex-col">
            <label class="mb-1 font-medium text-text">Email</label>
            <input
              type="email"
              placeholder="Email do admin"
              formControlName="email"
              class="border border-gray-300 rounded-lg p-2 text-black"
              required />
            @if (
              adminForm.get("email")?.touched &&
              adminForm.get("email")?.errors?.["required"]
            ) {
              <p class="text-error text-sm mt-1">Email é obrigatório</p>
            }
            @if (
              adminForm.get("email")?.touched &&
              adminForm.get("email")?.errors?.["email"]
            ) {
              <p class="text-error text-sm mt-1">Formato de email inválido</p>
            }
          </div>

          <!-- Password admin Modal-->

          <div class="flex flex-col">
            <label class="mb-1 font-medium text-text">Senha</label>
            <input
              type="password"
              placeholder="Sua senha"
              formControlName="password"
              class="border border-gray-300 rounded-lg p-2 text-black"
              [ngClass]="{
                'border-red-500':
                  adminForm.get('confirmPassword')?.touched &&
                  adminForm.get('confirmPassword')?.invalid,
              }"
              required />
            @if (
              adminForm.get("password")?.touched &&
              adminForm.get("password")?.errors?.["required"]
            ) {
              <p class="text-error text-sm mt-1">Senha é obrigatória</p>
            }
            @if (
              adminForm.get("password")?.touched &&
              adminForm.get("password")?.errors?.["minlength"]
            ) {
              <p class="text-error text-sm mt-1">
                A senha deve ter pelo menos 6 caracteres
              </p>
            }
          </div>

          <!-- Buttons -->

          <div class="flex justify-end gap-3 mt-4">
            <button
              type="button"
              (click)="isCreateAdminOpen.set(false)"
              class="px-4 py-2 rounded-lg bg-red-500 text-white">
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="adminForm.invalid"
              class="px-4 py-2 rounded-lg bg-primary text-white">
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Change Password Modal -->

    <div
      *ngIf="isChangePasswordOpen()"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-surface rounded-lg p-6 w-full max-w-md shadow-lg">
        <!-- Título centralizado -->
        <h2 class="text-xl font-bold text-center mb-6">Trocar Senha</h2>

        <form
          [formGroup]="passwordForm"
          (ngSubmit)="changePassword()"
          class="flex flex-col gap-4">
          <!-- Current Password -->
          <div class="flex flex-col">
            <label for="currentPassword" class="mb-1 font-medium text-text"
              >Senha Atual</label
            >
            <input
              id="currentPassword"
              type="password"
              placeholder="Senha Atual"
              formControlName="currentPassword"
              class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary text-black"
              [ngClass]="{
                'border-red-500':
                  passwordForm.get('currentPassword')?.touched &&
                  passwordForm.get('currentPassword')?.invalid,
                'border-gray-300':
                  !passwordForm.get('currentPassword')?.invalid,
              }"
              required />
            @if (
              passwordForm.get("currentPassword")?.touched &&
              passwordForm.get("currentPassword")?.errors?.["required"]
            ) {
              <p class="text-error text-sm mt-1">Senha atual é obrigatória</p>
            }
          </div>

          <!-- New Password -->

          <div class="flex flex-col">
            <label for="newPassword" class="mb-1 font-medium text-text"
              >Nova Senha</label
            >
            <input
              id="newPassword"
              type="password"
              placeholder="Nova Senha"
              formControlName="newPassword"
              class="border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary text-black"
              [ngClass]="{
                'border-red-500':
                  passwordForm.get('newPassword')?.touched &&
                  passwordForm.get('newPassword')?.invalid,
                'border-gray-300': !passwordForm.get('newPassword')?.invalid,
              }"
              required />
            @if (
              passwordForm.get("newPassword")?.touched &&
              passwordForm.get("newPassword")?.errors?.["minlength"]
            ) {
              <p class="text-error text-sm mt-1">
                A nova senha deve ter pelo menos 6 caracteres
              </p>
            }
          </div>

          <!-- Confirm New Password -->

          <div class="flex flex-col">
            <label for="confirmPassword" class="mb-1 font-medium text-text"
              >Confirmar Senha</label
            >
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirmar Senha"
              formControlName="confirmPassword"
              class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary text-black"
              [ngClass]="{
                'border-red-500':
                  passwordForm.get('confirmPassword')?.touched &&
                  (passwordForm.get('confirmPassword')?.invalid ||
                    passwordForm.errors?.['mismatch']),
              }"
              required />
            @if (
              passwordForm.get("confirmPassword")?.touched &&
              passwordForm.get("confirmPassword")?.errors?.["required"]
            ) {
              <p class="text-error text-sm mt-1">
                Confirmar senha é obrigatório
              </p>
            }
            @if (
              passwordForm.get("confirmPassword")?.touched &&
              passwordForm.errors?.["mismatch"]
            ) {
              <p class="text-error text-sm mt-1">As senhas não coincidem</p>
            }
          </div>

          <!-- Botões -->
          <div class="flex justify-end gap-3 mt-4">
            <button
              type="button"
              (click)="isChangePasswordOpen.set(false)"
              class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium">
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="passwordForm.invalid"
              class="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
    <div
      *ngIf="isDeleteModalOpen()"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-surface rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 class="text-xl font-bold text-center mb-4">
          Confirmar exclusão da conta
        </h2>
        <p class="text-sm text-text-muted mb-4">
          Digite sua senha para confirmar a exclusão permanente da conta.
        </p>
        <label for="deletePassword" class="mb-1 font-medium text-text">
          Senha
        </label>

        <input
          type="password"
          [ngModel]="deletePassword()"
          (ngModelChange)="deletePassword.set($event)"
          placeholder="Senha"
          class="border border-grey-300 text-black rounded-lg p-2 w-full mb-4"
          [ngClass]="{
            'border-red-500':
              deleteForm.get('password')?.touched &&
              deleteForm.get('password')?.invalid,
          }" />
        <p
          *ngIf="
            deleteForm.get('password')?.touched &&
            deleteForm.get('password')?.errors?.['required']
          "
          class="text-error text-sm mt-1">
          Senha é obrigatória
        </p>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            (click)="isDeleteModalOpen.set(false)"
            class="px-4 py-2 rounded-lg bg-gray-300 text-black">
            Cancelar
          </button>
          <button
            type="button"
            (click)="confirmDeleteAccount(deletePassword())"
            class="px-4 py-2 rounded-lg bg-error text-white hover:bg-error/90">
            Confirmar
          </button>
        </div>
      </div>
    </div>
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
export class NavbarComponent {
  isDropdownOpen = signal(false);
  isChangePasswordOpen = signal(false);
  isCreateAdminOpen = signal(false);
  toastMessage = signal("");
  toastType = signal<"success" | "error">("success");
  isDeleteModalOpen = signal(false);
  deletePassword = signal("");

  passwordForm: FormGroup = this.fb.group(
    {
      currentPassword: ["", Validators.required],
      newPassword: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

  adminForm: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  deleteForm: FormGroup = this.fb.group({
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private errorService: ErrorService,
  ) {}
  private toastTimeout?: ReturnType<typeof setTimeout>;

  get userInitials(): string {
    const email = this.authService.user()?.email || "";
    return email.split("@")[0].charAt(0).toUpperCase();
  }

  get userEmailPrefix(): string {
    const email = this.authService.user()?.email || "";
    return email.split("@")[0];
  }

  logout(): void {
    this.isDropdownOpen.set(false);
    this.authService.logout();
  }

  confirmDeleteAccount(password: string): void {
    if (!password) {
      this.showToast("Digite sua senha para continuar", "error");
      return;
    }

    this.authService.deleteAccount(password).subscribe({
      next: () => {
        setTimeout(() => {
          this.showToast("Conta excluída com sucesso", "success");
          this.isDeleteModalOpen.set(false);
          this.logout();
        }, 500);
      },
      error: (err) => {
        const message = this.errorService.extractMessage(err);
        const translated = this.errorService.translate(message);
        this.showToast(translated, "error");
      },
    });
  }

  openDeleteModal(): void {
    this.isDeleteModalOpen.set(true);
  }

  openChangePassword(): void {
    this.isDropdownOpen.set(false);
    this.isChangePasswordOpen.set(true);
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    const { currentPassword, newPassword, confirmPassword } =
      this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.showToast("As senhas não coincidem", "error");
      return;
    }

    this.authService
      .changePasswordLogged(currentPassword!, newPassword!)
      .subscribe({
        next: () => {
          this.showToast("Senha atualizada com sucesso", "success");
          this.isChangePasswordOpen.set(false);
          this.passwordForm.reset();
        },
        error: (err) => {
          const message = this.errorService.extractMessage(err);
          const translated = this.errorService.translate(message);

          this.showToast(translated, "error");
        },
      });
  }

  // Create admin
  openCreateAdmin(): void {
    this.isDropdownOpen.set(false);
    this.isCreateAdminOpen.set(true);
  }

  createAdmin(): void {
    if (this.adminForm.invalid) return;

    const { email, password } = this.adminForm.value;

    this.authService.registerAdmin({ email, password }).subscribe({
      next: () => {
        this.showToast("Admin criado com sucesso", "success");
        this.isCreateAdminOpen.set(false);
        this.adminForm.reset();
      },
      error: (err) => {
        const message = this.errorService.extractMessage(err);
        const translated = this.errorService.translate(message);

        this.showToast(translated, "error");
      },
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get("newPassword")?.value;
    const confirmPassword = control.get("confirmPassword")?.value;

    if (!newPassword || !confirmPassword) return null;

    return newPassword === confirmPassword ? null : { mismatch: true };
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
