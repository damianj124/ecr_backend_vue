// Author : GOD
// Date Start : 2019-2-7 10 AM
// Reason : Bug ID 369
<template>
    <section>
        <el-row>
            <el-col :span="24" class="ecrm-search-title">
                <a class="selected">发起征集活动</a>
            </el-col>
        </el-row>
        <el-form :model="activityForm" :rules="activityFormRules" ref="activityForm" label-width="120px">
            <el-row class="content">
                <el-col :span="24" class="ecrm-content-panel">
                    <el-row id="actName">
                        <el-col :span="24">
                            <el-form-item label="活动名称:" prop="activityname" class="is-required">
                                <el-input type="text" v-model="activityForm.activityname" @keyup.native="checkname" placeholder="征集活动名称" :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="主题图片:">
                                <input type="file" id="coursethumb1" @change="readThumb1" style="display:none" accept=".png,.jpg"/>
                                <img :src="form.coursethumb.blobfile1" style="width: 210px; height: 121px; border: 1px dashed gray; float:left; margin-right: 10px;" @click="openThumbFile1"/>
                                <div style="height: 121px;">
                                    <el-button type="small" style="width: 80px; margin-top: 30px;" @click="openThumbFile1">本地上传</el-button><br>
                                    <el-button type="small" style="width: 80px;" @click="clearThumbFile1">清空</el-button>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row id="bonPnt">
                        <el-col :span="24">
                            <el-form-item label="奖励积分:" prop="bonuspoints" class="is-required">
                                <el-input-number v-model.number="activityForm.bonuspoints" :min="1" :max="99999"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="资源类型:">
                                <el-select v-model="activityForm.contenttype" @change="onChangeConentType(activityForm.contenttype)">
                                    <el-option :label="item.contentname" :value="item.contenttype" v-for="(item, idx) in contentTypes" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row id="actDur">
                        <el-col :span="24">
                            <el-form-item label="活动有效期:" class="is-required" prop="timeprop">
                                <el-date-picker type="date" v-model="activityForm.starttime"></el-date-picker>
                                -
                                <el-date-picker type="date" v-model="activityForm.endtime"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row id="colReq">
                        <el-col :span="24">
                            <el-form-item label="征集要求:" class="is-required" prop="requirement">
                                <div class="components-container">
                                    <div class="editor-container">
                                        <UE :defaultMsg="activityForm.requirement" @keyup.native="checkrequirement" :config="ueConfig" :id="ue2" ref="ue2" :maxlength="500"></UE>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row id="resForm">
                        <el-col :span="24">
                            <el-form-item label="资源格式设置:" class="is-required" prop="checkprop">
                                <el-checkbox-group v-model="activityForm.formats">
                                    <el-checkbox :label="item" v-for="(item, idx) in extensions" :key="idx" :data="item"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row id="actDesc">
                        <el-col :span="24">
                            <el-form-item label="活动介绍:" class="is-required" prop="description">
                                <div class="components-container">
                                    <div class="editor-container">
                                            <UE :defaultMsg="activityForm.description" :config="ueConfig" :id="ue1" ref="ue" :maxlength="1000"></UE>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row id="rewDesc">
                        <el-col :span="24">
                            <el-form-item label="奖励说明:" class="is-required" prop="bonusnote">
                                <div class="components-container">
                                    <div class="editor-container">
                                          <UE :defaultMsg="activityForm.bonusnote" :config="ueConfig" :id="ue3" ref="ue3" :maxlength="500"></UE>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="征集发文:" style="text-align:center;">
                                <div style="display:inline-block;float:left;">
                                    <input type="file" id="coursethumb" @change="readThumb" style="display:none" accept=".png,.jpg"/>
                                    <img :src="form.coursethumb.blobfile" style="width: 210px; height: 121px; border: 1px dashed gray;" @click="openThumbFile"/>
                                    <div style="width:100%;text-align:center;">
                                        <el-button type="small" style="width: 80px;display:inline-block;" @click="openThumbFile">本地上传</el-button>
                                        <el-button type="small" style="width: 80px;display:inline-block;" @click="clearThumbFile">清空</el-button>
                                    </div>
                                </div>
                                <div style="display:inline-block;">
                                    <input type="file" id="coursethumb2" @change="readThumb2" style="display:none" accept=".png,.jpg"/>
                                    <img :src="form.coursethumb.blobfile2" style="width: 210px; height: 121px; border: 1px dashed gray;" @click="openThumbFile2"/>
                                    <div style="width:100%;text-align:center;">
                                        <el-button type="small" style="width: 80px;display:inline-block;" @click="openThumbFile2">本地上传</el-button>
                                        <el-button type="small" style="width: 80px;display:inline-block;" @click="clearThumbFile2">清空</el-button>
                                    </div>
                                </div>
                                <div style="display:inline-block;float:right;">
                                    <input type="file" id="coursethumb3" @change="readThumb3" style="display:none" accept=".png,.jpg"/>
                                    <img :src="form.coursethumb.blobfile3" style="width: 210px; height: 121px; border: 1px dashed gray;" @click="openThumbFile3"/>
                                    <div style="width:100%;text-align:center;">
                                        <el-button type="small" style="width: 80px;display:inline-block;" @click="openThumbFile3">本地上传</el-button>
                                        <el-button type="small" style="width: 80px;display:inline-block;" @click="clearThumbFile3">清空</el-button>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div style="padding: 20px 0px 50px 0px; border-top: 1px dashed #e8e8e8; text-align: center">
                        <el-button type="primary" @click="save" :loading="addLoading">保存</el-button>
                        <el-button type="success" @click="preview" :loading="previewLoading">预览</el-button>
                        <el-button type="default" @click="cancel">取消</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util'
    import { CONTENT_TYPE } from '../../common/js/const.js';
    import { addCollectionActivity, uploadFile } from '../../api/api';

    export default {
        data() {
            return {
                FRONTEND_CONTEXT: FRONTEND_CONTEXT,
                previewWindow: null,
                form: {
                    coursethumb: {
                        blobfile: '',
                        blobfile1: '',
                        blobfile2: '',
                        blobfile3: '',
                        file: null,
                        file1: null,
                        file2: null,
                        file3: null
                    }
                },
                contentTypes: CONTENT_TYPE,
                /////////// Pagination ///////////
                total: 0,
                page: 1,
                page_size: 5,
                /////////// Pagination End ////////
                addLoading: false,
                listLoading: false,
                previewLoading: false,
                previewstatus: false,
                activityForm: {
                    accordings: [],
                    activityname: '',
                    starttime: '',
                    endtime: '',
                    requirement: '',
                    formats: [],
                    description: '',
                    bonusnote: '',
                    bonuspoints: 0,
                    contenttype: CONTENT_TYPE[0].contenttype,
                    logopath: '',
                    descriptiontext: '',
                    requirementtext: '',
                    bonusnotetext: ''
                },
                activityFormRules: {
                    timeprop: [
                        { validator: this.validateActivityTime, trigger: 'blur' },
                    ],
                    checkprop: [
                        { validator: this.validateCheck, trigger: 'blur' },
                    ],
                    description: [
                        { validator: this.validateDescription, trigger: 'blur' }
                    ],
                    requirement: [
                        { validator: this.validateRequirement, trigger: 'blur' }
                    ],
                    bonusnote: [
                        { validator: this.validateCheckBonusnote, trigger: 'blur' }
                    ],
                    activityname: [
                        { validator: this.validateActivityName, trigger: 'blur' }
                    ],
                    bonuspoints: [
                        { validator: this.validateBonuspoint, trigger: 'blur' }
                    ]
                },
                activityInfo: null,
                extensions: CONTENT_TYPE[0].extensions,
                defaultMsg: '',
                ueConfig: {
                  initialFrameWidth: null,
                  initialFrameHeight: 150
                },
                ue1: "ue1",
                ue2: "ue2",
                ue3: "ue3",
                previewURL: '',
                txtFile: null,
                badWords: '',
                errors: []
            }
        },
        methods: {
            validateBonuspoint(rule, value, callback) {
                if (this.activityForm.bonuspoints != parseInt(this.activityForm.bonuspoints)) {
                    this.errors[1] = document.getElementById('bonPnt');
                    callback(new Error('不能输入小数'));
                } else {
                    this.errors[1] = null;
                    callback();
                }
            },
            validateDescription(rule, value, callback) {
                if (this.activityForm.description == "" || this.activityForm.description == null) {
                    this.errors[5] = document.getElementById('actDesc');
                    callback(new Error('请输入活动介绍'));
                } else if(this.activityForm.descriptiontext.length > 1000) {
                    this.errors[5] = document.getElementById('actDesc');
                    callback(new Error('请输入1-1000位字符'));
                } 
                // else if(this.badWords.includes(this.activityForm.descriptiontext)){
                //     this.errors[5] = document.getElementById('actDesc');
                //     callback(new Error('不能上传含有黄色暴力反政治等内容的资源文件。'));
                // } 
                else {
                    this.errors[5] = null;
                    callback();
                }
            },
            validateActivityName(rule, value, callback) {
                if (this.activityForm.activityname == "" || this.activityForm.activityname == null) {
                    this.errors[0] = document.getElementById('actName');
                    callback(new Error('请输入活动名称'));
                } 
                // else if (this.badWords.includes(this.activityForm.activityname)) {
                //     this.errors[0] = document.getElementById('actName');
                //     callback(new Error('不能上传含有黄色暴力反政治等内容的资源文件。'));
                // } 
                else {
                    this.errors[0] = null;
                    callback();
                }
            },
            checkname() {
                this.activityForm.activityname = ECRUtil.removespace(this.activityForm.activityname);
            },
            validateRequirement(rule, value, callback) {
                console.log(this.activityForm.requirementtext);
                if (this.activityForm.requirement == "" || this.activityForm.requirement == null) {
                    this.errors[3] = document.getElementById('colReq');
                    callback(new Error('请输入征集要求'));
                } else if(this.activityForm.requirementtext.length > 500) {
                    this.errors[3] = document.getElementById('colReq');
                    callback(new Error('请输入1-500位字符'));
                } 
                // else if (this.badWords.includes(this.activityForm.requirement)) {
                //     this.errors[3] = document.getElementById('colReq');
                //     callback(new Error('不能上传含有黄色暴力反政治等内容的资源文件。'));
                // } 
                else {
                    this.errors[3] = null;
                    callback();
                }
            },
            validateActivityTime(rule, value, callback) {
                if (this.activityForm.starttime == '' || this.activityForm.endtime == '' || 
                    this.activityForm.starttime == null || this.activityForm.endtime == null) {
                        this.errors[2] = document.getElementById('actDur');
                    callback(new Error('请输入活动有效期'));
                } else {
                    this.errors[2] = null;
                    callback();
                }
            },
            validateCheck(rule, value, callback) {
                if (this.activityForm.formats.length == 0) {
                    this.errors[4] = document.getElementById('resForm');
                    callback(new Error('请输入资源格式设置'));
                } else {
                    this.errors[4] = null;
                    callback();
                }
            },
            validateCheckBonusnote(rule, value, callback) {
                if(this.activityForm.bonusnote == '' || this.activityForm.bonusnote == null) {
                    this.errors[6] = document.getElementById('rewDesc');
                    callback(new Error('请输入奖励说明'));
                } else if(this.activityForm.bonusnotetext.length > 500) {
                    this.errors[6] = document.getElementById('rewDesc');
                    callback(new Error('请输入1-500位字符'));
                } 
                // else if(this.badWords.includes(this.activityForm.bonusnotetext)) {
                //     this.errors[6] = document.getElementById('rewDesc');
                //     callback(new Error('不能上传含有黄色暴力反政治等内容的资源文件。'));
                // } 
                else {
                    this.errors[6] = null;
                    callback();
                }        
            },
            openThumbFile() {
                document.getElementById('coursethumb').click();
            },
            openThumbFile1() {
                document.getElementById('coursethumb1').click();
            },
            openThumbFile2() {
                document.getElementById('coursethumb2').click();
            },
            openThumbFile3() {
                document.getElementById('coursethumb3').click();
            },
            save() {
                this.previewstatus = false;
                this.addCollectionActivity();
                this.$refs.activityForm.validate((valid) => {
                    if (valid) {
                        if (this.activityForm.starttime != '' && this.activityForm.endtime != '') {
                            if (new Date(this.activityForm.starttime) > new Date(this.activityForm.endtime)) {
                                this.$message({
                                    message: '活动有效期结束时间不得早于开始时间。',
                                    type: 'error'
                                });
                                return;
                            } else if (ECRUtil.formatDate.format(new Date(this.activityForm.starttime), 'yyyy-MM-dd') == ECRUtil.formatDate.format(new Date(this.activityForm.endtime), 'yyyy-MM-dd')) {
                                this.$message({
                                    message: '结束日期不能等于开始日期。',
                                    type: 'warning'
                                });
                                return;
                            }
                        }

                        if (this.form.coursethumb.file != null) {
                            const data = new FormData();
                            data.append('file', this.form.coursethumb.file);
                            this.addLoading = true;
                            uploadFile({ data:data, onUploadProgress:null }).then((res) => {
                                if (res.data.serverReults.resultCode == "200") {
                                    var path = res.data.fileInfos[0].localPath;
                                    this.activityForm.accordings[0] = path;
                                    this.uploadResultFile1();
                                } else {
                                    this.$message({
                                        message: res.data.serverReults.resultMessage,
                                        type: 'error'
                                    });
                                    this.addLoading = false;
                                }
                            });
                        } else {
                            this.addLoading = true;
                            this.uploadResultFile1();
                        }
                    }else{
                        for (var error of this.errors) {
                            if(error != null){
                                error.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                                break;
                            }
                        }
                    }

                    
                });
            },
            preview() {
                // Opens new tab first because if I want to open later, it is blocked for the security reason
                this.previewWindow = window.open('', '_blank');
                this.previewWindow.document.write("加载预览。。。");
                this.previewstatus = true;
                this.addCollectionActivity();
                this.$refs.activityForm.validate((valid) => {
                    if (valid) {
                        if (this.activityForm.starttime != '' && this.activityForm.endtime != '') {
                            if (new Date(this.activityForm.starttime) > new Date(this.activityForm.endtime)) {
                                this.$message({
                                    message: '查询结束时间不得大于开始时间。',
                                    type: 'error'
                                });
                                this.previewWindow.document.write("加载失败。。。");
                                return;
                            } else if (ECRUtil.formatDate.format(new Date(this.activityForm.starttime), 'yyyy-MM-dd') == ECRUtil.formatDate.format(new Date(this.activityForm.endtime), 'yyyy-MM-dd')) {
                                this.$message({
                                    message: '结束日期不能等于开始日期。',
                                    type: 'warning'
                                });
                                this.previewWindow.document.write("加载失败。。。");
                                return;
                            }
                        }

                        if (this.form.coursethumb.file != null) {
                            const data = new FormData();
                            data.append('file', this.form.coursethumb.file);
                            this.previewLoading = true;
                            uploadFile({ data:data, onUploadProgress:null }).then((res) => {
                                if (res.data.serverReults.resultCode == "200") {
                                    var path = res.data.fileInfos[0].localPath;
                                    this.activityForm.accordings[0] = path;
                                    this.uploadResultFile1();
                                } else {
                                    this.$message({
                                        message: res.data.serverReults.resultMessage,
                                        type: 'error'
                                    });
                                    this.previewWindow.document.write("加载失败。。。");
                                    this.previewLoading = false;
                                }
                            });
                        } else {
                            this.previewLoading = true;
                            this.uploadResultFile1();
                        }

                    } else {
                        for (var error of this.errors) {
                            if(error != null){
                                error.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                                this.previewWindow.document.body.innerHTML = "加载失败。。。";
                                break;
                            }
                        }
                    }
                });
            },
            cancel() {
                this.$router.push('/raise');
            },
            uploadResultFile1() {
                if (this.form.coursethumb.file1 != null) {
                    const data1 = new FormData();
                    data1.append('file1', this.form.coursethumb.file1);
                    uploadFile({ data:data1, onUploadProgress:null }).then((res) => {
                        if (res.data.serverReults.resultCode == "200") {
                            var path = res.data.fileInfos[0].localPath;
                            this.activityForm.logopath = path;
                            this.uploadResultFile2();
                        } else {
                            this.$message({
                                  message: res.data.serverReults.resultMessage,
                                  type: 'error'
                            });
                            this.previewWindow.document.write("加载失败。。。");
                            if (this.previewstatus) {
                                this.previewLoading = false;
                            } else {
                                this.addLoading = false;
                            }
                        }
                    });
                } else {
                    if (this.previewstatus) {
                        this.previewLoading = true;
                    } else {
                        this.addLoading = true;
                    }
                    this.uploadResultFile2();
                }
            },
            uploadResultFile2() {
                if (this.form.coursethumb.file2 != null) {
                    const data2 = new FormData();
                    data2.append('file2', this.form.coursethumb.file2);
                    uploadFile({ data:data2, onUploadProgress:null }).then((res) => {
                        if (res.data.serverReults.resultCode == "200") {
                            var path = res.data.fileInfos[0].localPath;
                            this.activityForm.accordings[1] = path;
                            this.uploadResultFile3();
                        } else {
                            this.$message({
                                  message: res.data.serverReults.resultMessage,
                                  type: 'error'
                            });
                            this.previewWindow.document.write("加载失败。。。");
                            if (this.previewstatus) {
                                this.previewLoading = false;
                            } else {
                                this.addLoading = false;
                            }
                        }
                    });
                } else {
                    if (this.previewstatus) {
                        this.previewLoading = true;
                    } else {
                        this.addLoading = true;
                    }
                    this.uploadResultFile3();
                }
            },
            uploadResultFile3() {
                if (this.form.coursethumb.file3 != null) {
                    const data3 = new FormData();
                    data3.append('file3', this.form.coursethumb.file3);
                    uploadFile({ data:data3, onUploadProgress:null }).then((res) => {
                        if (res.data.serverReults.resultCode == "200") {
                            var path = res.data.fileInfos[0].localPath;
                            this.activityForm.accordings[2] = path;
                            this.addSubmit();
                        } else {
                            this.$message({
                                  message: res.data.serverReults.resultMessage,
                                  type: 'error'
                            });
                            this.previewWindow.document.write("加载失败。。。");
                            if (this.previewstatus) {
                                this.previewLoading = false;
                            } else {
                                this.addLoading = false;
                            }
                        }
                    });
                } else {
                    if (this.previewstatus) {
                        this.previewLoading = true;
                    } else {
                        this.addLoading = true;
                    }
                    this.addSubmit();
                }
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
            readThumb1() {
                var input = document.getElementById('coursethumb1');
                var reader = new FileReader();
                var _this = this;

                reader.onload = function (e) {
                    _this.form.coursethumb.blobfile1 = e.target.result;
                }

                this.form.coursethumb.file1 = input.files[0];
                if (!this.form.coursethumb.file1.type.startsWith("image")) {
                    this.$message({
                        message: '只能支持图片格式。',
                        type: 'error'
                    });
                    return;
                }
                reader.readAsDataURL(this.form.coursethumb.file1);
            },
            readThumb2() {
                var input = document.getElementById('coursethumb2');
                var reader = new FileReader();
                var _this = this;

                reader.onload = function (e) {
                    _this.form.coursethumb.blobfile2 = e.target.result;
                }

                this.form.coursethumb.file2 = input.files[0];
                if (!this.form.coursethumb.file2.type.startsWith("image")) {
                    this.$message({
                        message: '只能支持图片格式。',
                        type: 'error'
                    });
                    return;
                }
                reader.readAsDataURL(this.form.coursethumb.file2);
            },
            readThumb3() {
                var input = document.getElementById('coursethumb3');
                var reader = new FileReader();
                var _this = this;

                reader.onload = function (e) {
                    _this.form.coursethumb.blobfile3 = e.target.result;
                }

                this.form.coursethumb.file3 = input.files[0];
                if (!this.form.coursethumb.file3.type.startsWith("image")) {
                    this.$message({
                        message: '只能支持图片格式。',
                        type: 'error'
                    });
                    return;
                }
                reader.readAsDataURL(this.form.coursethumb.file3);
            },
            clearThumbFile() {
                this.form.coursethumb.file = null;
                this.form.coursethumb.blobfile = '';
                document.getElementById('coursethumb').value = null;
            },
            clearThumbFile1() {
                this.form.coursethumb.file1 = null;
                this.form.coursethumb.blobfile1 = '';
                document.getElementById('coursethumb1').value = null;
            },
            clearThumbFile2() {
                this.form.coursethumb.file2 = null;
                this.form.coursethumb.blobfile2 = '';
                document.getElementById('coursethumb2').value = null;
            },
            clearThumbFile3() {
                this.form.coursethumb.file3 = null;
                this.form.coursethumb.blobfile3 = '';
                document.getElementById('coursethumb3').value = null;
            },
            addSubmit() {
                let params = {
                    activityname: this.activityForm.activityname,
                    starttime: ECRUtil.formatDate.format(new Date(this.activityForm.starttime), 'yyyy-MM-dd hh:mm:ss'),
                    endtime: ECRUtil.formatDate.format(new Date(this.activityForm.endtime), 'yyyy-MM-dd hh:mm:ss'),
                    requirement: this.activityForm.requirement,
                    requirementtext: this.activityForm.requirementtext,
                    formats: this.activityForm.formats,
                    description: this.activityForm.description,
                    descriptiontext: this.activityForm.descriptiontext,
                    bonusnote: this.activityForm.bonusnote,
                    bonusnotetext: this.activityForm.bonusnotetext,
                    bonuspoints: this.activityForm.bonuspoints,
                    accordings: this.activityForm.accordings,
                    logopath: this.activityForm.logopath,
                    contenttype: this.activityForm.contenttype
                };

                addCollectionActivity(params).then((res) => {
                    if(res.data.serverResult.resultCode == "200") {
                        if (this.previewstatus == false) {
                            this.$router.push('/raise');
                        } else if (this.previewstatus == true) {
                            this.activityInfo = res.data.responseEntity;
                            this.handlePreview(this.activityInfo);
                        }
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.previewWindow.document.write("加载失败。。。");
                    }

                    if (this.previewstatus) {
                        this.previewLoading = false;
                    } else {
                        this.addLoading = false;
                    }
                }).catch(() => {
                    if (this.previewstatus) {
                        this.previewLoading = false;
                    } else {
                        this.addLoading = false;
                    }
                });
            },
            handlePreview(activity) {
                this.previewWindow.location.href = `${this.FRONTEND_CONTEXT}collection/detail/${activity.activityid}`, "_blank";
                this.previewWindow.focus();
                this.$router.push('/raise');
            },
            goRaise() {
                this.$router.push('/raise');    
            },
            onChangeConentType(contenttype) {
                for(var i=0; i<this.contentTypes.length; i++) {
                    if (this.contentTypes[i].contenttype == contenttype) {
                        this.extensions = this.contentTypes[i].extensions;
                    }        
                }
            },
            addCollectionActivity() {
                let description = this.$refs.ue.getUEContent();
                let requirement = this.$refs.ue2.getUEContent();
                let bonusnote = this.$refs.ue3.getUEContent();

                let descriptiontext = this.$refs.ue.getUEContentTxt();
                let requirementtext = this.$refs.ue2.getUEContentTxt();
                let bonusnotetext = this.$refs.ue3.getUEContentTxt();

                this.activityForm.description = encodeURI(description);
                this.activityForm.requirement = encodeURI(requirement);
                this.activityForm.bonusnote = encodeURI(bonusnote);
                
                this.activityForm.descriptiontext = descriptiontext;
                this.activityForm.requirementtext = requirementtext;
                this.activityForm.bonusnotetext = bonusnotetext;
            }
        },
        created() {
            this.badWords = localStorage.getItem('badwords');
        }
    }

</script>
// Author : GOD
// Date End : 2019-2-7 4 PM
// Reason : Bug ID 369
<style lang="scss" scoped>
    @import '~scss_vars';

    section>.el-form>.content {
        max-width: 800px;
        min-width: 800px;
        width: 800px;
    }
    .info{
        border-radius: 10px;
        line-height: 20px;
        padding: 10px;
        margin: 10px;
        background-color: #ffffff;
    }
</style>