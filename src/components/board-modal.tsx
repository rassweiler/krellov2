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
	const [showAdd, setShowAdd] = useState<boolean>(false);
	const { data: board, isLoading } = trpc.board.getBoard.useQuery({
		boardId: currentBoard,
	});
	useEffect(() => {
		if (board) {
			setLists(board.lists);
		}
	}, [board]);
	const mutation = trpc.list.createList.useMutation();

	const createList = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
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

	const toggleShowAdd = async () => {
		const currentValue = showAdd;
		setShowAdd(!currentValue);
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
					<div className='flex flex-row gap-4'>
						{showAdd && (
							<form onSubmit={createList} className='flex flex-row gap-2'>
								<label htmlFor='Name'>Name</label>
								<input
									className='rounded-md text-black'
									type='text'
									name='Name'
									value={input}
									onChange={(e) => setInput(e.target.value)}
								/>
								<button
									type='submit'
									title='Add List'
									className='rounded-md bg-green-400 p-2 hover:bg-green-600 hover:text-white'
								>
									Add
								</button>
							</form>
						)}
						<button
							type='button'
							title={showAdd ? 'Hide Add Form' : 'Show Add Form'}
							onClick={toggleShowAdd}
							className={
								showAdd
									? 'rounded-md bg-red-400 p-2 hover:bg-red-800 hover:text-white'
									: 'rounded-md bg-green-400 p-2 hover:bg-green-800 hover:text-white'
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
										d='M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z'
									/>
								</svg>
							)}
						</button>
					</div>
					<button
						type='button'
						title='Close Board'
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
								d='M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25'
							/>
						</svg>
					</button>
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
