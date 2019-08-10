<template>
    <section>
        <el-col :span="24" class="ecrm-content-panel">
            <el-form ref="bookForm" :model="form" :rules="formRules" label-width="140px">
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
                    <el-form-item label="教辅名称 :" prop="coursename">
                        <el-col :span="24">
                            <el-input v-model="form.coursename" />
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
                        <el-col :span="12">
                            <el-button type="small" style="width: 80px;" @click="openCourseFile">本地上传</el-button>
                            <el-button type="small" style="width: 80px;" @click="clearCourseFile">清空</el-button>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="教辅定价 :" prop="courseprice">
                        <el-col :span="3">
                            <el-input-number v-model="form.courseprice" :min="1"/>
                        </el-col>
                        <el-col :span="12">
                            积分
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="教辅简介 :" prop="coursedesc">
                        <el-col :span="24">
                            <el-input type="textarea" :rows.native="5" v-model="form.coursedesc"/>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="24" style="text-align:center;">
                        <el-button style="width: 100px;" @click="cancel">取消</el-button>
                        <el-button type="primary" style="width: 100px;" @click="save" :loading="addLoading">保存</el-button>
                    </el-col>
                </el-row>
            </el-form>
            
        </el-col>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util';
    import { getSchoolSectionList, getSubjectList, getNaviGradeList, getNaviBookModelList, getNaviEditionTypeList, uploadFile, setBook } from '../../api/api';

    export default {
        data() {
            return {
                form: {
                    schoolsectionid: '',
                    subjectid: '',
                    gradeid: '',
                    editiontypeid: '',
                    bookmodelid: '',
                    coursename: '',
                    coursethumb: {
                        blobfile: '',
                        file: null
                    },
                    coursefile: {
                        name: '',
                        file: null
                    },
                    courseprice: '',
                    coursedesc: '',
                },
                formRules: {
                    property: [
                        { validator: this.validateProperty, trigger: 'blur' },
                    ],
                    coursename: [
                        { validator: this.validateCoursename, trigger: 'blur' },
                    ],
                    coursefile: [
                        { validator: this.validateCourseFile, trigger: 'blur' },
                    ],
                    courseprice: [
                        {  validator: this.validateCoursePrice, trigger: 'blur' },
                    ],
                    coursedesc: [
                        { validator: this.validateCoursedes, trigger: 'blur'},
                    ]
                },
                schoolsectionList:[],
                subjectList:[],
                gradeList:[],
                editionTypeList:[],
                bookModelList:[],
                addLoading:false
            }
        },
        methods: {
            initialize() {
                this.form.schoolsectionid = '';
                this.form.subjectid = '';
                this.form.gradeid = '';
                this.form.editiontypeid = '';
                this.form.bookmodelid = '';
                this.form.coursename = '';
                this.form.courseprice = '';
                this.form.coursedesc = '';
                this.clearThumbFile();
                this.clearCourseFile();                
            },
            validateCoursePrice(rule, value, callback) {
                if (this.form.courseprice != parseInt(this.form.courseprice)) {
                    callback(new Error('不能输入小数'));
                } else {
                    callback();
                }    
            },
            validateProperty(rule, value, callback) {
                if (this.form.schoolsectionid == '' || this.form.subjectid == '' || this.form.gradeid == '' || this.form.bookmodelid == '' || this.form.editiontypeid == '') {
                    callback(new Error('请输入属性'));
                } else {
                    callback();
                }
            },
            validateCoursename(rule, value, callback) {
                var coursename = value.split("");
                if (coursename.length > 25) {
                    callback(new Error('教辅名称不能超过25'));
                } else if (coursename == '') {
                    callback(new Error('请输入教辅名称'));
                } else {
                    callback();
                }
            },
            validateCourseFile(rule, value, callback) {
                if (this.form.coursefile.file == null) {
                    callback(new Error('请输入教辅目录'));
                } else {
                    callback();
                }
            },
            validateCoursedes(rule, value, callback) {
                var coursedes = value.split("");
                if (coursedes.length > 500) {
                    callback(new Error('教辅简介不能超过500'));
                } else {
                    callback();
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
                this.getSubjectList();
                this.getNaviGradeList();
            },
            getSubjectList() {
                let para = {
                    schoolsectionid: this.form.schoolsectionid,
                };
                this.form.subjectid = '';
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
                    schoolsectionid: this.form.schoolsectionid
                };
                this.form.gradeid = '';
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
                this.form.editiontypeid = '';
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
                this.form.bookmodelid = '';
                getNaviBookModelList(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.bookModelList = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.bookModelList = [];
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
                          this.addLoading = true;
                            if (this.form.coursethumb.file != null) {
                                const data = new FormData();
                                data.append('file', this.form.coursethumb.file);
                                uploadFile({ data:data, onUploadProgress:null }).then((res) => {
                                    if (res.data.serverReults.resultCode == "200") {
                                        var path = res.data.fileInfos[0].localPath;
                                        this.createBook(path);
                                    } else {
                                        this.$message({
                                              message: res.data.serverReults.resultMessage,
                                              type: 'error'
                                        });
                                    }
                                });
                            } else {
                                this.createBook(null);
                            }
                    } else {
                        return false;
                    }
                });
            },
            createBook(thumbpath) {
                let info = {
                    subjectnaviinfo: {
                        schoolsectionid: this.form.schoolsectionid,
                        subjectid: this.form.subjectid,
                        editiontypeid: this.form.editiontypeid,
                        bookmodelid: this.form.bookmodelid
                    },
                    gradeid: this.form.gradeid,
                    bookinfo: {
                        bookname: this.form.coursename,
                        bookscore: this.form.courseprice,
                        bookdesc: this.form.coursedesc,
                        thumnailpath: thumbpath,
                        filepath: this.form.coursefile.name
                    }
                };

                const param = new FormData();
                param.append('info', JSON.stringify(info));
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
                    this.addLoading = false;
                }).catch(() => {
                    this.addLoading = false;

                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            }
        },
        created() {
            this.getSchoolSectionList();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .el-select {
        width: calc(100% - 10px);
        margin-right: 10px;
    }
    .el-input {
        width: calc(100% - 10px);
        margin-right: 10px;
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