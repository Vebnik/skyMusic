const { Client, Intents } = require('discord.js');
const {CreateApp} = require('../eventLogic/eventListeners.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });
const app = new CreateApp(client)


app.listener(client)
app.connect(client)