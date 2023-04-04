import moment from "moment";
import Discord, {Client, Intents} from "discord.js";

import { getRainState } from "./controllers/getRainState";

//import {token, key} from './token.json';
const client = new Client({intents: [
    Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES
] });
const { DISCORD_TOKEN, WEATHER_API_KEY, DUST_API_KEY} = process.env;


client.on("ready", () => {
    client.user!.setActivity('NewJeans의 Hype Boy', {
        type: "LISTENING"
    });

    console.log(`준비가 완료되었습니다.`);
});

client.on("messageCreate", async msg => {
    if(msg.content === "!실내점호")
    {
        // 비
        const rainState = await getRainState();

        const embed = {
            title: `실내점호 확률: ${rainState.date.month}월 ${rainState.date.date}일 (다음 날)`,
            description: `실내 점호 가능성: ${rainState.data.popStr}`,
            color: 16557315,
            footer: {
                iconURL: "https://cdn.discordapp.com/attachments/1092677646288179253/1092723225294798920/E-isfH0XMAMMPUI.jpg?size=128",
                text: "https://github.com/5vs8vt/GGMRollCallBot"
            },
            author: {
                name: "GGM 실내점호봇",
                url: "",
                iconURL: "https://cdn.discordapp.com/attachments/1092677646288179253/1092724765871046676/NWJNS.png"
            },
            fields: [
                {
                    name: "🌧️ 강수 확률",
                    value: `${rainState.date.month}월 ${rainState.date.date}일의 강수확률은 **${rainState.data.pop}%** 입니다`,
                    inline: false
                },
                {
                    name: "🌆 미세먼지",
                    value: `업데이트 예정입니다`,
                    inline: false
                },
            ]
        };
        
        // 메세지 전송
        msg.channel.send({embeds:[embed]});
    }
});

client.login(DISCORD_TOKEN);