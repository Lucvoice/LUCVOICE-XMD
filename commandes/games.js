const { zokou } = require(__dirname + "/../framework/zokou");

// In-memory game storage
let activeGames = {};

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

zokou({ nomCom: "game", categorie: "Games" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg, auteurMessage } = commandeOptions;

    let user = auteurMessage;

    let sub = arg ? arg[0] : null;

    // ===== GUESS NUMBER GAME =====
    if (sub === "guess") {
        let number = randomInt(1, 10);

        activeGames[user] = number;

        return repondre(
            `🎮 GUESS NUMBER GAME STARTED!\n\n` +
            `Nimechagua namba kati ya 1 - 10\n` +
            `Jaribu kubahatisha kwa: .game play <number>`
        );
    }

    if (sub === "play") {
        let guess = parseInt(arg[1]);
        let correct = activeGames[user];

        if (!correct) return repondre("❌ Hakuna game active. Tumia .game guess");

        if (!guess) return repondre("❌ Tumia: .game play <number>");

        if (guess === correct) {
            delete activeGames[user];
            return repondre("🎉 Correct! Umeshinda mchezo!");
        } else {
            return repondre(`❌ Wrong! Jaribu tena. Namba ilikuwa ${correct}`);
        }
    }

    // ===== DICE GAME =====
    if (sub === "dice") {
        let roll = randomInt(1, 6);
        return repondre(`🎲 Umetupa kete: *${roll}*`);
    }

    // ===== ROCK PAPER SCISSORS =====
    if (sub === "rps") {
        let choices = ["rock", "paper", "scissors"];
        let bot = choices[randomInt(0, 2)];
        let userChoice = arg[1];

        if (!userChoice) {
            return repondre("❌ Tumia: .game rps rock/paper/scissors");
        }

        let result = "";

        if (userChoice === bot) {
            result = "🤝 Draw!";
        } else if (
            (userChoice === "rock" && bot === "scissors") ||
            (userChoice === "paper" && bot === "rock") ||
            (userChoice === "scissors" && bot === "paper")
        ) {
            result = "🎉 Umeshinda!";
        } else {
            result = "❌ Umeshindwa!";
        }

        return repondre(
            `🎮 ROCK PAPER SCISSORS\n\n` +
            `👤 Wewe: ${userChoice}\n` +
            `🤖 Bot: ${bot}\n\n` +
            `${result}`
        );
    }

    return repondre(
        `🎮 GAMES MENU\n\n` +
        `.game guess - start guess game\n` +
        `.game play <number> - play guess game\n` +
        `.game dice - roll dice\n` +
        `.game rps <rock/paper/scissors> - play RPS`
    );
});
