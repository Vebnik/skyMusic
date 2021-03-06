const { eventHandler } = require('./eventHendler/evHandler')
const { commandListen } = require('./commandLogic/commandHandler')
const { getFusingDisc } = require('../eventLogic/telegramIntegrations')
const commandList = require('./commandLogic/commandList')

function StartApp (bot) {

	this.login = () => {
		bot.launch()
			.then(start => console.log(`TgApp started ⏰ ${new Date().toJSON()}`))
	}

	this.eventListen = () => {
		bot.command(commandList, ctx => { commandListen(ctx) })
		bot.on('message', ctx => { eventHandler(ctx) })
	}

	this.DiscConnect = () => {
		getFusingDisc(bot)
	}
}

module.exports = { StartApp }