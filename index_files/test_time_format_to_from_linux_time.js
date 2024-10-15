function padWithZeros(str, length) {
    if (typeof str !== 'string') {
        str = String(str); // Convert to string if not already
    }
    while (str.length < length) {
        str = '0' + str; // Pad with zeros
    }
    return str;
}

function convertToLinuxTimeFormat(dateTimeString) {
    const [year, month, part_later] = dateTimeString.split('-');
    const [day, time, second] = part_later.split('_');
    console.log("time: ", time);
    const hour = time.substring(0, 2);
    const minute = time.substring(2, 4);

    // Check if both parts are defined
    //if (!datePart || !timePart) {
    //    throw new Error('Invalid dateTimeString format. Expected format: YYYY-MM-DD_HHmm-ss');
    //}

    // Log the components for debugging
    console.log("Parsed components:");
    console.log("Year:", year, "Month:", month, "Day:", day);
    console.log("Hour:", hour, "Minute:", minute);

    // Ensure all components are defined
    if (!year || !month || !day || !hour || !minute) {
        throw new Error('Invalid date or time components. Please check the input.');
    }

    const yy = year.slice(-2); // Last two digits of the year
    const mm = padWithZeros(month, 2);
    const dd = padWithZeros(day, 2);
    const hh = padWithZeros(hour, 2);
    const mi = padWithZeros(minute, 2);
    const ss = padWithZeros(second, 2); // "00"; // Set second to "00" or remove if you want seconds optional

    return `${yy}${mm}${dd}${hh}${mi}${ss}Z`;
}


function convertFromLinuxTimeFormat(linuxTimeString) {
    // Ensure the input string has the correct length and format
    const trimmedString = linuxTimeString.slice(0, 12) + 'Z';
    
    // Ensure the input string is in the correct format
    const match = /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/.exec(trimmedString);
    if (!match) {
        throw new Error('Invalid Linux time format. Expected format: YYMMDDHHMMSSZ');
    }

    // Extract components
    const [yy, mm, dd, hh, mi, ss] = match.slice(1);

    // Convert year to four digits
    const currentYear = new Date().getFullYear();
    const century = Math.floor(currentYear / 100) * 100;
    const yyyy = century + parseInt(yy);

    // Format to YYYY-MM-DD_HHmm_ss
    return `${yyyy}-${mm}-${dd}_${hh}${mi}_${ss}`;
}

function extractDateTime(dateTimeString) {
    // Split the string by underscores
    const [year, month, part_later] = dateTimeString.split('-');
    const [day, time, second] = part_later.split('_');
    console.log("time: ", time);
    const hour = time.substring(0, 2);
    const minute = time.substring(2, 4);

    return {
        year,
        month,
        day,
        hour,
        minute,
        second
    };
}

function getCurrentTimeFormats() {
    const now = new Date();

    // Format for YYYY-MM-DD_HHmm_ss
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    const formatted1 = `${yyyy}-${mm}-${dd}_${hh}${min}_${ss}`;

    // Format for YYMMDDHHmmssZ
    const yy = String(yyyy).slice(-2); // Last two digits of the year
    const formatted2 = `${yy}${mm}${dd}${hh}${min}${ss}Z`;

    return {
        formatted1,
        formatted2
    };
}

function getCurrentUnixTime() {
    return Math.floor(Date.now() / 1000); // Returns Unix time in seconds
}

function convertUnixToFormattedDate(unixTime) {
    const date = new Date(unixTime * 1000); // Convert seconds to milliseconds

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}_${hh}${min}_${ss}`;
}

function convertFormattedDateToUnix(dateString) {
    // Split the string to extract components
    // Split the string by underscores
    const [yyyy, mm, part_later] = dateString.split('-');
    const [dd, time, ss] = part_later.split('_');
    console.log("time: ", time);
    const hh = time.substring(0, 2);
    const min = time.substring(2, 4);

    console.log("Extracted Time parts:", hh, min, ss);
    // Create a new Date object
    const date = new Date(Date.UTC(yyyy, mm - 1, dd, hh, min, ss));

    // Return the Unix time in seconds
    return Math.floor(date.getTime() / 1000);
}

// Example usage
var formattedDate = '2024-10-14_1500_30';
const unixTime = convertFormattedDateToUnix(formattedDate);
console.log("Unix Time:", unixTime);

const currentUnixTime = getCurrentUnixTime();
console.log("Current Unix Time:", currentUnixTime);

formattedDate = convertUnixToFormattedDate(currentUnixTime);
console.log("Formatted Date:", formattedDate);


// Example usage
const currentTime = getCurrentTimeFormats();
console.log("currentTime: ", currentTime);
console.log("currentTime in format YYYY-MM-DD_HHmm_ss: ", currentTime.formatted1);
console.log("currentTime in format YYMMDDHHmmssZ: ", currentTime.formatted2);

// Example usage
const dateTime = '2023-10-14_1215_30';
const extracted = extractDateTime(dateTime);
console.log(extracted);


// Test the function with corrected input
console.log(convertToLinuxTimeFormat('2023-10-14_1215_30')); // Expected output: "231014121530Z"

const linuxTime = convertToLinuxTimeFormat('2023-10-14_1215_30');
console.log(linuxTime); // Expected output: "231014121530Z"

const originalTime = convertFromLinuxTimeFormat(linuxTime);
console.log(originalTime); // Expected output: "2023-10-14_1215_30"

// Test the function
try {
    const originalTime = convertFromLinuxTimeFormat('23101412153000Z');
    console.log("Converted Back to Original Format:", originalTime); // Expected output: "2023-10-14_12-15-30"
} catch (error) {
    console.error(error.message);
}


// % node test_time_format_to_from_linux_time.js