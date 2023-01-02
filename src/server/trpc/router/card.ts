import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const cardRouter = router({
	createCard: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				body: z.string(),
				listId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const card = await ctx.prisma.card.create({
					data: {
						name: input.name,
						body: input.body,
						list: { connect: { id: input.listId } },
					},
				});
				return { data: card, error: null };
			} catch (error) {
				console.log(error);
				return { data: null, erorr: error };
			}
		}),
	deleteCard: protectedProcedure
		.input(
			z.object({
				cardId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.prisma.card.delete({
					where: {
						id: input.cardId,
					},
				});
				return { data: null, error: null };
			} catch (error) {
				console.log(error);
				return { data: null, erorr: error };
			}
		}),
});
