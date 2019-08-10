<template>
    <section>
        <el-col>
            <el-col :span="24" class="ecrm-search-title">
                <a class="selected">标签管理</a>
            </el-col>
            <el-col :span="24" style="padding-top: 50px;">
                <el-form :inline="true" >
                    <el-form-item>
                        <el-input type="text" placeholder="请输入内容" v-model="labelFilter.labelname" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="24">
                <el-col :span="7" v-loading="listLoading">
                    <label-tree
                        :data="labelData"
                        :tools="tools"
                        :openlevel="1"
                        ref="catalogTree"
                        @item-select="onTreeItemSelect"
                        @item-operate="onTreeItemOperate">
                    </label-tree>
                </el-col>
                <el-col :span="14" style="margin-left: 100px;" v-if="hiddenUI">
                    <el-form label-width="80px">
                        <el-form-item label="标签名称 :" style="width: 50%;">
                            <el-input v-model="editForm.labelname"></el-input>
                        </el-form-item>
                        <el-form-item label="标签封面 :" style="width: 50%">
                            <input type="file" id="labelthumb" @change="readThumb(editForm.labelthumb)" style="display:none" accept=".png,.jpg"/>
                            <img :src="editForm.labelthumb.blobfile" class="ecrm-upload-image" @click="openThumbFile"/>
                            <div>
                                <el-button type="small" style="width: 80px; margin-top: 30px;" @click="openThumbFile">上传</el-button><br>
                                <el-button type="small" style="width: 80px;" @click="clearThumbFile(editForm.labelthumb)">清空</el-button>
                            </div>
                        </el-form-item>
                        <!---------- author: han --------->
                        <el-form-item label="积分:" style="width: 30%;" v-if="hasHighResource">
                            <el-input-number v-model="editForm.score" :min="1" :max="99999"></el-input-number>
                        </el-form-item>
                        <!---------- end: han --------->
                    </el-form>
                    
                    <el-form :inline="true" label-width="80px">
                        <el-form-item label="排队方式 :">
                            <el-select placeholder="排队方式" v-model="editForm.sortmethod">
                                <el-option label="手动" value="0"></el-option>
                                <el-option label="自动" value="1"></el-option>
                            </el-select>
                        </el-form-item><br>
                        <el-form-item label="标签类型 :">
                            <el-select placeholder="标签类型" v-model="editForm.labeltype" :disabled="hasParent" @change="getTypeValue">
                                <el-option label="门户目录类" value="1"></el-option>
                                <el-option label="门户栏目类" value="2"></el-option>
                                <el-option label="banner类型" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="标签属性 :" v-if="!hasBanner">
                            <el-select placeholder="标签属性" v-model="editForm.labelpro" :disabled="hasParent">
                                <el-option label="精品学堂" value="1"></el-option>
                                <el-option label="优秀课例资源包" value="2"></el-option>
                            </el-select>
                        </el-form-item><br>
                    </el-form>

                    <el-form ref="Form" :model="propertyForm" label-width="80px" v-if="hasHighResource">
                        <el-form-item label="属性 :">
                            <el-col :span="4">
                                <el-select @change="onChangeSchoolSection" v-model="propertyForm.schoolsectionid" placeholder="学段">
                                    <el-option :value="item.dictvalue" :label="item.dictname" v-for="(item , idx) in schoolsectionList" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="4" style="margin-left: 10px;">
                                <el-select @change="getNaviEditionTypeList" v-model="propertyForm.subjectid" placeholder="学科">
                                    <el-option :value="item.dictvalue" :label="item.dictname" v-for="(item , idx) in subjectList" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="4" style="margin-left: 10px;">
                                <el-select v-model="propertyForm.gradeid" placeholder="年级">
                                    <el-option :value="item.dictvalue" :label="item.dictname" v-for="(item , idx) in gradeList" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="4" style="margin-left: 10px;">
                                <el-select @change="getNaviBookModelList" v-model="propertyForm.editiontypeid" placeholder="版本">
                                    <el-option :value="item.dictvalue" :label="item.dictname" v-for="(item , idx) in editionTypeList" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="4" style="margin-left: 10px;">
                                <el-select v-model="propertyForm.bookmodelid" placeholder="册别">
                                    <el-option :value="item.dictvalue" :label="item.dictname" v-for="(item , idx) in bookModelList" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="学校 :">
                            <el-col :span="4">
                                <el-select v-model="filters.areaids[0]" @change="onChangeArea()" class="areaselect">
                                    <el-option
                                        :label="item.areaname"
                                        :value="item.areaid"
                                        v-for="(item, idx) in areas"
                                        :key="idx"
                                        :data="item"
                                    ></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="4" style="margin-left: 10px;">
                                <el-select v-model="filters.areaids[1]" @change="onChangeCity()" class="areaselect">
                                    <el-option label="全部" value></el-option>
                                    <el-option
                                        :label="item.areaname"
                                        :value="item.areaid"
                                        v-for="(item, idx) in cities"
                                        :key="idx"
                                        :data="item"
                                    ></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="4" style="margin-left: 10px;">
                                <el-select v-model="filters.areaids[2]" @change="onChangeCountry()" class="areaselect">
                                    <el-option label="全部" value></el-option>
                                    <el-option
                                        :label="item.areaname"
                                        :value="item.areaid"
                                        v-for="(item, idx) in countries"
                                        :key="idx"
                                        :data="item"
                                    ></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8" style="margin-left: 10px;">
                                <el-select v-model="propertyForm.schoolid" filterable v-loading="schoolLoading">
                                    <el-option
                                        :label="item.orgName"
                                        :value="item.orgId"
                                        v-for="(item, idx) in schoolList"
                                        :key="idx"
                                    ></el-option>
                                </el-select>
                                <!-- <v-select
                                    v-model="propertyForm.schoolid"
                                    :options="schoolList"
                                    label="orgName"
                                    value="orgId"
                                    filterable
                                    maxHeight="300px"
                                    class="schoolselection"
                                ></v-select> -->
                            </el-col>
                        </el-form-item>
                    </el-form>
                    <el-form style="margin-left: 100px;">
                        <el-form-item label=" ">
                            <el-button type="primary" @click="onSaveLabel">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-col>
        </el-col>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util';
    import Vue from 'vue';
    import { addLabel , editLabel , deleteLabel , getLabelTree , getLabelList, uploadFile , getTeachCatalogList, moveLabel, getSchoolSectionList, getSubjectList, getNaviGradeList, getNaviBookModelList, getNaviEditionTypeList, getSchoolList, getEcoSchoolList, getAreasByParent, getEcoOrgInfo} from '../../api/api';
