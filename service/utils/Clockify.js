import moment from 'moment';
import Mixins from './Mixins.js';

export default class Clockify { 
    static async getWeeklyReport(data, start, end) {
        // console.log('data :>> ', data.length)
        try {
            let accomplishmentReports = [];
            const processedEntries = [];
            let totalDuration = 0;
            let totalDurationPerDay = 0;
            
            const currentDate = moment();
            let startDate, endDate;
            // console.log('currentDate :>> ', currentDate);
            
            // Check if start and end parameters are provided, otherwise use the current week
            if (start && end) {
                startDate = moment(start);
                endDate = moment(end);
            } else {
                startDate = moment(currentDate).startOf('isoWeek').isoWeekday(1); 
                endDate = moment(currentDate).endOf('isoWeek').isoWeekday(7);            
            }
            console.log('Start of the week (Monday):', startDate.format('L'));
            console.log('End of the week (Sunday):', endDate.format('L'));
            
            let currentDay = null;
            
            for (const item of data) {
                const entryDate = moment(item.timeInterval.start);
            
                // Check if the entry's date is within the specified range
                if (entryDate.isBetween(startDate, endDate, undefined, '[]')) {
                    const formattedDuration = Mixins.readDuration(item.timeInterval.duration);
            
                    const entry = {
                        date: Mixins.dateFormat(item.timeInterval.start),
                        description: item.description,
                        startTime: Mixins.timeFormat(item.timeInterval.start),
                        endTime: Mixins.timeFormat(item.timeInterval.end),
                        formattedDuration: formattedDuration,
                        duration: Mixins.timeToSeconds(formattedDuration),
                    };
                    // console.log('\x1b[31m errrorr', moment(entry.date));
                    console.log('currentDay :>> ', moment(currentDay).format('L'));
                    if (!moment(item.timeInterval.start).isSame(currentDay, 'day')) {
                        if (currentDay !== null) {
                        processedEntries.push({
                            date: Mixins.dateFormat(currentDay),
                            totalDurationPerDay: totalDurationPerDay,
                            formattedTotalDurationPerDay: Mixins.secondsToHMS(totalDurationPerDay),
                            formattedDuration: Mixins.secondsToHMS(totalDurationPerDay),
                        });
                        }
                        currentDay = item.timeInterval.start;
                        totalDurationPerDay = 0;
                    }
            
                    processedEntries.push(entry);
            
                    totalDuration += entry.duration;
                    totalDurationPerDay += entry.duration;
                }
            }
            
            processedEntries.push({
                date: Mixins.dateFormat(currentDay),
                totalDurationPerDay: totalDurationPerDay,
                formattedTotalDurationPerDay: Mixins.secondsToHMS(totalDurationPerDay),
            });
            
            accomplishmentReports = processedEntries;
            // console.log("accomplishmentReports :>> ", JSON.stringify(accomplishmentReports, null, 3));
            return accomplishmentReports;
            
        } catch (error) {
            console.log('getWeeklyReport Error :>> ', error);
            
        }
    }
}