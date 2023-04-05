import axios from "axios"
import dayjs, { Dayjs } from "dayjs"
const rainUrl = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';

import {DISCORD_TOKEN, WEATHER_API_KEY} from './getToken'

const num_of_rows = 500;
const base_time = 2359; //전날 00시부터 가져와
const dataType = 'JSON';
const nx = 59;
const ny = 123;

const informCode = 'PM10'; //미세먼지임

const category = 'POP'; //강수확률 태그
const fcstTime = '0700'; //오전 6시

// Api의 Item 타입 선언
interface itemJsonType {
    category: string;
    baseDate: string;
    baseTime: string;
    fcstTime: string;
    fcstDate: string;
    fcstValue: string;
}

export interface RainState {
    precipitation: number;
    state: string;
}

const getRainState = async () : Promise<RainState> => {
    const now: Date = new Date();
    let targetDate: Dayjs = dayjs().tz().subtract(1, 'day'); //전날꺼부터 가져와

    const reqUrl: string = `${rainUrl}?serviceKey=${WEATHER_API_KEY}&numOfRows=${num_of_rows}&dataType=${dataType}&base_date=${targetDate.format('YYYYMMDD')}&base_time=${base_time}&nx=${nx}&ny=${ny}`;
    
    const req = await axios.get(reqUrl);

    // Api Body 저장
    let body: any = req.data;
    // 날씨 정보들 다 가져옴
    let items: itemJsonType[] = body.response.body.items.item;

    if(now.getHours() > 7) targetDate = dayjs().tz().add(1, 'd');
    else targetDate = dayjs().tz().add(2, 'd');
    
    let date = targetDate.get("date");
    let month = targetDate.get("month"); + 1;
    
    // 해당 날짜 날씨만 잡음
    let data = items
        .filter(x => x.category == category)
        .filter(x => x.fcstTime == fcstTime)
        .filter(x => x.fcstDate == targetDate.format("YYYYMMDD"));

    // 강수량 (number)
    let precipitation: number = parseInt(data[0].fcstValue);

    return {
        precipitation: precipitation,
        state: precipitation > 70 ? "높음" : precipitation > 40 ? "있음" : "없음"
    }
}

export {getRainState};