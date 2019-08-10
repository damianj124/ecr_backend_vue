<template>
    <section>
        <el-col>
            <el-col :span="24" class="ecrm-search-title">
                <a class="selected">资源统计</a>
            </el-col>
        </el-col>
        <el-col align="right" style="margin-top: 30px;">
            <el-button type="primary" @click="onCurrentPageExport" :disabled="mode == '-1'" :loading="exportLoading">导出</el-button>
        </el-col>
        <el-col :span="24">
            <el-col :span="17">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>                
            </el-col>
            <el-col :span="1" align="left" class="op-panel">
                <el-button style="margin-top: 270px" @click="onMapShow" :class="{ 'el-button-selected':$route.path=='/statistics/map' }">地图</el-button><br>
                <el-button @click="onCountShow" :class="{ 'el-button-selected':$route.path=='/statistics/pie' }">饼图</el-button><br>
                <el-button @click="onPermissionShow" :class="{ 'el-button-selected':$route.path=='/statistics/pie2' }">饼图</el-button><br>
                <el-button @click="onCurveShow" :class="{ 'el-button-selected':$route.path=='/statistics/curve' }">线图</el-button>
            </el-col>
            <el-col :span="6" class="ecrm-chart-right">
                <el-col class="ecrm-chart-right-list">
                    <el-col class="ecrm-chart-right-list-bro">
                        <ul>
                            <li>
                                总商品数 :  <span class="ecrm-color-red">{{addedGoodsStats.total}}</span> 条
                            </li>
                            <li>
                                上月新增商品数 : <span class="ecrm-color-red">{{addedGoodsStats.lastmonth}}</span> 条
                            </li>
                            <li>
                                上周新增商品数 : <span class="ecrm-color-red">{{addedGoodsStats.lastweek}}</span> 条
                            </li>
                            <li>
                                昨日新增商品数 : <span class="ecrm-color-red">{{addedGoodsStats.yesterday}}</span> 条
                            </li>
                            <li>
                                今日新增商品数 : <span class="ecrm-color-red">{{addedGoodsStats.today}}</span> 条
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
                        <el-table-column prop="count" align="right" label="商品数"></el-table-column>
                        <el-table-column align="right" width="10"></el-table-column>
                    </el-table>
                </el-col>
            </el-col>
        </el-col>
    </section>
</template>

<script>
    import { getGoodsStatistics, getTopTenUsers, exportChartData } from '../../api/api';
    import ECRUtil from '../../common/js/util.js';

    export default {
        data() {
            return {
                ECRUtil:ECRUtil,
                addedGoodsStats: [],
                listLoading: false,
                exportLoading: false,
                topUsers: [],
                mode:-1,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            getTopUsers() {
                getTopTenUsers().then((res) =>{
                    this.topUsers = res.data.responseEntity;
                    this.imageSize.width = $('section').width();
                    this.imageSize.height = $('section').height();
                });
                getGoodsStatistics().then((res) =>{
                    this.addedGoodsStats = res.data.responseEntity;
                });
            },
            onMapShow: function() {
                this.$router.push('/statistics/map');
                this.mode = -1;
                localStorage.setItem('linechat-mode', -1);
            },
            onCountShow: function() {
                this.$router.push('/statistics/pie');
                this.mode = 0;
                localStorage.setItem('linechat-mode', 0);
            },
            onPermissionShow: function() {
                this.$router.push('/statistics/pie2');
                this.mode = 1;
                localStorage.setItem('linechat-mode', 1);
            },
            onCurveShow: function() {
                this.$router.push('/statistics/curve');
                this.mode = localStorage.getItem("linechat-mode");
            },
            onCurrentPageExport() {
                var linemode = localStorage.getItem("linechat-mode");
                this.exportLoading = true;
                exportChartData(linemode).then((res) =>{
                    if (res.data.serverResult.resultCode == "200") {
                        this.ECRUtil.download(res.data.responseEntity.chartDataUrl);
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
        created() {
            this.getTopUsers();
            this.onMapShow();
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
    .op-panel .el-button {
        border-radius: 0px;
        border-left: 0px;
        border-bottom-width: 0px;
    }
    .op-panel .el-button:first-child {
        border-top-right-radius: 4px;
    }
    .op-panel .el-button:last-child {
        border-bottom-right-radius: 4px;
        border-bottom-width: 1px;
    }
</style>