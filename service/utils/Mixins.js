import moment from 'moment';

export default class Mixins { 
    static myGlobalMethod() { 
        console.log('this is a global method');
    }
    static readDuration(duration)  { 
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (match) {
           const hours = match[1] !== undefined ? Mixins.addLeadingZeros(match[1].slice(0, -1), 2) : "00";
           const minutes = match[2] !== undefined ? Mixins.addLeadingZeros(match[2].slice(0, -1), 2) : "00";
           const seconds = match[3] !== undefined ? Mixins.addLeadingZeros(match[3].slice(0, -1), 2) : "00";
           const duration = `${hours}:${minutes}:${seconds}`;
           return duration;
        }
        return "Invalid duration";
    }
    
    static secondsToHMS(seconds) { 
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60)
        const remainingSeconds = seconds % 60;

        const formattedHours = String(hours).padStart(2, "0");
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(remainingSeconds).padStart(2, "0");

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
    
    static addLeadingZeros(number, length) {
        const numStr = String(number);
        const zerosToAdd = Math.max(length - numStr.length, 0);

        return "0".repeat(zerosToAdd) + numStr;
    }

    static getWeekDayIndex(d) {
        return moment(d).weekday();
    }

    static getWeekDay(d, days) {
        return days[Mixins.getWeekDayIndex(d) - 1]
    }

    static dateFormat(d) {
        return moment(d).format("L");
    }

    static timeFormat(d) {
        // console.log('timeFormat :>> ', moment(d).format("LTS").padStart(11, "0"));
        return moment(d).format("LTS").padStart(11, "0");
    }

    static timeToSeconds(time) {
        return time.split(":").reduce((acc, time) => (60 * acc) + +time);
    }
        
}