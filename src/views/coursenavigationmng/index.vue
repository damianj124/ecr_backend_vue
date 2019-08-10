<template>
    <section>
        <el-col>
            <el-col :span="24" class="ecrm-search-title">
                <a class="selected">学科导航管理</a>
            </el-col>
            <el-col :span="24" style="padding-top: 50px;">
                <el-col :span="7" v-loading="listLoading">
                    <my-tree
                        :data="naviList"
                        :tools="tools"
                        :openlevel="0"
                        @item-select="onTreeItemSelect"
                        @item-operate="onTreeItemOperate">
                    </my-tree>
                </el-col>
                <el-col :span="14" style="margin-left: 100px;">
                    <el-form :inline="true" v-if="isSubject">
                        <el-form-item>
                            <el-select placeholder="版本类型" filterable v-model="editiontypeid">
                                <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in editiontypelist" :key="idx" :data="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="addEditionType">添加版本</el-button>
                            </el-form-item>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true" v-if="isEditionType">
                        <el-form-item>
                            <el-select placeholder="册别类型" filterable v-model="bookmodelid">
                                <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in bookmodellist" :key="idx" :data="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="addBookModel" :loading="addLoading">添加册别</el-button>
                            </el-form-item>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-col>
        </el-col>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util';
    import { getNavigationTree, addCoursenNavigation, getBookModelList, getEditionTypeList, deleteCoursenNavigation } from '../../api/api';

    export default {
        data() {
            return {
                tools: [
                    {
                        class:'ecrm-tabl-level-sub',
                        level:2
                    }
                ],
                addLoading: false,
                naviList:[],
                parentidlist:[],
                listLoading: false,
                editiontypeid:'',
                bookmodelid:'',

                subjectid:'',
                schoolsectionid:'',
                isSubject: false,
                isEditionType: false,

                editiontypelist:[],
                bookmodellist:[],
            }
        },
        methods: {
            load() {
                this.listLoading = true;
                getNavigationTree().then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.naviList = res.data.pageInfo.list;
                    } else {
                        this.naviList = [];

                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.listLoading = false;
                }).catch(() => {
                    this.naviList = [];
                    this.listLoading = false;
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });

                getBookModelList({ lang: 'zh_CN' }).then((res) =>{
                    if (res.data.serverResult.resultCode == "200") {
                        this.bookmodellist = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.bookmodellist = [];
                    }
                }).catch(() => {
                    this.bookmodellist = [];
                });

                getEditionTypeList({ lang: 'zh_CN' }).then((res) =>{
                    if (res.data.serverResult.resultCode == "200") {
                        this.editiontypelist = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.editiontypelist = [];
                    }
                }).catch(() => {
                    this.editiontypelist = [];
                });
            },
            search() {

            },
            onTreeItemSelect(target, model) {
                if (model.parent == null) {
                    this.isSubject = false;
                    this.isEditionType = false;
                } else if (model.parent.parent == null) {
                    this.isSubject = true;
                    this.isEditionType = false;
                    this.schoolsectionid = model.parent.dictItem.dictvalue;
                    this.subjectid = model.dictItem.dictvalue;
                } else if (model.parent.parent.parent == null) {
                    this.isSubject = false;
                    this.isEditionType = true;
                    this.schoolsectionid = model.parent.parent.dictItem.dictvalue;
                    this.subjectid = model.parent.dictItem.dictvalue;
                    this.editiontypeid = model.dictItem.dictvalue;
                } else {
                    this.isSubject = false;
                    this.isEditionType = false;
                }

            },
            onTreeItemOperate(target, level, parent, model, opIdx) {
                if (opIdx == 0) {
                    this.parentidlist = this.getParentIdList(model , []).reverse();
                    if (this.parentidlist.length == "4") {
                        let para = {
                            schoolsectionid: this.parentidlist[0].id,
                            bookmodelid: this.parentidlist[3].id,
                            subjectid: this.parentidlist[1].id,
                            editiontypeid: this.parentidlist[2].id
                        };
                        this.deleteNavi(para);
                    } else if(this.parentidlist.length == "3") {
                        let para = {
                            schoolsectionid: this.parentidlist[0].id,
                            subjectid: this.parentidlist[1].id,
                            editiontypeid: this.parentidlist[2].id
                        };
                        this.deleteNavi(para);
                    } else if(this.parentidlist.length == "2") {
                        let para = {
                            schoolsectionid: this.parentidlist[0].id,
                            subjectid: this.parentidlist[1].id,
                        };
                        this.deleteNavi(para);
                    } else if(this.parentidlist.length == "1") {
                        let para = {
                            schoolsectionid: this.parentidlist[0].id,
                        };
                        this.deleteNavi(para);
                    }                
                }

            },
            deleteNavi: function(para) {
                this.$confirm('是否删除这个学科导航吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteCoursenNavigation(para).then((res) =>{
                        if(res.data.serverResult.resultCode == "200") {
                            this.load();
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
            addBookModel() {
                let para = {
                    schoolsectionid:this.schoolsectionid,
                    subjectid:this.subjectid,
                    editiontypeid:this.editiontypeid,
                    bookmodelid: this.bookmodelid
                };

                this.addLoading = true;
                addCoursenNavigation(para).then((res) => {
                    this.load();
                    this.addLoading = false;
                }).catch(() => {
                    this.addLoading = false;
                });
            },
            addEditionType() {
                let para = {
                    schoolsectionid:this.schoolsectionid,
                    subjectid:this.subjectid,
                    editiontypeid:this.editiontypeid
                };

                this.addLoading = true;
                addCoursenNavigation(para).then((res) => {
                    this.load();
                    this.addLoading = false;
                }).catch(() => {
                    this.addLoading = false;
                });
            },
            getParentIdList: function(node, thread) {
                if (node.parent != null) {
                    thread.push({ label: node.dictItem.dictname, id: node.dictItem.dictvalue });
                    thread = this.getParentIdList(node.parent, thread);
                } else {
                    thread.push({ label: node.dictItem.dictname, id: node.dictItem.dictvalue });
                }
                return thread;
            }
        },
        created() {
            this.load();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>