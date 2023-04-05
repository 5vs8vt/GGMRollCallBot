import Discord, {Client, Intents} from "discord.js";

import { RainState, getRainState } from "./services/getRainState";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Seoul');

import {DISCORD_TOKEN, WEATHER_API_KEY} from './services/getToken';
const client = new Client({intents: [
    Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES
] });


client.on("ready", () => {
    client.user!.setActivity('NewJeans의 Zero', {
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
        const todayDate = {
            month: date.get("month") + 1,
            date: date.get("date")
        }
        const embed = {
            title: `**실내점호 확률:** ${todayDate.month}월 ${todayDate.date}일`,
            description: `**실내 점호 가능성:** *${rainState.state}*`,
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
                    value: `${todayDate.month}월 ${todayDate.date}일의 강수확률은 **${rainState.precipitation}%** 입니다`,
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
        msg.reply({embeds:[embed]});
    }
});

client.login(DISCORD_TOKEN);