
// Get date in Year-Month-Day format
var getYMD = function () {
    var date = new Date();
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate() - 1;

    const text = (year, month, day) => year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)

    return {
        year: year,
        minusYear: () => {
            var ydate = new Date()

            ydate.setFullYear(ydate.getUTCFullYear() - 1)

            return {
                year: ydate.getUTCFullYear(),
                month: ydate.getUTCMonth() + 1,
                day: ydate.getUTCDate(),
                text: text(ydate.getUTCFullYear(), ydate.getUTCMonth() + 1, ydate.getUTCDate())
            }
        },
        month: month,
        minusMonth: () => {
            var mdate = new Date()

            mdate.setMonth(mdate.getUTCMonth())

            return {
                year: mdate.getUTCFullYear(),
                month: mdate.getUTCMonth(),
                day: mdate.getUTCDay(),
                text: text(mdate.getUTCFullYear(), mdate.getUTCMonth(), mdate.getUTCDate())
            }
        },
        day: day,
        text: text(year, month, day)
    }
}

// Get date in Month Year format, for example - Янв 18
var getMonthYearFromYMD = function(date){
    var month = {
        1:'Янв',
        2:'Фев',
        3:'Март',
        4:'Апр',
        5:'Май',
        6:'Июнь',
        7:'Июль',
        8:'Авг',
        9:'Сен',
        10:'Окт',
        11:'Ноя',
        12:'Дек',
    }

    return month[parseInt(date.slice(5, 7)).toString()] + ' ' + date.slice(0, 4)
}


/*

Чтобы получить токен нужно перейти по адресу
1. https://oauth.yandex.ru/authorize?response_type=token&client_id=3529087045d74b8bb5ff6a97e6cd72fe
*/

var API = function () {
    this.baseUrl = 'https://api-metrika.yandex.ru/stat/v1/data' // base url
    this.method = 'GET' // base method
    this.app = {
        id: '3529087045d74b8bb5ff6a97e6cd72fe',
        token: 'AQAAAAAjXGO0AAUwjhDkLUTTiEWDsQ5DbABSAjk'// токен выдался приложению на 1 год с 9.09.2018
    }

    this.ids = '20289439'// id счетчиков (можно через запятую)

    var authUrl = 'ids=' + this.ids + '&oauth_token=' + this.app.token

    // Статистика посещаемости по месяцам
    this.getAttendancePerMonth = function (callback) {
        var date = getYMD()

        $.ajax({
            // url: this.baseUrl + '?date1='+ date.minusYear().text +'&date2='+ date.text +'&filters=ym:s:datePeriodMonth!n&attrubution=Last&sort=ym:s:datePeriodmonth&group=month&auto_group_size=1&dimensions=ym:s:datePeriodmonth&metrics=ym:s:visits, ym:s:users, ym:s:pageviews, ym:s:percentNewVisitors, ym:s:bounceRate, ym:s:pageDepth, ym:s:avgVisitDurationSeconds&' + authUrl,
            url: `${this.baseUrl}?attribution=Last&filters=ym:s:datePeriodday!n&sort=ym:s:datePeriodmonth&dimensions=ym:s:datePeriodmonth&metrics=ym:s:users&date1=${date.minusYear().text}&date2=${date.text}&${authUrl}`,
            method: this.method,
            dataType: "jsonp",
        })
        .done(function(data){
            callback({error: false, data: data})
        })
        .fail(function(err){
            callback({error:true, data: false})
        })
    }
    // Статистика посещаемости по дням
    this.getAttendancePerDay = function (callback) {
        var date = getYMD()

        $.ajax({
            // url: this.baseUrl + '?dimensions=ym:s:datePeriodday&metrics=ym:s:visits, ym:s:users, ym:s:pageviews, ym:s:percentNewVisitors, ym:s:bounceRate, ym:s:pageDepth, ym:s:avgVisitDurationSeconds&sort=ym:s:datePeriodday&date1=2018-08-14&date2=2018-09-13&filters=ym:s:datePeriodday!n&attribution=Last&group=day&auto_group_size=1&auto_group_type=day&' + authUrl,
            url: this.baseUrl + '?date1='+ date.minusMonth().text +'&date2='+ date.text +'&dimensions=ym:s:datePeriodday&metrics=ym:s:users&sort=ym:s:datePeriodday&filters=ym:s:datePeriodday!n&attribution=Last&group=day&auto_group_size=1&auto_group_type=day&' + authUrl,
            method: this.method,
            dataType: "jsonp",
        })
        .done(function(data){
            callback({error: false, data: data})
        })
        .fail(function(err){
            callback({error:true, data: false})
        })
    }

    // Статистика по возросту
    this.getAgeOfVisitors = function (callback) {
        $.ajax({
            url: this.baseUrl + '?preset=age&' + authUrl,
            method: this.method,
            dataType: "jsonp",
        })
        .done(function(data){
            callback({error: false, data: data})
        })
        .fail(function(err){
            callback({error:true, data: false})
        })
    }

    // Статистика по полу
    this.getGenderOfVisitors = function (callback) {
        $.ajax({
            url: this.baseUrl + '?preset=gender&' + authUrl,
            method: this.method,
            dataType: "jsonp",
        })
        .done(function(data){
            callback({error: false, data: data})
        })
        .fail(function(err){
            callback({error:true, data: false})
        })
    }

    // Статистика по устройствам
    this.getDeviceOfVisitors = function (callback) {
        $.ajax({
            url: this.baseUrl + '?metrics=ym:s:users&ym:s:visits&dimensions=ym:s:deviceCategory&' + authUrl,
            method: this.method,
            dataType: "jsonp",
        })
        .done(function(data){
            callback({error: false, data: data})
        })
        .fail(function(err){
            callback({error:true, data: false})
        })
    }
}

