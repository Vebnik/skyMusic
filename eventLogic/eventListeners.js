const {playMusic} = require('../eventLogic/commandLogic.js')
const {SongManage} = require('../eventLogic/distubeLogic.js')

function CreateApp () {

	this.connect = (client) => {
		client.login(process.env.TOKEN)
			.then(ev => console.log(`App started: ${new Date().toString()}`))
	}

	this.listener = (client) => {

		client.on('interactionCreate', inter => {
			if (!inter.isCommand()) return console.log('Err in interaction')
			const command = inter.commandName

			switch (command) {

				case 'play':
					playMusic(client, inter)
				break

				case 'repeat':
					new SongManage()
						.repeat(inter)
						.catch(err => console.error(err))
				break

				case 'add':
					new SongManage()
						.addSong(inter)
				break

				case 'pause':
					new SongManage()
						.pauseResumeSong(inter)
				break

				case 'skip':
					new  SongManage()
						.skipSong(inter)
				break

				case 'list':
					new SongManage()
						.listSong(inter)
				break

				case 'test':
					new SongManage()
						.testCommand(inter)
				break
			}
		})

		client.on('messageCreate', msg => {
			if (msg.author.username === 'N9kita'){
				msg.react('🤡').catch(err => console.log(err))
			}
		})
	}
}

module.exports = {CreateApp}