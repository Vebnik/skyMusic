const { Client, Intents } = require('discord.js');
const {CreateApp} = require('../eventLogic/eventListeners.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });
const app = new CreateApp(client)
const express = require('express')
const PORT = process.env.PORT || 80
const appEx = express()


appEx.get('/', (req, res) => { res.end('<h1>Start Page</h1>') })
appEx.listen(PORT, () => console.log(`Start listen on ${PORT} PORT`))
//
app.listener(client)
app.connect(client)