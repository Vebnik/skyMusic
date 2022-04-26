const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
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

	voiceLogic.player.set(inter.guildId, createAudioPlayer( {debug: true, behaviors: {maxMissedFrames: 100, noSubscriber: NoSubscriberBehavior.Pause}}) )
	return voiceLogic.player.get(inter.guildId)
}

function getConnection (inter) {
	return voiceLogic.connection.get(inter.guildId)
}

function getQueue(inter) {
	if (queue.get(inter.guildId)) return queue.get(inter.guildId)

	queue.set(inter.guildId, [])
	return queue.get(inter.guildId)
}

async function getSongList(inter) {
	await inter.deferReply({ephemeral: true})
	if (!await getQueue(inter).length) return await inter.editReply({content: 'Queue empty'})

	const tempArr = []
	getQueue(inter).forEach((el, index)=> {
		tempArr.push(`${index} || ${el.title}`)
	})

	await inter.editReply({content: '```fix\n'+tempArr.join('\n')+'```'})
}

// Mail logic
function PlayManual () {

	this.start = async (inter, client) => {
		await this.createConnection(inter).catch(err => console.log(err))
		await this.createPlayer(inter).catch(err => console.log(err))
		await this.play(inter).catch(err => console.log(err))
		await this.playerEvHandler(inter).catch(err => console.log(err))
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
		await getConnection(inter).subscribe(getPlayer(inter))
	}

	this.play = async (inter) => {
		console.log('songIndex: ', voiceLogic.songIndex)
		const url = inter?.options?._hoistedOptions[0]?.value || inter
		await getPlayer(inter).play(await getSong(url))
		await this.addQueue(inter)
	}

	this.destroy = async (inter) => {
		await inter.deferReply({ephemeral: true})

		await getConnection(inter).destroy()
		await getPlayer(inter).stop()

		await inter.editReply({content: 'Stop all process'})
	}

	this.addQueue = async (inter) => {
		inter.deferReply({ephemeral: true})
		console.log('songIndex: ', voiceLogic.songIndex)
		const url = inter.options._hoistedOptions[0].value
		await ytdl.getBasicInfo(`${url}`).then(async info => {
			await getQueue(inter).push({title: info.videoDetails.title, url: info.videoDetails.video_url})
			await inter.editReply({content :'```fix\n'+`Add queue: ${info.videoDetails.title}\n`+'```'})
		})

		console.log('add')
	}

	this.playerEvHandler = async (inter) => {

		const guild = inter

		getPlayer(guild).on(AudioPlayerStatus.Idle, async () => {
			try {

				const nextSong = getQueue(guild)[++voiceLogic.songIndex].url
				console.log('songIndex event handler: ', voiceLogic.songIndex)
				console.log('Next song:', nextSong)
				await getPlayer(guild).play(await getSong(nextSong))

			} catch (e) {

				queue.set(guild.guildId, [])
				await getConnection(guild).destroy()
				await getPlayer(guild).stop()
				voiceLogic.songIndex = 0
			}
		})

		getPlayer(guild).on('error', async (err) => {
			console.log(err)
		})
	}

	this.skipSong = async (inter) => {
		const song = getQueue(inter)[0].url

	}

}


module.exports = {PlayManual, getSongList}