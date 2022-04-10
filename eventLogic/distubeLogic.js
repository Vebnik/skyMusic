const { DisTube, Song} = require('distube')
const { patEmbed, msgPattern } = require('../msgDecorators/embedsEtc.js')
const ytdl = require('ytdl-core')

// distube object
let queue
let dist


async function getSongInfo (inter) {
	const url = inter.options._hoistedOptions[0].value
	let song
	await ytdl.getInfo(`${url}`)
		.then(vidInfo => { song = new Song(vidInfo, inter.user, true) })
	return song
}

function GetSong (inter, client) {
	dist = new DisTube(client, {
		leaveOnEmpty: true,
		leaveOnFinish: true,
		leaveOnStop: true,
	})

	this.playSong = async (inter) => {
		await inter.deferReply({ephemeral: true})
		if (!queue?.songs.length){
			getSongInfo(inter)
				.then(async song => {
					const msg = inter.member?.voice?.channel
					await dist.play(msg, song)
					queue = await dist.getQueue(msg)
					return song
				})
				.then(async song => {
					await inter.editReply({content: (`Playing: ${song.name}`).info(), ephemeral: true})
				})
				.catch(err => console.error(err))
		} else {
			await inter.editReply({content: ('Pls use /add').info(), ephemeral: true})
		}
	}

	dist.on('finishSong', async (queue, song) => {
		console.log('Finish song')
	})

}

function SongManage () {

	this.repeat = async (inter) => {
		await inter.deferReply({ephemeral: true})

		let mode = Number(inter.options._hoistedOptions[0].value)
		const msg = inter.member?.voice?.channel
		dist.setRepeatMode(msg, mode)

		await inter.editReply({content: mode === 0 ? ('Repeat is disabled').info() : ('Repeat is on').info(), ephemeral: true})
	}

	this.addSong = async (inter) => {
		await inter.deferReply({ephemeral: true})
		if (queue){
			getSongInfo(inter)
				.then(async song => {
					await queue.addToQueue(song)
					await inter.editReply({content: (`Add to queue: ${song.name}`).info(), ephemeral: true})
				})
				.catch(async err => {
					await inter.editReply({content: (`Check URL MAN`).info(), ephemeral: true})
					console.error(err)
				})
		} else {
			await inter.editReply({content: (`Empty queue`).info(), ephemeral: true})
		}

	}

	this.skipSong = (inter) => {
		let pos = inter?.options?._hoistedOptions[0]?.value
		queue.jump(pos || 1).catch(err => console.log(err))
		inter.reply({content: (`Skipped song`).info(), ephemeral: true})
	}

	this.pauseResumeSong = (inter) => {
		const msg = inter.member?.voice?.channel
		if (!dist.isPaused(msg)){
			dist.pause(msg)
			inter.reply({content: ('Paused').info()})
		} else {
			dist.resume(msg)
			inter.reply({content: ('Resume').info()})
		}
	}

	this.listSong = (inter) => {
		try {
			inter.reply({embeds: [patEmbed('list', queue.songs)], ephemeral: true})
		} catch (e) {
			inter.reply({embeds: [patEmbed('list', 0)], ephemeral: true})
		}
	}

	this.testCommand = async (inter) => {
		await inter.deferReply({ephemeral: true})
		queue.songs.forEach(el => { console.log(el.name) })
		await inter.editReply({content: (`Sons in queue: ${queue.songs.length}`).info(), ephemeral: true})
	}
}


module.exports = {GetSong, SongManage}