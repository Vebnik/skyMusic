
const clientTgDisc = {
	disc: null,
	tg: null
}

function getFusingTg (client) {
	clientTgDisc.disc = client
}

function getFusingDisc (bot) {
	clientTgDisc.tg = bot
}


module.exports = { clientTgDisc, getFusingTg, getFusingDisc }
