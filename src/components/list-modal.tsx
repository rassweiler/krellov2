import type { Card } from '@prisma/client';
import type { Dispatch } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { trpc } from '../utils/trpc';
import CardModal from './card-modal';

interface ListModalProps {
	listId: string;
	deleteList: Dispatch<string>;
}

const ListModal: React.FC<ListModalProps> = ({ listId, deleteList }) => {
	const [inputName, setInputName] = useState<string>('');
	const [inputBody, setInputBody] = useState<string>('');
	const [cards, setCards] = useState<Card[]>([]);
	const [showAdd, setShowAdd] = useState<boolean>(false);
	const { data: list, isLoading } = trpc.list.getList.useQuery({
		listId: listId,
	});
	useEffect(() => {
		if (list) {
			setCards(list.cards);
		}
	}, [list]);
	const mutation = trpc.card.createCard.useMutation();

	const createCard = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (inputName != '') {
			const data = await mutation.mutateAsync({
				name: inputName,
				body: inputBody,
				listId: listId,
			});
			if (data.error == null && data.data) {
				setInputName('');
				setInputBody('');
				setCards([...cards, data.data]);
			}
		}
	};
	const deleteMutation = trpc.card.deleteCard.useMutation();

	const deleteCard = async (cardId: string) => {
		const data = await deleteMutation.mutateAsync({ cardId: cardId });
		if (data.erorr == null) {
			setCards(cards.filter((card) => card.id != cardId));
		}
	};

	const toggleShowAdd = async () => {
		const currentValue = showAdd;
		setShowAdd(!currentValue);
	};

	if (isLoading) {
		return (
			<div className='max flex flex-col justify-center gap-4 rounded-xl bg-white/10 p-4 text-white'>
				Loading list info...
			</div>
		);
	}

	if (list) {
		return (
			<div className='flex w-1/3 min-w-[30%] flex-col gap-4 overflow-hidden rounded-xl border-2 border-[#031420] bg-[#2D4454] text-white'>
				<div className='flex flex-row justify-between bg-[#031420] p-2'>
					<div className='flex flex-row'>
						<h3 className='self-center text-xl font-bold'>{list?.name}</h3>
					</div>
					<div className='flex flex-row gap-2'>
						<button
							type='button'
							onClick={() => deleteList(list.id)}
							className='rounded-md bg-red-400 p-2 hover:bg-red-600 hover:text-white'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='h-5 w-5'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
								/>
							</svg>
						</button>
					</div>
				</div>
				{showAdd && (
					<form
						className='flex w-full flex-col gap-1 p-2'
						onSubmit={createCard}
					>
						<div className='w-full text-center'>Add New Card</div>
						<label htmlFor='name'>Name</label>
						<input
							type='text'
							name='name'
							className='rounded-md p-1 text-black'
							value={inputName}
							onChange={(e) => setInputName(e.target.value)}
						/>
						<label htmlFor='body'>Body</label>
						<input
							type='text'
							name='body'
							className='rounded-md p-1 text-black'
							value={inputBody}
							onChange={(e) => setInputBody(e.target.value)}
						/>
						<button
							type='submit'
							className='flex justify-center rounded-md bg-green-400 p-2 hover:bg-green-600 hover:text-white'
						>
							Add Card
						</button>
					</form>
				)}
				<button
					type='button'
					title={showAdd ? 'Hide Add Form' : 'Show Add Form'}
					onClick={toggleShowAdd}
					className={
						showAdd
							? 'mx-2 flex justify-center rounded-md bg-red-400 p-2 hover:bg-red-800 hover:text-white'
							: 'mx-2 flex justify-center rounded-md bg-green-400 p-2 hover:bg-green-800 hover:text-white'
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
				<div className='flex flex-col gap-2 p-2'>
					{cards.map((card) => {
						return (
							<CardModal key={card.id} card={card} deleteCard={deleteCard} />
						);
					})}
				</div>
			</div>
		);
	} else {
		return <div className=''>404: Board Not Found</div>;
	}
};

export default ListModal;
