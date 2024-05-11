export class Character {
    constructor(name) {
        this.name = name;
        this.isAlive = true;
    }

    die() {
        this.isAlive = false;
        console.log(`${this.name} is now dead.`);
    }

    revive() {
        this.isAlive = true;
        console.log(`${this.name} has been revived.`);
    }
}

export class Villager extends Character {
    constructor(name) {
        super(name);
    }

    vote() {
        if (!this.isAlive) return;
        console.log(`${this.name} (Villager) is voting during the day.`);
    }
}

export class Vampire extends Character {
    constructor(name) {
        super(name);
    }

    kill(victim) {
        if (!this.isAlive || !victim.isAlive) return;
        console.log(`${this.name} (Vampire) is killing ${victim.name} at night.`);
        victim.die();
    }
}

export class Doctor extends Character {
    constructor(name) {
        super(name);
    }

    save(victim) {
        if (!this.isAlive || !victim.isAlive) return;
        console.log(`${this.name} (Doctor) is saving ${victim.name} at night.`);
        victim.revive();
    }
}

export class Jester extends Character {
    constructor(name) {
        super(name);
    }

    vote() {
        if (!this.isAlive) return;
        console.log(`${this.name} (Jester) is voting during the day.`);
    }
}


export class Game {
    constructor(playerNames, includeJester) {
        this.players = this.assignRoles(playerNames, includeJester);
        this.isNight = false;
    }

    assignRoles(playerNames, includeJester) {
        const roles = [];
        const numVampires = playerNames.length >= 9 ? 2 : 1;
        const numDoctors = 1; // Her zaman 1 doktor
        const numJesters = includeJester ? (playerNames.length >= 8 ? 1 : 0) : 0;
        const numVillagers = (playerNames.length - 1) - (numVampires + numDoctors + numJesters);

        for (let i = 0; i < numVampires; i++) {
            roles.push('Vampire');
        }
        for (let i = 0; i < numDoctors; i++) {
            roles.push('Doctor');
        }
        for (let i = 0; i < numJesters; i++) {
            roles.push('Jester');
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
                isSelfHealed: false
            };
        });
    }




    toggleDayNight() {
        this.isNight = !this.isNight;
        console.log(`It is now ${this.isNight ? 'night' : 'day'}.`);
        this.isNight ? this.nightActions() : this.dayActions();
    }

    dayActions() {
        console.log("Day actions are taking place.");
        this.players.forEach(player => player instanceof Villager || player instanceof Jester ? player.vote() : null);
    }

    nightActions() {
        console.log("Night actions are taking place.");
        const vampires = this.players.filter(player => player instanceof Vampire && player.isAlive);
        const targets = this.players.filter(player => player.isAlive && !(player instanceof Vampire));
        vampires.forEach(vampire => vampire.kill(targets[Math.floor(Math.random() * targets.length)]));

        const doctor = this.players.find(player => player instanceof Doctor && player.isAlive);
        if (doctor) {
            const targetToSave = targets[Math.floor(Math.random() * targets.length)];
            doctor.save(targetToSave);
        }
    }

    findPlayerByName(name) {
        return this.players.find(player => player.name === name);
    }
}
