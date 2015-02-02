var conf = require("./conf.js")
var child = require("child_process")
var fs = require("fs")
var mysql = require('mysql')

var conn = mysql.createConnection({
    host        : 'localhost',
    user        : 'root',
    password    : 'root',
    database    : 'pingtest',
    port        : 3306
})
conn.connect()

var getTime = function(){
    var date = new Date()
    var Year = date.getFullYear()
    var Month = (date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : (dateMonth()+1)
    var Day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    var Hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
    var Minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    var Seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
    return Year + "-" + Month + "-" + Day + " " + Hours + ":" + Minutes + ":" + Seconds
}

var tranResult = function(result){
    if (parseInt(result) >= conf.options.threshold){
        return "异常"
    }
    else {
        return "正常"
    }
}

var t_tranResult = function(result){
    if (parseInt(result) >= conf.options.threshold){
        return 1
    }
    else {
        return 0
    }
}

var t_count = 0
for (var j = 0; j < conf.options.ip.length; j++){
    (function(i){
        var command = "sudo ping -c " + conf.options.count + " -s " + conf.options.packetsize + " -W " + conf.options.timeout + " " + conf.options.ip[i]
        child.exec(command, function(err, stdout, stderr){
            if(err){
                console.log(err)
            }
            else {
                var reg = /[0-9]{1,3}%/g
                var reg1 = /[0-9]{1,}.[0-9]{0,3}\/[0-9]{1,}.[0-9]{0,3}\/[0-9]{1,}.[0-9]{0,3}\/[0-9]{1,}.[0-9]{0,3}/g
                var result = reg.exec(stdout)[0]
                var ms = ((reg1.exec(stdout))[0]).split("/")
                var loss = getTime() + " " + conf.options.ip[i] + " " + result + " packet loss" + " " + tranResult(result) + "\n"
                var insertSQL = "insert into ping_log (s_ip, place, d_ip, loss, result, min, avg, max, mdev, logtime) values ('" + conf.options.s_ip + "', '" + conf.options.place + "', '" + conf.options.ip[i] + "', '" + result + "', '" + t_tranResult(result) + "', '" + ms[0] + "', '" + ms[1] + "', '" + ms[2] + "', '" + ms[3] + "', '" + getTime() + "')"
                conn.query(insertSQL, function(err,res) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        //console.log("INSERT RETURN ==> ")
                        //console.log(res)
                        t_count++
                        if ((conf.options.ip.length) == t_count) {
                            conn.end()
                        }
                    }
                })
                fs.open('tmp.cache', 'a', 0755, function(err, fd){
                    if (err){
                        console.log(err)
                    }
                    else {
                        var buff = new Buffer(loss, 'utf8')
                        fs.write(fd, buff, 0, buff.length, null, function(err){
                            if (err)
                                return err
                            fs.close(fd, function(err){
                                if (err)
                                    console.log(err)
                                else
                                    console.log("Test result : " + result + "   " + tranResult(result) + "    " + conf.options.ip[i])
                            })
                        })
                    }
                })
            }
        })
    })(j)
}
