import React, { useState } from 'react';
import { useRouter } from 'next/router';

function StartGameForm({ onStartGame }) {
    const [playerCount, setPlayerCount] = useState(5);
    const [playerNames, setPlayerNames] = useState(Array(5).fill(''));
    const [includeJester, setIncludeJester] = useState(false);
    const router = useRouter()


    const handlePlayerCountChange = event => {
        const count = parseInt(event.target.value, 10);
        setPlayerCount(count);
        setPlayerNames(Array(count).fill(''));
    };

    const handlePlayerNameChange = (index, event) => {
        const newNames = [...playerNames];
        newNames[index] = event.target.value;
        setPlayerNames(newNames);
    };
    const handleJesterToggle = () => {
        setIncludeJester(!includeJester);
    };

    const handleSubmit = event => {
        event.preventDefault();
        // onStartGame([...playerNames, 'Boş Oy']);
        onStartGame([...playerNames, 'Boş Oy'], includeJester); // Jester durumu ile başlatma fonksiyonunu çağır

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
            {playerCount >= 7 &&
                <div className="mb-4">
                    <label className="flex items-center text-lg text-gray-700">
                        <input
                            type="checkbox"
                            checked={includeJester}
                            onChange={handleJesterToggle}
                            className="mr-2 "
                        />
                        Soytarı Rolünü Dahil Et
                    </label>
                </div>
            }
            <button type="submit" className="bg-blue-500 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Oyunu Başlat
            </button>
        </form>
    );
}

export default StartGameForm;
