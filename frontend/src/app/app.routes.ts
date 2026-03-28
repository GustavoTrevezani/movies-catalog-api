import { Routes } from "@angular/router";
import { authGuard, adminGuard, guestGuard } from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: "register",
    loadComponent: () =>
      import("./pages/register/register.component").then(
        (m) => m.RegisterComponent,
      ),
    canActivate: [guestGuard],
  },
  {
    path: "reset-password",
    loadComponent: () =>
      import("./pages/login/reset-password/reset-password.component").then(
        (m) => m.ResetPasswordComponent,
      ),
    canActivate: [guestGuard],
  },
  {
    path: "movies",
    loadComponent: () =>
      import("./pages/dashboard/dashboard.component").then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./pages/profile/profile.component").then(
        (m) => m.ProfileComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: "ranking",
    loadComponent: () =>
      import("./pages/ranking/ranking.component").then(
        (m) => m.RankingComponent,
      ),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: "users",
    loadComponent: () =>
      import("./pages/users/users.component").then((m) => m.UsersComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: "**",
    redirectTo: "login",
  },
];
