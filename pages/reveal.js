// pages/reveal.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { characters } from '../roles';

function RoleReveal() {
    const router = useRouter();
    const { players } = router.query;
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [show, setShow] = useState(false);
    const [day, setDay] = useState(1)
    const [night, setNight] = useState(1)
    const [gameOver, setGameOver] = useState(false)
    useEffect(() => {
        if (players) {
            const parsedPlayers = JSON.parse(players);
            setCurrentPlayer(parsedPlayers[currentIndex]);
        }
    }, [players, currentIndex]);

    const handleNext = () => {
        setShow(false)
        if (currentIndex < JSON.parse(players).length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            router.push({
                pathname: '/day',
                query: { players: players, day: day, night: night, gameOver: gameOver }
            });
        }
    };

    const currentCharacter = characters.find(char => char.type === currentPlayer?.role);
    const vampireTeam = JSON.parse(players).filter(player => player.role === 'Vampire');


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
            {currentCharacter && currentPlayer.role !== 'Skip' && (
                <>
                    <div className="w-full max-w-md p-5 bg-gray-900 rounded-lg shadow-xl text-center">

                        <h2 className="text-xl font-bold mb-4">Bu ekranı sadece {currentPlayer.name} görsün</h2>
                        {!show &&
                            <div className='h-40 flex items-center justify-center'>
                                <button onClick={() => setShow(true)} className='px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-bold transition-colors'>Rolü Gör</button>
                            </div>
                        }
                        {show && <div>
                            <img src={currentCharacter.image} alt={currentCharacter.name} className="mx-auto h-40 w-40 object-cover rounded-full mb-4" />
                            <p className="text-lg mb-2">Rolün: {currentCharacter.name}</p>
                            <p className="text-sm mb-2" style={{ color: currentCharacter.sidecolor }}>{currentCharacter.description}</p>
                            {currentPlayer.role === 'Vampire' && vampireTeam.length > 1 && (
                                <>
                                    <h3 className="text-lg font-bold">Takım Arkadaşın:</h3>
                                    <ul>
                                        {vampireTeam.filter(vamp => vamp.name !== currentPlayer.name).map(vamp => (
                                            <li className='text-red-500 mb-4 mt-1' key={vamp.name}>{vamp.name}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            {/* <ul className="text-center mx-auto mb-4">
                                {currentCharacter.duties.map(duty => (
                                    <li key={duty}>{duty}</li>
                                ))}
                            </ul> */}
                            <button onClick={handleNext} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-bold transition-colors">
                                Sıradaki
                            </button>
                        </div>
                        }
                    </div>
                </>
            )}
            {currentCharacter && currentPlayer.role === 'Skip' &&
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg text-center">
                        <h1 className="text-2xl font-bold mb-4">Tüm oyuncular rollerini gördü!</h1>
                        <button
                            onClick={handleNext}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition-colors"
                        >
                            Oyunu Başlat
                        </button>
                    </div>
                </div>
            }

        </div>
    );
}

export default RoleReveal;
