import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  private errorsMap: Record<string, string> = {
    "User not found": "Usuário não encontrado",
    "Invalid credentials": "Credenciais inválidas",
    "Email already in use": "Email já cadastrado",
    Unauthorized: "Não autorizado",
    "Invalid token": "Token inválido",
    "Token expired": "Token expirado",
    "Movie not found": "Filme não encontrado",
    "Movie not found on OMDb": "Filme não encontrado na OMDb",
    "Movie already marked as watched": "Filme já marcado como assistido",
    "Movie not in favorites": "Filme não está nos favoritos",
    "Movie already in favorites": "Filme já está nos favoritos",
    // ---- Movie actions ----
    "Movie added to favorites": "Adicionado aos favoritos",
    "Movie added to watched": "Adicionado aos assistidos",
    "Failed to add to favorites": "Falha ao adicionar aos favoritos",
    "Failed to remove from favorites": "Falha ao remover dos favoritos",
    "Failed to add to watched": "Falha ao adicionar aos assistidos",
    "Failed to remove from watched": "Falha ao remover dos assistidos",
    "Movie not marked as watched": "Filme não marcado como assistido",

    //   ----  Password --------
    "newPassword must be longer than or equal to 6 characters":
      "A nova senha deve conter no mínimo 6 caracteres",
    "Passwords do not match": "As senhas não coincidem",
    "Current password is incorrect": "Senha atual incorreta",
    "Password updated successfully": "Senha alterada com sucesso",
    "Invalid password": "Senha inválida",

    // ---- Admin creation ----
    "Admin created successfully": "Admin criado com sucesso",
    "Account deleted successfully": "Conta deletada com sucesso",
  };

  translate(message: string): string {
    if (!message) return "Erro inesperado";

    const normalized = message.trim();

    return this.errorsMap[normalized] || message;
  }

  extractMessage(err: any): string {
    let message = err?.error?.message;

    if (Array.isArray(message)) {
      message = message[0];
    }

    if (typeof message === "string") {
      return message;
    }

    return err?.message || "Erro inesperado";
  }
}
