// pages/index.js
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white'>
      <div className='mb-16'>
        <div className='grid grid-cols-2 border-2 bg-gray-700 border-black rounded-full overflow-hidden'>
          <Image priority width={96} height={96} src="/vampire.png" alt="Oyun Logo" className="w-24 h-24" />
          <Image priority width={96} height={96} src="/villager.png" alt="Oyun Logo" className="w-24 h-24" />
          <Image priority width={96} height={96} src="/doctor.png" alt="Oyun Logo" className="w-24 h-24" />
          <Image priority width={96} height={96} src="/jester.png" alt="Oyun Logo" className="w-24 h-24" />
        </div>
        <h1 className='text-2xl tracking-wider w-full flex items-center justify-center mt-1'><span className='text-red-500'>Vampir</span>&<span className='text-green-500'>Köylü</span></h1>
      </div>
      <div className='flex flex-col items-center justify-center w-full gap-2'>
        <button
          onClick={() => router.push('/play')}
          className="bg-blue-500 text-white font-bold py-3 px-6 w-1/2 rounded-lg shadow-lg  focus:outline-none"
        >
          Oyna
        </button>
        <button
          onClick={() => router.push('/roles')}
          className="bg-green-500 text-white font-bold py-3 px-6 w-1/2 rounded-lg shadow-lg  focus:outline-none"
        >
          Roller
        </button>
      </div>
    </div>
  );
}
