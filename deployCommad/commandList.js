const {SlashCommandBuilder} = require("@discordjs/builders");

const prod = [
	new SlashCommandBuilder().setName('play').setDescription('play [song_link]')
		.addStringOption(opt => {
			return opt.setName('url')
				.setDescription('URL song => https://youtu.be/XXXXXXXXXX')
				.setRequired(false)
		}),
	new SlashCommandBuilder().setName('repeat').setDescription('Repeated current song/playList')
		.addStringOption(opt => {
			return opt.setName('repeatmode')
				.addChoice('disabled', '0')
				.addChoice('repeatsong', '1')
				.addChoice('repeatqueue', '2')
				.setDescription('Repeat logic')
				.setRequired(true)
		}),
	new SlashCommandBuilder().setName('add').setDescription('Add song to current queue')
		.addStringOption(opt => {
			return opt.setName('url')
				.setDescription('URL song => https://youtu.be/XXXXXXXXXX')
				.setRequired(true)
		}),
	new SlashCommandBuilder().setName('pause').setDescription('Pause/Resume song'),
	new SlashCommandBuilder().setName('skip').setDescription('Skip current song to next / position')
		.addIntegerOption(opt => {
			return opt.setName('position')
				.setDescription('Song positions => list')
		}),
	new SlashCommandBuilder().setName('list').setDescription('Get queue list'),
]

const testing = [
	new SlashCommandBuilder().setName('play').setDescription('play [song_link]')
		.addStringOption(opt => {
		return opt.setName('url')
			.setDescription('URL song => https://youtu.be/XXXXXXXXXX')
			.setRequired(false)
	}),
	new SlashCommandBuilder().setName('repeat').setDescription('Repeated current song/playList')
		.addStringOption(opt => {
			return opt.setName('repeatmode')
				.addChoice('disabled', '0')
				.addChoice('repeatsong', '1')
				.addChoice('repeatqueue', '2')
				.setDescription('Repeat logic')
				.setRequired(true)
		}),
	new SlashCommandBuilder().setName('add').setDescription('Add song to current queue')
		.addStringOption(opt => {
			return opt.setName('url')
				.setDescription('URL song => https://youtu.be/XXXXXXXXXX')
				.setRequired(true)
		}),
	new SlashCommandBuilder().setName('stop').setDescription('Stop bot'),
	new SlashCommandBuilder().setName('skip').setDescription('Skip current song to next / position')
		.addIntegerOption(opt => {
			return opt.setName('position')
				.setDescription('Song positions => list')
				.setRequired(true)
		}),
	new SlashCommandBuilder().setName('list').setDescription('Get queue list'),
	new SlashCommandBuilder().setName('test').setDescription('Testing'),
]

module.exports = {prod, testing}