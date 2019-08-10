// Author : GOD
// Date Start : 2019-2-7 10 AM
// Reason : Bug ID 369
<template>
    <section>
        <el-row>
            <el-col :span="24" class="ecrm-search-title">
                <a class="selected">发起评比活动</a>
            </el-col>
        </el-row>
        <el-form :model="activityForm" :rules="activityFormRules" ref="activityForm" label-width="120px">
            <el-row class="content">
                <el-col :span="24" class="ecrm-content-panel">
                    <el-row id="activityname">
                        <el-col :span="24">
                            <el-form-item label="活动名称:" prop="activityname" class="is-required">
                                <el-input type="text" placeholder="评比活动名称" v-model="activityForm.activityname" @keyup.native="checkname" :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="主题图片:">
                                <input type="file" id="compareapprfile1" @change="readThumb1" style="display:none" accept=".png,.jpg"/>
                                <img :src="form.compareapprfile.blobfile1" style="width: 210px; height: 121px; border: 1px dashed gray; float:left; margin-right: 10px;" @click="openThumbFile1"/>
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
                    <el-row id="timeprop">
                        <el-col :span="24">
                            <el-form-item label="活动有效期:" class="is-required" prop="timeprop">
                                <el-date-picker type="date" v-model="activityForm.starttime"></el-date-picker>
                                -
                                <el-date-picker type="date" v-model="activityForm.endtime"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row id="requirement">
                        <el-col :span="24">
                            <el-form-item label="评比要求:"  class="is-required" prop="requirement">
                                <div class="components-container">
                                    <div class="editor-container">
                                          <UE :defaultMsg="activityForm.requirement" :config="ueConfig" :id="ue2" ref="ue2" :maxlength="500"></UE>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row id="checkprop">
                        <el-col :span="24">
                            <el-form-item label="资源格式设置:" class="is-required" prop="checkprop">
                                <el-checkbox-group v-model="activityForm.formats">
                                    <el-checkbox :label="item" v-for="(item, idx) in extensions" :key="idx" :data="item" :maxlength="1000"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row id="description">
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
                    <el-row id="timeprop2">
                        <el-col :span="24">
                            <el-form-item label="投票日期设定:" class="is-required" prop="timeprop2">
                                <el-date-picker type="date" v-model="activityForm.votestarttime"></el-date-picker>
                                -
                                <el-date-picker type="date" v-model="activityForm.voteendtime"></el-date-picker>
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
    import { addEstimateActivity, uploadFile } from '../../api/api';

    export default {
        data() {
            return {
                FRONTEND_CONTEXT: FRONTEND_CONTEXT,
                form: {
                    compareapprfile: {
                        blobfile: '',
                        blobfile1: '',
                        file: null,
                        file1: null
                    }
                },
                contentTypes: CONTENT_TYPE,
                addLoading: false,
                listLoading: false,
                previewLoading: false,
                previewstatus: false,
                activityForm: {
                    activityname: '',
                    logopath: '',
                    activitytemplate: '',
                    contenttype: CONTENT_TYPE[0].contenttype,
                    starttime: '',
                    endtime: '',
                    requirement: '',
                    formats: [],
                    description: '',
                    bonuspoints: 0,
                    votestarttime: '',
                    voteendtime: '',
                    according: '',
                    descriptiontext: '',
                    requirementtext: ''

                },
                activityFormRules: {
                    timeprop: [
                        { validator: this.validateActivityTime, trigger: 'blur' },
                    ],
                    timeprop2: [
                        { validator: this.validateActivityTime2, trigger: 'blur' },
                    ],
                    checkprop: [
                        { validator: this.validateCheck, trigger: 'blur' },
                    ],
                    activityname: [
                        { validator: this.validateActivityName, trigger: 'blur' }
                    ],
                    description: [
                        { validator: this.validateDescription, trigger: 'blur' }
                    ],
                    requirement: [
                        { validator: this.validateRequirement, trigger: 'blur' }
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
                badWords: '',
                errors: []
            }
        },
        methods: {
            validateBonuspoint(rule, value, callback) {
                if (this.activityForm.bonuspoints != parseInt(this.activityForm.bonuspoints)) {
                    this.errors[6] = document.getElementById('bonPnt');
                    callback(new Error('不能输入小数'));
                } else {
                    this.errors[6] = null;
                    callback();
                }
            },
            validateActivityName(rule, value, callback) {
                if (this.activityForm.activityname == "" || this.activityForm.activityname == null) {
                    this.errors[0] = document.getElementById('activityname');
                    callback(new Error('请输入活动名称'));
                } 
                // else if (this.badWords.includes(this.activityForm.activityname)) {
                //     this.errors[0] = document.getElementById('activityname');
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
                if (this.activityForm.requirement == "" || this.activityForm.requirement == null) {
                    this.errors[2] = document.getElementById('requirement');
                    callback(new Error('请输入评比要求'));
                } else if(this.activityForm.requirementtext.length > 500) {
                    this.errors[2] = document.getElementById('requirement');
                    callback(new Error('请输入1-500位字符'));
                } 
                // else if (this.badWords.includes(this.activityForm.requirementtext)) {
                //     this.errors[2] = document.getElementById('requirement');
                //     callback(new Error('不能上传含有黄色暴力反政治等内容的资源文件。'));
                // } 
                else {
                    this.errors[2] = null;
                    callback();
                }
            },
            validateDescription(rule, value, callback) {
                if (this.activityForm.description == "" || this.activityForm.description == null) {
                    this.errors[4] = document.getElementById('description');
                    callback(new Error('请输入活动介绍'));
                } else if(this.activityForm.descriptiontext.length > 1000) {
                    this.errors[4] = document.getElementById('description');
                    callback(new Error('请输入1-1000位字符'));
                } 
                // else if (this.badWords.includes(this.activityForm.descriptiontext)) {
                //     this.errors[4] = document.getElementById('description');
                //     callback(new Error('不能上传含有黄色暴力反政治等内容的资源文件。'));
                // } 
                else {
                    this.errors[4] = null;
                    callback();
                }
            },
            validateActivityTime(rule, value, callback) {
                if (this.activityForm.starttime == '' || this.activityForm.starttime == null || 
                    this.activityForm.endtime == '' || this.activityForm.endtime == null) {
                    this.errors[1] = document.getElementById('timeprop');
                    callback(new Error('请输入活动有效期'));
                } else {
                    this.errors[1] = null;
                    callback();
                }
            },
            validateActivityTime2(rule, value, callback) {
                if (this.activityForm.votestarttime == '' || this.activityForm.votestarttime == null || 
                    this.activityForm.voteendtime == '' || this.activityForm.voteendtime == null) {
                    this.errors[5] = document.getElementById('timeprop2');
                    callback(new Error('请输入投票日期设定'));
                } else {
                    this.errors[5] = null;
                    callback();
                }
            },
            validateCheck(rule, value, callback) {
                if (this.activityForm.formats.length == 0) {
                    this.errors[3] = document.getElementById('checkprop');
                    callback(new Error('请输入资源格式设置'));
                } else {
                    this.errors[3] = null;
                    callback();
                }
            },
            openThumbFile() {
                document.getElementById('compareapprfile').click();
            },
            openThumbFile1() {
                document.getElementById('compareapprfile1').click();
            },
            save() {
                this.previewstatus = false;
                this.addEstimate();
                this.$refs.activityForm.validate((valid) => {
                    if (valid) {
                        if (this.activityForm.starttime != '' && this.activityForm.endtime != '') {
                            if (new Date(this.activityForm.starttime) > new Date(this.activityForm.endtime)) {
                                this.$message({
                                    message: '查询结束时间不得大于开始时间。',
                                    type: 'error'
                                });
                                this.addLoading = false;
                                return;
                            } else if (ECRUtil.formatDate.format(new Date(this.activityForm.starttime), 'yyyy-MM-dd') == ECRUtil.formatDate.format(new Date(this.activityForm.endtime), 'yyyy-MM-dd')) {
                                this.$message({
                                    message: '结束日期不能等于开始日期。',
                                    type: 'warning'
                                });
                                this.addLoading = false;
                                return;
                            }
                        }
                        if (this.activityForm.votestarttime != '' && this.activityForm.voteendtime != '') {
                            if (new Date(this.activityForm.votestarttime) > new Date(this.activityForm.voteendtime)) {
                                this.$message({
                                    message: '投票结束时间不得大于开始时间。',
                                    type: 'error'
                                });
                                this.addLoading = false;
                                return;
                            } else if (ECRUtil.formatDate.format(new Date(this.activityForm.votestarttime), 'yyyy-MM-dd') == ECRUtil.formatDate.format(new Date(this.activityForm.voteendtime), 'yyyy-MM-dd')) {
                                this.$message({
                                    message: '投票日期不能等于开始日期。',
                                    type: 'warning'
                                });
                                this.addLoading = false;
                                return;
                            }
                        }
                        
                        if (this.form.compareapprfile.file != null) {
                            const data = new FormData();
                            data.append('file', this.form.compareapprfile.file);
                            this.addLoading = true;
                            uploadFile({ data:data, onUploadProgress:null }).then((res) => {
                                if (res.data.serverReults.resultCode == "200") {
                                    var path = res.data.fileInfos[0].localPath;
                                    this.activityForm.according = path;
                                    this.uploadLogoPath();
                                } else {
                                    this.addLoading = false;

                                    this.$message({
                                        message: res.data.serverReults.resultMessage,
                                        type: 'error'
                                    });
                                }
                            }).catch(() => {
                                this.addLoading = false;
                            });
                        } else {
                            this.addLoading = true;
                            this.uploadLogoPath();
                        }
                    } else {
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
                this.previewstatus = true;
                this.addEstimate();
                if (this.form.compareapprfile.file != null) {
                    const data = new FormData();
                    data.append('file', this.form.compareapprfile.file);
                    this.previewLoading = true;
                    uploadFile({ data:data, onUploadProgress:null }).then((res) => {
                        if (res.data.serverReults.resultCode == "200") {
                            var path = res.data.fileInfos[0].localPath;
                            this.activityForm.according = path;
                            this.uploadLogoPath();
                        } else {
                            this.$message({
                                  message: res.data.serverReults.resultMessage,
                                  type: 'error'
                            });
                            this.previewLoading = false;
                        }
                    }).catch(() => {
                        this.previewLoading = false;
                    });
                } else {
                    this.previewLoading = true;
                    this.uploadLogoPath();
                }
            },
            cancel() {
                this.$router.push('/raise');
            },
            uploadLogoPath() {
                if (this.form.compareapprfile.file1 != null) {
                    const data1 = new FormData();
                    data1.append('file1', this.form.compareapprfile.file1);
                    
                    uploadFile({ data:data1, onUploadProgress:null }).then((res) => {
                        if (res.data.serverReults.resultCode == "200") {
                            var path = res.data.fileInfos[0].localPath;
                            this.activityForm.logopath = path;
                            this.addSubmit();
                        } else {
                            this.$message({
                                  message: res.data.serverReults.resultMessage,
                                  type: 'error'
                            });

                            if (this.previewstatus) {
                                this.previewLoading = false;
                            } else {
                                this.addLoading = false;
                            }
                        }
                    }).catch(() => {
                        if (this.previewstatus) {
                            this.previewLoading = false;
                        } else {
                            this.addLoading = false;
                        }

                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        });
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
                var input = document.getElementById('compareapprfile');
                var reader = new FileReader();
                var _this = this;

                reader.onload = function (e) {
                    _this.form.compareapprfile.blobfile = e.target.result;
                }

                this.form.compareapprfile.file = input.files[0];
                if (!this.form.compareapprfile.file.type.startsWith("image")) {
                    this.$message({
                        message: '只能支持图片格式。',
                        type: 'error'
                    });
                    return;
                }
                reader.readAsDataURL(this.form.compareapprfile.file);
            },
            readThumb1() {
                var input = document.getElementById('compareapprfile1');
                var reader = new FileReader();
                var _this = this;

                reader.onload = function (e) {
                    _this.form.compareapprfile.blobfile1 = e.target.result;
                }

                this.form.compareapprfile.file1 = input.files[0];
                if (!this.form.compareapprfile.file1.type.startsWith("image")) {
                    this.$message({
                        message: '只能支持图片格式。',
                        type: 'error'
                    });
                    return;
                }
                reader.readAsDataURL(this.form.compareapprfile.file1);
            },
            clearThumbFile() {
                this.form.compareapprfile.file = null;
                this.form.compareapprfile.blobfile = '';
                document.getElementById('compareapprfile').value = null;
            },
            clearThumbFile1() {
                this.form.compareapprfile.file1 = null;
                this.form.compareapprfile.blobfile1 = '';
                document.getElementById('compareapprfile1').value = null;
            },
            addSubmit() {

                let params = {
                    activityname: this.activityForm.activityname,
                    starttime: ECRUtil.formatDate.format(new Date(this.activityForm.starttime), 'yyyy-MM-dd hh:mm:ss'),
                    endtime: ECRUtil.formatDate.format(new Date(this.activityForm.endtime), 'yyyy-MM-dd hh:mm:ss'),
                    votestarttime: ECRUtil.formatDate.format(new Date(this.activityForm.votestarttime), 'yyyy-MM-dd hh:mm:ss'),
                    voteendtime: ECRUtil.formatDate.format(new Date(this.activityForm.voteendtime), 'yyyy-MM-dd hh:mm:ss'),
                    requirement: this.activityForm.requirement,
                    requirementtext: this.activityForm.requirementtext,
                    formats: this.activityForm.formats,
                    description: this.activityForm.description,
                    bonuspoints: this.activityForm.bonuspoints,
                    descriptiontext: this.activityForm.descriptiontext,
                    enddescription: '',
                    enddescriptiontext: '',
                    activitytemplate: this.activityForm.activitytemplate,
                    according: this.activityForm.according,
                    logopath: this.activityForm.logopath,
                    contenttype: this.activityForm.contenttype
                };

                addEstimateActivity(params).then((res) => {
                    if(res.data.serverResult.resultCode == "200") {
                        if (this.previewstatus == false) {
                            this.$router.push('/compareappr');
                        } else if (this.previewstatus == true) {
                            this.activityInfo = res.data.responseEntity;
                            this.handlePreview(this.activityInfo);
                        }
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
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

                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });

            },
            handlePreview(activity) {
                var w = window.open(this.FRONTEND_CONTEXT + 'compareappr/' + activity.activityid);
                w.focus();
                this.$router.push('/compareappr');
            },
            goCompareAppr() {
                this.$router.push('/compareappr');
            },
            onChangeConentType(contenttype) {
                for(var i=0; i<this.contentTypes.length; i++) {
                    if (this.contentTypes[i].contenttype == contenttype) {
                        this.extensions = this.contentTypes[i].extensions;
                    }        
                }
            },
            addEstimate() {
                let description = this.$refs.ue.getUEContent();
                let requirement = this.$refs.ue2.getUEContent();
                let descriptiontext = this.$refs.ue.getUEContentTxt();
                let requirementtext = this.$refs.ue2.getUEContentTxt();

                this.activityForm.description = encodeURI(description);
                this.activityForm.requirement = encodeURI(requirement);

                this.activityForm.descriptiontext = descriptiontext;
                this.activityForm.requirementtext = requirementtext;
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
</style>