const moment = require('moment');
// console.log(setDate())
// function setDate() {
//     var d = new Date();
//     var month = ((d.getMonth()+1) < 10) ? '0'+(d.getMonth()+1).toString() : (d.getMonth()+1).toString();
//     var day = ((d.getDate()) < 10) ? '0'+(d.getDate()).toString() : (d.getDate()).toString();
//     var dstr = d.getFullYear()+'-'+month+'-'+day
//     var date = new Date(dstr)
//     console.log(date)
//     date.setHours(0);
//     date.setMinutes(0);
//     date.setSeconds(0);
//     date.setMilliseconds(0);
//     return date;
// }

const getlocalDate = () => {
    const d = new Date()
    const date = d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()
    return date
}
const getlocalTime = () => {
    const d = new Date()
    const time = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
    return time
}
const tojustDate = (string1) => {
    let index = string1.search("-");
    var date = string1.slice(0,index);
    if(parseInt(date)< 10){
        date = '0'+date;
    }
    const year = string1.slice(-4)
    const month = string1.slice(index+1,index+2)
    
    let dte = year+"-0"+month+"-"+date
    let d = new Date(dte)
    return(d)
}
const toexactDateTime = (string1, time) => {
    let index = string1.search("-");
    var date = string1.slice(0,index);
    if(parseInt(date)< 10){
        date = '0'+date;
    }
    const year = string1.slice(-4)
    const month = string1.slice(index+1,index+2)
    
    let dte = year+"-0"+month+"-"+date
    let timestring = time.toString();
    let timeArr = timestring.split(":");
    var hour = (parseInt(timeArr[0]) < 10) ? '0'+timeArr[0] : timeArr[0];
    var minute = (parseInt(timeArr[1]) < 10) ? '0'+timeArr[1] : timeArr[1];
    var sec = (parseInt(timeArr[2]) < 10) ? '0'+timeArr[2] : timeArr[2]

    const timestamp = dte+'T'+hour+':'+minute+':'+sec+'.000'+'+05:30';
    const t = new Date(timestamp)
    
    return(t)
}
const getJustDate = () => {
    let d = new Date();
    var month = ((d.getMonth()+1) < 10) ? '0'+(d.getMonth()+1).toString() : (d.getMonth()+1).toString();
    var day = ((d.getDate()) < 10) ? '0'+(d.getDate()).toString() : (d.getDate()).toString();
    var dstr = d.getFullYear()+'-'+month+'-'+day
    var date = new Date(dstr)
    return(date)
}
const getTomorrowDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    var month = ((d.getMonth()+1) < 10) ? '0'+(d.getMonth()+1).toString() : (d.getMonth()+1).toString();
    var day = ((d.getDate()) < 10) ? '0'+(d.getDate()).toString() : (d.getDate()).toString();
    var dstr = d.getFullYear()+'-'+month+'-'+day
    var date = new Date(dstr)
    return(date)
}
const getInfiniteDate = () => {
    const d = new Date()
    d.setDate(31)
    d.setMonth(11);
    d.setFullYear(9999)
    d.setHours(0)
    d.setMinutes(0)
    d.setSeconds(0)
    d.setMilliseconds(0)
    d.setDate(d.getDate() + 1)
    return(d)
}
const getLastDate = () => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    const date = d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()
    return date
}
const prevDate = async (dte) => {
    var dateMomentObj = moment(dte, 'DD-MM-YYYY');
    var d = dateMomentObj.toDate();
    d.setDate(d.getDate() - 1)
    const date = d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()
    return date
    
}

const onlyDate = () => {
    const d = new Date();
    d.setHours(5)
    d.setMinutes(30)
    d.setSeconds(0)
    d.setMilliseconds(0)
    return d
}
const getDate = async(dte) => {
    const d = new Date(dte);
    d.setHours(5)
    d.setMinutes(30)
    d.setSeconds(0)
    d.setMilliseconds(0)
    return d
}
const nextDate = (dte) => {
    const d = new Date(dte)
    if(d.getDay() == 0) {
        d.setDate(d.getDate() + 1) // if sunday then get monday
    }
    if(d.getDay() == 6){
        d.setDate(d.getDate() + 2) // if saturday then get monday
    }
    if(d.getDay() == 5){
        d.setDate(d.getDate() + 3) //if friday then get monday
    }
    else{
        d.setDate(d.getDate() + 1); // get next day date
    }
    
    d.setHours(5)
    d.setMinutes(30)
    d.setSeconds(0)
    d.setMilliseconds(0)
    return d
}
// const prev = async () => {
//     var d = new Date()
//     d.setDate(d.getDate()+3);
//     d.setHours(0);
//     d.setMinutes(0);
//     d.setSeconds(0);
//     d.setMilliseconds(0);
//     console.log(d)
// }
// prev();
const getexpirationTime = (ms) => {
    const d = new Date()
    const millis = d.getTime() + ms;
    const date = new Date(millis)
    return date;
}
function getSessiontime(login, logout) {
    if(logout === null){
        return ('Not logged out')
    }
    const diff = logout-login
    const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN
    const humanDiff = `${Math.floor(diff/HRS)}:${Math.floor((diff%HRS)/MIN).toLocaleString('en-US', {minimumIntegerDigits: 2})}:${Math.floor((diff%MIN)/SEC).toLocaleString('en-US', {minimumIntegerDigits: 2})}.${Math.floor(diff % SEC).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping: false})}`

    console.log("humanDiff:", humanDiff)
    return (humanDiff)
}
 
module.exports = {
    getlocalDate,
    getlocalTime,
    getTomorrowDate,
    getLastDate,
    prevDate,
    getexpirationTime,
    toexactDateTime,
    tojustDate,
    getJustDate,
    getSessiontime,
    getInfiniteDate, nextDate,
    onlyDate, getDate
};