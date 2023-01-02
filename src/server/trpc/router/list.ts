import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const listRouter = router({
	getList: protectedProcedure
		.input(z.object({ listId: z.string() }))
		.query(async ({ ctx, input }) => {
			const data = await ctx.prisma.list.findFirst({
				where: {
					id: input.listId,
				},
				include: {
					cards: true,
				},
			});
			return data;
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
				const list = await ctx.prisma.list.create({
					data: {
						name: input.name,
						board: { connect: { id: input.boardId } },
					},
				});
				return { data: list, error: null };
			} catch (error) {
				console.log(error);
				return { data: null, erorr: error };
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
				return { data: null, error: null };
			} catch (error) {
				console.log(error);
				return { data: null, erorr: error };
			}
		}),
});
