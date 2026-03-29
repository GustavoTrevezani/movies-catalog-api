import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
  Delete,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwtAuth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Get()
  findEmail(@Query("query") query?: string) {
    return this.usersService.searchUsers(query);
  }

  @Delete("admin/delete-user/:id")
  async deleteUser(@Param("id") userId: string) {
    return this.usersService.deleteUserAdmin(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOneWithDetails(id);
  }
}
