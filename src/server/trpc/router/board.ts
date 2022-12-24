import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const boardRouter = router({
	getAllBoards: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.board.findMany({
			where: {
				userId: ctx.session.user.id,
			},
		});
	}),

	getBoard: protectedProcedure
		.input(z.object({ boardId: z.string() }))
		.query(({ ctx, input }) => {
			return ctx.prisma.board.findFirst({
				where: {
					id: input.boardId,
					userId: ctx.session.user.id,
				},
			});
		}),

	createBoard: protectedProcedure
		.input(
			z.object({
				name: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.prisma.board.create({
					data: {
						name: input.name,
						user: { connect: { id: ctx.session.user.id } },
						//	userId: ctx.session.user.id,
					},
				});
			} catch (error) {
				console.log(error);
			}
		}),
});
