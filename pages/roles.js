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
                <h2 className='text-xl font-bold pl-[15px] mb-1'>Rol Dağılımı:</h2>
                <ul className='list-disc pl-8'>
                    <li>5 kişi: 1 Vampir, 1 Doktor, 3 Köylü</li>
                    <li>6 kişi: 1 Vampir, 1 Doktor, 4 Köylü</li>
                    <li>7 kişi: 1 Vampir, 1 Doktor, 1 Soytarı (Opsiyonel), 4 Köylü</li>
                    <li>8 kişi: 2 Vampir, 1 Doktor, 1 Soytarı (Opsiyonel), 4 Köylü</li>
                    <li>9 kişi: 2 Vampir, 1 Doktor, 1 Soytarı (Opsiyonel), 5 Köylü</li>
                    <li>10 kişi: 2 Vampir, 1 Doktor, 1 Soytarı (Opsiyonel), 6 Köylü</li>
                    <li>11 kişi: 3 Vampir, 1 Doktor, 1 Soytarı (Opsiyonel), 6 Köylü</li>
                </ul>
            </div>
            {characters.filter(character => character.type !== 'Skip').map(character => (
                <div key={character.id} className='flex flex-col md:flex-row bg-gray-700 rounded-lg shadow-lg p-4 items-center justify-between w-full max-w-4xl'>
                    <div className='flex flex-col items-center md:flex-row md:items-start gap-4'>
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
