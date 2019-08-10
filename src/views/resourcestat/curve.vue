<template>
    <el-col :span="24" class="ecrm-chart-left" v-loading="curveLoading">
        <el-col :span="20" class="ecrm-chart-title">资源统计(拆线图)</el-col>
        <el-select placeholder="请择选显示模式" v-model="mode.val" style="margin-top: 20px; width: 150px;" @change="onModeChange(mode.val)">
            <el-option label="切换 按天" value="1"></el-option>
            <el-option label="切换 按周" value="2"></el-option>
            <el-option label="切换 按月" value="3"></el-option>
            <el-option label="切换 按季" value="4"></el-option>
            <el-option label="切换 按年" value="5"></el-option>
        </el-select>
        <div id="chartLine" style="width:100%; height:90%;"></div>
    </el-col>
</template>

<script>
    import echarts from 'echarts'
    import { getGoodsStatus,} from '../../api/api';
    import ECRUtil from '../../common/js/util.js';

    export default {
        data() {
            return {
                ECRUtil:ECRUtil,
                chartLine: null,
                dayList:[],
                mode: {
                    val: '1',
                },
                curveLoading: false
            }
        },
        methods: {
            getDate(mode) {
                this.curveLoading = true;
                var linemode = mode + 1;
                localStorage.setItem('linechat-mode', linemode);
                getGoodsStatus(mode).then((res) => {
                    this.drawDateChart(res.data.responseEntity.data , res.data.responseEntity.title);
                    this.curveLoading = false;
                });
            },
            drawDateChart(val , date) {
                
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['商品(资源)数',]
                    },
                    grid: {
                        left: '3%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: date
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '商品(资源)数',
                            type: 'line',
                            stack: '总量',
                            data: val
                        },
                        
                    ]
                });
            },
            onModeChange(modeVal) {
                switch(modeVal) {
                    case "1":
                        this.getDate(1);
                        break;
                    case "2":
                        this.getDate(2);
                        break;
                    case "3":
                        this.getDate(3);
                        break;
                    case "4":
                        this.getDate(4);
                        break;
                    case "5":
                        this.getDate(5);
                        break;
                }
            }
        },
        mounted() {
            this.getDate(1);
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
</style>