
//formatting to 12 hour time format for display
export function formatTo12Hour(time: string) { 
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${period}`;
}

export function formatSelectedTime(h: string, m: string, p: 'AM' | 'PM') {
    let hourNum = parseInt(h, 10); 
    if (p === 'PM' && hourNum < 12) hourNum += 12; 
    if (p === 'AM' && hourNum === 12) hourNum = 0;
    const hour = hourNum.toString().padStart(2, '0');
    const minute = m.padStart(2, '0');
    return `${hour}:${minute}`;
}

//get local date
export const getLocalDateString = (): string => { 
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}