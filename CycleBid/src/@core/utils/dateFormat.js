import { differenceInCalendarYears, differenceInCalendarMonths, differenceInCalendarDays } from 'date-fns'

export const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
};

export const getFormattedDateRange = (endDateRange,startDateRange) => {
    const years = differenceInCalendarYears(endDateRange, startDateRange)
    const months = differenceInCalendarMonths(endDateRange, startDateRange) % 12
    const days = differenceInCalendarDays(endDateRange, startDateRange) % 30

    const dateGap = `${years > 0 ? `${years} year${years > 1 ? 's' : ''}` : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''
        } ${days > 0 ? `${days} day${days > 1 ? 's' : ''}` : ''}`.trim()
    return dateGap
}