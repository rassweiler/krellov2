import { Dispatch, SetStateAction, useState } from 'react';
import { trpc } from '../utils/trpc';
import CardModal from './card-modal';

interface ListModalProps {
	listId: string;
	boardId: string;
}

const ListModal: React.FC<ListModalProps> = ({ listId, boardId }) => {
	const [inputName, setInputName] = useState<string>('');
	const [inputBody, setInputBody] = useState<string>('');
	const { data: list, isLoading } = trpc.list.getList.useQuery({
		listId: listId,
	});

	const mutation = trpc.card.createCard.useMutation({
		onSuccess: (data, variables, context) => {
			console.log('success');
		},
	});

	const createCard = async () => {
		if (inputName != '') {
			mutation.mutate({ name: inputName, body: inputBody, listId: listId });
			setInputName('');
			setInputBody('');
		}
	};
	const deleteMutation = trpc.list.deleteList.useMutation();

	const deleteList = async () => {
		deleteMutation.mutate({ listId: listId });
	};

	if (isLoading) {
		return (
			<div className='max flex flex-col justify-center gap-4 rounded-xl bg-white/10 p-4 text-white'>
				{' '}
				Loading list info...
			</div>
		);
	}

	if (list) {
		return (
			<div className='flex w-1/3 min-w-[30%] flex-col gap-4 rounded-xl border border-slate-50 bg-gray-500 text-white'>
				<div className='flex flex-row justify-between rounded-xl bg-gray-700 p-2'>
					<div className='flex flex-row'>
						<h3 className='self-center text-xl font-bold'>{list?.name}</h3>{' '}
					</div>
					<div className='flex flex-row gap-2'>
						<button
							type='button'
							onClick={() => deleteList()}
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
				</div>
				<div className='flex w-full flex-col gap-1 p-2'>
					Add New Card
					<label htmlFor='name'>Name</label>
					<input
						type='text'
						name='name'
						className='p-1 text-black'
						value={inputName}
						onChange={(e) => setInputName(e.target.value)}
					/>
					<label htmlFor='body'>Body</label>
					<input
						type='text'
						name='body'
						className='p-1 text-black'
						value={inputBody}
						onChange={(e) => setInputBody(e.target.value)}
					/>
					<button
						type='button'
						onClick={() => createCard()}
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
				</div>
				<div className='flex flex-col gap-2'>
					{list.cards.map((card) => {
						return <CardModal key={card.id} card={card} />;
					})}
				</div>
			</div>
		);
	} else {
		return <div className=''>404: Board Not Found</div>;
	}
};

export default ListModal;
