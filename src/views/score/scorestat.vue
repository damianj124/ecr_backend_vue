<template>
    <section>
        <el-row>
            <el-col :span="24" class="ecrm-search-title">
                <a class="selected">积分统计-图形</a>
            </el-col>
        </el-row>
        <el-row style="margin-top: 30px;">
            <el-col :span="19" class="ecrm-chart-left">
                <el-col class="ecrm-chart-title">积分值统计</el-col>
                <el-col id="chart-count" style="width:100%;height:90%;" v-loading="mapLoading"></el-col>            
            </el-col>
            <el-col :span="5" class="ecrm-chart-right">
                <el-col class="ecrm-chart-right-list">
                    <el-col class="ecrm-chart-right-list-bro" v-if="infos.length!=0">
                        <ul>
                            <li>
                                今天奖励积分 :  <span class="ecrm-color-red">{{infos.today.bonusIntegral}}</span> 分
                            </li>
                            <li>
                                上周奖励积分 : <span class="ecrm-color-red">{{infos.week.bonusIntegral}}</span> 分
                            </li>
                            <li>
                                上月奖励积分 : <span class="ecrm-color-red">{{infos.month.bonusIntegral}}</span> 分
                            </li>
                        </ul>
                        <ul>
                            <li>
                                今天消费积分 :  <span class="ecrm-color-red">{{infos.today.usedIntegral}}</span> 分
                            </li>
                            <li>
                                上周消费积分 : <span class="ecrm-color-red">{{infos.week.usedIntegral}}</span> 分
                            </li>
                            <li>
                                上月消费积分 : <span class="ecrm-color-red">{{infos.month.usedIntegral}}</span> 分
                            </li>
                        </ul>
                        <ul>
                            <li>
                                平台剩余总积分 : <span class="ecrm-color-red">{{ infos.useabletotal }}</span> 分
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
                        <el-table-column prop="username" align="left" label="排名"></el-table-column>
                        <el-table-column prop="totalscore" align="right" label="积分值"></el-table-column>
                        <el-table-column align="right" width="10"></el-table-column>
                    </el-table>
                </el-col>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util'
    import { getTop10ScoreUser, getScoreStatistic, getScoreTotalIntegralInfo } from '../../api/api';

    export default {
        data() {
            return {
                topUsers: [],
                infos: [],
                listLoading: false,
                mapLoading: false,
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
            getTopUsers() {
                this.listLoading = true;
                getTop10ScoreUser().then((res) => {
                    this.topUsers = res.data.pageInfo.list;
                    this.listLoading = false;
                    this.imageSize.width = $('section').width();
                    this.imageSize.height = $('section').height();
                });
            },
            getScoreTotalIntegralInfo() {
                getScoreTotalIntegralInfo().then((res) => {
                    this.infos = res.data.responseEntity;
                });
            },
            composeRegionData(regionData, max) {
                if (max == 0) {
                    max = 1;
                } else {
                    max = max;
                }
                let color = regionData.totalIntegral/max;
                let region = {
                    name:regionData.name,
                    bonusIntegral:regionData.bonusIntegral,
                    usedIntegral:regionData.usedIntegral,
                    totalIntegral:regionData.totalIntegral,
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
            getRegion() {
                this.mapLoading = true;
                getScoreStatistic({}).then((res) =>{
                    if (res.data.serverResult.resultCode == "200") {
                        let regionData = res.data.pageInfo.list;
                        regionData.forEach(function(data) {
                            data.name = ECRUtil.convertAreaName(data.areaname);
                        });
                        regionData.push({
                            name:'南海诸岛',
                            bonusIntegral: 0,
                            usedIntegral: 0,
                            totalIntegral: 0
                        });

                        for (var i=0; i<regionData.length; i++) {
                            if (this.max < regionData[i].totalIntegral) {
                                this.max = regionData[i].totalIntegral;
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
                                                '<p class="ecrm-tool-val">今天奖励积分：<span style="color:#ff3333;">'+params.data.bonusIntegral+'</span>分</p>'+
                                                '<p class="ecrm-tool-val">今天消费积分：<span style="color:#ff3333;">'+params.data.usedIntegral+'</span>分</p>'+
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
                                    color:'#f00'
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
            }
        },
        mounted() {
            this.getTopUsers();
            this.getRegion();
            this.getScoreTotalIntegralInfo();
        },
        created() {
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