const {SongManage} = require('../eventLogic/distubeLogic.js')
const {PlayManual} = require('./mainAppMusic')
const music = new PlayManual()


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
					music.start(inter, client)
						.catch(err => console.log(err))
				break

				case 'pause':
					music.destroy(inter)
						.catch(err => console.log(err))
					break

				case 'repeat':
					new SongManage()
						.repeat(inter)
						.catch(err => console.error(err))
				break

				case 'add':
					new SongManage()
						.addSong(inter)
						.catch(err => console.error(err))
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
						.catch(err => console.error(err))
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