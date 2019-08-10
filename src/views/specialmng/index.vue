<template>
	<section>
        <el-col :span="24" class="ecrm-search-title">
            <a class="selected">专题管理</a>
        </el-col>
        <input type="file" id="inputfile" @change="onSelectFile" hidden accept=".xls,.xlsx"></input>
        <el-col :span="24" style="padding: 20px;">
            <el-col :span="6">
            	<el-form label-width="80px">
                    <el-form-item label="学段:">
                        <el-select v-model="filters.schoolsectionid" @change="onSchoolSectionChange()">
                            <el-option label="全部" value=""></el-option>
                            <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in schoolSections" :key="idx" :data="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学科:">
                        <el-select v-model="filters.subjectid" @change="getNaviEditionTypeList()">
                            <el-option label="全部" value=""></el-option>
                            <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in subjects" :key="idx" :data="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="专题名称:">
                        <el-input v-model="filters.themename" placeholder="专题名称" style="width: 70%; margin-right: 20px;"></el-input>
                        <el-button type="primary" @click="getTheme(true)">查询</el-button>
                    </el-form-item>
                </el-form>
     <!-- Author : GOD
     Date Start : 2019-1-31 3 PM
     Reason : 系统管理 专题管理 Page Loading Speed, Select First Theme as Default -->
                <theme-tree
                    v-loading="treeLoading"
                    :data="themeData"
                    :tools="tools"
                    :openlevel="1"
                    :themeid="themeid"
                    ref="catalogTree"
                    @item-select="onTreeItemSelect"
                    @item-deselect="onTreeItemDeSelect"
                    @item-operate="onTreeItemOperate">
                </theme-tree>
    <!-- Author : GOD
    Date Start : 2019-1-31 3 PM
    Reason : 系统管理 专题管理 Page Loading Speed, Select First Theme as Default -->
            </el-col>
            <el-col :span="18" style="background: #f2f2f2;padding: 10px;">
                <el-form label-width="80px">
                    <el-col :span="8">
                        <el-form-item label="年级:" prop="grade">
                            <el-select v-model="filters.gradeid">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in grades" :key="idx" :data="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="版本:" prop="editiontype">
                            <el-select v-model="filters.editiontypeid" @change="getNaviBookModelList()">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in editionTypes" :key="idx" :data="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="册别:" prop="term">
                            <el-select v-model="filters.bookmodelid">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in bookModels" :key="idx" :data="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="资源类别:">
                            <el-select v-model="filters.contenttype">
                                <el-option label="全部" value=""></el-option>
                                <el-option :label="item.contentname" :value="item.contenttype" v-for="(item, idx) in contentTypes" :key="idx" :data="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="标题:">
                            <el-input v-model="filters.name" placeholder="标题" style="width: 70%; margin-right: 20px;"></el-input>                            
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="">                            
                            <el-button type="primary" @click="getResource">查询</el-button>
                        </el-form-item>
                    </el-col>                    
                </el-form>
            </el-col>
            <el-col :span="6">
            </el-col>
            <el-col :span="18">
                <el-col :span="24" style="margin: 0px 0px 10px 0px">
                    <el-button style="float:right;" type="table-op" size="small" :disabled="themeid==''" @click="goPage('/special_edit/' + (themeid==''?'0':themeid))">修改</el-button>
                    <el-button style="float: right; margin-right: 5px" type="table-op" size="small" @click="goPage('/special_add/' + (themeid==''?'0':themeid))">新增专题</el-button>
                    <el-button style="float: right; margin-right: 5px" type="table-op" size="small" @click="goPage('/special_add_res')">新增专题资源</el-button>
                    <el-button style="float: right; margin-right: 5px" type="table-op" size="small" :loading="exportLoading" :disabled="themeid==''" @click="exportToExcel">下载模板</el-button>
                    <el-button style="float: right; margin-right: 5px" type="table-op" size="small" :loading="importLoading" :disabled="themeid==''" @click="importFromExcel">导入专题资源关系</el-button>

                    <el-button style="float: left; margin-right: 5px" type="table-op" size="small" :disabled="themeid==''" @click="deleteTheme">删除专题</el-button>
                    <el-button style="float: left; margin-right: 5px" type="table-op" size="small" :disabled="themeid==''||sels.length==0" @click="deleteThemeRes">删除专题资源</el-button>
                </el-col>
                <el-col :span="24">
                    <img src="static/img/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="resources.length==0">
                    <el-table :data="resources" v-loading="listLoading" @selection-change="selsChange" v-if="resources.length>0">
                        <el-table-column type="selection" width="55" align="center">
                        </el-table-column>
                        <el-table-column prop="contentid" label="资源ID" align="center">
                        </el-table-column>
                        <el-table-column label="资源类型" align="center" :formatter="formatContentType">
                        </el-table-column>
                        <el-table-column prop="name" label="标题" align="center">
                        </el-table-column>
                        <el-table-column prop="schoolsection" label="学段" align="center">
                        </el-table-column>
                        <el-table-column prop="grade" label="年级" align="center">
                        </el-table-column>
                        <el-table-column prop="subject" label="学科" align="center">
                        </el-table-column>
                        <el-table-column prop="lastupdatetime" label="最后修改时间" align="center">
                        </el-table-column>
                    </el-table>
                    <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
                        <my-pagination @current-change="handleCurrentChange" @pgSize-change="handlePageSizeChange" :page="page" :page-size="page_size" :total="total" :pagetotal="page_total"></my-pagination>
                    </el-col>
                </el-col>
            </el-col>
        </el-col>
        <el-dialog title="生成" v-model="hiddenUI" :close-on-click-modal="false" v-if="editForm!=null">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="专题名称:" >
                            <el-input type="text" v-model="editForm.themename"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="hiddenUI = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="addLoading">生成</el-button>
            </div>
        </el-dialog>
	</section>
