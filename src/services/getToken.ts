import jsonToken from '../token.json';
export const DISCORD_TOKEN=  process.env["DISCORD_TOKEN"] ?? jsonToken["DISCORD_TOKEN"] ?? "";
export const WEATHER_API_KEY =  process.env["WEATHER_API_KEY"] ?? jsonToken["WEATHER_API_KEY"] ?? "";