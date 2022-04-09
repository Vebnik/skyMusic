const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js')

function patEmbed (type, content) {

	const embed = new MessageEmbed().setColor('GREY').setFooter(new Date().toISOString())

	switch (type) {

		case 'list':
			if (!content.length) return embed.addField('List Song', '```fix\nEmpty queue\n```')
			let list = content.map((el, index) => `${index}: ${el.name}`).join('\n')
			console.log(list)
			return embed.addField('List Song', '```css\n'+list+'\n'+'```')
		break

	}
}

module.exports = { patEmbed }