</template>
<script>
	import ECRUtil from '../../common/js/util'
    import { CONTENT_TYPE } from '../../common/js/const';
	import { getSchoolSectionList, getSubjectList, getThemeList, getNaviGradeList, getNaviEditionTypeList, getNaviBookModelList, getThemeResourceList, removeTheme, exportThemeToExcel, importFromExcel, removeThemeRes, getResource } from '../../api/api';
	export default {
		data() {
			return {
				ECRUtil: ECRUtil,
				filters: {
                    schoolsectionid: '',
                    subjectid: '',
                    editiontypeid: '',
                    bookmodelid: '',
                    gradeid: '',
                    // creatorname: '',
                    themename: '',
                    name: '',
                    contenttype: ''
                },
                schoolSections: [],
                subjects: [],
                grades: [],
                editionTypes: [],
                bookModels: [],
                contentTypes: CONTENT_TYPE,
                /////////// Pagination ///////////
                total: 0,
                page: 1,
                page_size: 5,
                page_total: 0,
                /////////// Pagination End ////////
                sels: [],
                listLoading: false,
                treeLoading: false,
                addLoading: false,
                exportLoading: false,
                importLoading: false,
                resources: [],
                themeData: [
                    {
                        children:[]
                    }
                ],
                tools: [
                ],
                selectedThemeItem: null,
                hiddenUI: false,
                themeid: '',
                editForm: null,
                editFormRules: [],
                imageSize: {
                    width: 0,
                    height: 0
                },
    //             Author : GOD
    //  Date Start : 2019-1-31 3 PM
    //  Reason : 系统管理 专题管理 Page Loading Speed, Select First Theme as Default
                initial: 0
                // Author : GOD
    // Date End : 2019-2-1 6 PM
    // Reason : 系统管理 专题管理 Page Loading Speed, Select First Theme as Default
			}
		},
		methods: {
            formatContentType(row, col) {
                for (var i=0;i<this.contentTypes.length; i++) {
                    if (this.contentTypes[i].contenttype == row.contenttype)
                        return this.contentTypes[i].contentname;
                }
            },
			getSchoolSectionList() {
                getSchoolSectionList({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.schoolSections = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.schoolSections = [];
                    }
                });
            },
			onSchoolSectionChange() {
                this.filters.subjectid = '';
                this.filters.gradeid = '';
                this.filters.editiontypeid = '';
                this.filters.bookmodelid = '';
                if (this.filters.schoolsectionid == "") {
                    this.subjectlist = [];
                    this.gradelist = [];
                    this.editiontypelist = [];
                    this.bookmodellist = [];
                } else {
                    this.getSubjectList();
                    this.getNaviGradeList();
                }
            },
            getSubjectList() {
                let param = {
                    schoolsectionid: this.filters.schoolsectionid
                };
                getSubjectList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.subjects = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        this.filters.subjectid = '';
                    } else {
                        this.subjects = [];
                    }
                });
            },
            getNaviEditionTypeList() {
                this.filters.editiontypeid = '';

                if (this.filters.subjectid == "") {
                    this.editiontypelist = [];
                    this.bookmodellist = [];
                } else {
                    let param = {
                        schoolsectionid: this.filters.schoolsectionid,
                        subjectid: this.filters.subjectid
                    };
                    getNaviEditionTypeList(param).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.editionTypes = ECRUtil.composeSysDict(res.data.pageInfo.list);
                            this.filters.editiontypeid = '';
                        } else {
                            this.editionTypes = [];
                        }
                    });
                }
            },
            getNaviGradeList() {
                let param = {
                    schoolsectionid: this.filters.schoolsectionid
                };
                getNaviGradeList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.grades = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        this.filters.gradeid = '';
                    } else {
                        this.grades = [];
                    }
                });
            },
            getNaviBookModelList() {
                this.filters.bookmodelid = '';

                if (this.filters.editiontypeid == "") {
                    this.bookmodellist = [];
                } else {
                    let param = {
                        schoolsectionid: this.filters.schoolsectionid,
                        subjectid: this.filters.subjectid,
                        editiontypeid: this.filters.editiontypeid
                    };
                    getNaviBookModelList(param).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.bookModels = ECRUtil.composeSysDict(res.data.pageInfo.list);
                            this.filters.bookmodelid = '';
                        } else {
                            this.bookModels = [];
                        }
                    });    
                }
            },
			goPage(url) {
                this.$router.push(url);
			},
			handleCurrentChange(val) {
                this.page = val;
                this.getResource();
            },
            // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
            // Modify Reason : Bug Number #491
            // Data Start : 2019-1-28 11:05 AM
            handlePageSizeChange(pageSize) {
                this.page_size = pageSize;
                this.getResource();
            },
            // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
            // Data End : 2019-1-28 12:35 AM
            selsChange: function (sels) {
                this.sels = sels;
            },
            // Author : GOD, 2019-2-18 Bug ID: #816
            getTheme(byuser = false) {
                var param = {
                    "conditions":
                    [
                        {
                            "fieldName":"parentthemeid",
                            "fieldValues":["0"],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName":"themename",
                            "fieldValues":[this.filters.themename],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName":"schoolsection",
                            "fieldValues":[this.filters.schoolsectionid],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName":"subjectid",
                            "fieldValues":[this.filters.subjectid],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        }
                    ]
                };
                if(byuser && this.filters.themename != '') {
                    param.conditions[0].fieldValues = [""];
                } else {
                    param.conditions[0].fieldValues = ["0"];
                }
                // Author : GOD, 2019-2-18 Bug ID: #816
                this.treeLoading = true;
                getThemeList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.themeData[0].children = res.data.pageInfo.list;
                        var list = Object.keys(this.themeData[0].children);
                        for(var i=0;i<this.themeData[0].children.length;i++){
                            this.themeData[0].children[i].themelevel = list[i];
                        }
    // Author : GOD
    // Date Start : 2019-1-31 3 PM
    // Reason : 系统管理 专题管理 Page Loading Speed, Select First Theme as Default
                        if(this.initial == 0) {
                            this.themeid = this.themeData[0].children[0].themeData.themeid;
                            this.getResource();
                            this.initial = 1;
                        }
    // Author : GOD
    // Date End : 2019-2-1 6 PM
    // Reason : 系统管理 专题管理 Page Loading Speed, Select First Theme as Default
                    } else {
                        this.themeData[0].children = [];
                    }
                    this.treeLoading = false;
                }).catch((res) => {
                    this.themeData[0].children = [];
                    this.treeLoading = false;

                });
            },
            onTreeItemSelect(target, model) {
                // this.selectedThemeItem = model;
                // Author : GOD
    // Date Start : 2019-1-31 3 PM
    // Reason : 系统管理 专题管理 Page Loading Speed, Select First Theme as Default
                this.themeid = model.themeData.themeid;
                // Author : GOD
    // Date End : 2019-2-1 6 PM
    // Reason : 系统管理 专题管理 Page Loading Speed, Select First Theme as Default
                this.getResource();
            },
            onTreeItemDeSelect(target, model) {
                this.themeid = '';
            },
            onTreeItemOperate(target, level, parent, model, opIdx) {
            },
            deleteTheme() {
                this.$confirm('确认删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    removeTheme(this.themeid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.getTheme();
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                        }
                    }).catch((res) => {
                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
                });
            },
            deleteThemeRes() {
                var res = [];
                var resIds = this.sels.map(item => item.contentid).toString().split(",");
                for (var i=0;i<resIds.length;i++){
                    res.push({'themeid': this.themeid, "resourceno": resIds[i]});
                }
                this.$confirm('确认删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    removeThemeRes(res).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.themeid = '';
                            this.getResource();
                        } else if (res.data.responseEntity == -1) {
                            this.$message({
                                message: '资源重复!',
                                type: 'error'
                            });
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                        }
                    }).catch((res) => {
                        this.$message({
                            message: '加载失败!',
                            type: 'error'
                        });
                    });
                });
            },
            editSubmit() {

            },
            getResource() {
                var param = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page
                    },
                    conditions:[
                        {
                            "fieldName":"themeids",
                            "fieldValues":[this.themeid==''?'':this.themeid],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName":"schoolsectionid",
                            "fieldValues":[this.filters.schoolsectionid],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName":"subjectid",
                            "fieldValues":[this.filters.subjectid],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName":"gradeid",
                            "fieldValues":[this.filters.gradeid],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName":"bookmodelid",
                            "fieldValues":[this.filters.bookmodelid],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName":"contenttype",
                            "fieldValues":[this.filters.contenttype],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        // {
                        //     "fieldName":"creatorname",
                        //     "fieldValues":[this.filters.creatorname],
                        //     "prepender":null,
                        //     "operator":"EQUAL",
                        //     "childConditions":null
                        // },
                        {
                            "fieldName":"name",
                            "fieldValues":[this.filters.name],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                        {
                            "fieldName": 'isgoods',
                            "fieldValues": [
                                '1'
                            ],
                            "prepender": null,
                            "operator": 'EQUAL',
                            "childCondtions": null
                        }
                    ]
                };
                this.listLoading = true;
                getThemeResourceList(param).then((res) => {
                    if(res.data.serverResult.resultCode == "200") {
                        this.resources = res.data.pageInfo.list;
                        this.total = res.data.pageInfo.total;
                        this.page_total = res.data.pageInfo.list.length;
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
                    this.listLoading = false;
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                    this.resources = [];
                    this.total = 0;
                })
            },
            exportToExcel() {
                var param = {
                    conditions: [
                        {
                            "fieldName":"themeid",
                            "fieldValues":[this.themeid],
                            "prepender":null,
                            "operator":"EQUAL",
                            "childConditions":null
                        },
                    ]
                };
                this.exportLoading = true;
                exportThemeToExcel(param).then((res) => {
                    if(res.data.serverResult.resultCode == "200") {
                        this.ECRUtil.download(res.data.responseEntity.downloadUrl);
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
            importFromExcel() {
                document.getElementById("inputfile").click();
            },
            onSelectFile: function(e) {
                if (e.target.files.length == 0) return;
                var selectedFile = e.target.files[0];
                const data = new FormData();
                data.append('themeresfile', selectedFile);

                this.importLoading = true;
                importFromExcel(data).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                    } else if (res.data.responseEntity == -1) {
                        this.$message({
                            message: '资源重复!',
                            type: 'error'
                        });
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.importLoading = false;
                }).catch((res) => {
                    this.importLoading = false;
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },
		},
		created() {
            // Author : GOD
    // Date Start : 2019-1-31 3 PM
    // Reason : 系统管理 专题管理 Page Loading Speed, Select First Theme as Default
			this.getSchoolSectionList();
            this.getSubjectList();
            this.getTheme();
            // Author : GOD
    // Date End : 2019-2-1 6 PM
    // Reason : 系统管理 专题管理 Page Loading Speed, Select First Theme as Default
		},
		mounted() {

		}
	}
</script>
<style lang="scss" scoped>
    @import '~scss_vars';
    
</style>