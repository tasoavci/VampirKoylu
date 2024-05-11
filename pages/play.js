import { useRouter } from "next/router";
import StartGameForm from "./StartGameForm";
import { Game } from './gameclasses';

export default function Play() {
    const router = useRouter();

    const handleFormSubmit = (playerNames, includeJester) => {
        console.log(includeJester)
        const game = new Game(playerNames, includeJester);
        const playersWithRoles = game.players;
        console.log(playersWithRoles)

        router.push({
            pathname: '/reveal',
            query: { players: JSON.stringify(playersWithRoles) }
        });
    };

    return (
        <div className='flex min-h-screen flex-col justify-center items-center bg-gray-800'>
            <StartGameForm onStartGame={handleFormSubmit} />
        </div>
    );
}
