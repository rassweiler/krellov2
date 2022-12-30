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
				await ctx.prisma.card.create({
					data: {
						name: input.name, 
						list: { connect: { id: input.listId } },
					},
				});
			} catch (error) {
				console.log(error);
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
			} catch (error) {
				console.log(error);
			}
		}),

});
