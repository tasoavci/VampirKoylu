import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function StartGameForm({ onStartGame }) {
    const [playerCount, setPlayerCount] = useState(5);
    const [playerNames, setPlayerNames] = useState(Array(5).fill(''));
    const [numVampires, setNumVampires] = useState(playerCount >= 11 ? 3 : (playerCount >= 8 ? 2 : 1))
    const [numDoctor, setNumDoctor] = useState(1)
    const [numNeutral, setNumNeutral] = useState(playerCount >= 7 ? 1 : 0)
    const [numVillager, setNumVillager] = useState(playerCount - (numVampires + numNeutral + numDoctor))
    const router = useRouter()
    useEffect(() => {
        neutralUpdate()
        updateVillagerCount()
    }, [numDoctor, numNeutral, numVampires, playerCount])
    const handlePlayerCountChange = event => {
        const count = parseInt(event.target.value, 10);
        console.log(count)
        setPlayerCount(count);
        setPlayerNames(Array(count).fill(''));
        setNumVampires(count >= 11 ? 3 : (count >= 8 ? 2 : 1));
        setNumNeutral(count >= 7 ? 1 : 0);
        updateVillagerCount()
    };
    const updateVillagerCount = () => {
        setNumVillager(playerCount - (numVampires + numDoctor + numNeutral));
    };
    const neutralUpdate = () => {
        setNumNeutral(playerCount >= 7 ? 1 : 0)
    }

    const handlePlayerNameChange = (index, event) => {
        const newNames = [...playerNames];
        newNames[index] = event.target.value;
        setPlayerNames(newNames);
    };
    const handleVampiresChange = event => {
        setNumVampires(parseInt(event.target.value, 10));
    };

    const handleDoctorChange = event => {
        setNumDoctor(parseInt(event.target.value, 10));
    };

    const handleNeutralChange = event => {
        setNumNeutral(parseInt(event.target.value, 10));
    };

    const handleSubmit = event => {
        event.preventDefault();
        onStartGame([...playerNames, 'Boş Oy'], numVampires, numDoctor, numNeutral);

    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 min-h-full m-10">
            <button onClick={() => router.push('/')} className='fixed top-5 left-5 bg-indigo-500 px-5 py-1 rounded-lg'>Geri Dön</button>
            <div className="mb-4">
                <label htmlFor="playerCount" className="block text-gray-700 text-sm font-bold mb-2">
                    Oyuncu Sayısı:
                </label>
                <select
                    id="playerCount"
                    value={playerCount}
                    onChange={handlePlayerCountChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    {[5, 6, 7, 8, 9, 10, 11].map(count => (
                        <option key={count} value={count}>{count}</option>
                    ))}
                </select>
            </div>
            {playerNames.map((name, index) => (
                <div key={index} className="mb-4">
                    <label htmlFor={`playerName${index}`} className="block text-gray-700 text-sm font-bold mb-2">
                        Oyuncu {index + 1} İsmi:
                    </label>
                    <input
                        type="text"
                        id={`playerName${index}`}
                        value={name}
                        onChange={e => handlePlayerNameChange(index, e)}
                        required
                        placeholder={`Oyuncu ${index + 1} İsmi`}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            ))}
            <div className="mb-4">
                <label htmlFor="numVampires" className="block text-red-700 text-sm font-bold mb-2">
                    Vampir Sayısı:
                </label>
                <select
                    id="numVampires"
                    value={numVampires}
                    onChange={handleVampiresChange}
                    className="shadow appearance-none border  rounded w-full py-2 px-3 text-red-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    {[1, 2, 3].map(vampireCount => (
                        <option key={vampireCount} value={vampireCount}>{vampireCount}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="numDoctor" className="block text-green-700 text-sm font-bold mb-2">
                    Doktor Sayısı:
                </label>
                <select
                    id="numDoctor"
                    value={numDoctor}
                    onChange={handleDoctorChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    {[0, 1, 2].map(doctorCount => (
                        <option key={doctorCount} value={doctorCount}>{doctorCount}</option>
                    ))}
                </select>
            </div>
            {playerCount >= 7 &&
                <div className="mb-4">
                    <label htmlFor="numNeutral" className="block text-blue-700 text-sm font-bold mb-2">
                        Tarafsız Rol Sayısı:
                    </label>
                    <select
                        id="numNeutral"
                        value={numNeutral}
                        onChange={handleNeutralChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-blue-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        {[0, 1, 2].map(neutralCount => (
                            <option key={neutralCount} value={neutralCount}>{neutralCount}</option>
                        ))}
                    </select>
                </div>
            }
            <div className='flex items-center justify-center my-2'>
                <h1 className='text-gray-800 text-center text-lg'>Köylü sayısı: <span className='text-green-700'>{numVillager}</span></h1>
            </div>

            <button type="submit" className="bg-blue-500 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Oyunu Başlat
            </button>
        </form>
    );
}

export default StartGameForm;
