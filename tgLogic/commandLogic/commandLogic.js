const { clientTgDisc } = require('../../eventLogic/telegramIntegrations')


async function sendMsgDiscord (ctx, cmd) {
	const content = ctx.update.message.text.split(cmd)[1]
	const userName = `${ctx.update.message.from.first_name || ' '} ${ctx.update.message.from.first_name.last_name || ' '}`
	const channel = await clientTgDisc.disc.channels.cache.get('968614387923423262')


	//await channel.send('```fix\n'+`${userName}\n${content}\n`+'```')
	await channel.send(`${userName}\n${content}`)
}


module.exports = { sendMsgDiscord }