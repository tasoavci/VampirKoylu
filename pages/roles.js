import React from 'react';
import { characters } from './../roles'
import { useRouter } from 'next/router';
import Image from 'next/image';

function Roles() {
    const router = useRouter()
    return (
        <div className='bg-gray-800 min-h-screen flex flex-col items-center justify-center gap-8 p-10'>
            <button onClick={() => router.push('/')} className='fixed top-5 left-5 bg-indigo-500 px-5 py-1 rounded-lg'>Geri Dön</button>
            <h1 className='text-white text-3xl font-bold mb-6'>Roller</h1>
            <div className='bg-white text-gray-800 rounded-lg p-4 shadow-xl'>
                <h2 className='text-xl font-bold pl-[15px] mb-1'>Önerilen Rol Dağılımı:</h2>
                <ul className='list-disc pl-8'>
                    <li><strong>5 kişi:</strong> <span className='text-red-600'>1 Vampir</span>, <span className='text-green-600'>1 Doktor</span>, <span className='text-green-600'>3 Köylü</span></li>
                    <li><strong>6 kişi:</strong> <span className='text-red-600'>1 Vampir</span>, <span className='text-green-600'>1 Doktor</span>, <span className='text-green-600'>4 Köylü</span></li>
                    <li><strong>7 kişi:</strong> <span className='text-red-600'>1 Vampir</span>, <span className='text-green-600'>1 Doktor</span>, <span className='text-blue-600'>1 Tarafsız</span>, <span className='text-green-600'>4 Köylü</span></li>
                    <li><strong>8 kişi:</strong> <span className='text-red-600'>2 Vampir</span>, <span className='text-green-600'>1 Doktor</span>, <span className='text-blue-600'>1 Tarafsız</span>, <span className='text-green-600'>4 Köylü</span></li>
                    <li><strong>9 kişi:</strong> <span className='text-red-600'>2 Vampir</span>, <span className='text-green-600'>1 Doktor</span>, <span className='text-blue-600'>1 Tarafsız</span>, <span className='text-green-600'>5 Köylü</span></li>
                    <li><strong>10 kişi:</strong> <span className='text-red-600'>2 Vampir</span>, <span className='text-green-600'>1 Doktor</span>, <span className='text-blue-600'>1 Tarafsız</span>, <span className='text-green-600'>6 Köylü</span></li>
                    <li><strong>11 kişi:</strong> <span className='text-red-600'>3 Vampir</span>, <span className='text-green-600'>1 Doktor</span>, <span className='text-blue-600'>1 Tarafsız</span>, <span className='text-green-600'>6 Köylü</span></li>
                </ul>
            </div>
            {characters.filter(character => character.type !== 'Skip').map(character => (
                <div key={character.id} className='flex flex-col md:flex-row bg-gray-700 rounded-lg shadow-lg p-4 items-center justify-between w-full max-w-4xl'>
                    <div className='flex flex-col relative items-center md:flex-row md:items-start gap-4'>
                        {(character.name === 'İzci' || character.name === 'Eski Albay') &&
                            <h1 className='absolute top-0 right-0 text-gray-900 text-2xl'>(WIP)</h1>
                        }
                        <Image height={80} width={80} className='h-20 w-20 rounded-full' src={character.image} alt={character.name} />
                        <div>
                            <h2 className='text-white text-lg font-bold text-center'>{character.name} <span className={`text-${character.sidecolor}-500`}>({character.side})</span> </h2>
                            <p className='text-gray-300 text-center my-1'>{character.description}</p>
                            <p className='text-gray-300 text-center'>{character.description2}</p>
                        </div>
                    </div>
                    {character.duties.length > 0 &&
                        <p className='p-2'>Görevler:</p>
                    }
                    <div className='flex items-center justify-center flex-wrap gap-2 mt-4 md:mt-0'>
                        {character.duties.map(duty => (

                            <button
                                key={duty}
                                className={`bg-${character.sidecolor}-500 text-white py-2 px-4 rounded`}
                            >
                                {duty}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>

    );
}

export default Roles;
