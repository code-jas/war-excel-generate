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
            console.log('startDate :>> ', startDate);
            console.log('endDate :>> ', endDate);

            
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
                        status: 'entry'
                    };
                    // console.log('\x1b[31m errrorr', moment(entry.date));
                    if (!moment(item.timeInterval.start).isSame(currentDay, 'day')) {   
                        if (currentDay !== null) {
                            processedEntries.push({
                                date: Mixins.dateFormat(currentDay),
                                description: '',
                                startTime: '',
                                endTime: '',
                                formattedDuration: Mixins.secondsToHMS(totalDurationPerDay),
                                formattedTotalDurationPerDay: Mixins.secondsToHMS(totalDurationPerDay),
                                totalDurationPerDay,
                                status: 'day'
                            });
                        }
                        currentDay = item.timeInterval.start;
                        totalDurationPerDay = 0;
                    }
            
                    processedEntries.push(entry);
            
                    totalDurationPerDay += entry.duration;
                    totalDuration += entry.duration;
                }
            }
            
            processedEntries.push({
                date: Mixins.dateFormat(currentDay),
                description: '',
                startTime: '',
                endTime: '',
                formattedDuration: Mixins.secondsToHMS(totalDurationPerDay),
                formattedTotalDurationPerDay: Mixins.secondsToHMS(totalDurationPerDay),
                totalDurationPerDay: totalDurationPerDay,
                status: 'day'
            });

            const totalWeekDuration = processedEntries.reduce((acc, curr) => acc + (curr.totalDurationPerDay || 0), 0);
            
            processedEntries.push({
                date: '',
                description: '',
                startTime: '',
                endTime: 'Total:',
                formattedTotalDurationPerDay: Mixins.secondsToHMS(totalWeekDuration),
            })
            
            
            accomplishmentReports = processedEntries;
            // console.log("accomplishmentReports :>> ", JSON.stringify(accomplishmentReports, null, 3));
            return accomplishmentReports;
            
        } catch (error) {
            console.log('getWeeklyReport Error :>> ', error);
            
        }
    }
}