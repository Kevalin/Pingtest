# Pingtest
This tool is used for checking the status of network by linux Ping command.

- config.js
```js
// 参数配置文件
exports.options = {
    place      : "lugu",
    count      : 10,
    interval   : 1,
    packetsize : 64,
    timeout    : 2000,
    threshold  : 30,
    s_ip       : "8.8.8.8",
    ip : [
        "223.5.5.5",
        "223.6.6.6",
    ]
}
```
- running result
```sh
$sudo node app.js
Test result : 0%        正常    223.5.5.5
Test result : 0%        正常    223.6.6.6
```
- tmp.cache
```text
// 输出结果到文件tmp.cache
2015-01-19 17:25:19 223.5.5.5 0% packet loss 正常
2015-01-19 17:25:19 223.6.6.6 0% packet loss 正常
```
