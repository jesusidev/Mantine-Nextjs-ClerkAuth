import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { projectInput } from '~/types/project';

export const projectRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) =>
      ctx.prisma.project.findUnique({
        where: {
          id,
        },
      })
    ),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
    });
    const totalProjectProducts = await ctx.prisma.product.count({
      where: {
        userId: ctx.auth.userId,
        projectId: {
          in: projects.map((project) => project.id),
        },
      },
    });

    return projects.map(({ name, updatedAt, id, status }) => ({
      name,
      updatedAt,
      id,
      status,
      totalProjectProducts,
    }));
  }),
  create: protectedProcedure.input(projectInput).mutation(async ({ ctx, input }) =>
    ctx.prisma.project.create({
      data: {
        name: input.name,
        userId: ctx.auth.userId,
      },
    })
  ),
});
