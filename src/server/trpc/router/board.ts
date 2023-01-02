import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const boardRouter = router({
	getAllBoards: protectedProcedure.query(async ({ ctx }) => {
		const data = await ctx.prisma.board.findMany({
			where: {
				userId: ctx.session.user.id,
			},
		});

		return data;
	}),

	getBoard: protectedProcedure
		.input(z.object({ boardId: z.string() }))
		.query(({ ctx, input }) => {
			return ctx.prisma.board.findFirst({
				where: {
					id: input.boardId,
					userId: ctx.session.user.id,
				},
				include: {
					lists: {
						include: {
							cards: true,
						},
					},
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
				const board = await ctx.prisma.board.create({
					data: {
						name: input.name,
						user: { connect: { id: ctx.session.user.id } },
					},
				});
				return { data: board, error: '' };
			} catch (error) {
				console.log(error);
				return { data: null, error: error };
			}
		}),
	deleteBoard: protectedProcedure
		.input(
			z.object({
				boardId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.prisma.board.delete({
					where: {
						id: input.boardId,
					},
				});
				return { data: null, error: null };
			} catch (error) {
				console.log(error);
				return { data: null, erorr: error };
			}
		}),
});
