import { type NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import BoardModal from '../../components/board-modal';
import { useRouter } from 'next/router';

const BoardPage: NextPage = () => {
	const { data: sessionData } = useSession();
	const query = useRouter().query;

	return (
		<>
			<Head>
				<title>Krello - Board</title>
				<meta name='description' content='Trello Clone' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2C2C45] to-[#060723]'>
				<div className='container flex flex-col items-center justify-center gap-12 px-4 py-16 '>
				
					{sessionData && typeof query.bid == 'string' ? (
						<BoardModal currentBoard={query.bid}></BoardModal>
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

export default BoardPage;