var metrica = new API()

metrica.getAttendancePerMonth(function(answer){

    var labels = answer.data.data.map(function(obj){
        return getMonthYearFromYMD(obj.dimensions[0].name)
    })

    var values = answer.data.data.map(function(obj){
        return obj.metrics[0]
    })

    new Chart(document.getElementById('attendancePerMonth').getContext('2d'), {
        type: 'bar',
        options:{
            legend: {
                display:false
            }
        },
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor:'#C3B0FA',
                borderWidth: 1
            }]
        }
    })
})

metrica.getAttendancePerDay(function(answer){

    var labels = answer.data.data.map(function(obj){
        return obj.dimensions[0].name
    })

    var values = answer.data.data.map(function(obj){
        return obj.metrics[0]
    })

    new Chart(document.getElementById('attendancePerDay').getContext('2d'), {
        type: 'bar',
        options:{
            legend: {
                display: false
            }
        },
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor:'#C3B0FA',
                borderWidth: 1
            }]
        }
    })
})

metrica.getAgeOfVisitors(function(answer) {

    var labels = answer.data.data.map(function(obj){
        return obj.dimensions[0].name
    })

    var values = answer.data.data.map(function(obj){
        return obj.metrics[0]
    })

    new Chart(document.getElementById('ageOfVisitors').getContext('2d'), {
        type: 'bar',
        options:{
            legend:{
                display: false,
            }
        },
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
    })
})

metrica.getGenderOfVisitors(function(answer) {

    var labels = answer.data.data.map(function(obj){
        return obj.dimensions[0].name
    })

    var values = answer.data.data.map(function(obj){
        return obj.metrics[0]
    })
    new Chart(document.getElementById('sexOfVisitors').getContext('2d'), {
        type: 'doughnut',
        options:{

        },
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }]
        }
    })
})

metrica.getDeviceOfVisitors(function(answer) {

    var labels = answer.data.data.map(function(obj){
        return obj.dimensions[0].name
    })

    var values = answer.data.data.map(function(obj){
        return obj.metrics[0]
    })

    new Chart(document.getElementById('deviceOfVisitors').getContext('2d'), {
        type: 'doughnut',
        options:{

        },
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
    })
})
