import ClearDay from '../icons/clear-day.svg';
import ClearNight from '../icons/clear-night.svg';
import PartlyCloudyDay from '../icons/partly-cloudy-day.svg';
import PartlyCloudyNight from '../icons/partly-cloudy-night.svg';
import Cloudy from '../icons/cloudy.svg';
import Overcast from '../icons/overcast.svg';
import Mist from '../icons/mist.svg';
import Drizzle from '../icons/drizzle.svg';
import Snow from '../icons/snow.svg';
import Sleet from '../icons/sleet.svg';
import Thunderstorms from '../icons/thunderstorms.svg';
import ThunderstormsSnow from '../icons/thunderstorms-snow.svg';
import Fog from '../icons/fog.svg';
import FogNight from "../icons/fog-night.svg"
import Rain from '../icons/rain.svg';
import Hail from '../icons/hail.svg';


export default function lookupIcon(code, isDay) {
    switch (code) {
        case 1000: // Sunny / Clear
            if (isDay) {
                return ClearDay;
            }
            return ClearNight;

        case 1003: // Partly cloudy
            if (isDay) {
                return PartlyCloudyDay;
            }
            return PartlyCloudyNight;

        case 1006: // Cloudy
            return Cloudy;

        case 1009: // Overcast
            return Overcast;

        case 1030: // Mist
            return Mist;

        case 1063: // Patchy rain possible
        case 1150: // Patchy light drizzle
        case 1153: // Light drizzle
            return Drizzle;

        case 1066: // Patchy snow possible
        case 1114: // Blowing snow
        case 1210: // Patchy light snow
        case 1213: // Light snow
        case 1216: // Patchy moderate snow
        case 1219: // Moderate snow
        case 1222: // Patchy heavy snow
        case 1225: // Heavy snow
        case 1255: // Light snow showers
        case 1258: // Moderate or heavy snow showers
            return Snow;

        case 1069: // Patchy sleet possible
        case 1072: // Patchy freezing drizzle possible
        case 1168: // Freezing drizzle
        case 1171: // Heavy freezing drizzle
        case 1198: // Light freezing rain
        case 1201: // Moderate or heavy freezing rain
        case 1204: // Light sleet
        case 1207: // Moderate or heavy sleet
        case 1249: // Light sleet showers
        case 1252: // Moderate or heavy sleet showers
            return Sleet;

        case 1087: // Thundery outbreaks possible
        case 1273: // Patchy light rain with thunder
        case 1276: // Moderate or heavy rain with thunder
            return Thunderstorms;

        case 1117: // Blizzard
        case 1279: // Patchy light snow with thunder
        case 1282: // Moderate or heavy snow with thunder
            return ThunderstormsSnow;

        case 1135: // Fog
        case 1147: // Freezing fog
            return isDay ? Fog : FogNight;

        case 1180: // Patchy light rain:
        case 1183: // Light rain
        case 1186: // Moderate rain at times
        case 1189: // Moderate rain
        case 1192: // Heavy rain at times
        case 1195: // Heavy rain
        case 1240: // Light rain shower
        case 1243: // Moderate or heavy rain shower
        case 1246: // Torrential rain shower
            return Rain;

        case 1237: // Ice pellets
        case 1261: // Light showers of ice pellets
        case 1264: // Moderate or heavy showers of ice pellets
            return Hail;

        default:
            return undefined;
    }
}