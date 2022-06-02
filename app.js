const moment = require('moment');
const request = require('request');

const Discord = require('discord.js');
const {Client, Intents} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
//const {token} = require('./token.json');
const token = process.env.TOKEN;

const rainUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
const dustUrl = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth';

//const {key} = require('./key.json');
const key = process.env.KEY;

const num_of_rows = 500;
let base_date;
const base_time = 2359; //전날 00시부터 가져와
const dataType = 'JSON';
const nx = 59;
const ny = 123;

const informCode = 'PM10'; //미세먼지임

const category = 'POP'; //강수확률 태그
const fcstTime = '0700'; //오전 6시

client.on("ready", () => {
    client.user.setActivity('?실내점호', 'PLAYING');
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {

    if(msg.content === "?실내점호")
    {
        const now = new Date();

        let targetDate;

        if(now.getHours() > 7)
        {
            targetDate = moment().subtract(1, 'd'); //전날꺼부터 가져와
        }
        else
        {
            targetDate = moment().subtract(2, 'd'); //전전날꺼부터 가져와
        }

        base_date = targetDate.format('YYYYMMDD');

        const req_rainUrl = `${rainUrl}?serviceKey=${key}&numOfRows=${num_of_rows}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;

        request.get(req_rainUrl, (err, res, body)=>{
            let result = JSON.parse(body);
            
            let items = result.response.body.items.item;

            targetDate = moment().add(1, 'd');

            let date = targetDate.date();
            let month = targetDate.month() + 1;
            
            let data = items.filter(x => x.category == category).filter(x => x.fcstTime == fcstTime).filter(x => x.fcstDate == targetDate.format("YYYYMMDD"));

            let pop = data[0].fcstValue;

            let str;

            if(pop >= 70)
            {
                str = "높음";
            }
            else if(pop >= 30)
            {
                str = "있음"
            }
            else
            {
                str = "낮음";
            }

            const embed = {
                "title": `${month}월 ${date}일의 실내점호 확률`,
                "description": `\n\`\`\`cs\n ${month}월 ${date}일은 "실내점호 일 확률이 \"${str}\"\`\`\`\n`,
                "color": 16557315,
                "footer": {
                    "icon_url": "https://cdn.discordapp.com/avatars/357483772037300225/a_344fd87d9c8569fa9ec168f1a6a6b9e9.gif?size=128",
                    "text": "만든 놈 : 박선우"
                },
                "author": {
                    "name": "GGM 실내점호봇",
                    "url": "",
                    "icon_url": "https://cdn.discordapp.com/attachments/969048582336430151/969061485533880360/Icon.png"
                },
                "fields": [
                    {
                    "name": "<:rain:969051378829893672> 강수확률",
                    "value": `${month}월 ${date}일의 강수확률은 **${pop}%** 입니다`
                    },
                    {
                    "name": "<:dust:969051378506944522> 미세먼지",
                    "value": `업데이트 예정입니다`
                    },
                ]};
            
            //헤로쿠가 정신이 나갔구나
            msg.channel.send({embeds:[embed]});
        });
    }
});

client.login(token);