// GLOBAL VARIABLE
var OFFICE2PDF_URL = 'http://175.6.40.51:8989/office2pdf';
var DOWNLOADURL = 'http://open.teewon.net:9000/';
var ECO_MEDIA_PATH = 'http://open.teewon.net:9000/fs/media';
var CONTEXT_PATH = 'http://{ip:port}/rescloud';
var ENCRYPT_KEY = '8c10cb3089a01210';
var ECOAPI_SERVER =  'http://open.teewon.net:9000/';
var OPENAPI_SERVER = 'http://localhost:8088/ecrapi';
var FRONTEND_CONTEXT = 'http://47.107.48.202:8082/';
var BRANCH_CODE = 'TWSMECR';
var TENANT_ID = "YYDJ001";

$(document).ready(function () {
    window.onunload = function () {
        window.EventHub.$emit('window-unload');
    };
});

$(function(){
	$('section').scroll(function(){
		$('.el-select-dropdown').css('display', 'none');
	});
});
