<template>
    <section>
        <el-row>
            <el-col :span="7" class="ecrm-content-panel">
                <label-tree
                    :data="catalogTreeData"
                    :tools="tools"
                    :tool-min-level="0"
                    :openlevel="3"
                    ref="catalogTree"
                    @item-select="onTreeItemClick"
                    @item-operate="onTreeItemOperate">
                </label-tree>
            </el-col>
            <el-col :span="17" class="ecrm-content-panel">
                <el-form ref="bookForm" :model="form" :rules="formRules" label-width="120px">
                    <el-row>
                        <el-form-item class="is-required" label="属性 :" prop="property">
                            <el-col :span="5">
                                <el-select @change="onChangeSchoolSection" v-model="form.schoolsectionid" placeholder="学段">
                                    <el-option :value="item.dictvalue" :label="item.dictname" v-for="(item , idx) in schoolsectionList" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="5">
                                <el-select @change="getNaviEditionTypeList" v-model="form.subjectid" placeholder="学科">
                                    <el-option :value="item.dictvalue" :label="item.dictname" v-for="(item , idx) in subjectList" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="5">
                                <el-select v-model="form.gradeid" placeholder="年级">
                                    <el-option :value="item.dictvalue" :label="item.dictname" v-for="(item , idx) in gradeList" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="4">
                                <el-select @change="getNaviBookModelList" v-model="form.editiontypeid" placeholder="版本">
                                    <el-option :value="item.dictvalue" :label="item.dictname" v-for="(item , idx) in editionTypeList" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="5">
                                <el-select v-model="form.bookmodelid" placeholder="册别">
                                    <el-option :value="item.dictvalue" :label="item.dictname" v-for="(item , idx) in bookModelList" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="教辅名称 :" prop="bookname">
                            <el-col :span="24">
                                <el-input v-model="form.bookname" :maxlength="25"/>
                            </el-col>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="教辅封面 :" prop="coursethumb">
                            <input type="file" id="coursethumb" @change="readThumb" style="display:none" accept=".png,.jpg"/>
                            <img :src="form.coursethumb.blobfile" style="width: 210px; height: 121px; border: 1px dashed gray; float:left; margin-right: 10px;" @click="openThumbFile"/>
                            <div style="height: 121px;">
                                <el-button type="small" style="width: 80px; margin-top: 30px;" @click="openThumbFile">本地上传</el-button><br>
                                <el-button type="small" style="width: 80px;" @click="clearThumbFile">清空</el-button>
                            </div>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item class="is-required" label="教辅目录 :" prop="coursefile">
                            <input type="file" id="coursefile" @change="readCourse" style="display:none" accept=".xls,.xlsx"/>
                            <el-col :span="12">
                                <el-input v-model="form.coursefile.name" readonly @click.native="openCourseFile"/>
                            </el-col>
                            <el-col :span="12" style="padding-left:5px">
                                <el-button type="small" style="width: 80px;" @click="openCourseFile">本地上传</el-button>
                                <el-button type="small" style="width: 80px;" @click="clearCourseFile">清空</el-button>
                            </el-col>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="教辅定价 :" class="is-required" prop="bookprice">
                            <el-col :span="6">
                                <el-input-number v-model="form.bookprice" :min="0" @keypress.native="detectDecimal($event)" style="width:100%;"/>
                            </el-col>
                            <el-col :span="12">
                                &nbsp;积分
                            </el-col>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="教辅简介 :" prop="bookdesc">
                            <el-col :span="24">
                                <el-input type="textarea" :rows.native="8" v-model="form.bookdesc" :maxlength="500"/>
                            </el-col>
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" style="text-align:center;">
                <el-button style="width: 100px;" @click="cancel">取消</el-button>
                <el-button type="primary" style="width: 100px;" @click="save" :loading="editLoading">提交</el-button>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util';
    import { getBookInfo, getTeachCatalogList, uploadFile, setBook, updateBookWithoutCatalog, insertCatalog, deleteCatalog, moveCatalog, getSchoolSectionList, getSubjectList, getNaviGradeList, getNaviBookModelList, getNaviEditionTypeList, } from '../../api/api';

    export default {
        data() {
            return {
                form: {
                    schoolsectionid: '',
                    subjectid: '',
                    gradeid: '',
                    bookmodelid: '',
                    editiontypeid: '',
                    bookname: '',
                    coursethumb: {
                        blobfile: '',
                        file: null
                    },
                    coursefile: {
                        name: '',
                        file: ''
                    },
                    bookprice: 0,
                    bookdesc: ''
                },
                formRules: {
                    property: [
                        { validator: this.validateProperty, trigger: 'blur' },
                    ],
                    bookname: [
                        { required: true, message: '请输入教辅名称', trigger: 'blur' },
                    ],
                    coursefile: [
                        { validator: this.validateCourseFile, trigger: 'blur' },
                    ]
                },
                bookInfo: null,
                catalogTreeData: [],
                originCatalog: null,
                tools: [
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
                schoolsectionList:[],
                subjectList:[],
                gradeList:[],
                editionTypeList:[],
                bookModelList:[],

                selectedSchool:'',
                editLoading:false
            }
        },
        methods: {
            detectDecimal(evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if ((charCode > 31 && (charCode < 48 || charCode > 57)) ) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            },
            initialize() {
                this.form.schoolsectionid = '';
                this.form.subjectid = '';
                this.form.gradeid = '';
                this.form.bookmodelid = '';
                this.form.editiontypeid = '';
        
                this.form.bookname = '';
                this.form.bookprice = '';
                this.form.bookdesc = '';
                this.clearThumbFile();
                this.clearCourseFile();
            },
            validateProperty(rule, value, callback) {
                if (this.form.schoolsectionid == '' || this.form.subjectid == '' || this.form.gradeid == '' || this.form.bookmodelid == '' || this.form.editiontypeid == '') {
                    callback(new Error('请输入属性'));
                } else {
                    callback();
                }
            },
            validateCourseFile(rule, value, callback) {
                // if (this.form.coursefile.file == null) {
                if (this.form.coursefile.name == '') {
                    callback(new Error('请输入教辅目录'));
                } else {
                    callback();
                }
            },
            getBookInfo() {
                var bookId = this.$route.params.id;
                getBookInfo(bookId).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.bookInfo = res.data.responseEntity;
                        this.form.schoolsectionid = this.bookInfo.schoolsectionid;
                        this.form.subjectid = this.bookInfo.subjectid;
                        this.form.gradeid = this.bookInfo.gradeid;
                        this.form.bookmodelid = this.bookInfo.bookmodelid;
                        this.form.editiontypeid = this.bookInfo.editiontypeid;

                        this.form.bookname = this.bookInfo.bookname;
                        this.form.bookprice = this.bookInfo.bookscore;
                        this.form.bookdesc = this.bookInfo.description;
                        this.form.coursethumb.file = null;
                        this.form.coursefile.name = this.bookInfo.filepath;
                        this.form.coursethumb.blobfile = ECO_MEDIA_PATH + this.bookInfo.thumbnail;

                        this.selectedSchool = this.bookInfo.schoolsectionid;
                        // this.clearCourseFile();
                        this.loadCatalogTree();
                    } else {
                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            loadCatalogTree() {
                let para = {
                    lang:'zh_CN',
                    schoolsectionid: this.form.schoolsectionid,
                    gradeid: this.form.gradeid,
                    subjectid: this.form.subjectid,
                    bookmodelid: this.form.bookmodelid,
                    editiontypeid: this.form.editiontypeid
                };
                this.catalogTreeData = [];
                getTeachCatalogList(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        if (res.data.pageInfo.list.length > 0) {
                            this.catalogTreeData = res.data.pageInfo.list[0].children[0].children[0].children[0].children[0].children.filter(data => data.id == this.bookInfo.bookid);
                        } else {
                            this.catalogTreeData = [];
                        }
                    }
                });
            },
            openThumbFile() {
                document.getElementById('coursethumb').click();
            },
            openCourseFile() {
                document.getElementById('coursefile').click();
            },
            clearThumbFile() {
                this.form.coursethumb.file = null;
                this.form.coursethumb.blobfile = '';
                document.getElementById('coursethumb').value = null;
            },
            clearCourseFile() {
                this.form.coursefile.file = null;
                this.form.coursefile.name = '';
                document.getElementById('coursefile').value = null;
            },
            readThumb() {
                var input = document.getElementById('coursethumb');
                var reader = new FileReader();
                var _this = this;

                reader.onload = function (e) {
                    _this.form.coursethumb.blobfile = e.target.result;
                }

                this.form.coursethumb.file = input.files[0];
                if (!this.form.coursethumb.file.type.startsWith("image")) {
                    this.$message({
                        message: '只能支持图片格式。',
                        type: 'error'
                    });
                    return;
                }
                reader.readAsDataURL(this.form.coursethumb.file);
            },
            readCourse() {
                var input = document.getElementById('coursefile');
                this.form.coursefile.name = input.files[0].name;
                this.form.coursefile.file = input.files[0];
            },
            cancel() {
                window.EventHub.$emit('request-dialog');
            },
            save() {
                this.$refs.bookForm.validate((valid) => {
                      if (valid) {
                          if (this.form.coursethumb.file != null) {
                            const data = new FormData();
                            data.append('file', this.form.coursethumb.file);
                            uploadFile({ data:data, onUploadProgress:null }).then((res) => {
                                if (res.data.serverReults.resultCode == "200") {
                                    var path = res.data.fileInfos[0].localPath;
                                    this.editBook(path);
                                } else {
                                    this.$message({
                                        message: res.data.serverReults.resultMessage,
                                        type: 'error'
                                    });
                                }
                            }).catch(() => {
                                this.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                        } else {
                            this.editBook(this.bookInfo.thumbnail);
                        }
                    } else {
                        return false;
                    }
                });
            },
            editBook(thumbpath) {
                let info = {
                    subjectnaviinfo: {
                        schoolsectionid: this.form.schoolsectionid,
                        subjectid: this.form.subjectid,
                        bookmodelid: this.form.bookmodelid,
                        editiontypeid: this.form.editiontypeid
                    },
                    gradeid: this.form.gradeid,
                    bookinfo: {
                        bookid: this.bookInfo.bookid,
                        bookname: this.form.bookname,
                        bookscore: this.form.bookprice,
                        bookdesc: this.form.bookdesc,
                        thumnailpath: thumbpath
                    }
                };

                const param = new FormData();
                param.append('info', JSON.stringify(info));


                this.editLoading = true;

              /**
               * @author: gennie
               * @date: 1/28/2019
               */
              // if catalog file is set use 'setBook' api else use 'updateBookWithoutCatlog' api
              if (this.form.coursefile.file) {
                param.append('catalogfile', this.form.coursefile.file);
                setBook(param).then((res) => {
                  if (res.data.serverResult.resultCode == "200") {
                    this.$message({
                      message: '操作成功',
                      type: 'success'
                    });
                    window.EventHub.$emit('request-dialog');
                  } else {
                    this.$message({
                      message: res.data.serverResult.resultMessage,
                      type: 'error'
                    });
                  }
                  this.editLoading = false;
                }).catch(() => {
                  this.editLoading = false;

                  this.$message({
                    message: '操作失败',
                    type: 'error'
                  });
                });
              } else {
                param.append('catalogfile', this.form.coursefile.file);
                updateBookWithoutCatalog(param).then((res) => {
                  if (res.data.serverResult.resultCode == "200") {
                    this.$message({
                      message: '操作成功',
                      type: 'success'
                    });
                    window.EventHub.$emit('request-dialog');
                  } else {
                    this.$message({
                      message: res.data.serverResult.resultMessage,
                      type: 'error'
                    });
                  }
                  this.editLoading = false;
                }).catch(() => {
                  this.editLoading = false;
                  this.$message({
                    message: '操作失败',
                    type: 'error'
                  });
                });
              }

            },
            onTreeItemClick(target, model) {
                if (this.originCatalog != null) {
                    var fromcatalogid = this.originCatalog.catalogids[0];
                    var tocatalogid = model.catalogids[0];
                    var param = {
                        fromcatalogid:fromcatalogid,
                        tocatalogid:tocatalogid
                    };

                    var originCatalog = this.originCatalog;
                    moveCatalog(param).then((res) => {
                        if (res.data.serverResult.resultCode == "200") {
                            var originIndex = originCatalog.parent.children.indexOf(originCatalog);
                            originCatalog.parent.children.splice(originIndex, 1);
                            var targetIndexOf = model.parent.children.indexOf(model);
                            model.parent.children.splice(targetIndexOf, 0, originCatalog);
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
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
                    this.$refs.catalogTree.highlight(false);
                    this.originCatalog = null;
                }
            },
            onTreeItemOperate(target, level, parent, model, opIdx) {
                if (opIdx == 0) { // Insert
                    this.$prompt('请输入目录名称', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消'
                    }).then(({ value }) => {
                        var parentcatalogid = level==0?null:model.id;
                        let params = {
                            bookid: this.bookInfo.bookid,
                            parentcatalogid: parentcatalogid,
                            catalogname: value
                        };
                        insertCatalog(params).then((res) => {
                            if (res.data.serverResult.resultCode == "200") {
                                model.catalogids.push(res.data.responseEntity.catalogid);
                                var newModel = {
                                    catalogids: [ res.data.responseEntity.catalogid ],
                                    children: [],
                                    label: res.data.responseEntity.catalogname
                                };
                                model.children.push(newModel);
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
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
                    }).catch(() => {
                    });
                } else if (opIdx == 1) { // Delete
                    var catalogId = model.id;
                    this.$confirm('是否删除目录？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        deleteCatalog(catalogId).then((res) => {
                            if (res.data.serverResult.resultCode == "200") {
                                target.remove();
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
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
                    }).catch(() => {
                    });
                } else if (opIdx == 2) { // Move
                    this.originCatalog = model;
                    this.$refs.catalogTree.highlight(true);
                }
            },
            onChangeSchoolSection() {
                this.getSubjectList();
                this.getNaviGradeList();

                if (this.form.schoolsectionid != this.selectedSchool) {

                    this.form.subjectid = '';
                    this.form.gradeid = '';
                    this.form.bookmodelid = '';
                    this.form.editiontypeid = '';
                    this.selectedSchool = this.form.schoolsectionid;    
                }
            },
            getSubjectList() {
                let para = {
                    schoolsectionid: this.form.schoolsectionid,
                };
                getSubjectList(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.subjectList = ECRUtil.composeSysDict(res.data.pageInfo.list);

                        // Fix when subject id is not matching with subject list
                        // Ex: item's value  of subject list is 100000000001,110000000001,120000000001 and book subject id is 110000000001
                        // #1. Check if subjectid is existing in subjectlist
                        if (this.subjectList && this.subjectList.length > 0 && this.bookInfo) {
                            let findParam = {};
                            if (findParam = this.subjectList.find(x => x.dictname === this.bookInfo.subject)) {
                                this.form.subjectid = findParam.dictvalue;
                            } else {
                            }
                        } else {
                        }
                        //---------------------------------------------------
                    } else {
                        this.subjectList = [];
                    }
                });
            },
            getNaviGradeList() {
                let para = {
                    schoolsectionid: this.form.schoolsectionid
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
                    schoolsectionid: this.form.schoolsectionid,
                    subjectid: this.form.subjectid
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
                    schoolsectionid: this.form.schoolsectionid,
                    subjectid: this.form.subjectid,
                    editiontypeid: this.form.editiontypeid,
                };
                getNaviBookModelList(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.bookModelList = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.bookModelList = [];
                    }
                });
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
        },
        created() {
            this.getBookInfo();
        },
        mounted() {
            this.getSchoolSectionList();
            this.getNaviGradeList();
            this.getSubjectList();
            this.getNaviBookModelList();
            this.getNaviEditionTypeList();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
    .el-select {
        width: calc(100% - 10px);
        margin-right: 10px;
    }
    .el-form-item__content .el-col:last-child .el-select {
        width: 100%;
        margin-right: 0px;
    }
    .el-input {
        width: 100%;
    }
    .el-button--green {
        background-color: #54ca08;
        color: white;
    }
    .el-button--green:focus {
        border-color: #54ca08;
    }
    .el-button--green:hover {
        background-color: #69ea16;
        border-color: #69ea16;
    }
</style>