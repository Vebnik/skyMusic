const {SongManage} = require('../eventLogic/distubeLogic.js')
const {PlayManual, getSongList} = require('./mainAppMusic')
const {getFusingTg} = require('./telegramIntegrations')
const music = new PlayManual()


function CreateApp () {

	this.connect = (client) => {
		client.login(process.env.TOKEN)
			.then(ev => console.log(`DiscordApp started ⏰ ${new Date().toJSON()}`))
	}

	this.listener = (client) => {

		client.on('interactionCreate', inter => {
			if (!inter.isCommand()) return console.log('Err in interaction')
			const command = inter.commandName

			switch (command) {

				case 'play':
					music.start(inter, client)
						.catch(err => console.log(err))
				break

				case 'stop':
					music.destroy(inter)
						.catch(err => console.log(err))
				break

				case 'add':
					music.addQueue(inter)
						.catch(err => console.error(err))
				break

				case 'list':
					getSongList(inter)
						.catch(err => console.error(err))
				break

				case 'skip':
					music.skipSong(inter)
						.catch(err => console.error(err))
				break

				case 'repeat':
					new SongManage()
						.repeat(inter)
						.catch(err => console.error(err))
				break

				case 'pause':
					music.pause(inter)
						.catch(err => console.log(err))
				break
			}
		})

		client.on('messageCreate', msg => {
			if (msg.author.username === 'N9kita'){
				msg.react('🤡').catch(err => console.log(err))
			}
		})
	}

	this.tgInt = (client) => {
		getFusingTg(client)
	}
}


module.exports = {CreateApp}