import { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import ListModal from './list-modal';
import { useRouter } from 'next/router';
import type { List } from '@prisma/client';

interface BoardModalProps {
	currentBoard: string;
}

const BoardModal: React.FC<BoardModalProps> = ({ currentBoard }) => {
	const router = useRouter();
	const [input, setInput] = useState<string>('');
	const [lists, setLists] = useState<List[]>([]);
	const { data: board, isLoading } = trpc.board.getBoard.useQuery({
		boardId: currentBoard,
	});
	useEffect(() => {
		if (board) {
			setLists(board.lists);
		}
	}, [board]);
	const mutation = trpc.list.createList.useMutation();

	const createList = async () => {
		if (input != '') {
			const data = await mutation.mutateAsync({
				name: input,
				boardId: currentBoard,
			});
			if (data.erorr == null && data.data) {
				setInput('');
				setLists([...lists, data.data]);
			}
		}
	};
	const deleteListMutation = trpc.list.deleteList.useMutation();

	const deleteList = async (listId: string) => {
		const data = await deleteListMutation.mutateAsync({ listId: listId });
		if (data.erorr == null) {
			setLists(lists.filter((list) => list.id != listId));
		}
	};

	const deleteMutation = trpc.board.deleteBoard.useMutation();

	const deleteBoard = async () => {
		await deleteMutation.mutate({ boardId: currentBoard });
		if (deleteMutation.error == null) {
			router.push('/');
		}
	};

	if (isLoading) {
		return (
			<div className='max flex flex-col justify-center gap-4 rounded-xl bg-white/10 p-4 text-white'>
				{' '}
				Loading board info...
			</div>
		);
	}
	if (board) {
		return (
			<div className='flex w-full flex-col gap-4 overflow-hidden rounded-xl bg-[#35365B] text-white'>
				<div className='flex flex-row justify-between bg-[#060723] p-2'>
					<div className='flex flex-row gap-2'>
						<h3 className='self-center text-2xl font-bold'>{board?.name}</h3>{' '}
					</div>
					<div className='flex flex-row gap-2'>
						<input
							className='rounded-md text-black'
							type='text'
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
						<button
							type='button'
							onClick={() => createList()}
							className='rounded-md bg-green-400 p-2 hover:bg-green-600 hover:text-white'
						>
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
									d='M12 4.5v15m7.5-7.5h-15'
								/>
							</svg>
						</button>
						<button
							type='button'
							onClick={() => router.push('/')}
							className='rounded-md bg-red-400 p-2 hover:bg-red-600 hover:text-white'
						>
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
									d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
						</button>
					</div>
				</div>
				<div className='flex flex-row gap-2 overflow-x-scroll p-2'>
					{lists.map((list) => {
						return (
							<ListModal
								key={list.id}
								listId={list.id}
								deleteList={deleteList}
							/>
						);
					})}
				</div>
			</div>
		);
	} else {
		return <div className=''>404: Board Not Found</div>;
	}
};

export default BoardModal;
