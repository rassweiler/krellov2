import Link from 'next/link';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';

const Navbar: React.FC = () => {
	const { data: sessionData } = useSession();

	return (
		<nav className='bg-slate-800'>
			<div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
				<div className='relative flex h-16 items-center justify-between'>
					<div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
					</div>
					<div className='flex flex-1 items-center sm:items-stretch justify-start'>
						<Link className='flex flex-shrink-0 items-center' href='/'>
							<Image
								className='block h-8 w-auto lg:hidden'
								src='/favicon.ico'
								alt='Your Company'
								width={150}
								height={150}
							/>
							<Image
								className='hidden h-8 w-auto lg:block'
								src='/favicon.ico'
								alt='Your Company'
								width={150}
								height={150}
							/>
						</Link>
						<div className='sm:ml-6 sm:block'>
							<div className='flex space-x-4'>
								<Link
									href='https://portfolio.kylerassweiler.ca'
									className='rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white'
									aria-current='page'
								>
									Portfolio
								</Link>{' '}
								<Link
									href='https://github.com/rassweiler/'
									className='rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white'
									aria-current='page'
								>
									Github
								</Link>
							</div>
						</div>
					</div>
					<div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
						<span className='text-gray-300'>
							{sessionData && <span>{sessionData.user?.email}</span>}
						</span>
						<div className='relative ml-3'>
							<div>
								<button
									type='button'
									className='flex rounded-full bg-gray-800 text-sm text-gray-300 hover:border-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
									id='user-menu-button'
									aria-expanded='false'
									aria-haspopup='true'
									onClick={sessionData ? () => signOut() : () => signIn()}
								>
									<span className='sr-only'>
										{sessionData ? 'Sign Out' : 'Sign In'}
									</span>
									{sessionData ? (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
											strokeWidth={1.5}
											stroke='currentColor'
											className='h-6 w-6 text-red-400'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'
											/>
										</svg>
									) : (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
											strokeWidth={1.5}
											stroke='currentColor'
											className='h-6 w-6 text-green-400'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75'
											/>
										</svg>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
