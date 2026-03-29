import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
    });
  }

  async findOneWithDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        favorites: { include: { movie: true } },
        watched: { include: { movie: true } },
      },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async searchUsers(query?: string) {
    return this.prisma.user.findMany({
      where: query
        ? {
            email: {
              contains: query,
              mode: "insensitive",
            },
          }
        : undefined,
      include: {
        favorites: {
          include: {
            movie: true,
          },
        },
        watched: {
          include: {
            movie: true,
          },
        },
      },
    });
  }

  async deleteUserAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    await this.prisma.$transaction([
      this.prisma.favorite.deleteMany({ where: { userId } }),
      this.prisma.watched.deleteMany({ where: { userId } }),
      this.prisma.passwordReset.deleteMany({ where: { userId } }),
      this.prisma.user.delete({ where: { id: userId } }),
    ]);

    return { message: "Account deleted successfully" };
  }
}
