import { type NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';
import type { Board } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
	import { BoardCard } from '../components/board-card';

const Home: NextPage = () => {
	const { data: sessionData } = useSession();

	return (
		<>
			<Head>
				<title>Krello</title>
				<meta name='description' content='Trello Clone' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2C2C45] to-[#060723]'>
				<div className='container flex flex-col items-center justify-center gap-12 px-4 py-16 '>
					<h1 className='text-sm font-extrabold tracking-tight text-white sm:text-[5rem]'>
						<span className='text-[#d8534e]'>Krello</span> - A Trello Clone
					</h1>
					{sessionData ? (
						<BoardList />
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

const BoardList: React.FC = () => {
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
							<BoardCard key={board.id} board={board} deleteBoard={deleteBoard} />
						);
					})}
				</div>
			</>
		);
	}
};
