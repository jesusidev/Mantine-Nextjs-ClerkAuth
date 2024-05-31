import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { productInput, updateProductInput } from '~/types/product';

export const productRouter = createTRPCRouter({
  get: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.findUnique({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        remaining: true,
        favoriteProducts: ctx.auth?.userId
          ? {
              where: {
                userId: ctx.auth.userId,
              },
              select: {
                userId: true,
              },
            }
          : false,
      },
      where: {
        id: input.id,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const isFavorite = ctx.auth?.userId ? product.favoriteProducts.length > 0 : false;

    return {
      ...product,
      isFavorite,
    };
  }),

  getAllPublic: publicProcedure
    .input(z.object({ projectId: z.string() }).optional())
    .query(async ({ ctx, input }) => {
      const productsByProject = input?.projectId ? { projectId: input?.projectId } : {};
      const products = await ctx.prisma.product.findMany({
        orderBy: [{ createdAt: 'desc' }],
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          remaining: true,
          favoriteProducts: {},
        },
        where: {
          ...productsByProject,
        },
      });
      return products.map((product) => ({
        ...product,
        isFavorite: false,
      }));
    }),

  getAll: protectedProcedure
    .input(z.object({ projectId: z.string() }).optional())
    .query(async ({ ctx, input }) => {
      const productsByProject = input?.projectId ? { projectId: input?.projectId } : {};

      const products = await ctx.prisma.product.findMany({
        orderBy: [{ createdAt: 'desc' }],
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          remaining: true,
          favoriteProducts: {
            where: {
              userId: ctx.auth.userId,
            },
          },
        },
        where: {
          userId: ctx.auth.userId,
          ...productsByProject,
        },
      });
      return products.map((product) => ({
        ...product,
        isFavorite: product.favoriteProducts.length > 0,
      }));
    }),

  getByProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const products = await ctx.prisma.product.findMany({
        orderBy: [{ createdAt: 'desc' }],
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          remaining: true,
        },
        where: {
          userId: ctx.auth.userId,
          projectId: input.projectId,
        },
      });
      return products;
    }),

  create: protectedProcedure.input(productInput).mutation(async ({ ctx, input }) => {
    const connectProject = input.projectId
      ? {
          project: {
            connect: {
              id: input.projectId,
            },
          },
        }
      : {};

    const product = await ctx.prisma.product.create({
      data: {
        name: input.name,
        brand: input.brand,
        sku: input.sku,
        remaining: {
          create: {
            quantity: input.quantity,
          },
        },
        user: {
          connect: {
            id: ctx.auth.userId,
          },
        },
        ...connectProject,
      },
    });

    if (input.isFavorite) {
      await ctx.prisma.favoriteProduct.create({
        data: {
          user: {
            connect: {
              id: ctx.auth.userId,
            },
          },
          product: {
            connect: {
              id: product.id,
            },
          },
        },
      });
    }

    return product;
  }),

  createCategory: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) =>
      ctx.prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          categories: {
            create: [
              {
                category: {
                  create: {
                    name: input.name,
                  },
                },
              },
            ],
          },
        },
      })
    ),

  update: protectedProcedure.input(updateProductInput).mutation(async ({ ctx, input }) => {
    const updatedProduct = await ctx.prisma.$transaction(async (prisma) => {
      const product = await prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          brand: input.brand,
          sku: input.sku,
          categories: input.categoryName
            ? {
                create: [
                  {
                    category: {
                      create: {
                        name: input.categoryName,
                      },
                    },
                  },
                ],
              }
            : undefined,
        },
      });

      if (input.isFavorite) {
        await prisma.favoriteProduct.upsert({
          where: {
            userId_productId: {
              userId: ctx.auth.userId,
              productId: input.id,
            },
          },
          create: {
            userId: ctx.auth.userId,
            productId: input.id,
          },
          update: {},
        });
      } else {
        await prisma.favoriteProduct.deleteMany({
          where: {
            userId: ctx.auth.userId,
            productId: input.id,
          },
        });
      }

      return product;
    });

    return updatedProduct;
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const product = ctx.prisma.product.delete({
        where: {
          id: input.id,
        },
      });
      return product;
    }),
});
