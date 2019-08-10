<template>
    <el-col :span="24" class="ecrm-chart-left">
        <el-col class="ecrm-chart-title">资源统计(饼图)</el-col>
        <div id="chartPiePermission" style="width:100%; height:100%;"></div>
    </el-col>
</template>

<script>
    import echarts from 'echarts'
    import { getGoodsStatistics, getGoodsCount } from '../../api/api';

    export default {
        data() {
            return {
                chartPiePermission: null,
                resourcePermission: {
                    total:0,
                    permission:0,
                    prohibition:0
                },
            }
        },
        methods: {
            getProperty() {
                getGoodsStatistics().then((res) =>{
                    this.resourcePermission.total = res.data.responseEntity.total;
                    let param = 
                        {
                            conditions: [
                                {
                                    fieldName: 'status',
                                    fieldValues: [
                                        '1'
                                    ],
                                    prepender: null,
                                    operator: 'EQUAL',
                                    childCondtions: null
                                }
                            ]
                        };

                    getGoodsCount(param).then((res) =>{
                        this.resourcePermission.permission = res.data.responseEntity.count;
                        this.resourcePermission.prohibition = this.resourcePermission.total - this.resourcePermission.permission;
                        this.drawPieChartCount();
                    });
                });

            },
            drawPieChartCount() {
                this.chartPiePermission = echarts.init(document.getElementById('chartPiePermission'));
                this.chartPiePermission.setOption({
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
                        data: ['总商品(资源)数', '上架商品(资源)数', '下架商品(资源)数']
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['25%', '60%'],
                            center: ['50%', '60%'],
                            data: [
                                { value: this.resourcePermission.total, name: '总商品(资源)数' },
                                { value: this.resourcePermission.permission, name: '上架商品(资源)数' },
                                { value: this.resourcePermission.prohibition, name: '下架商品(资源)数' }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },
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