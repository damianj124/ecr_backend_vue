import Mock from 'mockjs';

const ChargeStatByArea = [

                {
                    name: '北京',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },

                {
                    name: '天津',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '上海',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '重庆',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '河北',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '河南',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '云南',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '辽宁',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '黑龙江',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '湖南',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '安徽',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '山东',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '新疆',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '江苏',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '浙江',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '江西',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '湖北',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '广西',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '甘肃',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '山西',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '内蒙古',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '陕西',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '吉林',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '福建',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '贵州',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '广东',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '青海',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '西藏',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '四川',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '宁夏',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '海南',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '台湾',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '香港',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '南海诸岛',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                },
                {
                    name: '澳门',
                    today: Math.round(Math.random()*1000),
                    lastweek:Math.round(Math.random()*1000),
                    lastmonth:Math.round(Math.random()*1000),
                    average:Math.round(Math.random()*1000)
                }
            ];

export { ChargeStatByArea };