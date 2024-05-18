export class Game {
    constructor(playerNames, numVampires, numDoctor, numNeutral, numSheriff, numScout, numHunter) {
        this.players = this.assignRoles(playerNames, numVampires, numDoctor, numNeutral, numSheriff, numScout, numHunter);
        this.isNight = false;
    }

    assignRoles(playerNames, numVampires, numDoctor, numNeutral, numSheriff, numScout, numHunter) {
        const roles = [];
        const numVillagers = (playerNames.length - 1) - (numVampires + numDoctor + numNeutral + numSheriff + numScout + numHunter);

        for (let i = 0; i < numVampires; i++) {
            roles.push('Vampire');
        }
        for (let i = 0; i < numDoctor; i++) {
            roles.push('Doctor');
        }
        for (let i = 0; i < numSheriff; i++) {
            roles.push('Sheriff');
        }
        for (let i = 0; i < numScout; i++) {
            roles.push('Scout');
        }
        for (let i = 0; i < numHunter; i++) {
            roles.push('Hunter');
        }
        for (let i = 0; i < numNeutral; i++) {
            const role = Math.random() < 0.5 ? 'Jester' : 'Survivor';
            roles.push(role);
        }
        for (let i = 0; i < numVillagers; i++) {
            roles.push('Villager');
        }

        roles.sort(() => Math.random() - 0.5);

        return playerNames.map((name, index) => {
            if (index === playerNames.length - 1) {
                return {
                    name: name,
                    role: 'Skip',
                    isAlive: true,
                    isSelfHealed: false
                };
            }
            return {
                name: name,
                role: roles[index],
                isAlive: true,
                isSelfHealed: false,
                survivorVest: 2,
                sheriffLookout: 2,
                roleKnownBySheriff: false,
                nightActionTarget: null,
                scoutLookout: 3,
                hunterTrap: 1,
                isHunterUsedTrap: false
            };
        });
    }

}
