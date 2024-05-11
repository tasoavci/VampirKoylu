// pages/game.js
import { useRouter } from "next/router";

export default function Game() {
    const router = useRouter();
    const { players } = router.query;
    const playerNames = players ? JSON.parse(players) : []; // Query'den gelen veriyi parse edin

    return (
        <div className='flex min-h-screen flex-col justify-center items-center bg-gray-800'>
            <h1>Oyun Sayfası</h1>
            {playerNames.map((player, index) => (
                <p key={index}>{player}</p>
            ))}
        </div>
    );
}
