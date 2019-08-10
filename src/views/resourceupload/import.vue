<template>
    <section>
        <el-col :span="24" class="ecrm-search-title">
            <a class="selected">资源批量导入</a>
        </el-col>
        <input type="file" id="inputfile" @change="onSelectFile" hidden accept=".xls,.xlsx"/>
        <el-col :span="24" class="ecrm-content-panel">
            <el-form label-width="100px">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="状态：">
                            <el-select v-model="filters.importstatus">
                                <el-option value="" label="全部"></el-option>
                                <el-option value="0" label="未导入"></el-option>
                                <el-option value="1" label="已导入"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="文件名：">
                            <el-input type="text" v-model="filters.filename"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="导入人：">
                            <el-input type="text" v-model="filters.creatorname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="导入时间：">
                            <el-date-picker type="date" v-model="filters.begin_time" style ="width: 140px;"></el-date-picker>
                            -
                            <el-date-picker type="date" v-model="filters.end_time" style ="width: 140px;"></el-date-picker>
                            <el-button type="primary" v-on:click="search" id="searchBtn">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row> 
            </el-form>

            <el-col :span="24" style="margin-bottom: 10px; text-align:right;">
                <el-button type="table-op" size="small" @click="downTemplate" :loading="exportLoading">文件清单表模板下载</el-button>
                <el-button type="table-op" size="small"  @click="importTemplate">文件清单表数据上传</el-button>
                <el-button type="table-op" size="small" :disabled="sels.length===0" @click="uploadResInfo">批量修改状态及导入信息</el-button>
            </el-col>
            <img src="static/img/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="resources.length==0">
            <el-table :data="resources" v-loading="listLoading" @selection-change="selsChange" v-if="resources.length > 0">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <span :class="{ 'ecrm-color-red':scope.row.importstatus=='0', 'ecrm-color-green':scope.row.importstatus=='1' }">{{ getImportStatus(scope.row.importstatus) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="fileInfo.filename" label="文件名" align="center">
                </el-table-column>
                <el-table-column label="导入人" align="center" width="150">
                    <template slot-scope="scope">
                        <span class="ecrm-color-red" v-if="scope.row.remarks.creator!=''">{{ scope.row.remarks.creator }}</span>
                        <span v-if="scope.row.remarks.creator==''">{{ scope.row.creatorname }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createtime" label="导入时间" align="center" width="150">
                </el-table-column>
                <el-table-column label="文仵路径" align="center">
                    <template slot-scope="scope">
                        <span class="ecrm-color-red" v-if="scope.row.remarks.filepath!=''">{{ scope.row.remarks.filepath }}</span>
                        <span v-if="scope.row.remarks.filepath==''">{{ scope.row.filepath }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="类别" align="center">
                    <template slot-scope="scope">
                        <span class="ecrm-color-red" v-if="scope.row.remarks.contenttype!=''">{{ ECRUtil.resourceLabel(scope.row.remarks.contenttype) }}</span>
                        <span v-if="scope.row.remarks.contenttype==''">{{ ECRUtil.resourceLabel(scope.row.contenttype) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="学段" align="center">
                    <template slot-scope="scope">
                        <span class="ecrm-color-red" v-if="scope.row.remarks.schoolsection!=''">{{ scope.row.remarks.schoolsection }}</span>
                        <span v-if="scope.row.remarks.schoolsection==''">{{ scope.row.schoolsection }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="学科" align="center">
                    <template slot-scope="scope">
                        <span class="ecrm-color-red" v-if="scope.row.remarks.subject!=''">{{ scope.row.remarks.subject }}</span>
                        <span v-if="scope.row.remarks.subject==''">{{ scope.row.subject }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="年级" align="center">
                    <template slot-scope="scope">
                        <span class="ecrm-color-red" v-if="scope.row.remarks.grade!=''">{{ scope.row.remarks.grade }}</span>
                        <span v-if="scope.row.remarks.grade==''">{{ scope.row.grade }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="版本" align="center">
                    <template slot-scope="scope">
                        <span class="ecrm-color-red" v-if="scope.row.remarks.editiontype!=''">{{ scope.row.remarks.editiontype }}</span>
                        <span v-if="scope.row.remarks.editiontype==''">{{ scope.row.editiontype }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="册别" align="center">
                    <template slot-scope="scope">
                        <span class="ecrm-color-red" v-if="scope.row.remarks.bookmodel!=''">{{ scope.row.remarks.bookmodel }}</span>
                        <span v-if="scope.row.remarks.bookmodel==''">{{ scope.row.bookmodel }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="章" align="center">
                    <template slot-scope="scope">
                        <span class="ecrm-color-red" v-if="scope.row.remarks.chapter!=''">{{ scope.row.remarks.chapter }}</span>
                        <span v-if="scope.row.remarks.chapter==''">{{ getChapter(scope.row) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="节" align="center">
                    <template slot-scope="scope">
                        <span class="ecrm-color-red" v-if="scope.row.remarks.section!=''">{{ scope.row.remarks.section }}</span>
                        <span v-if="scope.row.remarks.section==''">{{ getSection(scope.row) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="课" align="center">
                    <template slot-scope="scope">
                        <span class="ecrm-color-red" v-if="scope.row.remarks.lesson!=''">{{ scope.row.remarks.lesson }}</span>
                        <span v-if="scope.row.remarks.lesson==''">{{ getlesson(scope.row) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="知识点" align="center">
                </el-table-column>
                <el-table-column prop="score" label="商品定价" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center" width="120">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)" style="margin:0">修改</el-button>
                        <el-button size="small" @click="handleDel(scope.$index, scope.row)" style="margin:0">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--工具条-->
            <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
                <my-pagination @current-change="handleCurrentChange" @pgSize-change="handlePageSizeChange" :page="page" :page-size="page_size" :total="total" :pagetotal="page_total"></my-pagination>
            </el-col>
        </el-col>

        <el-dialog title="批量修改状态及导入信息" v-model="updateFormVisible" :close-on-click-modal="false">
            <el-form label-width="100px">
                <el-col :span="23">
                    <el-form-item label="状态：">
                        <el-select v-model="importStatus">
                            <el-option value="0" label="未导入"></el-option>
                            <el-option value="1" label="已导入"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="updateFormVisible=false">取消</el-button>
                <el-button type="primary" @click.native="updateSubmit" :loading="editLoading">修改</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util'
    import { uploadResourceBatch, downloadTemplate, getDataListPage, batchRemoveResources, uploadResInfoApi, removeResource, editResource } from '../../api/api';

    export default {
        data() {
            return {
                ECRUtil: ECRUtil,
                filters: {
                    importstatus: '',
                    creatorname: '',
                    filename: '',
                    begin_time: '',
                    end_time: ''
                },
                importStatus: '',
                resourceIds: '',
                templateUrl: '',
                resources: [],
                total: 0,
                page: 1,
                page_size: 5,
                page_total: 0,
                listLoading: false,
                sels: [],
                updateFormVisible: false,
                editLoading: false,
                exportLoading: false,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            onSelectFile: function(e) {
                if (e.target.files.length == 0) return;
                var selectedFile = e.target.files[0];
                const data = new FormData();
                data.append('file', selectedFile);
                data.append('type', 1);

                this.listLoading = true;
                uploadResourceBatch(data).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        let resources = res.data.pageInfo.list;
                        this.total = res.data.pageInfo.total;
                        for (var i=0; i<resources.length; i++) {
                            if (resources[i].remarks == "" || resources[i].remarks == null)    
                                continue;
                            resources[i].remarks = JSON.parse(resources[i].remarks);
                        }
                        this.resources = resources;  
                        // Author : GOD 2019-2-18 Bug ID: #784
                        if(res.data.serverResult.internalMessage != "[]" && res.data.serverResult.internalMessage != null) {
                            let reportMessages = JSON.parse(res.data.serverResult.internalMessage);
                            var report = '';
                            for (var i=0; i<reportMessages.length; i++) {
                                if(reportMessages[i].fileNotExist) {

                                    report = report + reportMessages[i].fileNotExist + ' 文件不存在! \n';

                                } else if(reportMessages[i].chapterNotExist) {

                                    report = report + reportMessages[i].chapterNotExist + ' 没有这个章! \n';

                                } else if(reportMessages[i].sectionNotExist) {

                                    report = report + reportMessages[i].sectionNotExist + ' 没有这个节! \n';

                                } else if(reportMessages[i].lessonNotExist) {

                                    report = report + reportMessages[i].lessonNotExist + ' 没有这个课! \n';

                                }
                            }

                            this.$message({
                                message: report,
                                type: 'warning'
                            });
                        }
                        // Author : GOD 2019-2-18 Bug ID: #784
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.resources = [];
                        this.total = 0;
                    }
                    this.listLoading = false;
                }).catch((res) => {
                    this.listLoading = false;
                    this.resources = [];
                    this.total = 0;

                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },
            getChapter(resource) {
                if (resource.subnaviInfos == null) return '';
                return resource.subnaviInfos.map(item => item.chapter).toString();
            },
            getSection(resource) {
                if (resource.subnaviInfos == null) return '';
                return resource.subnaviInfos.map(item => item.section).toString();
            },
            getlesson(resource) {
                if (resource.subnaviInfos == null) return '';
                return resource.subnaviInfos.map(item => item.lesson).toString();
            },
            getImportStatus: function(status) {
                if (status == "0") {
                    return "未导入";
                } else if (status == "1") {
                    return "已导入";
                }
                return "";
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getData();
            },
            // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
            // Modify Reason : Bug Number #491
            // Data Start : 2019-1-28 11:05 AM
            handlePageSizeChange(pageSize) {
                this.page_size = pageSize;
                this.getData();
            },
            // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
            // Data End : 2019-1-28 12:35 AM
            handleDel: function(index, row) {
                this.$confirm('确认删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    batchRemoveResources([row.contentid]).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.getData();
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                            this.listLoading = false;
                        }
                    }).catch((res) => {
                        this.listLoading = false;

                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
                });
            },
            getData() {
                let param = 
                {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page,
                        calTotal:true
                    },
                    conditions: [
                        {
                            fieldName: 'filename',
                            fieldValues: [
                                this.filters.filename
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'remarks',
                            fieldValues: [
                                this.filters.creatorname
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                    ]
                }

                if (this.filters.begin_time != '' && this.filters.end_time != '') {
                    if (new Date(this.filters.begin_time) > new Date(this.filters.end_time)) {
                        this.$message({
                            message: '查询结束时间不得大于开始时间。',
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

                if (this.filters.importstatus != '') {
                    param.conditions.push(
                        {
                            fieldName: 'importstatus',
                            fieldValues: [
                                this.filters.importstatus
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        }
                    );
                }

                this.listLoading = true;
                getDataListPage(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.resources = res.data.pageInfo.list;
                        this.page_total = res.data.pageInfo.list.length;
                        for (var i=0; i<this.resources.length; i++) {
                            if (this.resources[i].remarks == "" || this.resources[i].remarks == null)    
                                continue;
                            this.resources[i].remarks = JSON.parse(this.resources[i].remarks);    
                        }
                        this.total = res.data.pageInfo.total;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.resources = [];
                        this.total = 0;
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('section').width();
                    this.imageSize.height = $('section').height();
                }).catch((res) => {
                    this.resources = [];
                    this.total = 0;
                    this.listLoading = false;

                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            search() {
                this.page = 1;
                this.getData();
            },
            handleEdit: function (index, row) {
                this.$router.push('/import/detail/' + row.contentid);
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            batchRemove: function () {
                var ids = this.sels.map(item => item.contentid).toString().split(",");
                
                this.$confirm('confirmMsg', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    batchRemoveResources(ids).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.getData();
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                            this.listLoading = false;
                        }
                    }).catch((res) => {
                        this.listLoading = false;

                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
                }).catch(() => {
                });
            },
            uploadResInfo: function() {
                this.updateFormVisible = true;
                this.resourceIds = this.sels.map(item => item.contentid).toString().split(",");
            },
            updateSubmit: function() {
                let para = { contentids: this.resourceIds, importstatus: this.importStatus };

                this.editLoading = true;
                uploadResInfoApi(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.editLoading = false;
                        this.getData();
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.editLoading = false;
                    }
                    this.updateFormVisible = false;
                }).catch((res) => {
                    this.editLoading = false;

                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },
            downTemplate: function() {
                this.exportLoading = true;
                downloadTemplate().then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.templateUrl = res.data.responseEntity.downloadUrl;
                        this.ECRUtil.download(this.templateUrl);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.exportLoading = false;
                }).catch((res) => {
                    this.exportLoading = false;

                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },
            importTemplate: function() {
                document.getElementById("inputfile").click();
            }
        },
        created() {
            this.getData();
        }
    }

</script>

<style lang="scss" scoped>
    @import '~scss_vars';

    .el-select {
        width: 100%;
    }
    .el-input {
        width: 100%;
    }
</style>