import { getParentAreaId } from '../../../../frontend/src/api/api';
import importVue from '../resourceupload/import.vue';
    
    export default {
        data() {
            return {
                bModelChange: false,
                labelFilter: {
                    labelname: ''
                },
                labelData:[
                    {
                        label:"门户目录类",
                        children:[],
                        labelData:{
                            labeltype: 1,
                            parentlabelid: '-1'
                        }
                    },
                    {
                        label:"门户栏目类",
                        children:[],
                        labelData:{
                            labeltype: 2,
                            parentlabelid: '-1'
                        }
                    },
                    {
                        label:"banner类型",
                        children:[],
                        labelData:{
                            labeltype: 4,
                            parentlabelid: '-1'
                        }
                    }
                ],
                tools: [
                    {
                        class:'ecrm-tabl-level-edit',
                        level:1
                    },
                    {
                        class:'ecrm-tabl-level-add',
                        level:0
                    },
                    {
                        class:'ecrm-tabl-level-sub',
                        level:1
                    },
                    {
                        class:'ecrm-tabl-level-move',
                        level:1
                    }
                ],

                editForm: {
                    labelid:'',
                    labelname:'',
                    labeltype:'',
                    labelpro:'',
                    businesstype:'',
                    score: 0, //--- author:han-------
                    sortmethod: '',
                    labelthumb: {
                        blobfile: '',
                        file: null
                    },
                },

                propertyForm: {
                    schoolsectionid:'',
                    subjectid:'',
                    gradeid:'',
                    bookmodelid:'',
                    editiontypeid:'',
                    schoolid:'',
                },

                filters: {
                    areaids: ["110000", //areaid - Beijing
                                "",     //cityid
                                ""],     //countryid
                    tmp_areaids:["","",""],
                    orgname: ""
                },
                areas: [],
                cities: [],
                countries: [],
                schoolsectionList:[],
                subjectList:[],
                gradeList:[],
                editionTypeList:[],
                bookModelList:[],
                schoolList:[],

                hasParent: false,
                hasBanner: true,
                hasHighResource: false,
                listLoading: false,
                schoolLoading: false,
                listCount: 0,
                editLoading: false,
                hiddenUI: false,

                selectedImagePath: '',
                selectedLabelItem:[],
                fromId:null
            }
        },
        watch: {
            'propertyForm.schoolsectionid': function () {
                this.getSubjectList();
                this.getNaviGradeList();
            },
        },
        methods: {
            openThumbFile() {
                document.getElementById('labelthumb').click();
            },
            clearThumbFile(labelthumb) {
                if (labelthumb != null) {
                    labelthumb.file = null;
                    labelthumb.blobfile = '';
                }
                document.getElementById('labelthumb').value = null;
            },
            readThumb(labelthumb) {
                var input = document.getElementById('labelthumb');
                var reader = new FileReader();

                reader.onload = function (e) {
                    labelthumb.blobfile = e.target.result;
                }
                labelthumb.file = input.files[0];
                if (!labelthumb.file.type.startsWith("image")) {
                    this.$message({
                        message: '只能支持图片格式。',
                        type: 'error'
                    });
                    return;
                }
                reader.readAsDataURL(labelthumb.file);
            },
            getList() {
                let para1 = {
                    conditions:[
                        {
                            fieldName: "labeltype",
                            fieldValues: ["1"],
                            prepender: null,
                            operator: "EQUAL",
                            childConditions: null
                        },
                        {
                            fieldName: "parentlabelid",
                            fieldValues: ["0"],
                            prepender: null,
                            operator: "EQUAL",
                            childConditions: null
                        },
                        {
                            fieldName: "labelname",
                            fieldValues: [this.labelFilter.labelname],
                            prepender: null,
                            operator: "EQUAL",
                            childConditions: null
                        }
                    ]
                };

                this.listLoading = true;
                this.listCount = 0;

                getLabelList(para1).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.labelData[0].children = res.data.pageInfo.list;
                    } else {
                        message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.labelData[0].children = [];
                    }
                    this.listCount += 1;
                    if (this.listCount == 3) this.listLoading = false;
                }).catch(() => {
                    this.listCount += 1;
                    if (this.listCount == 3) this.listLoading = false;
                    this.labelData[0].children = [];

                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });

                let para2 = {
                    conditions:[
                        {
                            fieldName: "labeltype",
                            fieldValues: ["2"],
                            prepender: null,
                            operator: "EQUAL",
                            childConditions: null
                        },
                        {
                            fieldName: "parentlabelid",
                            fieldValues: ["0"],
                            prepender: null,
                            operator: "EQUAL",
                            childConditions: null
                        },
                        {
                            fieldName: "labelname",
                            fieldValues: [this.labelFilter.labelname],
                            prepender: null,
                            operator: "EQUAL",
                            childConditions: null
                        }
                    ]
                };
                getLabelList(para2).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.labelData[1].children = res.data.pageInfo.list;
                    } else {
                        message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.labelData[1].children = [];
                    }
                    this.listCount += 1;
                    if (this.listCount == 3) this.listLoading = false;
                }).catch(() => {
                    this.labelData[1].children = [];
                    this.listCount += 1;
                    if (this.listCount == 3) this.listLoading = false;

                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });

                let para3 = {
                    conditions:[
                        {
                            fieldName: "labeltype",
                            fieldValues: ["4"],
                            prepender: null,
                            operator: "EQUAL",
                            childConditions: null
                        },
                        {
                            fieldName: "parentlabelid",
                            fieldValues: ["0"],
                            prepender: null,
                            operator: "EQUAL",
                            childConditions: null
                        },
                        {
                            fieldName: "labelname",
                            fieldValues: [this.labelFilter.labelname],
                            prepender: null,
                            operator: "EQUAL",
                            childConditions: null
                        }
                    ]
                };
                getLabelList(para3).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.labelData[2].children = res.data.pageInfo.list;
                    } else {
                        message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.labelData[2].children = [];
                    }
                    this.listCount += 1;
                    if (this.listCount == 3) this.listLoading = false;
                }).catch(() => {
                    this.listCount += 1;
                    if (this.listCount == 3) this.listLoading = false;

                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            search() {
                this.page = 1;
                this.getList();
            },
            onTreeItemSelect(target, model) {
                if(this.fromId != null) {
                    var toid = model.labelData.labelid;
                    var param = {
                        "fromlabelid": this.fromId,
                        "tolabelid": toid
                    }
                    moveLabel(param).then((res) => {
                        this.getList();
                        this.fromId = null;
                        this.$refs.catalogTree.highlight(false);
                    });
                    
                }
                if(this.selectedLabelItem != target) {
                    this.selectedLabelItem.selected = false;
                    this.selectedLabelItem = target;
                }
                this.hiddenUI = false;
            },
            
            onTreeItemOperate(target, level, parent, model, opIdx) {
                async function getAreaIds(areaid, schoolid, parent) {
                    parent.filters.tmp_areaids = [];
                    let flag_err = false;
                    try{
                        const res1 = await getParentAreaId(areaid);
                        if(res1.data.serverResult.resultCode == "200") {
                            res1.data.pageInfo.list.forEach(function(item){
                                parent.filters.tmp_areaids.splice(0,0, item.areaid);
                            });
                        }
                            
                    }catch(err){
                        flag_err = true;
                    }
                    if(flag_err==false && parent.filters.tmp_areaids.length<=3){
                        for( var i=0; i<3-parent.filters.tmp_areaids.length; i++){
                            parent.filters.tmp_areaids.push("");
                        }
                        parent.filters.tmp_areaids[3] = schoolid;

                        if(parent.filters.areaids[0] == parent.filters.tmp_areaids[0]){
                            parent.onChangeArea();
                        }
                        else{
                            Vue.set(parent.filters.areaids, 0, parent.filters.tmp_areaids[0]);
                        }
                    }
                    else{
                        parent.filters.tmp_areaids = ["","","",""];
                    }
                }

                if(this.selectedLabelItem != target) {
                    this.selectedLabelItem.selected = false;
                }
                this.selectedLabelItem = target;
                target.selected = true;
                if(model.labelData.parentlabelid == "0") {
                    this.hasParent = false;
                } else {
                    this.hasParent = true;
                }
                if(opIdx == 0) {
                    if (model.labelData.parentlabelid == "-1") {
                        return;
                    } else {
                        this.hiddenUI = true;
                        this.editForm.labelid = model.labelData.labelid;
                        this.editForm.businesstype = model.labelData.businesstype;
                        this.editForm.labeltype = model.labelData.labeltype;
                        this.editForm.labelpro = model.labelData.property;
                        this.editForm.labelname = model.label;
                        this.editForm.sortmethod = model.labelData.sortmethod;
                        // this.editForm.labelthumb.blobfile = ECO_MEDIA_PATH + model.labelData.localpath;
                        this.editForm.labelthumb.blobfile = model.labelData.localpath? ECO_MEDIA_PATH + model.labelData.localpath: null;
                        this.editForm.score = model.labelData.score; //author:han
                        this.selectedImagePath = model.labelData.localpath;

                        this.bModelChange = true;
                        this.propertyForm.schoolsectionid = model.labelData.schoolsectionid;
                        this.propertyForm.subjectid = model.labelData.subjectid;
                        this.propertyForm.gradeid = model.labelData.gradeid;
                        this.propertyForm.bookmodelid = model.labelData.bookmodelid;
                        this.propertyForm.editiontypeid = model.labelData.editiontypeid;

                        if(model.labelData.schoolid){
                            getEcoOrgInfo(model.labelData.schoolid).then(function(res){
                                if(res.data.serverResult.resultCode == "200") {
                                    if(res.data.responseEntity.areaid != "-1"){
                                        getAreaIds(res.data.responseEntity.areaId, model.labelData.schoolid, this);
                                    }
                                }
                            }.bind(this)).catch((res)=>{
                                this.$message({
                                    message: res.data.serverResult.resultMessage,
                                    type: 'error'
                                });
                            });
                        }
                        if (model.labelData.labeltype == 4 && model.labelData.parentlabelid != 0 && (model.labelData.property == 2 || model.labelData.property == 3)){
                            this.hasHighResource = true;    
                        } else {
                            this.hasHighResource = false;
                        }
                    }
                } else if(opIdx == 1) {
                    if (model.labelData.parentlabelid == "-1") {
                        this.onAddFirstLabel(target, model.labelData.labeltype);
                    } else {
                        this.$prompt('请输入标签名称', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消'
                        }).then(({ value }) => {
                            let para = {
                                "labelname": value,
                                "parentlabelid": model.labelData.labelid,
                                "businesstype": model.labelData.businesstype,
                                "labeltype": model.labelData.labeltype,
                                "localpath": "",
                                "sequence":"1",
                                "property":model.labelData.property,
                                "sortmethod":"0"
                            };
                            addLabel(para).then((res) => {
                                if (res.data.serverResult.resultCode == "200") {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                } else {
                                    this.$message({
                                        message: res.data.serverResult.resultMessage,
                                        type: 'error'
                                    });
                                }
                                this.getList();
                            }).catch(() => {
                                this.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                        }).catch(() => {
                        });
                    }
                } else if(opIdx == 2) {
                    if (model.labelData.parentlabelid == "-1") {
                        return;
                    } else {
                        this.selectedLabelDel(target, model.labelData.labelid);
                    }
                } else if(opIdx == 3) {
                    if (model.labelData.parentlabelid == "-1") {
                        return;
                    } else {
                        this.fromId = model.labelData.labelid;
                        this.$refs.catalogTree.highlight(true);
                    }
                }
            },
            selectedLabelDel(target, labelid) {
                this.$confirm('确认删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteLabel(labelid).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                        }
                        this.getList();
                    }).catch((res) => {
                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
                }).catch(() =>{});

            },

            onAddFirstLabel: function(target, type){
                this.$prompt('请输入标签名称', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消'
                    }).then(({ value }) => {
                        if (type == 4) {
                            let para = {
                                "labelname": value,
                                "parentlabelid": "0",
                                "businesstype": "1",
                                "labeltype": type,
                                "sequence":"1",
                                "localpath": "",
                                "property": "1",
                                "sortmethod": "0"
                            };
                            addLabel(para).then((res) => {
                                if (res.data.serverResult.resultCode == "200") {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                } else {
                                    this.$message({
                                        message: res.data.serverResult.resultMessage,
                                        type: 'error'
                                    });
                                }
                                this.getList();
                            }).catch(() => {
                                this.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                        } else {
                            let para = {
                                "labelname": value,
                                "parentlabelid": "0",
                                "businesstype": "1",
                                "labeltype": type,
                                "sequence":"1",
                                "localpath": "",
                                "property": "0",
                                "sortmethod": "0"
                            };
                            addLabel(para).then((res) => {
                                if (res.data.serverResult.resultCode == "200") {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                } else {
                                    this.$message({
                                        message: res.data.serverResult.resultMessage,
                                        type: 'error'
                                    });
                                }
                                this.getList();
                            }).catch(() => {
                                this.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                        }                  
                    }).catch(() => {
                    });
            },
            onSaveLabel: function() {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.editLoading = true;
                    var file = this.editForm.labelthumb.file;
                    var localPath = "";

                    if(file != null) {
                        this.uploadImage(file).then((res) =>{
                            if (res.data.serverReults.resultCode == "200") {
                                    localPath = res.data.fileInfos[0].localPath;
                                    this.editLabel(localPath);
                                }
                        });
                    } else if(file == null) {
                        localPath = this.selectedImagePath;
                        this.editLabel(localPath);
                    }
                    
                });
            },
            editLabel(localPath) {
                console.log(this.propertyForm.schoolid);
                let para = {
                    "labelid": this.editForm.labelid,
                    "labelname": this.editForm.labelname,
                    "businesstype": this.editForm.businesstype,
                    "labeltype": this.editForm.labeltype,
                    "localpath": localPath,
                    "property": this.editForm.labelpro,
                    "sortmethod": this.editForm.sortmethod,
                    "score": this.editForm.score, //author:han
                    "schoolsectionid": this.propertyForm.schoolsectionid,
                    "subjectid": this.propertyForm.subjectid,
                    "gradeid": this.propertyForm.gradeid,
                    "bookmodelid": this.propertyForm.bookmodelid,
                    "editiontypeid": this.propertyForm.editiontypeid,
                    "schoolid": this.propertyForm.schoolid,
                };
                editLabel(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.editLoading = false;
                    this.getList();
                }).catch(() => {
                    this.editLoading = false;
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            },
        
            uploadImage(file) {
                const data = new FormData();
                data.append('file' , file);

                return uploadFile({ data:data, onUploadProgress:null });
            },
            getTypeValue() {
                if (this.editForm.labeltype == 4) {
                    this.hasBanner = false;
                } else {
                    this.hasBanner = true;
                }
            },
            getSchoolSectionList() {
                getSchoolSectionList({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.schoolsectionList = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.schoolsectionList = [];
                    }
                });
            },
            onChangeSchoolSection() {
                console.log('on change school section is being called');
                // When school section value changed, set subject value and grade value as null;
                // And this happens because of school dropdown change
                if (this.bModelChange == false) {
                    this.propertyForm.subjectid = '';
                    this.propertyForm.gradeid = '';
                } else {
                    this.bModelChange = false;
                }

                this.getSubjectList();
                this.getNaviGradeList();
            },
            getSubjectList() {
                let para = {
                    schoolsectionid: this.propertyForm.schoolsectionid,
                };
                getSubjectList(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.subjectList = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.subjectList = [];
                    }
                });
            },
            getNaviGradeList() {
                let para = {
                    schoolsectionid: this.propertyForm.schoolsectionid
                };
                getNaviGradeList(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.gradeList = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.gradeList = [];
                    }
                });
            },
            getNaviEditionTypeList() {
                let para = {
                    schoolsectionid: this.propertyForm.schoolsectionid,
                    subjectid: this.propertyForm.subjectid
                };
                getNaviEditionTypeList(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.editionTypeList = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.editionTypeList = [];
                    }
                });
            },
            getNaviBookModelList() {
                let para = {
                    schoolsectionid: this.propertyForm.schoolsectionid,
                    subjectid: this.propertyForm.subjectid,
                    editiontypeid: this.propertyForm.editiontypeid,
                };
                getNaviBookModelList(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.bookModelList = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.bookModelList = [];
                    }
                });
            },
            getSchool() {
                var fuzzyAreaId = "";
                for(var i=this.filters.areaids.length-1; i>=0; i--){
                    if (this.filters.areaids[i] != "") {
                        fuzzyAreaId = this.filters.areaids[i];
                        break;
                    }
                }
                let param = {
                    singleTable: false,
                    pagination: {
                        numPerPage: 100000,
                        // pageNo: 1,
                        calTotal: false
                    },
                    conditions: [
                        {
                            fieldName: "incloudParent",
                            fieldValues: ["1"],
                            prepender: "AND",
                            operator: "EQUAL"
                        }
                    ]
                };

                if(fuzzyAreaId != ""){
                    param.conditions.push({
                        fieldName: "fuzzyAreaId",
                        fieldValues: [fuzzyAreaId],
                        prepender: "AND",
                        operator: "EQUAL"
                    });
                }
                this.schoolLoading = true;
                //this.propertyForm.schoolid = "";
                getEcoSchoolList(param, this.$message)
                    .then(res => {
                        if (res.data.serverResult.resultCode == "200") {
                            
                            this.schoolList = res.data.pageInfo.list;

                            if(this.filters.tmp_areaids[3] != ""){
                                this.propertyForm.schoolid = this.filters.tmp_areaids[3];
                                //this.propertyForm.schoolid = this.schoolList.find(o => o.orgId === this.filters.tmp_areaids[3]);
                                this.filters.tmp_areaids[3] = "";
                            }
                            else
                                this.propertyForm.schoolid = "";
                            this.$nextTick(() => {
                                this.schoolLoading = false;
                            });
                        }

                        
                    })
                    .catch(() => {
                        this.schoolList = [];
                        this.schoolLoading = false;
                    });

                // getSchoolList({}).then((res) => {
                //     if (res.data.serverResult.resultCode == "200") {
                //         this.schoolList = res.data.pageInfo.list;                    
                //     } 
                // });
            },
            getAreas() {
                getAreasByParent("-1")
                    .then(res => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.areas = res.data.pageInfo.list;
                        } else {
                            this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: "error"
                            });
                            this.areas = [];
                        }
                    })
                    .catch(() => {
                        this.areas = [];
                    });
            },
            onChangeArea() {
                if(this.filters.tmp_areaids[1] != ""){
                    if(this.filters.areaids[1] == this.filters.tmp_areaids[1])
                        this.onChangeCity();
                    else{
                        Vue.set(this.filters.areaids, 1, this.filters.tmp_areaids[1]);
                    }
                    this.filters.tmp_areaids[1] = "";
                }
                else if(this.filters.areaids[1] != ""){
                    Vue.set(this.filters.areaids, 1, "");
                }
                else{
                    this.onChangeCity();
                }
                this.cities = [];
                
                if (this.filters.areaids[0] != "") {
                    getAreasByParent(this.filters.areaids[0])
                    .then(res => {
                        if (res.data.serverResult.resultCode == "200") {
                            this.cities = res.data.pageInfo.list;
                        } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: "error"
                        });
                        this.cities = [];
                        }
                    })
                    .catch(() => {
                        this.cities = [];
                    });
                }
            },
            onChangeCity() {
                if(this.filters.tmp_areaids[2] != ""){
                    if(this.filters.areaids[2] == this.filters.tmp_areaids[2])
                        this.onChangeCountry();
                    else
                        Vue.set(this.filters.areaids, 2, this.filters.tmp_areaids[2]);
                    this.filters.tmp_areaids[2] = "";
                }
                else if(this.filters.areaids[2] != ""){
                    Vue.set(this.filters.areaids, 2, "");
                }
                else
                    this.onChangeCountry();
                this.countries = [];
                if (this.filters.areaids[1] != "") {
                    getAreasByParent(this.filters.areaids[1])
                        .then(res => {
                            if (res.data.serverResult.resultCode == "200") {
                                this.countries = res.data.pageInfo.list;
                            } else {
                                this.$message({
                                    message: res.data.serverResult.resultMessage,
                                    type: "error"
                                });
                                this.countries = [];
                            }
                        })
                        .catch(() => {
                            this.countries = [];
                        });
                }
            },
            onChangeCountry() {
                this.getSchool();
            },
            
        },
        
        created() {
            this.getList();
            this.getAreas();
            this.onChangeArea();
            this.getSchool();
            this.getSchoolSectionList();
            this.getNaviGradeList();
            this.getSubjectList();
            this.getNaviBookModelList();
            this.getNaviEditionTypeList();
        },
        mounted() {
        }
    }
</script>

<style lang="scss">
    @import '~scss_vars';

    .ecrm-upload-image {width: 210px; height: 121px; border: 1px dashed gray; float:left; margin-right: 10px;}
    .areaselect .el-input__inner {height:32px;}
    .schoolselection {margin-top:2px;}
</style>