const { Client, Intents } = require('discord.js');
const {Telegraf} = require('telegraf')
//
const {CreateApp} = require('../eventLogic/eventListeners.js')
const {StartApp} = require('../tgLogic/startApp')
//
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });
const tgBot = new Telegraf(process.env.BOT_TOKEN);
//
const app = new CreateApp(client)
const tgApp = new StartApp(tgBot)


// Discord integrations
app.tgInt(client)
app.listener(client)
app.connect(client)

// Tg integrations
tgApp.login()
tgApp.eventListen()