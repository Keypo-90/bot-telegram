const express = require('express')
const axios = require('axios').default
const { Telegraf } = require('telegraf');

// configuramos el .env
require('dotenv').config()
//creamos app Express
const app = express();

//creamos el bot de Telegram
const bot = new Telegraf(process.env.BOT_TOKEN);


//config conexion con telegram
app.use(bot.webhookCallback('/telegram-bot'))
bot.telegram.setWebhook(`${process.env.BOT_URL}/telegram-bot`)

app.post('/telegram-bot', (req, res) => {
    res.send('Responde')
});

//Comandos BOT
bot.command('prueba', async ctx => {
    await ctx.reply('funciona')
})
bot.command('tiempo', async ctx => {
    const ciudad = ctx.message.text.slice(8);
    try {
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${process.env.OWM_API_KEY}&units=metric`)

        await ctx.replyWithHTML(`Este es el tiempo de ${ciudad.toUpperCase()} actualmente
    Temperatura ${data.main.temp}ºC
    Mínima ${data.main.temp_min}ºC
    Máxima ${data.main.temp_max}ºC
    Humedad ${data.main.humidity}%
   `)
        await ctx.replyWithLocation(data.coord.lat, data.coord.lon)
    } catch (error) {
        ctx.reply(`No he encontrado ninguna ciudad con el nombre ${ciudad}`)
    }

})


//poner a escuchar en un puerto
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto${PORT}`)
})