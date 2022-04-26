const { joinVoiceChannel, createAudioPlayer, StreamType, createAudioResource, NoSubscriberBehavior, generateDependencyReport } = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord')
const ytdlExec = require('youtube-dl-exec')

async function getSong (url) {
	if (typeof url !== 'string') return false

	console.log('Start exec')

	const stream = ytdlExec.exec(url, {
		o: '-',
		q: '',
		f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
		r: '100K',
	}, { stdio: ['ignore', 'pipe', 'ignore'] })

	return createAudioResource(stream.stdout)
}

function PlayManual () {

	const queue = new Map()

	const voiceLogic = {
		connection: null,
		player: null,
		songIndex: 0,
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

	this.addQueue = async (inter) => {
		const url = inter.options._hoistedOptions[0].value
		await ytdl.getBasicInfo(`${url}`).then(info => {
			queue.set(inter.guildId, [ {title: info.videoDetails.title, url: info.videoDetails.video_url} ])
		})

		if (queue.get(inter.guildId).length > 1) voiceLogic.player++
	}

	this.play = async (inter) => {
		const url = inter.options._hoistedOptions[0].value
		voiceLogic.player.play(await getSong(url))

		await this.addQueue(inter)
		await inter.editReply({content :`Playing now: ${queue.get(inter.guildId)[voiceLogic.songIndex].title}`})
	}
}


module.exports = {PlayManual}