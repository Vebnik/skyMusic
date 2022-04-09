const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const {prod, testing} = require('../deployCommad/commandList.js')

function CreateCommand (guild) {

	this.oAuth = {
		token: process.env.TOKEN,
		clientId: process.env.APPID,
		guildId: guild
	}

	this.createComm = (command) => {

		command.map(command => command.toJSON());

		const rest = new REST({ version: '9' }).setToken(this.oAuth.token);

		rest.put(Routes.applicationGuildCommands(this.oAuth.clientId, this.oAuth.guildId), { body: command })
			.then(() => console.log('Successfully deploy commands.'))
			.catch(console.error)
	}
}

// тут в конструктор передать ID сервера
//let command = new CreateCommand('394072712785690624') // testing
let command = new CreateCommand('884380677141831730')
command.createComm(prod)
//command.createComm(testing)
