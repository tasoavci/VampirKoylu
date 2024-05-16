// pages/index.js
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  return (
    <div className='bodyBackground flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white'>
      <div className='mb-16'>
        <motion.div
          initial={{ y: '-30vh' }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 60 }}
          className='grid grid-cols-3 border-[4px] bg-gray-700 grid-wrap border-black rounded-[100px] overflow-hidden'>
          <Image priority width={96} height={96} src="/boy-scout.png" alt="Oyun Logo" className="w-24 h-24" />
          <Image priority width={96} height={96} src="/villager.png" alt="Oyun Logo" className="w-24 h-24" />
          <Image priority width={96} height={96} src="/doctor.png" alt="Oyun Logo" className="w-24 h-24" />
          <Image priority width={96} height={96} src="/jester.png" alt="Oyun Logo" className="w-24 h-24" />
          <Image priority width={96} height={96} src="/vampire.png" alt="Oyun Logo" className="w-24 h-24" />
          <Image priority width={96} height={96} src="/survivor.png" alt="Oyun Logo" className="w-24 h-24" />
          <Image priority width={96} height={96} src="/villager.png" alt="Oyun Logo" className="w-24 h-24" />
          <Image priority width={96} height={96} src="/sheriff.png" alt="Oyun Logo" className="w-24 h-24" />
          <Image priority width={96} height={96} src="/villager.png" alt="Oyun Logo" className="w-24 h-24" />
        </motion.div>
        <h1 className='text-2xl tracking-wider w-full flex items-center justify-center mt-1 font-bold'>
          <motion.span
            initial={{ y: '-30vh' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className='text-red-600'>Vampir</motion.span>
          <motion.span
            initial={{ y: '-30vh' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className='text-gray-800'>&</motion.span>
          <motion.span
            initial={{ y: '-30vh' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 60 }}
            className='text-green-500'>Köylü</motion.span>
        </h1>
      </div>
      <div className='flex flex-col items-center justify-center w-full gap-2'>
        <motion.button
          initial={{ x: '-100vh' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 60 }}
          onClick={() => router.push('/play')}
          className="bg-blue-500 text-white font-bold py-3 px-6 w-1/2 rounded-lg shadow-lg  focus:outline-none"
        >
          Oyna
        </motion.button>
        <motion.button
          initial={{ x: '-70vh' }} // Başlangıç konumu (viewport yüksekliğinin üzerinde)
          animate={{ x: 0 }}        // Bitiş konumu (normal konumu)
          transition={{ type: 'spring', stiffness: 60 }}
          onClick={() => router.push('/roles')}
          className="bg-green-500 text-white font-bold py-3 px-6 w-1/2 rounded-lg shadow-lg  focus:outline-none"
        >
          Roller
        </motion.button>
      </div>
    </div>
  );
}
