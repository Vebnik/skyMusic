const { joinVoiceChannel, createAudioPlayer, StreamType, createAudioResource, NoSubscriberBehavior, generateDependencyReport } = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord')
const ytdlExec = require('youtube-dl-exec')

const voiceLogic = {
	connection: new Map(),
	player: new Map(),
	songIndex: 0,
}

const queue = new Map()

// Utils
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

function getPlayer (inter) {
	if (voiceLogic.player.get(inter.guildId)) return voiceLogic.player.get(inter.guildId)
	return voiceLogic.player.set(inter.guildId, createAudioPlayer( {debug: true, behaviors: {maxMissedFrames: 100, noSubscriber: NoSubscriberBehavior.Pause}}) )
}

function getConnection (inter) {
	return voiceLogic.connection.get(inter.guildId)
}

function getQueue(inter) {
	return queue.get(inter.guildId)
}

async function getSongList(inter) {
	getQueue(inter)
}

// Mail logic
function PlayManual () {

	this.start = async (inter, client) => {
		await inter.deferReply({ephemeral: true})

		await this.createConnection(inter).catch(err => console.log(err))
		await this.createPlayer(inter).catch(err => console.log(err))
		await this.play(inter).catch(err => console.log(err))
	}

	this.createConnection = async (inter) => {
		const channel = await inter.member.guild.channels.fetch('849942421206859826')
		voiceLogic.connection.set(inter.guildId, joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		}))
	}

	this.createPlayer = async (inter) => {
		await getPlayer(inter)
		await getConnection(inter).subscribe(getPlayer(inter))
	}

	this.play = async (inter) => {
		const url = inter.options._hoistedOptions[0].value

		await getPlayer(inter).play(await getSong(url))
		await this.addQueue(inter)
		await inter.editReply({content :`Playing now: ${getQueue(inter)[voiceLogic.songIndex].title}`})
	}

	this.destroy = async (inter) => {
		await inter.deferReply({ephemeral: true})
		await voiceLogic.connection.get(inter.guildId).destroy()
		await queue =
		await inter.editReply({content: 'Stop all process'})
	}

	this.addQueue = async (inter) => {
		const url = inter.options._hoistedOptions[0].value
		await ytdl.getBasicInfo(`${url}`).then(info => {
			queue.set(inter.guildId, [ {title: info.videoDetails.title, url: info.videoDetails.video_url} ])
		})
		console.log('add')

		if (getQueue(inter).length > 1) voiceLogic.player++
	}

}


module.exports = {PlayManual, getSongList}