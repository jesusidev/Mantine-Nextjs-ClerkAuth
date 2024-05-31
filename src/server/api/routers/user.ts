import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { userInput } from '~/types/user';

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => ctx.prisma.user.findUnique({
      where: {
        id: ctx.auth.userId,
      },
    })),
  create: protectedProcedure
    .input(userInput)
    .mutation(async ({ ctx, input }) => ctx.prisma.user.create({
        data: {
          id: ctx.auth.userId,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
        },
      })),
    update: protectedProcedure
        .input(userInput)
        .mutation(async ({ ctx, input }) => ctx.prisma.user.update({
            where: {
                id: ctx.auth.userId,
            },
            data: {
                firstName: input.firstName,
                lastName: input.lastName,
                email: input.email,
            },
            })),
});
