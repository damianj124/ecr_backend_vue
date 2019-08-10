<template>
    <section>
        <el-col :span="24" class="ecrm-search-title">
            <a class="selected">审核统计</a>
        </el-col>

        <el-col :span="24" class="ecrm-content-panel">
            <el-form label-width="120px">
                <el-col :span="6">
                    <el-form-item label="业务类型:">
                        <el-select v-model="filters.businesstype">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="上传审核" value="1"></el-option>
                            <el-option label="征集审核" value="2"></el-option>
                            <el-option label="悬赏审核" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="状态:">
                        <el-select v-model="filters.status">
                            <el-option label="全部" value=""></el-option>
                            <el-option :label="state.label" :value="state.value" v-for="(state, idx) in status" :key="idx" :data="state"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                    <el-form-item label="审核级别:">
                        <el-select v-model="filters.sharerange">
                            <el-option label="全部" value=""></el-option>
                            <el-option :label="order.label" :value="order.value" v-for="(order, idx) in sharerange" :key="idx" :data="order"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col> -->
                <el-col :span="6">
                    <el-form-item label="审核员:">
                        <el-select v-model="filters.audituser">
                            <el-option label="全部" value=""></el-option>
                            <el-option :label="audituser.realName" :value="audituser.userId" v-for="(audituser, idx) in auditusers" :key="idx" :data="audituser"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="学校名称:">
                        <el-input v-model="filters.schoolname" placeholder="请输入学校名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="18">
                    <el-form-item label="创建日期:">
                        <el-date-picker type="date" v-model="filters.begin_time" style="width:150px;"></el-date-picker>
                        -
                        <el-date-picker type="date" v-model="filters.end_time" style="width:150px;"></el-date-picker>
                        <el-button style="margin-left:10px" type="primary" v-on:click="search" id="searchBtn">查询</el-button>
                        <el-button style="margin-left:10px" type="primary" v-on:click="doExport" id="exportBtn" :loading="exportLoading">导出</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
            <img src="static/img/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="schools.length==0">
            <el-table :data="schools" v-loading="listLoading" @sort-change="doSort" v-if="schools.length>0">
                <el-table-column label="业务类型" align="center"> 
                     <template slot-scope="school">
                        <span>{{businesstype}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="学校名称" align="center">
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" sortable="custom">
                    <template slot-scope="school">
                        <span :class="{ 'ecrm-color-red':school.row.status=='4', 'ecrm-color-green':school.row.status=='3'}">{{ formatStatus(school.row.status) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="count" label="资源总量" align="center" sortable="custom">
                    <template slot-scope="school">
                        <a href="javascript:;" style="text-decoration: none;color: #1f2d3d;" @click="doDetail(school.row)">{{school.row.count}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="school">
                        <el-button size="small" @click="doDetailStatistics(school.row)" style="margin:0">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
                <my-pagination @current-change="handleCurrentChange" @pgSize-change="handlePageSizeChange" :page="page" :page-size="page_size" :total="total" :pagetotal="page_total"></my-pagination>
            </el-col>
        </el-col>
        <el-dialog title="数值" v-model="statisticsVisible" :close-on-click-modal="false">
            <el-form :model="statisticsForm" label-width="120px">
                <el-row v-if="statisticsForm.PRIMARY_SCHOOL.subname.length>0">
                    <el-col :span="4"><span class="ecrw-statistics-school-span">小学</span></el-col>
                    <el-col :span="20">
                        <el-row>
                            <el-col :span="4" v-for="(item, idx) in statisticsForm.PRIMARY_SCHOOL.subname" v-bind:key="idx">
                                <div v-if="statisticsForm.PRIMARY_SCHOOL.subname[idx] != null">
                                    <span>{{statisticsForm.PRIMARY_SCHOOL.subname[idx]}}<br/>{{statisticsForm.PRIMARY_SCHOOL.subcount[idx]}}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <hr>
                <el-row v-if="statisticsForm.JUNIOR_HIGH_SCHOOL.subname.length>0">
                    <el-col :span="4"><span class="ecrw-statistics-school-span">初中</span></el-col>
                    <el-col :span="20" >
                        <el-row>
                            <el-col :span="4" v-for="(item, idx) in statisticsForm.JUNIOR_HIGH_SCHOOL.subname" v-bind:key="idx">
                                <div v-if="statisticsForm.JUNIOR_HIGH_SCHOOL.subname[idx] != null">
                                    <span>{{statisticsForm.JUNIOR_HIGH_SCHOOL.subname[idx]}}<br/>{{statisticsForm.JUNIOR_HIGH_SCHOOL.subcount[idx]}}</span>
                                </div>
                                
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <hr>
                <el-row v-if="statisticsForm.HIGH_SCHOOL.subname.length>0">
                    <el-col :span="4"><span class="ecrw-statistics-school-span">高中</span></el-col>
                    <el-col :span="20">
                        <el-row>
                            <el-col :span="4" v-for="(item, idx) in statisticsForm.HIGH_SCHOOL.subname" v-bind:key="idx">
                                <!-- <span>{{statisticsForm.HIGH_SCHOOL.subname[idx]}}<br/>{{statisticsForm.HIGH_SCHOOL.subcount[idx]}}</span> -->
                                <div v-if="statisticsForm.HIGH_SCHOOL.subname[idx] != null">
                                    <span>{{statisticsForm.HIGH_SCHOOL.subname[idx]}}<br/>{{statisticsForm.HIGH_SCHOOL.subcount[idx]}}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="statisticsVisible = false">取消</el-button>
            </div>
        </el-dialog>
        <!-- Author : GOD 2019-2-18 Bug ID: #781 -->
        <el-dialog title="范围级别数据" v-model="statisticsDetailVisible" :close-on-click-modal="false">
            <el-form  label-width="120px">
                <span v-for="(item, idx) in statisticsDetail" style="padding: 10px;font-size: 16px" v-bind:key="idx">
                   {{sharerange[idx].label}} : {{item}}<br/>
                </span>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="statisticsDetailVisible = false">取消</el-button>
            </div>
        </el-dialog>
        <!-- Author : GOD 2019-2-18 Bug ID: #781 -->
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util'
    import { REVIEWED_STATUS, SHARE_RANGE } from '../../common/js/const.js';
    import { getAuditUserList, exportToExcel, getAuditStatistics, getAuditStatisticsDetail } from '../../api/api';

    export default {
        data() {
            return {
                ECRUtil:ECRUtil,
                filters: {
                    schoolname:'',
                    businesstype: '',
                    status: '',
                    sharerange: '',
                    audituser: '',
                    begin_time: '',
                    end_time: ''
                },
                last_filter: [],
                schools: [],
                status: REVIEWED_STATUS,
                sharerange: SHARE_RANGE,
                auditusers: [],
                statisticsForm: {
                    PRIMARY_SCHOOL : {
                        subname: [],
                        subcount: []
                    },
                    JUNIOR_HIGH_SCHOOL : {
                        subname: [],
                        subcount: []
                    },
                    HIGH_SCHOOL : {
                        subname: [],
                        subcount: []
                    }
                },
                /////////// Pagination ///////////
                total: 0,
                page: 1,
                page_size: 10,
                page_total: 0,
                /////////// Pagination End ////////

                /////////// SortMode Start ////////
                stateSortMode: "",
                countSortMode: "",
                /////////// SortMode End ////////

                listLoading: false,
                exportLoading: false,
                statisticsVisible: false,
                imageSize: {
                    width: 0,
                    height: 0
                },
                // <!-- Author : GOD 2019-2-18 Bug ID: #781 -->
                statisticsDetailVisible: false,
                statisticsDetail: [],
                businesstype: "",
                businesstypes: ["上传审核", "征集审核", "悬赏审核"]
                // <!-- Author : GOD 2019-2-18 Bug ID: #781 -->
            }
        },
        methods: {
            getAuditUsers() {
                getAuditUserList().then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.auditusers = res.data.pageInfo.list;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.auditusers = [];
                    }
                }).catch((res) => {
                    this.auditusers = [];
                });
            },            
            getSchools() {
                let param = 
                    {
                        pagination:{
                            numPerPage:this.page_size,
                            pageNo:this.page,
                            calTotal:true
                        },                        
                        conditions: [
                            {
                                fieldName: 'orgname',
                                fieldValues: [
                                    this.filters.schoolname
                                ],
                                prepender: null,
                                operator: 'EQUAL',
                                childCondtions: null
                            },
                            {
                                fieldName: 'businesstype',
                                fieldValues: 
                                    (this.filters.businesstype=='1')?[this.filters.businesstype, '5']:[this.filters.businesstype],
                                prepender: null,
                                operator: 'EQUAL',
                                childCondtions: null
                            },
                            {
                                fieldName: 'status',
                                fieldValues: [
                                    this.filters.status
                                ],
                                prepender: null,
                                operator: 'EQUAL',
                                childCondtions: null
                            },
                            {
                                fieldName: 'sharerange',
                                fieldValues: [
                                    this.filters.sharerange
                                ],
                                prepender: null,
                                operator: 'EQUAL',
                                childCondtions: null
                            },
                            {
                                fieldName: 'audituser',
                                fieldValues: [
                                    this.filters.audituser
                                ],
                                prepender: null,
                                operator: 'EQUAL',
                                childCondtions: null
                            }                                                                        
                        ],
                        orderMethods: []
                    };

                if (this.filters.begin_time != '' && this.filters.end_time != '') {
                    if (new Date(this.filters.begin_time) > new Date(this.filters.end_time)) {
                        this.$message({
                            message: '结束日期不能小于开始日期。',
                            type: 'error'
                        });
                        return;
                    }
                }
                if (this.filters.begin_time != '') {
                    param.conditions.push(
                        {
                            fieldName: 'begin_time',
                            fieldValues: [
                                ECRUtil.formatDate.format(new Date(this.filters.begin_time))
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    );
                }
                if (this.filters.end_time != '') {
                    param.conditions.push(
                        {
                            fieldName: 'end_time',
                            fieldValues: [
                                ECRUtil.formatDate.format(new Date(this.filters.end_time))
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    );
                }

                if (this.stateSortMode != '') {
                    param.orderMethods.push({
                        field: "status", 
                        method: this.stateSortMode
                    });
                }
                if (this.countSortMode != '') {
                    param.orderMethods.push({
                        field: "count", 
                        method: this.countSortMode
                    });
                }
                
                this.listLoading = true;
                getAuditStatistics(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.last_filter = param;
                        this.total = res.data.pageInfo.total;
                        this.schools = res.data.pageInfo.list;
                        this.page_total = res.data.pageInfo.list.length;
                        if(this.filters.businesstype != "")
                            this.businesstype = this.businesstypes[this.filters.businesstype-1];
                        else 
                            this.businesstype = "全部";
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.total = 0;
                        this.schools = [];
                    }
                    this.listLoading = false;    
                    this.imageSize.width = $('section').width();
                    this.imageSize.height = $('section').height();
                }).catch((res) => {
                    this.total = 0;
                    this.schools = [];
                    this.listLoading = false;

                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            formatStatus: function(status) {
                if (status == "3") {
                    return '已审核';
                } else if (status == "4") {
                    return '已驳回';
                } 
            },
            doSort: function(col) {
                this.stateSortMode = "";
                this.countSortMode = "";
                
                if (col.prop == "status") {
                    if (col.order == "ascending") {
                        this.stateSortMode = "ASC";
                    }
                    else {
                        this.stateSortMode = "DESC";
                    }
                }
                else if(col.prop == "count") {
                    if (col.order == "ascending") {
                        this.countSortMode = "ASC";
                    }
                    else {
                        this.countSortMode = "DESC";
                    }
                }    
                                
                this.getSchools();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getSchools();
            },
            // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
            // Modify Reason : Bug Number #491
            // Data Start : 2019-1-28 11:05 AM
            handlePageSizeChange(pageSize) {
                this.page_size = pageSize;
                this.getSchools();
            },
            // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
            // Data End : 2019-1-28 12:35 AM
            search() {
                this.page = 1;
                this.getSchools();
            },
            doExport() {
                this.exportLoading = true;
                delete this.last_filter.pagination;
                exportToExcel(this.last_filter).then((res) => {
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
            },
            doDetail(row) {
                if (row.subname.length > 0) {
                    
                    for (var i = 0; i< row.schoolsection.length; i++) {
                        
                        if(row.schoolsection[i] == 'PRIMARY_SCHOOL') {
                            this.statisticsForm.PRIMARY_SCHOOL.subname[i] = row.subname[i];
                            this.statisticsForm.PRIMARY_SCHOOL.subcount[i] = row.subcount[i];
                        } else if(row.schoolsection[i] == 'JUNIOR_HIGH_SCHOOL') {
                            this.statisticsForm.JUNIOR_HIGH_SCHOOL.subname[i] = row.subname[i];
                            this.statisticsForm.JUNIOR_HIGH_SCHOOL.subcount[i] = row.subcount[i];
                        } else if(row.schoolsection[i] == 'HIGH_SCHOOL') {
                            this.statisticsForm.HIGH_SCHOOL.subname[i] = row.subname[i];
                            this.statisticsForm.HIGH_SCHOOL.subcount[i] = row.subcount[i];
                        }
                    }
                    console.log(this.statisticsForm);
                    this.statisticsVisible = true;
                }
            },
            // <!-- Author : GOD 2019-2-18 Bug ID: #781 -->
            doDetailStatistics(row) {
                if(row.count > 0) {
                    let param = 
                    {
                        pagination:{
                            numPerPage:this.page_size,
                            pageNo:this.page,
                            calTotal:true
                        },                        
                        conditions: [
                            {
                                fieldName: 'orgid',
                                fieldValues: [
                                    row.id
                                ],
                                prepender: null,
                                operator: 'EQUAL',
                                childCondtions: null
                            },
                            {
                                fieldName: 'businesstype',
                                fieldValues: 
                                    (this.filters.businesstype=='1')?[this.filters.businesstype, '5']:[this.filters.businesstype],
                                prepender: null,
                                operator: 'EQUAL',
                                childCondtions: null
                            },
                            {
                                fieldName: 'status',
                                fieldValues: [
                                    row.status
                                ],
                                prepender: null,
                                operator: 'EQUAL',
                                childCondtions: null
                            },
                            {
                                fieldName: 'audituser',
                                fieldValues: [
                                    this.filters.audituser
                                ],
                                prepender: null,
                                operator: 'EQUAL',
                                childCondtions: null
                            }                                                                        
                        ],
                        orderMethods: []
                    };

                    if (this.filters.begin_time != '' && this.filters.end_time != '') {
                        if (new Date(this.filters.begin_time) > new Date(this.filters.end_time)) {
                            this.$message({
                                message: '结束日期不能小于开始日期。',
                                type: 'error'
                            });
                            return;
                        }
                    }
                    if (this.filters.begin_time != '') {
                        param.conditions.push(
                            {
                                fieldName: 'begin_time',
                                fieldValues: [
                                    ECRUtil.formatDate.format(new Date(this.filters.begin_time))
                                ],
                                prepender: null,
                                operator: 'EQUAL',
                                childCondtions: null
                            }
                        );
                    }
                    if (this.filters.end_time != '') {
                        param.conditions.push(
                            {
                                fieldName: 'end_time',
                                fieldValues: [
                                    ECRUtil.formatDate.format(new Date(this.filters.end_time))
                                ],
                                prepender: null,
                                operator: 'EQUAL',
                                childCondtions: null
                            }
                        );
                    }

                    getAuditStatisticsDetail(param).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.last_filter = param;
                            this.statisticsDetail = res.data.pageInfo.list;
                            this.statisticsDetailVisible = true;
                        } else {
                            this.statisticsDetailVisible = false;
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                            this.statisticsDetail = [];
                        }
                        this.listLoading = false;    
                        this.imageSize.width = $('section').width();
                        this.imageSize.height = $('section').height();
                    }).catch((res) => {
                        this.statisticsDetail = [];
                        this.listLoading = false;
                        this.statisticsDetailVisible = false;

                        this.$message({
                            message: '加载失败!',
                            type: 'error'
                        });
                    });
                    
                }
            }
            // <!-- Author : GOD 2019-2-18 Bug ID: #781 -->
        },
        created() {
            this.getAuditUsers();
            this.getSchools();
        }
    }

</script>

<style lang="scss" scoped>
    @import '~scss_vars';
    
    .el-input, .el-select {
        width: 100%;
    }

    .ecrw-statistics-school-span {
        font-size: 20px;
        font-weight: bold;
        color: black;
    }
</style>