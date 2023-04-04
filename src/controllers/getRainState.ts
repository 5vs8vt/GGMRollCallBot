import axios from "axios"
import moment, { Moment } from "moment"
const rainUrl = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';

const { DISCORD_TOKEN, WEATHER_API_KEY, DUST_API_KEY} = process.env;

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

const getRainState = async () => {
    const now: Date = new Date();
    let targetDate: Moment = moment().subtract(1, 'd'); //전날꺼부터 가져와

    const reqUrl: string = `${rainUrl}?serviceKey=${WEATHER_API_KEY}&numOfRows=${num_of_rows}&dataType=${dataType}&base_date=${targetDate.format('YYYYMMDD')}&base_time=${base_time}&nx=${nx}&ny=${ny}`;
    
    const req = await axios.get(reqUrl);

    // Api Body 저장
    let body: any = req.data;
    // 날씨 정보들 다 가져옴
    let items: itemJsonType[] = body.response.body.items.item;

    if(now.getHours() > 7) targetDate = moment().add(1, 'd');
    else targetDate = moment().add(2, 'd');
    
    let date = targetDate.date();
    let month = targetDate.month() + 1;
    
    // 해당 날짜 날씨만 잡음
    let data = items
        .filter(x => x.category == category)
        .filter(x => x.fcstTime == fcstTime)
        .filter(x => x.fcstDate == targetDate.format("YYYYMMDD"));

    // 강수량 (number)
    let precipitation: number = parseInt(data[0].fcstValue);

    return {
        date: {
            date: date,
            month: month
        },
        data: {
            pop: precipitation,
            popStr: precipitation >= 70 ? "높음" : precipitation >= 30 ? "있음" : "낮음"
        }
    }
}

export {getRainState};