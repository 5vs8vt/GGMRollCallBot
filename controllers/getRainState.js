// 비

const axios = require("axios");
const moment = require("moment");
const rainUrl = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';

const {key} = require('../token.json');
const request = require("request");

const num_of_rows = 500;
const base_time = 2359; //전날 00시부터 가져와
const dataType = 'JSON';
const nx = 59;
const ny = 123;

const informCode = 'PM10'; //미세먼지임

const category = 'POP'; //강수확률 태그
const fcstTime = '0700'; //오전 6시

const getRainState = async () => {
    
    const now = new Date();
    let targetDate = moment().subtract(1, 'd'); //전날꺼부터 가져와

    const req_rainUrl = `${rainUrl}?serviceKey=${key}&numOfRows=${num_of_rows}&dataType=${dataType}&base_date=${targetDate.format('YYYYMMDD')}&base_time=${base_time}&nx=${nx}&ny=${ny}`;
    const req = await axios.get(req_rainUrl);
    const body = req.data;
    console.log(body);

    let result = req.data;   
    console.log(result)
    let items = result.response.body.items.item;

    if(now.getHours() > 7) targetDate = moment().add(1, 'd');
    else targetDate = moment().add(2, 'd');
    
    let date = targetDate.date();
    let month = targetDate.month() + 1;
            
    let data = items.filter(x => x.category == category).filter(x => x.fcstTime == fcstTime).filter(x => x.fcstDate == targetDate.format("YYYYMMDD"));
    let pop = data[0].fcstValue;
    console.log({
        date: {
            date: date,
            month: month
        },
        data: {
            pop: pop,
            popStr: pop >= 70 ? "높음" : pop >= 30 ? "있음" : "낮음"
        }
    });
    return {
        date: {
            date: date,
            month: month
        },
        data: {
            pop: pop,
            popStr: pop >= 70 ? "높음" : pop >= 30 ? "있음" : "낮음"
        }
    }
}

exports.getRainState = getRainState;