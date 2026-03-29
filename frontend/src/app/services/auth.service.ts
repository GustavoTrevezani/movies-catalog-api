import { Injectable, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap, catchError, throwError } from "rxjs";
import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RequestResetRequest,
  ResetPasswordRequest,
} from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = "http://localhost:3000";
  private readonly TOKEN_KEY = "jwt_token";
  private readonly USER_KEY = "user_data";

  private userSignal = signal<User | null>(this.getStoredUser());

  user = this.userSignal.asReadonly();
  isAdmin = computed(() => this.userSignal()?.role === "ADMIN");
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    if (this.isAuthenticated()) {
      this.loadUser();
    }
  }

  getMe() {
    return this.http.get<User>(`${this.API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Login failed"),
          );
        }),
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/register`, data)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Registration failed"),
          );
        }),
      );
  }

  registerAdmin(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/register-admin`, data)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Registration failed"),
          );
        }),
      );
  }

  requestPasswordReset(data: RequestResetRequest): Observable<void> {
    return this.http
      .post<void>(`${this.API_URL}/auth/request-reset`, data)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Request failed"),
          );
        }),
      );
  }

  resetPassword(data: ResetPasswordRequest): Observable<void> {
    return this.http
      .post<void>(`${this.API_URL}/auth/reset-password`, data)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Reset failed"),
          );
        }),
      );
  }

  changePasswordLogged(
    currentPassword: string,
    newPassword: string,
  ): Observable<void> {
    return this.http
      .patch<void>(
        `${this.API_URL}/auth/new-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        },
      )
      .pipe(
        catchError((error) => {
          return throwError(
            () =>
              new Error(error.error?.message || "Failed to change password"),
          );
        }),
      );
  }

  deleteAccount(password: string): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/auth/delete-account`, {
        body: { password },
      })
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Failed to delete account"),
          );
        }),
      );
  }

  deleteAccountAdmin(userId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/users/admin/delete-user/${userId}`)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Failed to delete account"),
          );
        }),
      );
  }

  loadUser() {
    this.getMe().subscribe({
      next: (user) => {
        this.userSignal.set(user);
      },
      error: () => {
        localStorage.removeItem(this.TOKEN_KEY);
        this.userSignal.set(null);
        this.router.navigate(["/login"]);
      },
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSignal.set(null);
    this.router.navigate(["/login"]);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/me`).pipe(
      tap((user) => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.userSignal.set(user);
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error.error?.message || "Failed to get user"),
        );
      }),
    );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    if (response.user) {
      this.userSignal.set(response.user);
    } else {
      // fallback caso não venha user
      this.loadUser();
    }
  }

  private getStoredUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}
