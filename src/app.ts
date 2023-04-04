import moment from "moment";
import Discord, {Client, Intents} from "discord.js";

import { RainState, getRainState } from "./controllers/getRainState";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Seoul');

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
        const rainState: RainState = await getRainState();
        const date = dayjs().tz().add(1, "day");
        const embed = {
            title: `실내점호 확률: ${date.month}월 ${date.date}일 (다음 날)`,
            description: `실내 점호 가능성: ${rainState.state}`,
            color: 16557315,
            footer: {
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
                    value: `${date.month}월 ${date.date}일의 강수확률은 **${rainState.precipitation}%** 입니다`,
                    inline: false
                },
                {
                    name: "🌆 미세먼지",
                    value: `해당 기능은 업데이트 예정입니다`,
                    inline: false
                },
            ]
        };
        
        // 메세지 전송
        msg.channel.send({embeds:[embed]});
    }
});

client.login(DISCORD_TOKEN);