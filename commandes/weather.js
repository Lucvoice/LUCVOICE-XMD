const { zokou } = require(__dirname + "/../framework/zokou");
const axios = require("axios");

zokou({ nomCom: "weather", categorie: "Info" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, arg } = commandeOptions;

    try {
        let city = arg && arg.length > 0 ? arg.join(" ") : "Dar es Salaam";

        repondre(`🌦️ Checking weather for *${city}*...`);

        let url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;

        let res = await axios.get(url);

        let data = res.data.current_condition[0];

        let temp = data.temp_C;
        let feelsLike = data.FeelsLikeC;
        let humidity = data.humidity;
        let weather = data.weatherDesc[0].value;
        let wind = data.windspeedKmph;

        let text = `
╭━━〔 🌦️ LUCVOICE-XMD WEATHER 〕━━╮
┃ 📍 Location : ${city}
┃ 🌡️ Temp     : ${temp}°C
┃ 🤗 Feels Like: ${feelsLike}°C
┃ ☁️ Condition : ${weather}
┃ 💧 Humidity  : ${humidity}%
┃ 💨 Wind      : ${wind} km/h
╰━━━━━━━━━━━━━━━━━━━━━━╯

🤖 Powered by LUCVOICE-XMD
`;

        await zk.sendMessage(dest, {
            text: text
        }, { quoted: ms });

    } catch (e) {
        console.log("Weather error:", e);
        repondre("❌ Failed to get weather info. Try again later.");
    }
});
