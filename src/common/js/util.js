var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';
var url = '';

import { CONTENT_TYPE, SCORE_MNGTYPE, SCORE_TYPE } from './const.js'
import { downloadResource, getThumbnail, setGoodThumbnail } from '../../api/api';

function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
};

export default {
    getQueryStringByName: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    },
    getParamWithToken: function(params) {
        if (params == null) {
            params = {};
        }
        var user = JSON.parse(localStorage.getItem('backend-user'));
        params.token = user.token;
        return params;
    },
    formatDate: {
        format: function (date, pattern) {
            if (date == undefined) return '';
            if (date == '') return '';  
            pattern = pattern || DEFAULT_PATTERN;
            return pattern.replace(SIGN_REGEXP, function ($0) {
                switch ($0.charAt(0)) {
                    case 'y': return padding(date.getFullYear(), $0.length);
                    case 'M': return padding(date.getMonth() + 1, $0.length);
                    case 'd': return padding(date.getDate(), $0.length);
                    case 'w': return date.getDay() + 1;
                    case 'h': return padding(date.getHours(), $0.length);
                    case 'm': return padding(date.getMinutes(), $0.length);
                    case 's': return padding(date.getSeconds(), $0.length);
                }
            });
        },
        parse: function (dateString, pattern) {
            var matchs1 = pattern.match(SIGN_REGEXP);
            var matchs2 = dateString.match(/(\d)+/g);
            if (matchs1.length == matchs2.length) {
                var _date = new Date(1970, 0, 1);
                for (var i = 0; i < matchs1.length; i++) {
                    var _int = parseInt(matchs2[i]);
                    var sign = matchs1[i];
                    switch (sign.charAt(0)) {
                        case 'y': _date.setFullYear(_int); break;
                        case 'M': _date.setMonth(_int - 1); break;
                        case 'd': _date.setDate(_int); break;
                        case 'h': _date.setHours(_int); break;
                        case 'm': _date.setMinutes(_int); break;
                        case 's': _date.setSeconds(_int); break;
                    }
                }
                return _date;
            }
            return null;
        }
    },
    formatNumber: function(val, precision) {
        return Math.floor(val * Math.pow(10, precision)) / Math.pow(10, precision);
    },
    pickFileNameOnly: function(fileName) {
        return fileName.substring(0, fileName.lastIndexOf("."));
    },
    pickFileFormatOnly: function(fileName) {
        return fileName.substring(fileName.lastIndexOf('.')+1 , fileName.lastIndexOf('')).toLowerCase();
    },
    checkToken: function(promise) {
        promise.then((res) => {
            if (res.data.serverResult.resultCode == "-108") { // expired
                window.EventHub.$emit('token-is-expired');
            } else if (res.data.serverResult.resultCode == "-107") { // logged in on other machine
                window.EventHub.$emit('token-has-caught');
            } else if (res.data.serverResult.resultCode == "-100") { // not correct
                window.EventHub.$emit('token-is-invalid');
            }
        });

        return promise;
    },
    checkECOToken: function(promise, message) {
        promise.then((res) => {
        }).catch(() => {
            message({
                message: '您的会话超时，请重新登录！',
                type: 'error'
            });
            window.EventHub.$emit('token-is-expired');
        });
        return promise;
    },
    download: function(url) {
        var link = $('#download_iframe');
        link.attr('src', url);
    },
    downloadResource: function(resource, message) {
        if (resource.fileInfo == null) {
            return false;
        }

        downloadResource(resource.contentid).then((res) => {
            if (res.data.serverResult.resultCode == "200") {
                this.download(res.data.responseEntity);
            } else {
                message({
                    message: res.data.serverResult.resultMessage,
                    type: 'error'
                });
            }
        });

        return true;
    },
    getFileSize: function(sizeInByte, precision) {
        if (sizeInByte == null || isNaN(sizeInByte)) return '0Byte';

        if (sizeInByte < 1024) {
            return sizeInByte + 'B';
        } else if (sizeInByte < 1024 * 1024) {
            return Math.floor((sizeInByte / 1024) * Math.pow(10, precision)) / Math.pow(10, precision) + 'KB';
        } else if (sizeInByte < 1024 * 1024 * 1024) {
            return Math.floor((sizeInByte / 1024 / 1024) * Math.pow(10, precision)) / Math.pow(10, precision) + 'MB';
        } else {
            return Math.floor((sizeInByte / 1024 / 1024 / 1024) * Math.pow(10, precision)) / Math.pow(10, precision) + 'GB';
        }
    },
    formatDuration(seconds) {
        var hour = Math.floor(seconds / 3600);
        var min = Math.floor((seconds - 3600 * hour) / 60);
        var sec = seconds % 60;
        var result = '';
        if (hour == 0) {
            hour = '';
        } else {
            hour = hour + '时';
        }
        if (min == 0) {
            min = '';
        } else {
            min = min + '分';
        }
        if ((hour!=0 || min!=0) && sec == 0) {
            sec = '';
        } else {
            sec = sec + '秒';
        }
        result = hour + min + sec;

        return result + '中';
    },
    hasExtensionOfContentType(contentType, extension) {
        return contentType.extensions.indexOf(extension.toLowerCase()) != -1;
    },
    getContentTypesOfExt(ext) {
        let contentTypes = [];
        for (var i=0; i<CONTENT_TYPE.length; i++) {
            if (this.hasExtensionOfContentType(CONTENT_TYPE[i], ext)) {
                contentTypes.push(CONTENT_TYPE[i]);
            }
        }
        return contentTypes;
    },
    getDefaultThumb: function(resource, thumbpath) {
        if (resource.thumbnailpath != null ) {
            thumbpath.localpath = resource.thumbnailpath;
        } else {
            if (resource.fileInfo != null && 
                (resource.fileInfo.format.toLowerCase() == 'jpg' 
                    || resource.fileInfo.format.toLowerCase() == 'png' 
                    || resource.fileInfo.format.toLowerCase() == 'gif')) {
                this.getFileThumbnail(resource, '1', thumbpath);
                return 'ecrw-exam-bk-pic';
            } else if (resource.fileInfo != null && 
                (resource.fileInfo.format.toLowerCase() == 'ppt' 
                    || resource.fileInfo.format.toLowerCase() == 'pptx') ) {
                this.getFileThumbnail(resource, '2', thumbpath);
                return 'ecrw-exam-bk-word';
            } else if (resource.fileInfo != null && 
                ( resource.fileInfo.format.toLowerCase() == 'mp4' 
                    || resource.fileInfo.format.toLowerCase() == 'flv' 
                    || resource.fileInfo.format.toLowerCase() == 'wmv' 
                    || resource.fileInfo.format.toLowerCase() == 'avi' 
                    || resource.fileInfo.format.toLowerCase() == 'mpg') ) {
                this.getFileThumbnail(resource, '3', thumbpath);
                return 'ecrw-exam-bk-video';
            } else {
                thumbpath.localpath = "";
                var type = resource.contenttype;
                if (type == '1') {
                    return 'ecrw-exam-bk-word';
                } else if (type == '2') {
                    return 'ecrw-exam-bk-teach';
                } else if (type == '3') {
                    return 'ecrw-exam-bk-ext';
                } else if (type == '4') {
                    return 'ecrw-exam-bk-test';
                } else if (type == '5') {
                    return 'ecrw-exam-bk-pic';
                } else if (type == '6') {
                    return 'ecrw-exam-bk-video';
                } else if (type == '7') {
                    return 'ecrw-exam-bk-audio';
                } else if (type == '8') {
                    return 'ecrw-exam-bk-swf';
                } else if (type == '9') {
                    return 'ecrw-exam-bk-h5';
                } else if (type == '10') {
                    return 'ecrw-exam-bk-epub';
                } else if (type == '11') {
                    return 'ecrw-exam-bk-zip';
                } else if (type == '12') {
                    return 'ecrw-exam-bk-other';
                } else if (type == '21') {
                    return 'ecrw-exam-bk-shiti';
                } else if (type == '22') {
                    return 'ecrw-exam-bk-shiti';
                } else if (type == '31') {
                    return 'ecrw-exam-bk-jiaocai';
                }
            };
        }
        
        
    },
    getFileThumbnail(resource, filetype, thumbpath) {
        var aryFiles = new Array();
        aryFiles[0] = ECO_MEDIA_PATH + resource.fileInfo.localpath;
        var params = {"filesPath": aryFiles, "fileType": filetype };
        params = JSON.stringify(params);       
        getThumbnail(params).then((res) => {
            if (res.data.serverResult.resultCode == "200") {
                thumbpath.localpath = res.data.pageInfo.list[0].targetImagePath;
                let param = {
                    contentid: resource.contentid,
                    thumbnailpath: res.data.pageInfo.list[0].targetImagePath
                };

                setGoodThumbnail(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                    } else {
                        // message({
                        //     message: res.data.serverResult.resultMessage,
                        //     type: 'error'
                        // });
                    }
                }).catch(() => {

                });
            } else {
                // message({
                //     message: res.data.serverResult.resultMessage,
                //     type: 'error'
                // });
            }
        }).catch(() => {
        });
    },
    getScoreMNGType: function(scoretype) {
        for (var i=0; i< SCORE_MNGTYPE.length; i++) {
            if (SCORE_MNGTYPE[i].value == scoretype) {
                return SCORE_MNGTYPE[i].label;
            }
        }
        return '';
    },
    getScoreType: function(scoretype) {
        for (var i=0; i< SCORE_TYPE.length; i++) {
            if (SCORE_TYPE[i].value == scoretype) {
                return SCORE_TYPE[i].label;
            }
        }
        return '';
    },
    resourceLabel: function(type) {
        for (var i=0; i<CONTENT_TYPE.length; i++) {
            if (CONTENT_TYPE[i].contenttype == type)
                return CONTENT_TYPE[i].contentname;
        }
        return '';
    },
    convertAreaName: function(from) {
        var nameMapper = [
            { from:'北京市', to:'北京' },
            { from:'天津市', to:'天津' },
            { from:'上海市', to:'上海' },
            { from:'重庆市', to:'重庆' },
            { from:'河北省', to:'河北' },
            { from:'河南省', to:'河南' },
            { from:'云南省', to:'云南' },
            { from:'辽宁省', to:'辽宁' },
            { from:'黑龙江省', to:'黑龙江' },
            { from:'湖南省', to:'湖南' },
            { from:'安徽省', to:'安徽' },
            { from:'山东省', to:'山东' },
            { from:'新疆维吾尔自治区', to:'新疆' },
            { from:'江苏省', to:'江苏' },
            { from:'浙江省', to:'浙江' },
            { from:'江西省', to:'江西' },
            { from:'湖北省', to:'湖北' },
            { from:'广西壮族自治区', to:'广西' },
            { from:'甘肃省', to:'甘肃' },
            { from:'山西省', to:'山西' },
            { from:'内蒙古自治区', to:'内蒙古' },
            { from:'陕西省', to:'陕西' },
            { from:'吉林省', to:'吉林' },
            { from:'福建省', to:'福建' },
            { from:'贵州省', to:'贵州' },
            { from:'广东省', to:'广东' },
            { from:'青海省', to:'青海' },
            { from:'西藏自治区', to:'西藏' },
            { from:'四川省', to:'四川' },
            { from:'宁夏回族自治区', to:'宁夏' },
            { from:'海南省', to:'海南' },
            { from:'台湾省', to:'台湾' },
            { from:'香港特别行政区', to:'香港' },
            { from:'', to:'南海诸岛' },
            { from:'澳门特别行政区', to:'澳门' }
        ];
        for (var i=0; i<nameMapper.length; i++) {
            if (nameMapper[i].from == from) {
                return nameMapper[i].to;
            }
        }
        return from;
    },
    getHtmlCode: function(str) {
        return decodeURI(str);
    },
    pushToSysdict(sysdictList, sysdictItem) {
        for (var i=0; i<sysdictList.length; i++) {
            if (sysdictList[i].dictname == sysdictItem.dictname) {
                sysdictList[i].dictvalue += ("," + sysdictItem.dictvalue);
                return sysdictList;
            }
        }
        sysdictList.push({ dictvalue:sysdictItem.dictvalue, dictname:sysdictItem.dictname });

        return sysdictList;
    },
    composeSysDict(sysdictList) {
        let sysdictResult = [];
        for (var i=0; i<sysdictList.length; i++) {
            if (i == 0) {
                sysdictResult.push({ dictvalue:sysdictList[i].dictvalue, dictname:sysdictList[i].dictname });
                continue;
            }
            sysdictResult = this.pushToSysdict(sysdictResult, sysdictList[i]);
        }
        return sysdictResult;
    },
    concat(source, items) {
        for (var i=0; i<items.length; i++) {
            source.push(items[i]);
        }
        return source;
    },
    alphanumeric(str) {
        let newstr = str.replace(/\s/i, '');
        do {
            str = newstr;
            newstr = str.replace(/[^\da-zA-Z]/i, '');
        } while (newstr != str);
        return newstr;
    },
    removespace(str) {
        let newstr = str.trim();
        return newstr;
    },
    //author:han
    isBadWords(str){
        var wordsList = localStorage.getItem("badwords").split(",");
        var filterdStr = str;
        var sensitiveWordList = [];
        var buffer = filterdStr;
        var hash = {};
        for (var i = 0; i < wordsList.length; i++) {
            var temp = wordsList[i].trim();
            if (temp == "") continue;
            var findIndexSize = 0;
            for (var start = -1; (start = buffer.indexOf(temp, findIndexSize)) > -1; start++) {
                findIndexSize = start + temp.length;
                var mapStart = hash[start];
                if (mapStart == undefined || (mapStart != undefined && findIndexSize > mapStart)) {
                    hash[start] = findIndexSize;
                }
            }
        }
        var values = Object.keys(hash);
        values.forEach(function(startIndex){
            var endIndex = hash[startIndex];
            var sensitive = buffer.substring(startIndex, endIndex);
            if (!sensitive.includes("*")) {
                sensitiveWordList.push(sensitive);
            }
            for (var i = startIndex; i < endIndex; i ++) {
                buffer.replace(i, i + 1, "*");
            }
        })
        return sensitiveWordList[0]
    }
    //end han
};
