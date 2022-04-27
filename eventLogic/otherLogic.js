const { clientTgDisc } = require('./telegramIntegrations')


const validation = {
	channel: ['968614387923423262'],
	prefix: ['!tg']
}

function addEmoji (msg) {
	//if (msg.author.username === 'N9kita') { msg.react('🤡').catch(err => console.log(err)) }
}

function sendTg (msg) {
	if ( validation.channel.includes(msg.channelId) && msg.content.startsWith(validation.prefix) ) {
		const userName = msg.author.username
		const content = msg.content.split('!tg')[1]
		const tgApp = clientTgDisc.tg

		tgApp.telegram.sendMessage('-1001527774412', `${userName}\n${content}`)
			.catch(err => console.log(err))
	}
}


module.exports = { addEmoji, sendTg }