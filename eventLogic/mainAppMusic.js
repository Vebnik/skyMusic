const { joinVoiceChannel, createAudioPlayer, StreamType, createAudioResource, NoSubscriberBehavior, generateDependencyReport } = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord')

console.log(generateDependencyReport())

async function getSong (url) {
	if (typeof url !== 'string') return false
	console.log(await ytdl(`${url}`))
	return createAudioResource(await ytdl(`${url}`), {inputType: StreamType.Opusm})
}


function PlayManual () {

	const queue = new Map()

	const voiceLogic = {
		connection: null,
		player: null
	}

	this.createConnection = async (inter) => {
		const channel = await inter.member.guild.channels.fetch('849942421206859826')

		voiceLogic.connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		})
	}

	this.start = async (inter, client) => {
		await inter.deferReply({ephemeral: true})

		if (voiceLogic.player && voiceLogic.connection) return this.play(inter)
		await this.createConnection(inter).catch(err => console.log(err))
		await this.createPlayer(inter).catch(err => console.log(err))
		await this.play(inter).catch(err => console.log(err))
	}

	this.destroy = async (inter) => {
		await inter.deferReply({ephemeral: true})
		await voiceLogic.connection.destroy()
	}

	this.createPlayer = async (inter) => {
		voiceLogic.player = createAudioPlayer({debug: true, behaviors: {maxMissedFrames: 100, noSubscriber: NoSubscriberBehavior.Pause}})
		await voiceLogic.connection.subscribe(voiceLogic.player)
	}

	this.addQueue = (inter) => {
		const url = inter.options._hoistedOptions[0].value
		ytdl.getBasicInfo(`${url}`).then(info => {
			queue.set(inter.guildId, [ {title: info.videoDetails.title, url: info.videoDetails.video_url} ])
		})
	}

	this.play = async (inter) => {
		const url = inter.options._hoistedOptions[0].value
		this.addQueue(inter)

		await voiceLogic.player.play(await getSong(url), {type: 'opus'})
		await inter.editReply({content :`Playing: ${queue.get(inter.guildId)[0].title}`})
	}
}


module.exports = { PlayManual }