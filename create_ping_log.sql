CREATE DATABASE pingtest;
use pingtest;
CREATE TABLE IF NOT EXISTS ping_log(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `s_ip` varchar(20) NOT NULL,
    `place` varchar(20) NOT NULL,
    `d_ip` varchar(20) NOT NULL,
    `loss` varchar(10) NOT NULL,
    `result` int(10) NOT NULL,
    `min` double NOT NULL,
    `avg` double NOT NULL,
    `max` double NOT NULL,
    `mdev` double NOT NULL,
    `logtime` datetime NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_logtime` (`logtime`),
    KEY `idx_dip` (`d_ip`)
);