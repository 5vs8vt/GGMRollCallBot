const moment = require('moment');
const request = require('request');

const Discord = require('discord.js');
const {Client, Intents} = require('discord.js');
const { getRainState } = require('./controllers/getRainState');
const client = new Client({intents: [
    Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES
] });
const {token, key} = require('./token.json');
//const token = process.env.TOKEN;

const dustUrl = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth';

client.on("ready", () => {
    client.user.setActivity('!실내점호', 'PLAYING');
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async msg => {
    if(msg.content === "!실내점호")
    {
        const rainState = await getRainState();

        const embed = {
            "title": `실내점호 확률: ${rainState.date.month}월 ${rainState.date.date}일 (다음 날)`,
            "description": `실내 점호 가능성: ${rainState.data.popStr}`,
            "color": 16557315,
            "footer": {
                "icon_url": "https://cdn.discordapp.com/attachments/1092677646288179253/1092723225294798920/E-isfH0XMAMMPUI.jpg?size=128",
                "text": "https://github.com/5vs8vt/GGMRollCallBot"
            },
            "author": {
                "name": "GGM 실내점호봇",
                "url": "",
                "icon_url": "https://cdn.discordapp.com/attachments/1092677646288179253/1092724765871046676/NWJNS.png"
            },
            "fields": [
                {
                    "name": "🌧️ 강수 확률",
                    "value": `${rainState.date.month}월 ${rainState.date.date}일의 강수확률은 **${rainState.data.pop}%** 입니다`
                },
                {
                    "name": "🌆 미세먼지",
                    "value": `업데이트 예정입니다`
                },
            ]
        };
            
        msg.channel.send({embeds:[embed]});
    }
});

client.login(token);