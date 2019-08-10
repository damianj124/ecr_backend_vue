<template>
    <section>
        <el-col>
            <el-col :span="24" class="ecrm-search-title">
                <a class="selected">充值金额量统计</a>
            </el-col>
        </el-col>
        <el-col align="right" style="margin-top: 30px;">
            <el-button type="primary" @click="exportReport" :loading="exportLoading">导出</el-button>
        </el-col>
        <el-col :span="24">
            <el-col :span="19" class="ecrm-chart-left">
                <el-col class="ecrm-chart-title">充值金额量统计</el-col>
                <el-col id="chart-count" style="width:100%;height:90%;" v-loading="mapLoading"></el-col>            
            </el-col>
            <el-col :span="5" class="ecrm-chart-right">
                <el-col class="ecrm-chart-right-list">
                    <el-col class="ecrm-chart-right-list-bro">
                        <ul>
                            <li>
                                今天充值金额 :  <span class="ecrm-color-red">{{ chargeStats.today }}</span> 元
                            </li>
                            <li>
                                上周充值金额 : <span class="ecrm-color-red">{{ chargeStats.lastweek }}</span> 元
                            </li>
                            <li>
                                上月充值金额 : <span class="ecrm-color-red">{{ chargeStats.lastmonth }}</span> 元
                            </li>
                            <li>
                                平台充值总金额 : <span class="ecrm-color-red">{{ chargeStats.total }}</span> 元
                            </li>
                        </ul>
                    </el-col>
                    <img src="static/img/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="topUsers.length==0">
                    <el-table :data="topUsers" v-loading="listLoading" style="width: 100%;" v-if="topUsers.length>0">
                        <el-table-column align="center" width="40">
                            <template slot-scope="topUser">
                                <span class="ecrm-chart-num" :class="{ 'ecrm-chart-num1':topUser.$index == '0' , 'ecrm-chart-num2':topUser.$index == '1' , 'ecrm-chart-num3':topUser.$index == '2'}">{{topUser.$index + 1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="realName" align="left" label="排名"></el-table-column>
                        <el-table-column prop="chargeScore" align="right" label="充值金额"></el-table-column>
                        <el-table-column align="right" width="10"></el-table-column>
                    </el-table>
                </el-col>
            </el-col>
        </el-col>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util'
    import { getChargeInfoByUser, getChargeStatistics, getChargeInfoByArea, exportChargeStatToExcel } from '../../api/api';

    export default {
        data() {
            return {
                chargeStats: {
                    today: 0,
                    lastweek: 0,
                    lastmonth: 0,
                    total: 0
                },
                topUsers: [],
                listLoading: false,
                exportLoading: false,
                mapLoading: false,
                ids: ['110000', '120000', '310000', '500000', '130000', '410000', '530000', '210000', '230000', '430000', '340000', '370000', '650000', '320000', '330000', '360000', '420000', '450000', '620000', '140000', '150000', '610000', '220000', '350000', '520000', '440000', '630000', '540000', '510000', '640000', '460000', '710000', '810000', '820000'],
                result:[],
                max: 0,
                ECRUtil:ECRUtil,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            composeRegionData(regionData, max) {
                if (max == 0) {
                    max = 1;
                } else {
                    max = max;
                }
                let color = regionData.total/max;
                let region = {
                    name:regionData.name,
                    today:regionData.today,
                    lastweek:regionData.lastweek,
                    lastmonth:regionData.lastmonth,
                    total:regionData.total,
                    itemStyle: {
                        normal: {
                            color: 'hsla(210, 100%, 40%, ' + color + ')',
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#000',
                                    fontSize: 12
                                }
                            }
                        },
                        emphasis: {// 也是选中样式
                            borderWidth:1,
                            borderColor:'lightgreen',
                            areaColor: '#cd5c5c',
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 12
                                }
                            }
                        }
                    },
                };
                return region;
            },
            getTopUsers() {
                getChargeInfoByUser().then((res) => {
                    this.topUsers = res.data.responseEntity;
                    this.imageSize.width = $('section').width();
                    this.imageSize.height = $('section').height();
                });
                getChargeStatistics().then((res) => {
                    this.chargeStats = res.data.responseEntity;
                });
            },
            getRegion() {
                this.mapLoading = true;
                getChargeInfoByArea({ areaids: this.ids }).then((res) =>{
                    if (res.data.serverResult.resultCode == "200") {
                        let regionData = res.data.responseEntity;
                        regionData.forEach(function(data) {
                            data.name = ECRUtil.convertAreaName(data.name);
                        });
                        regionData.push({
                            name:'南海诸岛',
                            total:0,
                            today:0,
                            lastweek:0,
                            lastmonth:0,
                            average:0
                        });
                        for (var i=0; i<regionData.length; i++) {
                            if (this.max < regionData[i].total) {
                                this.max = regionData[i].total;
                            }
                        }
                        

                        for (var i=0; i<regionData.length; i++) {
                            let region = this.composeRegionData(regionData[i], this.max);
                            this.result.push(region);
                        }

                        this.init();
                        this.ecrmChart("chart-count",{
                            title : {
                                text: '',
                                x:'center'
                            },
                            tooltip : {
                                show:true,
                                extraCssText:'width:237px;height:130px;',
                                trigger: 'item',
                                backgroundColor:'rgba(0,0,0,0)',
                                textStyle:{
                                    color:"#000",
                                },
                                borderRadius:0,
                                padding:0,
                                formatter: function (params, callback){
                                    var res='<div class="ecrm-tool-title">'+
                                                '<p class="ecrm-tool-bt">'+params.data.name+'</p>'+
                                                '<div style="margin-left:6px;background:#f4f4f4; padding:5px 0px;">'+
                                                '<p class="ecrm-tool-val">今天充值金额：<span style="color:#ff3333;">'+params.data.today+'</span>元</p>'+
                                                '<p class="ecrm-tool-val">上周充值金额：<span style="color:#ff3333;">'+params.data.lastweek+'</span>元</p>'+
                                                '<p class="ecrm-tool-val">上月充值金额：<span style="color:#ff3333;">'+params.data.lastmonth+'</span>元</p>'+
                                                '<p class="ecrm-tool-val">平台充值总金额：<span style="color:#ff3333;">'+params.data.total+'</span>元</p></div>'+
                                            '</div>' ;
                                    return res;
                                }
                            },
                            series : [
                                {
                                    name: '中国',
                                    type: 'map',
                                    mapType: 'china',
                                    roam: false,
                                    mapLocation:{
                                        width:1000,
                                        height:500
                                    },
                                    itemStyle:{
                                        normal:{
                                            borderWidth: 1,
                                            borderColor:'lightgreen',
                                            label:
                                            {
                                                show:true,
                                                textStyle:{
                                                    color: '#000',
                                                    fontSize: 12
                                                }
                                            },
                                            color:"#afcdef"
                                        },

                                        emphasis:{
                                            label:
                                            {
                                                show:true,
                                                textStyle:{
                                                    color:'#fff',
                                                    fontSize: 12
                                                }
                                            },
                                            areaStyle:{
                                                color:"#07b9ad"
                                            }
                                        },
                                    },
                                    data: this.result,
                                }
                            ]
                        });
                    } else {

                    }
                    this.mapLoading = false;
                }).catch(() => {
                    this.mapLoading = false;

                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            init: function(){
                var tar =$(".ecrm-mode-cal-tdl");
                if(tar&&tar.length!=0){
                    for(var i=0;i<tar.length;i++){
                        if(tar.eq(i).find(".ecrm-mode-cal-last").length!=0){
                            $(".ecrm-mode-cal-last").parent().css("padding-left",(i)*20);
                        }
                        else{
                            tar.eq(i).css("padding-left",(i+1)*20);
                        }
                    }   
                }
            },
            ecrmChart: function(tar,option){
                if(tar&&tar.length!=0){
                    try{
                        var myChart = echarts.init(document.getElementById(tar));
                        myChart.setOption(option);
                    }
                    catch(errr){

                    }
                }
            },
            exportReport() {
                this.exportLoading = true;
                exportChargeStatToExcel().then((res) =>{
                    if (res.data.serverResult.resultCode == "200") {
                        this.ECRUtil.download(res.data.responseEntity.downloadUrl);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.exportLoading = false;
                }).catch(() => {
                    this.exportLoading = false;
                    
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            }
        },
        mounted() {
            this.getTopUsers();
            this.getRegion();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
    ul, ol {
        list-style: none;
        font-family: \5FAE\8F6F\96C5\9ED1,arial,tahoma,Verdana,sans-serif;
        line-height: 2;
        font-size: 14px;
        padding: 0px;
    }
</style>