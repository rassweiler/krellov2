import { router } from '../trpc';
import { authRouter } from './auth';
import { boardRouter } from './board';
import { cardRouter } from './card';
import { listRouter } from './list';

export const appRouter = router({
	board: boardRouter,
	list: listRouter,
	card: cardRouter,
	auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
