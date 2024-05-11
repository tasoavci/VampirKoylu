import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2'
import { characters } from './../roles'
import Image from 'next/image';

function Day() {
    const router = useRouter();
    const initialPlayers = router.query.players ? JSON.parse(router.query.players) : [];
    const [players, setPlayers] = useState(initialPlayers);

    const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
    const [votes, setVotes] = useState({});
    const [currentDay, setCurrentDay] = useState(1);
    const [isNight, setIsNight] = useState(false)
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const currentPlayer = players[currentPlayerIndex];
    const [seeNightAction, setSeeNightAction] = useState(false)
    const [nightMessage, setNightMessage] = useState('')
    const [targetToKill, setTargetToKill] = useState([]);
    const [targetToSave, setTargetToSave] = useState(null);
    const [vampireVotes, setVampireVotes] = useState({});
    const playerRoles = players.filter(player => player.role !== 'Skip').map(player => {
        let color;
        switch (player.role) {
            case 'Vampire':
                color = 'red';
                break;
            case 'Doctor':
            case 'Villager':
                color = 'green';
                break;
            case 'Jester':
                color = 'blue';
                break;
            default:
                color = 'black';
        }
        return `<li>${player.name}: <span style="color: ${color};">${player.role}</span></li>`;
    }).join('');


    useEffect(() => {
        if (currentPlayer.role === 'Skip') {
            setSeeNightAction(true);
        }
    }, [currentPlayer]);

    useEffect(() => {
        const nextVoterIndex = (startIndex) => {
            let nextIndex = startIndex;
            let attempts = 0;

            while (nextIndex < players.length && !players[nextIndex].isAlive) {
                nextIndex++;
                if (nextIndex >= players.length) {
                    nextIndex = 0;
                }
                if (++attempts > players.length) {
                    return startIndex;
                }
            }
            return nextIndex;
        };
        if (players.length > 0 && (!players[currentVoterIndex].isAlive || currentVoterIndex >= players.length)) {
            const newIndex = nextVoterIndex(currentVoterIndex + 1);
            setCurrentVoterIndex(newIndex);
        }
    }, [players, currentVoterIndex, isNight]);
    const checkGameOver = () => {
        const livingPlayers = players.filter(player => player.isAlive && player.role !== 'Skip');
        const vampires = livingPlayers.filter(player => player.role === "Vampire");
        const villagers = livingPlayers.filter(player => player.role !== "Vampire");

        if (vampires.length >= villagers.length) {
            return "Tüm köylüler öldü ve vampirler kazandı!";
        }

        if (vampires.length === 0) {
            return "Tüm vampirler öldü ve köylüler kazandı!";
        }

        return null;
    };

    useEffect(() => {
        if (nightMessage) {
            Swal.fire({
                title: 'Gece Olayları',
                text: nightMessage,
                icon: 'info',
                confirmButtonText: 'Tamam',
            }).then(() => {
                setNightMessage('');
            });
        }
    }, [nightMessage]);

    const handleVote = (name) => {
        setVotes(prevVotes => {
            const updatedVotes = { ...prevVotes, [name]: (prevVotes[name] || 0) + 1 };
            console.log(updatedVotes)
            if (currentVoterIndex < players.length - 1) {
                setCurrentVoterIndex(currentVoterIndex + 1);
            } else {
                finishVoting(updatedVotes);
            }

            return updatedVotes;
        });
    };

    const finishVoting = (finalVotes) => {
        let maxVotes = 0;
        let playersToDie = [];


        Object.entries(finalVotes).forEach(([name, count]) => {
            if (count > maxVotes) {
                maxVotes = count;
                playersToDie = [name];
            } else if (count === maxVotes) {
                playersToDie.push(name);
            }
        });
        const skipPlayer = players.find(p => p.role === "Skip");
        if (playersToDie.includes(skipPlayer.name)) {
            return SkipVoting();
        }
        if (playersToDie.length > 1) {
            Swal.fire({
                title: 'Gündüz Olayları',
                text: "Oylar eşit, kimse ölmedi.",
                icon: 'info',
                confirmButtonText: 'Tamam',
            })
        } else {
            const player = players.find(p => p.name === playersToDie[0]);
            if (player) {
                player.isAlive = false;
                if (player.role === "Jester") {
                    Swal.fire({
                        title: 'Gündüz Olayları',
                        html: `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
                        <img src="/jester.png" style="width:100px; height:100px;">
                        <p>${player.name} oy birliğiyle öldürüldü ama soytarı olduğu için kazandı.</p>
                        </div>`,
                        confirmButtonText: 'Tamam',
                    })
                } else {
                    Swal.fire({
                        title: 'Gündüz Olayları',
                        text: `${player.name} oy birliğiyle öldürüldü`,
                        icon: 'info',
                        confirmButtonText: 'Tamam',
                    })
                }
            }
        }
        const gameResult = checkGameOver();
        if (gameResult) {
            Swal.fire({
                title: 'Oyun Sonu',
                html: `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
                <img src="/villager.png" style="width:100px; height:100px;">
                <p>${gameResult}</p>
                <ul>${playerRoles}</ul>
                </div>`,
                confirmButtonText: 'Tamam',
            });
            router.push('/');
        } else {
            handleEndDay();
        }
    };

    const handleEndDay = () => {
        setVotes({})
        setCurrentVoterIndex(0)
        setIsNight(true)
        setSeeNightAction(false)

    };
    const SkipVoting = () => {
        Swal.fire({
            title: 'Gündüz Olayları',
            text: "Oylama sonucu kimse ölmedi.",
            icon: 'info',
            confirmButtonText: 'Tamam',
        })
        handleEndDay()
    }

    const handleNextPlayer = () => {
        const nextIndex = (currentPlayerIndex + 1) % players.length;
        if (nextIndex === 0) {
            handleEndNight();
        } else {
            setCurrentPlayerIndex(nextIndex);
            setSeeNightAction(false);
        }
    };

    const handleEndNight = () => {
        if (targetToKill.length > 0) {
            const uniqueTargets = [...new Set(targetToKill)];
            if (uniqueTargets.length === 1) {


                const targetIndex = uniqueTargets[0];
                if (targetIndex === targetToSave) {
                    setNightMessage(`Bu gece kimse ölmedi.`);
                    setTargetToSave(null);
                    setTargetToKill([]);
                } else if (targetIndex === players.length - 1) {
                    setNightMessage('Bu gece kimse ölmedi.');
                    setTargetToKill([]);
                    setTargetToSave(null);
                }
                else {
                    players[targetIndex].isAlive = false;
                    const gameResult = checkGameOver();
                    if (gameResult) {
                        // Swal.fire({
                        //     title: 'Oyun Sonu',
                        //     text: gameResult,
                        //     icon: 'info'
                        // })
                        Swal.fire({
                            title: 'Oyun Sonu',
                            html: `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
                            <img src="/vampire.png" style="width:100px; height:100px;">
                            <p>${gameResult}</p>
                            <ul>${playerRoles}</ul>
                            </div>`,
                            confirmButtonText: 'Tamam',
                        });
                        router.push('/')
                    } else {
                        setNightMessage(`Vampir(ler) ${players[targetIndex].name} isimli oyuncuyu öldürdü.`);
                        setTargetToSave(null);
                        setTargetToKill([]);
                    }
                }
            } else {
                const randomTargetIndex = uniqueTargets[Math.floor(Math.random() * uniqueTargets.length)];
                if (randomTargetIndex === targetToSave) {
                    setNightMessage('Bu gece kimse ölmedi.');
                    setTargetToSave(null);
                    setTargetToKill([]);
                } else if (randomTargetIndex === players.length - 1) {
                    setNightMessage('Bu gece kimse ölmedi.');
                    setTargetToSave(null);
                    setTargetToKill([]);
                } else {
                    players[randomTargetIndex].isAlive = false;
                    const gameResult = checkGameOver();
                    if (gameResult) {
                        // Swal.fire({
                        //     title: 'Oyun Sonu',
                        //     text: gameResult,
                        //     icon: 'info'
                        // })
                        Swal.fire({
                            title: 'Oyun Sonu',
                            html: `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
                            <img src="/vampire.png" style="width:100px; height:100px;">
                            <p>${gameResult}</p>
                            <ul>${playerRoles}</ul>
                            </div>`,
                            confirmButtonText: 'Tamam',
                        });
                        router.push('/')
                    } else {
                        setNightMessage(`Vampir(ler) ${players[randomTargetIndex].name} isimli oyuncuyu öldürdü.`);
                        setTargetToSave(null);
                        setTargetToKill([]);
                    }
                }
            }
        }


        console.log(nightMessage)
        setIsNight(false);
        setCurrentPlayerIndex(0);
        setCurrentDay(currentDay + 1);
        setVampireVotes([])

    };


    const handleVampireKill = (targetIndex) => {
        setTargetToKill(prev => [...prev, targetIndex]);
        console.log(targetToKill)
        setVampireVotes(prevVotes => ({
            ...prevVotes,
            [targetIndex]: (prevVotes[targetIndex] || 0) + 1
        }))

        handleNextPlayer();
    };

    const handleDoctorSave = (targetIndex) => {
        const player = players[targetIndex];
        if (player.role === 'Doctor' && currentPlayerIndex === targetIndex && !player.isSelfHealed) {
            setPlayers(prevPlayers =>
                prevPlayers.map((p, idx) =>
                    idx === targetIndex ? { ...p, isSelfHealed: true } : p
                )
            );
        }
        setTargetToSave(targetIndex)
        handleNextPlayer();

    };


    return (
        <div className={`min-h-screen flex flex-col items-center justify-center py-10 ${isNight ? 'bg-black' : 'bg-blue-200'}`}>
            {!isNight ? (
                <>
                    <Image height={80} width={80} className='h-20 w-20 mb-5' src='/sunny.png' alt='sun' />
                    <h1 className="text-2xl font-bold mb-4">Gündüz Vakti - Oylama</h1>
                    <h1 className="text-2xl font-bold mb-4">{currentDay}. gün</h1>
                    {players[currentVoterIndex].role !== 'Skip' &&
                        <p className="text-lg mb-4">Oy kullanma sırası: {players[currentVoterIndex] ? <span className='font-bold text-gray-600 text-xl'>{players[currentVoterIndex].name}</span> : 'Bilinmeyen'}</p>}
                    {players[currentVoterIndex].role === 'Skip' &&
                        <p className='text-lg mb-4'>Oylama bitti</p>
                    }
                    {/* <div className='w-1/2'>
                        {players.map((player, index) => (
                            <button key={player.name}
                                onClick={() => handleVote(player.name)}
                                disabled={!player.isAlive || index === currentVoterIndex || players[currentVoterIndex].role === 'Skip'}
                                className={`${index === currentVoterIndex || players[currentVoterIndex].role === 'Skip' ? 'bg-blue-500/10' : ''} ${!player.isAlive ? 'bg-red-500/30' : ''} my-2 bg-blue-500 min-w-full text-white font-bold py-2 px-4 rounded`}>
                                {player.role !== 'Skip' ? 'Oy Ver:' : ''} {player.name} ({votes[player.name] || 0})
                            </button>
                        ))}
                    </div> */}
                    <div className='w-full flex flex-wrap justify-center items-center gap-4 p-4'>
                        {players.map((player, index) => (
                            <div key={player.name} className='bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-44 flex flex-col items-center'>
                                {player.role !== 'Skip' && player.isAlive &&
                                    <Image height={96} width={96} src={`/villager.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                }
                                {player.role !== 'Skip' && !player.isAlive &&
                                    <Image height={96} width={96} src={`/tombstone.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                }
                                {player.role === 'Skip' &&
                                    <Image height={96} width={96} src={`/voting-box.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                }
                                <h3 className='text-white text-lg'>{player.name}</h3>
                                <button
                                    onClick={() => handleVote(player.name)}
                                    disabled={!player.isAlive || index === currentVoterIndex || players[currentVoterIndex].role === 'Skip'}
                                    className={`${index === currentVoterIndex || players[currentVoterIndex].role === 'Skip' ? 'bg-blue-300/80 cursor-not-allowed' : 'bg-blue-500 '} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out mt-2 ${!player.isAlive ? 'bg-red-500/20' : ''}`}>
                                    {player.role !== 'Skip' ? 'Oy Ver' : ''} ({votes[player.name] || 0} Oy)
                                </button>
                            </div>
                        ))}
                    </div>


                    {players[currentVoterIndex].role !== 'Skip' &&
                        <button onClick={SkipVoting} className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Oylamayı Atla ve Geceye Geç
                        </button>
                    }
                    {players[currentVoterIndex].role === 'Skip' &&
                        <div className="mt-4 w-full flex justify-center">
                            <button
                                onClick={() => handleVote('bombos')}
                                className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg "
                            >
                                Geceye Geç
                            </button>
                        </div>
                    }
                </>
            ) : (
                <>
                    <div className="flex flex-col items-center justify-center min-h-screen text-white m-10 w-full">
                        <Image height={80} width={80} className='h-20 w-20 mb-5' src='/moon.png' alt='moon' />
                        <div className='mb-10 text-center text-gray-500'>
                            <h1 className="text-2xl font-bold mb-4">Gece Vakti - Görevler</h1>
                            <h1 className="text-2xl font-bold mb-4">{currentDay}. gece</h1>
                        </div>
                        {currentPlayer.isAlive ? (
                            <h2 className="text-xl font-bold mb-4 text-center">
                                {currentPlayer.role === 'Skip' ? 'Gece görevleri bitti' : `Bu ekranı sadece ${currentPlayer.name} görsün`}
                            </h2>
                        ) : (handleNextPlayer())}
                        {!seeNightAction &&
                            <button onClick={() => setSeeNightAction(true)} className='p-4 bg-blue-500 rounded-xl'>
                                {currentPlayer.role === 'Skip' ? 'Tuşa bas' : `Görevini yap`}
                            </button>
                        }

                        {currentPlayer.role === 'Vampire' && currentPlayer.isAlive && seeNightAction && (
                            <>
                                <div>
                                    <h1 className='text-red-500 text-2xl text-center'>{characters[2].name}</h1>
                                    <Image height={80} width={80} className='h-20 w-20 rounded-full' src={characters[2].image} alt={characters[2].type} />
                                </div>
                                <h3 className="my-2">Birini öldür:</h3>
                                <div className='w-full flex flex-wrap justify-center items-center gap-4 p-4'>
                                    {players.map((player, index) => (
                                        <div key={player.name} className={`bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-44 flex flex-col items-center ${player.role === 'Skip' ? 'hidden' : ''}`}>
                                            {player.role !== 'Skip' && player.role !== 'Vampire' && player.isAlive &&
                                                <Image height={96} width={96} src={`/villager.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            {player.role === 'Vampire' && player.isAlive &&
                                                <Image height={96} width={96} src={`/vampire.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            {player.role === 'Vampire' && !player.isAlive &&
                                                <Image height={96} width={96} src={`/coffin.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            {!player.isAlive && player.role !== 'Vampire' &&
                                                <Image height={96} width={96} src={`/tombstone.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            <button key={index}
                                                onClick={() => handleVampireKill(index)}
                                                disabled={!player.isAlive || index === currentPlayerIndex || player.role === 'Vampire'}
                                                className={`${index === currentPlayerIndex || player.role === 'Vampire' ? 'bg-gray-700 text-red-500' : 'bg-red-500 text-white'} ${!player.isAlive ? 'bg-gray-500/80 text-gray-400' : ''}  min-w-40  font-bold py-2 px-4 rounded my-2 w-full`}>
                                                {player.role === 'Skip' ? 'Kimseyi öldürme' : player.name}{vampireVotes[index] ? ` (${vampireVotes[index]} oy)` : ''}{!player.isAlive ? ' (Ölü)' : ''}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {currentPlayer.role === 'Doctor' && currentPlayer.isAlive && seeNightAction && (
                            <>
                                <div>
                                    <h1 className='text-green-500 text-2xl text-center'>{characters[1].name}</h1>
                                    <Image height={80} width={80} className='h-20 w-20 rounded-full' src={characters[1].image} alt={characters[1].type} />
                                </div>
                                {!currentPlayer.isSelfHealed &&
                                    <h1 className='text-xl my-2 text-green-500 text-center'>Kendini koruma hakkı: 1</h1>
                                }
                                {currentPlayer.isSelfHealed &&
                                    <h1 className='text-xl my-2 text-red-500 text-center'>Kendini koruma hakkın kalmadı</h1>
                                }
                                <h3 className="mb-2">Birini koru:</h3>
                                <div className='w-full flex flex-wrap justify-center items-center gap-4 p-4'>
                                    {players.map((player, index) => (
                                        <div key={player.name} className={`bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-44 flex flex-col items-center ${player.role === 'Skip' ? 'hidden' : ''}`}>
                                            {player.role !== 'Skip' && player.role !== 'Doctor' && player.isAlive &&
                                                <Image height={96} width={96} src={`/villager.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            {player.role !== 'Skip' && player.role !== 'Doctor' && !player.isAlive &&
                                                <Image height={96} width={96} src={`/tombstone.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            {player.role == 'Doctor' && player.isAlive &&
                                                <Image height={96} width={96} src={`/doctor.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            <button key={index}
                                                onClick={() => handleDoctorSave(index)}
                                                disabled={!player.isAlive || player.role === 'Skip' || (index === currentPlayerIndex && player.isSelfHealed)}
                                                className={`${!player.isAlive || (index === currentPlayerIndex && player.isSelfHealed) ? 'bg-green-500/10 text-gray-800' : ''} ${player.role === 'Skip' ? 'hidden' : ''} bg-green-500 min-w-40 w-full text-white font-bold py-2 px-4 rounded my-2`}>
                                                {player.role === 'Skip' ? '' : player.name}{player.role === 'Doctor' ? ' (Doktor)' : ''}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {currentPlayer.role === 'Jester' && currentPlayer.isAlive && seeNightAction && (
                            <>
                                <div className='flex items-center justify-center flex-col'>
                                    <h1 className='text-blue-500 text-2xl text-center'>{characters[3].name}</h1>
                                    <Image height={80} width={80} className='h-20 w-20 rounded-full' src={characters[3].image} alt={characters[3].type} />
                                    <h2 className='text-center text-lg mx-5'>Gece yapacak bir görevin olmadığı için aşağıda işlevsiz tuşlar var bas da anlaşılmasın soytarı olduğun</h2>
                                </div>
                                <div className='w-full flex flex-wrap justify-center items-center gap-4 p-4'>
                                    {players.map((player, index) => (
                                        <div key={player.name} className={`bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-44 flex flex-col items-center ${player.role === 'Skip' ? 'hidden' : ''}`}>
                                            {player.role !== 'Skip' && player.isAlive &&
                                                <Image height={96} width={96} src={`/villager.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            {player.role !== 'Skip' && !player.isAlive &&
                                                <Image height={96} width={96} src={`/tombstone.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            <button key={index}
                                                disabled={player.role === 'Skip'}
                                                onClick={handleNextPlayer}
                                                className={`${player.role === 'Skip' ? 'hidden' : ''} bg-green-500 hover:bg-green-700 w-full min-w-40 text-white font-bold py-2 px-4 rounded my-2`}>
                                                {player.role === 'Skip' ? '' : player.name}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {currentPlayer.role === 'Villager' && currentPlayer.isAlive && seeNightAction && (
                            <>
                                <div className='flex items-center justify-center flex-col'>
                                    <h1 className='text-green-500 text-2xl text-center'>{characters[0].name}</h1>
                                    <Image height={80} width={80} className='h-20 w-20 rounded-full' src={characters[0].image} alt={characters[0].type} />
                                    <h2 className='text-center text-lg mx-5'>Gece yapacak bir görevin olmadığı için aşağıda işlevsiz tuşlar var bas da anlaşılmasın köylü olduğun</h2>
                                </div>
                                <div className='w-full flex flex-wrap justify-center items-center gap-4 p-4'>
                                    {players.map((player, index) => (
                                        <div key={player.name} className={`bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-44 flex flex-col items-center ${player.role === 'Skip' ? 'hidden' : ''}`}>
                                            {player.role !== 'Skip' && player.isAlive &&
                                                <Image height={96} width={96} src={`/villager.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            {player.role !== 'Skip' && !player.isAlive &&
                                                <Image height={96} width={96} src={`/tombstone.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            <button key={index}
                                                disabled={player.role === 'Skip'}
                                                onClick={handleNextPlayer}
                                                className={`${player.role === 'Skip' ? 'hidden' : ''} bg-green-500 w-full min-w-40 hover:bg-green-700 text-white font-bold py-2 px-4 rounded my-2`}>
                                                {player.role === 'Skip' ? '' : player.name}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                            </>
                        )}
                        {currentPlayer.role === 'Skip' && seeNightAction &&
                            <div className="mt-4 w-full flex justify-center">
                                <button
                                    onClick={handleNextPlayer}
                                    className="bg-blue-500 hover:bg-blue-700 gap-1 flex items-center justify-center flex-col text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-300 focus:outline-none"
                                >
                                    <Image height={80} width={80} src='/sunny.png' alt='sun' className='h-20 w-20 ' />
                                    Sabaha Geç
                                </button>
                            </div>
                        }
                    </div>
                </>
            )}
        </div>
    );
}

export default Day;