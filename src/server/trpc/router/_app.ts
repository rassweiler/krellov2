import { router } from '../trpc';
import { authRouter } from './auth';
import { boardRouter } from './board';

export const appRouter = router({
	board: boardRouter,
	auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
