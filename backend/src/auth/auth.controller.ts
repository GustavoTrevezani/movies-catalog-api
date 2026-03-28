import { Controller, Post, Body, UseGuards, Get, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/requestPassword.dto";
import { RequestResetDto } from "./dto/requestReset.dto";
import { JwtAuthGuard } from "./jwtAuth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("request-reset")
  requestReset(@Body() dto: RequestResetDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @Post("reset-password")
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request & { user: any }) {
    return req.user;
  }
}
