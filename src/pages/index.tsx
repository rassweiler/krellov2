import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '../components/nav';
import { trpc } from '../utils/trpc';
import type { Board } from '@prisma/client';
import { Dispatch, SetStateAction, useState } from 'react';

const Home: NextPage = () => {
	const [boards, setBoards] = useState<Board[]>([]);
	const { data: sessionData } = useSession();
	const { data: boardsData, isLoading } = trpc.board.getAllBoards.useQuery();

	return (
		<>
			<Head>
				<title>Krello - Home</title>
				<meta name='description' content='Trello Clone' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Navbar />
			<main className='flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
				<div className='container flex flex-col items-center justify-center gap-12 px-4 py-16 '>
					<h1 className='text-l font-extrabold tracking-tight text-white sm:text-[5rem]'>
						<span className='text-[hsl(280,100%,70%)]'>Krello</span> A Trello
						Clone
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
	const [currentBoard, setCurrentBoard] = useState<string>('');
	const utils = trpc.useContext();
	const mutation = trpc.board.createBoard.useMutation({
		onSuccess: (data, variables, context) => {
			console.log("success");
		},
	});

	const createBoard = async () => {
		mutation.mutate({ name: input });
		setInput('');
	};
	if (isLoading) {
		return (
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8'>
				Loading boards...
			</div>
		);
	} else if (currentBoard != '') {
		return (
			<BoardModal
				currentBoard={currentBoard}
				setCurrentBoard={setCurrentBoard}
			></BoardModal>
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
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8'>
					{boardsData?.map((board) => {
						return (
							<div
								className='flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20'
								onClick={() => setCurrentBoard(board.id)}
								key={board.id}
							>
								<h3 className='text-2xl font-bold'>{board.name}</h3>
								<div className='text-lg'>{board.updatedAt.toString()}</div>
							</div>
						);
					})}
				</div>
			</>
		);
	}
};

interface BoardModalProps {
	currentBoard: string;
	setCurrentBoard: Dispatch<SetStateAction<string>>;
}

const BoardModal: React.FC<BoardModalProps> = ({
	currentBoard,
	setCurrentBoard,
}) => {
	const { data: board, isLoading } = trpc.board.getBoard.useQuery({
		boardId: currentBoard,
	});
	if (isLoading) {
		return (
			<div className='flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20'>
				{' '}
				Loading board info...
			</div>
		);
	}
	return (
		<div className='flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20'>
			<h3 className='text-2xl font-bold'>{board?.name}</h3>
			<div className='text-lg'>{board?.updatedAt.toString()}</div>
			<button
				type='button'
				onClick={() => setCurrentBoard('')}
				className='rounded-md bg-red-200 p-2 hover:bg-red-600 hover:text-white'
			>
				Close
			</button>
		</div>
	);
};
