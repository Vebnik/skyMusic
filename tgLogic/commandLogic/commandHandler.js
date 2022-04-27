const commandList = require('./commandList')
const { sendMsgDiscord } = require('./commandLogic')

const validChat = ['testingBot', 'Freedom TG (from discord)']

async function isTrueChat (ctx) {
	const chat = ctx.update.message.chat
	const content = ctx.update.message.text

	console.log(chat)

	if (!validChat.includes(chat.title)) return false

	return commandList.filter(el => content.includes(el))[0]
}

function commandListen (ctx) {
	isTrueChat(ctx).then(command => {
		if (!command) return console.log('Not valid chat')

		console.log(command)

		switch (command) {

			case 'dis':
				sendMsgDiscord(ctx, command)
					.catch(err => console.log(err))
			break
		}
	})
}


module.exports = { commandListen }