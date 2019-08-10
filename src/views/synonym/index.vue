<template>
    <section>
        <el-col :span="24" class="ecrm-search-title">
            <a class="selected">同义词管理</a>
        </el-col>

        <el-col :span="24" class="ecrm-content-panel">
            <!-- Filter Panel -->

            <el-form label-width="100px">
            	<el-col :span="6">
                    <el-form-item label="原始词:">
                        <el-input v-model="filters.original"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="同义词:">
                        <el-input v-model="filters.synonym" placeholder="请输入同义词名称" style="width:calc(100% - 65px)" @keyup.enter.native="search"></el-input>
                        <el-button type="primary" v-on:click="search" id="searchBtn">查询</el-button>
                    </el-form-item>
                </el-col>
            </el-form>

            <!-- Filter Panel End -->

            <!-- Batch Operation Panel -->

            <el-col :span="24" style="margin-bottom:10px;text-align:right;">
            	<el-button type="table-op" size="small" @click="doInsert">追加</el-button>
                <el-button type="table-op" size="small" :disabled="this.sels.length==0" @click="doBatchRemove">批量删除</el-button>
            </el-col>

            <!-- Batch Operation Panel End -->

            <!-- Data Table -->
            <img src="static/img/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="resources.length==0">
            <el-table :data="resources" v-loading="listLoading" @selection-change="selsChange" v-if="resources.length>0">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="original" label="原始词" align="center">
                </el-table-column>
                <el-table-column prop="synonym" label="同义词" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="synonym">
                        <el-button size="small" @click="doEdit(synonym.$index, synonym.row)" style="margin:0px">修改</el-button>
                        <el-button size="small" @click="doDelete(synonym.$index, synonym.row)" style="margin:0px">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
                <my-pagination @current-change="handleCurrentChange" @pgSize-change="handlePageSizeChange" :page="page" :page-size="page_size" :total="total" :pagetotal="page_total"></my-pagination>
            </el-col>

            <!-- Data Table End -->

            <el-dialog title="追加" v-model="createFormVisible" :close-on-click-modal="false">
	            <el-form :model="createForm" label-width="100px" :rules="createFormRules" ref="createForm">
	                <el-row>
	                    <el-col :span="10">
	                        <el-form-item label="原始词:" class="is-required" prop="original">
	                            <el-input v-model="createForm.original"></el-input>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	                <el-row>
	                    <el-col :span="10">
	                        <el-form-item label="同义词:" class="is-required" prop="synonym">
	                            <el-input v-model="createForm.synonym"></el-input>
	                        </el-form-item>
	                    </el-col>
	                </el-row>
	            </el-form>
	            <div slot="footer" class="dialog-footer">
	                <el-button @click.native="createFormVisible = false">取消</el-button>
	                <el-button type="primary" @click.native="createSubmit" :loading="addLoading">生成</el-button>
	            </div>
        	</el-dialog>
        </el-col>

        <el-dialog title="修改" v-model="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="原始词:" class="is-required" prop="original">
                                <el-input v-model="editForm.original"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="同义词:" class="is-required" prop="synonym">
                                <el-input v-model="editForm.synonym"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
                </div>
            </el-dialog>
        </el-col>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util'
    import { getList, batchRemoveResources, insert, remove, modify } from '../../api/api';

    export default {
        data() {
            return {
                FRONTEND_CONTEXT: FRONTEND_CONTEXT,
                filters: {
                	original: '',
                	synonym: ''
                },
                ////////// Filter Data /////////////
                /////////// Filter Data End //////////
                resources: [],

                /////////// Pagination ///////////
                total: 0,
                page: 1,
                page_size: 5,
                page_total: 0,
                /////////// Pagination End ////////

				/////////// CreateForm ///////////
				createFormVisible: false,
				createForm: {
					original: '',
					synonym: ''
				},
				createFormRules : {
					original: [
                        { required: true, message: '请输入原始', trigger: 'blur' },
                    ],
                    synonym: [
                        { required: true, message: '请输入同义', trigger: 'blur' },
                    ]
				},
				/////////// CreateForm End ////////   

                /////////// EditForm ///////////
                editFormVisible: false,
                editForm: {
                    original: '',
                    synonym: ''
                },
                editFormRules : {
                    original: [
                        { required: true, message: '请输入原始', trigger: 'blur' },
                    ],
                    synonym: [
                        { required: true, message: '请输入同义', trigger: 'blur' },
                    ]
                },
                /////////// EidtForm End ////////   
                editSynid: '',            
                resourceIds: [],
                addLoading: false,
                listLoading: false,
                sels: [], //列表选中列
                imageSize: {
                    width: 0,
                    height: 0
                }
                
            }
        },
        computed: {},
        methods: {
            formatGoodsStatus(isgoods) {
                if (isgoods == "1") {
                    return "已生成";
                } else if (isgoods == "0") {
                    return "未生成";
                }
                return "";
            },
            getResources() {
                let param = 
                    {
                        pagination:{
                            numPerPage:this.page_size,
                            pageNo:this.page,
                            calTotal:true
                        },
                        conditions: [
                            {
                                fieldName: 'original',
                                fieldValues: [
                                    this.filters.original
                                ],
                                prepender: null,
                                operator: 'EQUAL',
                                childCondtions: null
                            },
                            {
                                fieldName: 'synonym',
                                fieldValues: [
                                    this.filters.synonym
                                ],
                                prepender: null,
                                operator: 'EQUAL',
                                childCondtions: null
                            }
                        ]
                    };

                this.listLoading = true;
                getList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.total = res.data.pageInfo.total;
                        this.resources = res.data.pageInfo.list;
                        this.page_total = res.data.pageInfo.list.length;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.total = 0;
                        this.resources = [];
                    }
                    this.listLoading = false;
                    this.imageSize.width = $('section').width();
                    this.imageSize.height = $('section').height();
                }).catch(() => {
                    this.total = 0;
                    this.resources = [];
                    this.listLoading = false;

                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getResources();
            },
            // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
            // Modify Reason : Bug Number #491
            // Data Start : 2019-1-28 11:05 AM
            handlePageSizeChange(pageSize) {
                this.page_size = pageSize;
                this.getResources();
            },
            // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
            // Data End : 2019-1-28 12:35 AM
            selsChange: function (sels) {
                this.sels = sels;
            },
            doBatchRemove() {
                this.$confirm('是否批量删除过该同义词？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let param = { synids: this.sels.map(item => item.synid) };
                    this.listLoading = true;
                    remove(param).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.getResources();
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                            this.listLoading = false;
                        }
                    }).catch(() => {
                        this.listLoading = false;

                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
                }).catch(() => {
                });
            },
            doInsert() {
                this.createForm.original = '';
                this.createForm.synonym = '';
            	this.createFormVisible = true;
            },
            createSubmit() {
                this.$refs.createForm.validate((valid) => {
                    if (valid) {
                        let para = { 
                            original: this.createForm.original,
                            synonym: this.createForm.synonym
                        };
                        this.addLoading = true;
                        insert(para).then((res) => {
                            if (res.data.serverResult.resultCode == "200") {
                                this.getResources();
                            } else {
                                this.$message({
                                    message: res.data.serverResult.resultMessage,
                                    type: 'error'
                                });
                            }
                            this.addLoading = false;
                            this.createFormVisible = false;
                        }).catch(() => {
                            this.addLoading = false;

                            this.$message({
                                message: '操作失败',
                                type: 'error'
                            });
                        });
                    }
                });
            },
            editSubmit() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        let para = { 
                            synid: this.editSynid,
                            original: this.editForm.original,
                            synonym: this.editForm.synonym
                        };
                        this.addLoading = true;
                        modify(para).then((res) => {
                            if (res.data.serverResult.resultCode == "200") {
                                this.getResources();
                            } else {
                                this.$message({
                                    message: res.data.serverResult.resultMessage,
                                    type: 'error'
                                });
                            }
                            this.addLoading = false;
                            this.editFormVisible = false;
                        }).catch(() => {
                            this.addLoading = false;

                            this.$message({
                                message: '操作失败',
                                type: 'error'
                            });
                        });
                    }
                });
            },
            doEdit(index, synonym) {
                this.editSynid = synonym.synid;
                this.editFormVisible = true;
                this.editForm = JSON.parse(JSON.stringify(synonym));
            },
            doDelete(index, synonym) {
                let param = {
                    synids: [synonym.synid]
                }
                this.$confirm('是否删除当前同义词？', '提示', {
                    type: 'warning'
                }).then(() => {
                    remove(param).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.getResources();
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                        }
                    }).catch(() => {
                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
                });
            },
            search() {
                this.page = 1;
                this.getResources();
            }
        },
        created() {
            this.getResources();
        }
    }
</script>

<style lang="scss" scoped>
    @import '~scss_vars';
    
    .el-input, .el-select {
        width: 100%;
    }
    .cell .el-select {
        width: auto;
    }
</style>