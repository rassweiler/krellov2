import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const listRouter = router({
	getList: protectedProcedure
		.input(z.object({ listId: z.string() }))
		.query(({ ctx, input }) => {
			return ctx.prisma.list.findFirst({
				where: {
					id: input.listId,
				},
				include: {
					cards: true,
				},
			});
		}),

	createList: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				boardId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.prisma.list.create({
					data: {
						name: input.name,
						board: { connect: { id: input.boardId } },
					},
				});
			} catch (error) {
				console.log(error);
			}
		}),
	deleteList: protectedProcedure
		.input(
			z.object({
				listId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.prisma.list.delete({
					where: {
						id: input.listId,
					},
				});
			} catch (error) {
				console.log(error);
			}
		}),
});
