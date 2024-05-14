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
    const [targetToVest, setTargetToVest] = useState(null);
    const [vampireVotes, setVampireVotes] = useState({});

    const playerRoles = players.filter(player => player.role !== 'Skip').map(player => {
        let color;
        let roleName;

        switch (player.role) {
            case 'Vampire':
                color = 'red';
                roleName = 'Vampir';
                break;
            case 'Doctor':
                color = 'green';
                roleName = 'Doktor';
                break;
            case 'Villager':
                color = 'green';
                roleName = 'Köylü';
                break;
            case 'Jester':
                color = 'blue';
                roleName = 'Soytarı';
                break;
            case 'Survivor':
                color = 'blue';
                roleName = 'Survivor';
                break;
            default:
                color = 'black';
                roleName = player.role;
        }
        return `<li>${player.name}: <span style="color: ${color};">${roleName}</span></li>`;
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
        const villagers = livingPlayers.filter(player => player.role === "Villager" || player.role === "Doctor");
        const survivors = livingPlayers.filter(player => player.role === "Survivor");
        const jesters = livingPlayers.filter(player => player.role === 'Jester');

        let result = null
        if (survivors.length > 0) {
            if (vampires.length === 0 && survivors.length > 0 && villagers.length > 0) {
                result = "Tüm vampirler öldü. Köylüler ve Survivor kazandı!"
            }
            if (villagers.length === 0 && vampires.length > 0 && survivors.length > 0 && jesters.length === 0) {
                result = "Tüm köylüler öldü. Vampirler ve Survivorlar kazandı!"
            }
            if (villagers.length === 0 && vampires.length === 0 && survivors.length > 0) {
                result = "Survivor Kazandı!"
            }
        }
        if (survivors.length === 0) {
            if (vampires.length === 0 && villagers.length > 0) {
                result = "Tüm vampirler öldü ve köylüler kazandı!";
            }
            if (vampires.length >= villagers.length) {
                result = "Tüm köylüler öldü ve vampirler kazandı!"
            }
        }
        return result;
    };

    useEffect(() => {
        if (nightMessage) {
            Swal.fire({
                title: 'Gece Olayları',
                // text: nightMessage,
                html: nightMessage,
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
                    player.win = true;
                    Swal.fire({
                        title: 'Gündüz Olayları',
                        html: `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
                        <img src="/jester.png" style="width:100px; height:100px;">
                        <p>${player.name} oy birliğiyle öldürüldü ve soytarı olduğu için kazandı.</p>
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
                <p>Gün Sayısı: ${currentDay}</p>
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
            customClass: {
                popup: 'bg-gray-100 shadow-lg border',
                title: 'text-xl font-semibold',
                content: 'text-gray-800'
            },
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
                if ((targetIndex === targetToSave) || (targetIndex === targetToVest)) {
                    // setNightMessage(`Bu gece kimse ölmedi.`);
                    setNightMessage(`
                    <p class="mb-4"><strong>Bu gece kimse ölmedi.</strong></p>
                    <ul>
                    <li>Survivor yelek giymiş olabilir.</li>
                        <li>Doktor vampirlerin hedefini korumuş olabilir.</li>
                        <li>Vampirler taktiksel olarak kimseyi öldürmemiş olabilir.</li>
                    </ul>
`);
                    setTargetToSave(null);
                    setTargetToKill([]);
                    setTargetToVest(null);
                } else if (targetIndex === players.length - 1) {
                    // setNightMessage('Bu gece kimse ölmedi.');
                    setNightMessage(`
                    <p class="mb-4"><strong>Bu gece kimse ölmedi.</strong></p>
                    <ul>
                    <li>Survivor yelek giymiş olabilir.</li>
                        <li>Doktor vampirlerin hedefini korumuş olabilir.</li>
                        <li>Vampirler taktiksel olarak kimseyi öldürmemiş olabilir.</li>
                    </ul>
`);
                    setTargetToKill([]);
                    setTargetToSave(null);
                    setTargetToVest(null);
                }
                else {
                    players[targetIndex].isAlive = false;
                    const gameResult = checkGameOver();
                    if (gameResult) {
                        Swal.fire({
                            title: 'Oyun Sonu',
                            html: `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
                            <img src="/vampire.png" style="width:100px; height:100px;">
                            <p>${gameResult}</p>
                            <p>Gün Sayısı: ${currentDay}</p>
                            <ul>${playerRoles}</ul>
                            </div>`,
                            confirmButtonText: 'Tamam',
                        });
                        router.push('/')
                    } else {
                        setNightMessage(`Vampir(ler) ${players[targetIndex].name} isimli oyuncuyu öldürdü.`);
                        setTargetToSave(null);
                        setTargetToKill([]);
                        setTargetToVest(null);
                    }
                }
            } else {
                const randomTargetIndex = uniqueTargets[Math.floor(Math.random() * uniqueTargets.length)];
                if ((randomTargetIndex === targetToSave) || (randomTargetIndex === targetToVest)) {
                    // setNightMessage('Bu gece kimse ölmedi.');
                    setNightMessage(`
                    <p class="mb-4"><strong>Bu gece kimse ölmedi.</strong></p>
                    <ul>
                    <li>Survivor yelek giymiş olabilir.</li>
                        <li>Doktor vampirlerin hedefini korumuş olabilir.</li>
                        <li>Vampirler taktiksel olarak kimseyi öldürmemiş olabilir.</li>
                    </ul>
`);
                    setTargetToSave(null);
                    setTargetToKill([]);
                    setTargetToVest(null);
                } else if (randomTargetIndex === players.length - 1) {
                    // setNightMessage('Bu gece kimse ölmedi.');
                    setNightMessage(`
                    <p class="mb-4"><strong>Bu gece kimse ölmedi.</strong></p>
                    <ul>
                    <li>Survivor yelek giymiş olabilir.</li>
                        <li>Doktor vampirlerin hedefini korumuş olabilir.</li>
                        <li>Vampirler taktiksel olarak kimseyi öldürmemiş olabilir.</li>
                    </ul>
`);
                    setTargetToSave(null);
                    setTargetToKill([]);
                    setTargetToVest(null);
                } else {
                    players[randomTargetIndex].isAlive = false;
                    const gameResult = checkGameOver();
                    if (gameResult) {
                        Swal.fire({
                            title: 'Oyun Sonu',
                            html: `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
                            <img src="/vampire.png" style="width:100px; height:100px;">
                            <p>${gameResult}</p>
                            <p>Gün Sayısı: ${currentDay}</p>
                            <ul>${playerRoles}</ul>
                            </div>`,
                            confirmButtonText: 'Tamam',
                        });
                        router.push('/')
                    } else {
                        setNightMessage(`Vampir(ler) ${players[randomTargetIndex].name} isimli oyuncuyu öldürdü.`);
                        setTargetToSave(null);
                        setTargetToKill([]);
                        setTargetToVest(null);
                    }
                }
            }
        }


        setIsNight(false);
        setCurrentPlayerIndex(0);
        setCurrentDay(currentDay + 1);
        setVampireVotes([])
        setTargetToVest(null);

    };


    const handleVampireKill = (targetIndex) => {
        setTargetToKill(prev => [...prev, targetIndex]);
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
    const handleSurvivorProtect = (targetIndex) => {
        const player = players[targetIndex]
        if (player.role === 'Survivor' && currentPlayerIndex === targetIndex && player.survivorVest > 0) {
            setPlayers(prevPlayers =>
                prevPlayers.map((p, idx) =>
                    idx === targetIndex ? { ...p, survivorVest: p.survivorVest - 1 } : p
                )
            );
            setTargetToVest(targetIndex)
        }
        handleNextPlayer()
    }
    const handleSheriffLearn = (targetIndex) => {
        const player = players[targetIndex]
        if (players[currentPlayerIndex].role === 'Sheriff' && players[currentPlayerIndex].sheriffLookout > 0) {
            setPlayers(prevPlayers =>
                prevPlayers.map((p, idx) =>
                    idx === currentPlayerIndex ? { ...p, sheriffLookout: p.sheriffLookout - 1 } : p
                )
            );
            Swal.fire({
                title: `<strong>Oyuncunun Rolü:</strong>`,
                html: `<div style="color: ${getColorByRole(player.role)}; font-size: 20px;">${categorizeRole(player.role)}</div>`,
                imageUrl: getImageByRole(player.role),
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: 'rol',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true
            });
        }
        player.roleKnownBySheriff = true
        handleNextPlayer()
    }
    function categorizeRole(role) {
        switch (role) {
            case 'Doctor':
                return 'Doktor';
            case 'Sheriff':
                return 'Muhtar';
            case 'Villager':
                return 'Köylü';
            case 'Vampire':
                return 'Vampir';
            case 'Jester':
                return 'Soytarı';
            case 'Survivor':
                return 'Survivor';
            default:
                return '';
        }
    }
    function getColorByRole(role) {
        switch (role) {
            case 'Doctor':
            case 'Villager':
            case 'Sheriff':
                return '#28a745';
            case 'Vampire':
                return '#dc3545';
            case 'Jester':
            case 'Survivor':
                return '#007bff';
            default:
                return '#6c757d';
        }
    }
    function getImageByRole(role) {
        switch (role) {
            case 'Doctor':
                return '/doctor.png';
            case 'Sheriff':
                return '/sheriff.png';
            case 'Villager':
                return '/villager.png';
            case 'Vampire':
                return '/vampire.png';
            case 'Jester':
                return '/jester.png';
            case 'Survivor':
                return '/survivor.png';
            default:
                return '';
        }
    }
    if (!currentPlayer) {
        return <div>Yukleniyor...</div>;
    }
    console.log(players)
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
                                    <h1 className='text-red-500 text-2xl text-center'>{characters[4].name}</h1>
                                    <Image height={80} width={80} className='h-20 w-20 rounded-full' src={characters[4].image} alt={characters[4].type} />
                                </div>
                                <h3 className="my-2">Birini öldür:</h3>
                                <div className='w-full flex flex-wrap justify-center items-center gap-4 p-4'>
                                    {players.map((player, index) => (
                                        <div key={player.name} className={`bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-44 flex flex-col items-center `}>
                                            {player.role === 'Skip' &&
                                                <div className='relative'>
                                                    <Image height={96} width={96} src={`/bloody.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />

                                                    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                                        <svg className="w-full h-full rounded-full text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                                                            <line x1="1" y1="1" x2="23" y2="23" />
                                                            <line x1="23" y1="1" x2="1" y2="23" />
                                                        </svg>
                                                    </div>

                                                </div>

                                            }
                                            {player.role !== 'Skip' && player.role !== 'Vampire' && player.isAlive &&
                                                <Image height={96} width={96} src={`/anonymous-woman.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
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
                                                // className={`${index === currentPlayerIndex || player.role === 'Vampire' ? 'bg-gray-700 text-red-500' : 'bg-red-500 text-white'} ${!player.isAlive ? 'bg-gray-500/80 text-gray-400' : ''}  ${player.role === 'Skip' ? 'text-sm' : ''}  min-w-40  font-bold py-2 px-4 rounded my-2 w-full`}
                                                className={`min-w-40 font-bold py-2 px-4 rounded my-2 w-full
            ${!player.isAlive ? 'bg-gray-500/80 text-gray-400' :
                                                        `${index === currentPlayerIndex || player.role === 'Vampire' ? 'bg-gray-700 text-red-500' : 'bg-red-500 text-white'}
              ${player.role === 'Skip' ? 'text-sm' : ''}`
                                                    }`}
                                            >

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
                                                <Image height={96} width={96} src={`/anonymous-woman.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
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
                                    <h1 className='text-blue-500 text-2xl text-center'>{characters[5].name}</h1>
                                    <Image height={80} width={80} className='h-20 w-20 rounded-full' src={characters[5].image} alt={characters[5].type} />
                                    <h2 className='text-center text-lg mx-5'>Gece yapacak bir görevin olmadığı için aşağıda işlevsiz tuşlar var bas da anlaşılmasın soytarı olduğun</h2>
                                </div>
                                <div className='w-full flex flex-wrap justify-center items-center gap-4 p-4'>
                                    {players.map((player, index) => (
                                        <div key={player.name} className={`bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-44 flex flex-col items-center ${player.role === 'Skip' ? 'hidden' : ''}`}>
                                            {player.role !== 'Skip' && player.isAlive &&
                                                <Image height={96} width={96} src={`/anonymous-woman.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            {player.role !== 'Skip' && !player.isAlive &&
                                                <Image height={96} width={96} src={`/tombstone.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            <button key={index}
                                                disabled={player.role === 'Skip'}
                                                onClick={handleNextPlayer}
                                                className={`${player.role === 'Skip' ? 'hidden' : ''} bg-blue-500  w-full min-w-40 text-white font-bold py-2 px-4 rounded my-2`}>
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
                                                <Image height={96} width={96} src={`/anonymous-woman.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
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
                        {currentPlayer.role === 'Survivor' && currentPlayer.isAlive && seeNightAction && (
                            <>
                                <div className='flex items-center justify-center flex-col'>
                                    <h1 className='text-blue-500 text-2xl text-center'>{characters[6].name}</h1>
                                    <Image height={80} width={80} className='h-20 w-20 rounded-full' src={characters[6].image} alt={characters[6].type} />
                                    {currentPlayer.survivorVest > 0 &&
                                        <h2 className='text-center text-lg mx-5 mt-2'>Kendini koru:</h2>
                                    }
                                    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-2 mt-4">
                                        {currentPlayer.survivorVest > 0 &&
                                            <>
                                                <h1 className="text-lg font-semibold text-gray-700 text-center">Yelek sayısı: <span className="text-blue-600">{currentPlayer.survivorVest ? currentPlayer.survivorVest : 0}</span></h1>
                                                <div className="flex gap-2 mt-4 items-center justify-center ">
                                                    <button onClick={() => handleSurvivorProtect(currentPlayerIndex)} className="bg-blue-500 text-white font-bold py-2 px-4 rounded text-center">Kullan</button>
                                                    <button onClick={handleNextPlayer} className="bg-gray-500 text-white font-bold py-2 px-2 rounded text-center">Kullanma</button>
                                                </div>
                                            </>
                                        }
                                        {currentPlayer.survivorVest === 0 &&
                                            <h1 className="text-lg font-semibold text-red-700 text-center">Tüm yelekler tükendi</h1>
                                        }


                                    </div>
                                    {currentPlayer.survivorVest === 0 &&
                                        <h2 className='text-center text-lg mx-5'>Aşağıdaki tuşlara basarak sıranı geçebilirsin</h2>
                                    }

                                </div>
                                <div className='w-full flex flex-wrap justify-center items-center gap-4 p-4'>
                                    {players.map((player, index) => (
                                        <div key={player.name} className={`bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-44 flex flex-col items-center ${player.role === 'Skip' ? 'hidden' : ''}`}>
                                            {player.role !== 'Skip' && player.isAlive &&
                                                <Image height={96} width={96} src={`/anonymous-woman.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            {player.role !== 'Skip' && !player.isAlive &&
                                                <Image height={96} width={96} src={`/tombstone.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            <button key={index}
                                                disabled={player.role === 'Skip'}
                                                onClick={handleNextPlayer}
                                                className={`${player.role === 'Skip' ? 'hidden' : ''} bg-blue-500 w-full min-w-40  text-white font-bold py-2 px-4 rounded my-2`}>
                                                {player.role === 'Skip' ? '' : player.name}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                            </>
                        )}
                        {currentPlayer.role === 'Sheriff' && currentPlayer.isAlive && seeNightAction && (
                            <>
                                <div className='flex items-center justify-center flex-col'>
                                    <h1 className='text-green-500 text-2xl text-center'>{characters[3].name}</h1>
                                    <Image height={80} width={80} className='h-20 w-20 rounded-full' src={characters[3].image} alt={characters[3].type} />
                                    {currentPlayer.sheriffLookout > 0 &&
                                        <>
                                            <h1 className="text-lg font-semibold text-gray-700 text-center">Rol görme hakkın: <span className="text-green-600">{currentPlayer.sheriffLookout ? currentPlayer.sheriffLookout : 0}</span></h1>
                                            <div className="flex gap-2 mt-4 text-xl items-center justify-center ">
                                                Birinin rolünü öğren:
                                            </div>
                                        </>
                                    }
                                    {currentPlayer.sheriffLookout === 0 &&
                                        <div className='flex flex-col items-center justify-center gap-2'>
                                            <h1 className="text-lg font-semibold text-red-700 text-center">Rol öğrenme hakkın bitti.</h1>
                                            <button onClick={handleNextPlayer} className='bg-green-500 px-4 py-1 text-xl rounded-lg'>Sıranı geç</button>
                                        </div>
                                    }
                                </div>
                                <div className='w-full flex flex-wrap justify-center items-center gap-4 p-4'>
                                    {players.map((player, index) => (
                                        <div key={player.name} className={`bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-44 flex flex-col items-center ${player.role === 'Skip' ? 'hidden' : ''}`}>
                                            {player.role === 'Sheriff' && player.isAlive &&
                                                <Image height={96} width={96} src={`/sheriff.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            {player.roleKnownBySheriff && player.isAlive &&
                                                <Image height={96} width={96} src={getImageByRole(player.role)} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            {player.role !== 'Skip' && player.isAlive && player.role !== 'Sheriff' && !player.roleKnownBySheriff &&
                                                < Image height={96} width={96} src={`/anonymous-woman.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />

                                            }
                                            {player.role !== 'Skip' && !player.isAlive &&
                                                <Image height={96} width={96} src={`/tombstone.png`} alt={player.name} className='w-24 h-24 rounded-full mb-3' />
                                            }
                                            <button key={index}
                                                disabled={player.role === 'Skip' || currentPlayerIndex === index || player.roleKnownBySheriff || players[currentPlayerIndex].sheriffLookout === 0}
                                                onClick={() => handleSheriffLearn(index)}
                                                className={`${player.role === 'Skip' ? 'hidden' : ''} ${`${currentPlayerIndex === index || player.roleKnownBySheriff || players[currentPlayerIndex].sheriffLookout === 0 ? 'bg-green-500/10' : ''}`} bg-green-500 w-full min-w-40 text-white font-bold py-2 px-4 rounded my-2`}>
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
            )
            }
        </div >
    );
}

export default Day;