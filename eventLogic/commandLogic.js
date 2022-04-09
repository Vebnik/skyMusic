const {GetSong} = require('../eventLogic/distubeLogic.js')


function playMusic (client, inter) {
	const song = new GetSong(inter, client)
	song.playSong(inter)
}


module.exports = {playMusic}