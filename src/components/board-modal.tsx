import { Dispatch, SetStateAction, useState } from 'react';
import { trpc } from '../utils/trpc';
import ListModal from './list-modal';

interface BoardModalProps {
	currentBoard: string;
	setCurrentBoard: Dispatch<SetStateAction<string>>;
}

const BoardModal: React.FC<BoardModalProps> = ({
	currentBoard,
	setCurrentBoard,
}) => {
	const [input, setInput] = useState<string>('');
	const { data: board, isLoading } = trpc.board.getBoard.useQuery({
		boardId: currentBoard,
	});
	const mutation = trpc.list.createList.useMutation({
		onSuccess: (data, variables, context) => {
			console.log('success');
		},
	});

	const createList = async () => {
		if (input != '') {
			mutation.mutate({ name: input, boardId: currentBoard });
			setInput('');
		}
	};

	const deleteMutation = trpc.board.deleteBoard.useMutation();

	const deleteBoard = async () => {
		deleteMutation.mutate({ boardId: currentBoard });
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
			<div className='flex w-full flex-col gap-4 rounded-xl bg-white/10 bg-gray-500 text-white'>
				<div className='flex flex-row justify-between rounded-xl bg-gray-700 p-2'>
					<div className='flex flex-row'>
						<h3 className='self-center text-2xl font-bold'>{board?.name}</h3>{' '}
						<button
							type='button'
							onClick={() => deleteBoard()}
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
									d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
								/>
							</svg>
						</button>
					</div>
					<div className='flex flex-row gap-2'>
						<div className='self-center text-sm'>
							Last Update: {board?.updatedAt.toISOString()}
						</div>
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
							onClick={() => setCurrentBoard('')}
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
					{board.lists.map((list) => {
						return (
							<ListModal
								key={list.id}
								listId={list.id}
								boardId={currentBoard}
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
