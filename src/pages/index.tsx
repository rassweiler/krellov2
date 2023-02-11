import { type NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';
import type { Board } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BoardCard } from '../components/board-card';
import Image from 'next/image';

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
						<span className='text-[#d8534e]'>Krello</span> - A Simple Kanban
					</h1>
					{sessionData ? (
						<BoardList />
					) : (
						<>
							<div className='flex flex-col items-center gap-2 text-white'>
								Please login to view your boards...
							</div>
							<div className='flex flex-col items-center gap-2 text-white'>
								This app was created using: Typescript, Nextjs, Tailwind, tRPC, Prisma, and NextAuth. It is hosted using Vercel.
							</div>
							<div className='items-center'>
								<Image src='/Boardlist.webp' alt='Image of available boards' width={900} height={900} />
								<Image src='/Board.webp' alt='Image of a board' width={900} height={900} />
							</div>
						</>
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
	const [showAdd, setShowAdd] = useState<boolean>(false);
	const mutation = trpc.board.createBoard.useMutation();
	useEffect(() => {
		if (boardsData) {
			setBoards(boardsData);
		}
	}, [boardsData]);

	const createBoard = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (input != '') {
			const { data } = await mutation.mutateAsync({ name: input });
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

	const toggleShowAdd = async () => {
		const currentValue = showAdd;
		setShowAdd(!currentValue);
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
				<div className='flex flex-row'>
					{showAdd && (
						<form
							className='m-2 flex flex-row justify-center gap-4'
							onSubmit={createBoard}
						>
							<label htmlFor='name' title='Name' className='self-center text-white'>
								Name
							</label>
							<input
								className='rounded-md bg-gray-400'
								type='text'
								value={input}
								name='name'
								placeholder='New board name...'
								required
								onChange={(e) => setInput(e.target.value)}
							/>
							<button
								type='submit'
								className='rounded-md bg-green-200 p-2 hover:bg-green-500 hover:text-white'
							>
								Add
							</button>
						</form>
					)}
					<button
						type='button'
						title={showAdd ? 'Close Add Form' : 'Open Add Form'}
						onClick={toggleShowAdd}
						className={
							showAdd
								? 'm-2 rounded-md bg-red-400 p-2 hover:bg-red-800 hover:text-white'
								: 'm-2 rounded-md bg-green-400 p-2 hover:bg-green-800 hover:text-white'
						}
					>
						{showAdd ? (
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='h-6 w-6'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'
								/>
							</svg>
						) : (
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='h-6 w-6'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
								/>
							</svg>
						)}
					</button>
				</div>
				<div className='flex w-full flex-row flex-wrap justify-center gap-4 md:gap-8'>
					{boards?.map((board) => {
						return (
							<BoardCard
								key={board.id}
								board={board}
								deleteBoard={deleteBoard}
							/>
						);
					})}
				</div>
			</>
		);
	}
};
