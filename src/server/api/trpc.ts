import * as trpcNext from '@trpc/server/adapters/next';

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { getAuth, SignedInAuthObject, SignedOutAuthObject } from '@clerk/nextjs/server';
import { prisma } from '~/server/db';

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject;
}

const createContextInner = ({ auth }: AuthContext) => ({
  auth,
  prisma,
});

export const createTRPCContext = async (opts: trpcNext.CreateNextContextOptions) =>
  createContextInner({ auth: getAuth(opts.req) });

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
