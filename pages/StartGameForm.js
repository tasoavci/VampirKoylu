import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';


function StartGameForm({ onStartGame }) {
    const [playerCount, setPlayerCount] = useState(5);
    const [playerNames, setPlayerNames] = useState(Array(5).fill(''));
    const [numVampires, setNumVampires] = useState(playerCount >= 11 ? 3 : (playerCount >= 8 ? 2 : 1))
    const [numDoctor, setNumDoctor] = useState(1)
    const [numSheriff, setNumSheriff] = useState(0)
    const [numScout, setNumScout] = useState(0)
    const [numHunter, setNumHunter] = useState(0)
    const [numNeutral, setNumNeutral] = useState(playerCount >= 7 ? 1 : 0)
    const [neutralArray, setNeutralArray] = useState([0, 1, 2])
    const [vampireArray, setVampireArray] = useState([1, 2, 3])
    const [numVillager, setNumVillager] = useState(playerCount - (numVampires + numNeutral + numDoctor + numSheriff + numScout + numHunter))
    const router = useRouter()

    useEffect(() => {
        updateRolesCount()
        updateVillagerCount()
        updateNeutralArray()
        updateVampireArray()
    }, [numDoctor, numNeutral, numVampires, numSheriff, numScout, numHunter, playerCount])
    const handlePlayerCountChange = event => {
        const count = parseInt(event.target.value, 10);
        setPlayerCount(count);
        setPlayerNames(Array(count).fill(''));
        setNumVampires(count >= 11 ? 3 : (count >= 8 ? 2 : 1));
        setNumNeutral(count >= 7 ? 1 : 0);
        updateVillagerCount()
    };
    const updateVillagerCount = () => {
        setNumVillager(playerCount - (numVampires + numDoctor + numNeutral + numSheriff + numScout + numHunter));
    };
    const updateRolesCount = () => {
        setNumScout(playerCount <= 6 ? 0 : 1)
        setNumHunter(playerCount <= 6 ? 0 : 1)
    };
    const updateNeutralArray = () => {
        setNeutralArray(playerCount <= 8 ? [0, 1] : [0, 1, 2])
    }
    const updateVampireArray = () => {
        setVampireArray(playerCount === 7 ? [1, 2] : [1, 2, 3])
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
    const handleSheriffChange = event => {
        setNumSheriff(parseInt(event.target.value, 10));
    };
    const handleScoutChange = event => {
        setNumScout(parseInt(event.target.value, 10));
    };
    const handleHunterChange = event => {
        setNumHunter(parseInt(event.target.value, 10));
    };


    const handleSubmit = event => {
        event.preventDefault();
        onStartGame([...playerNames, 'Boş Oy'], numVampires, numDoctor, numNeutral, numSheriff, numScout, numHunter);

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
            <div className="mb-4 flex flex-col">
                <label htmlFor="numVampires" className="block text-red-700 text-sm font-bold mb-2">
                    Vampir Sayısı:
                </label>
                <div className='flex items-center justify-center gap-2'>
                    <Image width={50} height={50} src={'/vampire.png'} alt='vampir' className='object-contain rounded-full' />
                    <select
                        id="numVampires"
                        value={numVampires}
                        onChange={handleVampiresChange}
                        className="shadow appearance-none border  rounded w-full py-2 px-3 text-red-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        {vampireArray.map(vampireCount => (
                            <option key={vampireCount} value={vampireCount}>{vampireCount}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-4 flex flex-col">
                <label htmlFor="numDoctor" className="block text-green-700 text-sm font-bold mb-2">
                    Doktor Sayısı:
                </label>
                <div className='flex items-center justify-center gap-2'>
                    <Image width={50} height={50} src={'/doctor.png'} alt='doktor' className='object-contain rounded-full' />
                    <select
                        id="numDoctor"
                        value={numDoctor}
                        onChange={handleDoctorChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        {[0, 1].map(doctorCount => (
                            <option key={doctorCount} value={doctorCount}>{doctorCount}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="mb-4 flex flex-col">
                <label htmlFor="numSheriff" className="block text-green-700 text-sm font-bold mb-2">
                    Muhtar Sayısı:
                </label>
                <div className='flex items-center justify-center gap-2'>
                    <Image width={50} height={50} src={'/sheriff.png'} alt='muhtar' className='object-contain rounded-full' />
                    <select
                        id="numSheriff"
                        value={numSheriff}
                        onChange={handleSheriffChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        {[0, 1].map(sheriffCount => (
                            <option key={sheriffCount} value={sheriffCount}>{sheriffCount}</option>
                        ))}
                    </select>
                </div>
            </div>
            {playerCount >= 6 &&
                <div className="mb-4 flex flex-col">
                    <label htmlFor="numScout" className="block text-green-700 text-sm font-bold mb-2">
                        İzci Sayısı:
                    </label>
                    <div className='flex items-center justify-center gap-2'>
                        <Image width={50} height={50} src={'/boy-scout.png'} alt='izci' className='object-contain rounded-full' />
                        <select
                            id="numScout"
                            value={numScout}
                            onChange={handleScoutChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            {[0, 1].map(scoutCount => (
                                <option key={scoutCount} value={scoutCount}>{scoutCount}</option>
                            ))}
                        </select>
                    </div>
                </div>}
            {playerCount >= 6 &&
                <div className="mb-4 flex flex-col">
                    <label htmlFor="numHunter" className="block text-green-700 text-sm font-bold mb-2">
                        Vampir Avcısı Sayısı:
                    </label>
                    <div className='flex items-center justify-center gap-2'>
                        <Image width={50} height={50} src={'/vampire-hunter.png'} alt='vampir-avcisi' className='object-contain rounded-full' />
                        <select
                            id="numHunter"
                            value={numHunter}
                            onChange={handleHunterChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            {[0, 1].map(hunterCount => (
                                <option key={hunterCount} value={hunterCount}>{hunterCount}</option>
                            ))}
                        </select>
                    </div>
                </div>}
            {playerCount >= 7 &&
                <div className="mb-4 flex flex-col">
                    <label htmlFor="numNeutral" className="block text-blue-700 text-sm font-bold mb-2">
                        Tarafsız Rol Sayısı:
                    </label>
                    <div className='flex items-center justify-center gap-2'>
                        <Image width={50} height={50} src={'/survivor.png'} alt='tarafsiz' className='object-contain rounded-full' />
                        <Image width={50} height={50} src={'/jester.png'} alt='tarafsiz' className='object-contain rounded-full' />
                        <select
                            id="numNeutral"
                            value={numNeutral}
                            onChange={handleNeutralChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-blue-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            {neutralArray.map(neutralCount => (
                                <option key={neutralCount} value={neutralCount}>{neutralCount}</option>
                            ))}
                        </select>
                    </div>
                </div>
            }
            <div className='flex items-center justify-left gap-3 my-2'>
                <Image width={50} height={50} src={'/villager.png'} alt='koylu' className='object-contain rounded-full' />
                <h1 className='text-gray-800 text-center text-lg'>Köylü sayısı: <span className='text-green-700'>{numVillager}</span></h1>
            </div>

            <button type="submit" className="bg-blue-500 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Oyunu Başlat
            </button>
        </form>
    );
}

export default StartGameForm;
