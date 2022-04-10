const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js')

function patEmbed (type, content) {

	const embed = new MessageEmbed().setColor('GREY').setFooter(new Date().toISOString())

	switch (type) {

		case 'list':
			if (!content.length) return embed.addField('List Song', ('Empty queue').info())
			let list = content.map((el, index) => `${index}: ${el.name.normalize()} || Duration: ${(el.duration/60).toFixed(2)} min`).join('\n')
			return embed.addField('List Song', list.infoPy())
		break

	}
}

// edit proto from fast edit msg string !use all project
String.prototype.info = function () { return '```fix\n'+`${this}\n`+'```' }
String.prototype.infoPy = function () { return '```py\n'+`${this}\n`+'```' }
String.prototype.normalize = function () { return this.replaceAll(`'`, '') }

module.exports = { patEmbed }