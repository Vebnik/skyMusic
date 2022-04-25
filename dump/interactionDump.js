const {playMusic} = require("../eventLogic/commandLogic.js");
const {SongManage} = require("../eventLogic/distubeLogic.js");

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
				.catch(err => console.error(err))
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
				.catch(err => console.error(err))
			break
	}
})