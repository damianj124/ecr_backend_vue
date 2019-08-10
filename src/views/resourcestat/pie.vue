<template>
    <el-col :span="24" class="ecrm-chart-left">
        <el-col class="ecrm-chart-title">资源统计(饼图)</el-col>
        <div id="chartPieCount" style="width:100%; height:100%;"></div>
    </el-col>
</template>

<script>
    import echarts from 'echarts'
    import { getGoodsStatus } from '../../api/api';

    export default {
        data() {
            return {
                chartPieCount: null,
                resourceCount: {
                    currentYear:0,
                    lastYear:0,
                    yearBeforelast:0
                },
            }
        },
        methods: {
            getProperty() {
                getGoodsStatus("5").then((res) =>{
                    this.resourceCount.currentYear = res.data.responseEntity.data[4];
                    this.resourceCount.lastYear = res.data.responseEntity.data[3];
                    this.resourceCount.yearBeforelast = res.data.responseEntity.data[2];
                    this.drawPieChartCount();
                });                
            },
            drawPieChartCount() {
                this.chartPieCount = echarts.init(document.getElementById('chartPieCount'));
                this.chartPieCount.setOption({
                    title: {
                        text: '',
                        subtext: '',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'horizontal',
                        left: 'right',
                        data: ['今年商品(资源)数', '去年商品(资源)数', '前年商品(资源)数']
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['25%', '60%'],
                            center: ['50%', '60%'],
                            data: [
                                { value: this.resourceCount.currentYear, name: '今年商品(资源)数' },
                                { value: this.resourceCount.lastYear, name: '去年商品(资源)数' },
                                { value: this.resourceCount.yearBeforelast, name: '前年商品(资源)数' }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
        },
        mounted() {
            this.getProperty();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
</style>