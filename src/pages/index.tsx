import { type NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Navbar from '../components/nav';
import { trpc } from '../utils/trpc';
import type { Board } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
	const { data: sessionData } = useSession();

	return (
		<>
			<Head>
				<title>Krello</title>
				<meta name='description' content='Trello Clone' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Navbar />
			<main className='flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2C2C45] to-[#060723]'>
				<div className='container flex flex-col items-center justify-center gap-12 px-4 py-16 '>
					<h1 className='text-sm font-extrabold tracking-tight text-white sm:text-[5rem]'>
						<span className='text-[#d8534e]'>Krello</span> - A Trello Clone
					</h1>
					{sessionData ? (
						<Boards />
					) : (
						<div className='flex flex-col items-center gap-2 text-white'>
							Please login to view your boards...
						</div>
					)}
				</div>
			</main>
		</>
	);
};

export default Home;

const Boards: React.FC = () => {
	const { data: boardsData, isLoading } = trpc.board.getAllBoards.useQuery();
	const [input, setInput] = useState<string>('');
	const [boards, setBoards] = useState<Board[]>([]);
	const mutation = trpc.board.createBoard.useMutation();
	const router = useRouter();
	useEffect(() => {
		if (boardsData) {
			setBoards(boardsData);
		}
	}, [boardsData]);

	const createBoard = async () => {
		if (input != '') {
			const { data, error } = await mutation.mutateAsync({ name: input });
			if (data != null) {
				setBoards([...boards, data]);
				setInput('');
			}
		}
	};

	const deleteMutation = trpc.board.deleteBoard.useMutation();

	const deleteBoard = async (boardId: string) => {
		const data = await deleteMutation.mutateAsync({ boardId: boardId });
		if (data.erorr == null) {
			setBoards(boards.filter((board) => board.id != boardId));
		}
	};

	if (isLoading) {
		return (
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8'>
				Loading boards...
			</div>
		);
	} else {
		return (
			<>
				<div className='m-2 flex flex-row justify-center gap-4'>
					<input
						className='rounded-md bg-gray-400'
						type='text'
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
					<button
						className='rounded-md bg-green-200 p-2 hover:bg-green-500 hover:text-white'
						onClick={createBoard}
					>
						Add
					</button>
				</div>
				<div className='flex w-full flex-row flex-wrap justify-center gap-4 md:gap-8'>
					{boards?.map((board) => {
						return (
							<div
								className='flex h-40 w-64 flex-col rounded-xl bg-[#060723] p-4 text-center text-white hover:bg-[#131439]'
								key={board.id}
							>
								<button
									type='button'
									onClick={() => deleteBoard(board.id)}
									className='w-8 rounded-md bg-red-400 p-2 hover:bg-red-600 hover:text-white'
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										strokeWidth={1.5}
										stroke='currentColor'
										className='h-4 w-4'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
										/>
									</svg>
								</button>
								<div
									className='hover:cursor-pointer'
									onClick={() =>
										router.push({
											pathname: '/board/[bid]',
											query: { bid: board.id },
										})
									}
									key={board.id}
								>
									<h3 className='text-center text-2xl font-bold justify-center'>
										{board.name}
									</h3>
								</div>
							</div>
						);
					})}
				</div>
			</>
		);
	}
};
