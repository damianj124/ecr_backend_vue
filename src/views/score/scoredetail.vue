<template>
    <section>
        <el-col :span="24" class="ecrm-search-title">
            <a class="selected">用户积分明细</a>
        </el-col>

        <el-col style="margin-top: 30px;">
            <el-form :inline="true" label-width="80px">
                <el-form-item label="当前积分 :">
                    <span class="ecrm-color-red"> {{ score }} </span>分
                </el-form-item>
                <el-form-item label="当前用户 :" style="margin-left: 60px;">
                    <span class="ecrm-color-red"> {{ username }} </span>
                </el-form-item>
            </el-form>            
        </el-col>
        <img src="static/img/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="scorelist.length==0">
        <el-table :data="scorelist" v-loading="listLoading" highlight-current-row @selection-change="selsChange" v-if="scorelist.length>0">
            <el-table-column prop="operationtype" label="积分操作" align="center">
            </el-table-column>
            <el-table-column prop="scoretype" label="积分形式" align="center">
            </el-table-column>
            <el-table-column prop="createtime" label="操作时间" align="center"></el-table-column>
            <el-table-column label="积分变化" align="center" width="200">
                <template slot-scope="scope">
                    <span :class=" {'ecrm-color-red': scope.row.incometype == 1 , 'ecrm-color-green': scope.row.incometype == 0 }"> <span v-if="scope.row.incometype == 0">+</span> <span v-if="scope.row.incometype == 1">-</span>{{ scope.row.integralvalue }}</span>
                </template>
            </el-table-column>    
        </el-table>
        <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
            <my-pagination @current-change="goCurrentPage" :page-size="page_size" :total="total" :pagetotal="page_total"></my-pagination>
        </el-col>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util.js'
    import { getScoreByUserId , getScoreDetailByUserId } from '../../api/api'

    export default {
        data() {
            return {
                scorelist:[],

                userid:'',
                username:'',
                page_size: 10,
                total: 0,
                page: 1,
                page_total: 0,
                score: 0,
                imageSize: {
                    width: 0,
                    height: 0
                },
                listLoading: false
            }
        },
        methods: {
            load() {

                this.userid = this.$route.params.user;

                let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page
                    },
                    conditions: [
                        {
                            fieldName: 'userid',
                            fieldValues: [this.userid],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                    ]
                };
                this.listLoading = true;
                getScoreDetailByUserId(params).then((res) =>{
                    if (res.data.serverResult.resultCode == "200") {
                        this.scorelist = res.data.pageInfo.list;
                        this.total  = res.data.pageInfo.total;
                        this.page_total = res.data.pageInfo.list.length;
                        for (var i=0; i<this.scorelist.length; i++) {
                            this.scorelist[i].operationtype = ECRUtil.getScoreMNGType(res.data.pageInfo.list[i].operationtype);
                            this.scorelist[i].scoretype = ECRUtil.getScoreType(res.data.pageInfo.list[i].scoretype);
                        }
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('section').width();
                    this.imageSize.height = $('section').height();
                });
            },
            getScore: function(){
                getScoreByUserId(this.userid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        if (res.data.responseEntity == null) {
                            this.score = '?';
                        } else {
                            this.score = parseInt(res.data.responseEntity.score);
                            this.username = res.data.responseEntity.loginname;

                        }
                    } else {
                        this.score = 0;
                    }
                });
            },
            goCurrentPage(val) {
                this.page = val;
                this.load();
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            search: function() {
                this.load();
            }
        },
        created() {
            this.load();
            this.getScore();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
    ul {
        height: 34px;
        margin-top: 15px;
    }
    li {
        min-width: 160px;
    }
    li a {
        width: calc(100% - 30px);
        text-align: center;
    }
    .el-table th {
        background: #fafafa;
    }

</style>