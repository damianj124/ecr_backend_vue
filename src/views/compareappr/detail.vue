<template>
    <section v-if="activityInfo != null">
        <el-row>
            <el-col :span="24" class="ecrm-search-title">
                <a class="selected">评比活动详情</a>
            </el-col>
        </el-row>
        <el-form ref="activityForm" :model="activityInfo" :rules="activityFormRules" label-width="120px">
            <el-row class="content">
                <el-col :span="24" class="ecrm-content-panel">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="活动名称:" prop="activityname" class="is-required">
                                <el-input type="text" v-model="activityInfo.activityname" @keyup.native="checkname" :maxlength="30"></el-input>
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
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="活动类型:">
                                <el-select v-model="activityInfo.contenttype" @change="onChangeContentType(activityInfo.contenttype)">
                                    <el-option :label="item.contentname" :value="item.contenttype" v-for="(item, idx) in contentTypes" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="活动有效期:" class="is-required" prop="timeprop">
                                <el-date-picker type="date" v-model="activityInfo.starttime"></el-date-picker>
                                -
                                <el-date-picker type="date" v-model="activityInfo.endtime"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="评比要求:" prop="requirement" class="is-required">
                                <div class="components-container">
                                    <div class="editor-container">
                                          <UE :defaultMsg="activityInfo.requirement" :config="ueConfig" id="ue_req" ref="req" :maxlength="500"></UE>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="资源格式设置:" class="is-required" prop="checkprop">
                                <el-checkbox-group v-model="activityInfo.formats">
                                    <el-checkbox :label="item" v-for="(item, idx) in extensions" :key="idx" :data="item"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="活动介绍:" prop="description" class="is-required">
                                <div class="components-container">
                                    <div class="editor-container">
                                          <UE :defaultMsg="activityInfo.description" :config="ueConfig" id="ue_desc" ref="desc" :maxlength="1000"></UE>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="投票日期设定:" class="is-required" prop="timeprop2">
                                <el-date-picker type="date" v-model="activityInfo.votestarttime"></el-date-picker>
                                -
                                <el-date-picker type="date" v-model="activityInfo.voteendtime"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="评比结果公布:" prop="enddescription" class="is-required">
                                <div class="components-container">
                                    <div class="editor-container">
                                          <UE :defaultMsg="activityInfo.enddescription" :config=ueConfig :id=ue2 ref="ue2" :maxlength="1000"></UE>
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
                        <el-button @click="goBack">取消</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util'
    import { CONTENT_TYPE } from '../../common/js/const.js';
    import { editEstimateActivity, getEstimateActivity, uploadFile } from '../../api/api';

    export default {
        data() {
            return {
                form: {
                    coursethumb: {
                        blobfile: '',
                        blobfile1: '',
                        file: null,
                        file1: null
                    }
                },
                activityFormRules: {
                    timeprop: [
                        { validator: this.validateActivityTime },
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
                    requirement: [
                        { validator: this.validateRequirement, trigger: 'blur' }
                    ],
                    description: [
                        { validator: this.validateDescription, trigger: 'blur' }
                    ],
                    enddescription: [
                        { validator: this.validateEndDescription, trigger: 'blur' }
                    ]
                },
                contentTypes: CONTENT_TYPE,
                addLoading: false,
                listLoading: false,
                extensions: [],
                activityInfo: null,
                defaultMsg: '',
                ueConfig: {
                  initialFrameWidth: null,
                  initialFrameHeight: 150
                },
                ue2: "ue2",
                badWords: ''
            }
        },
        methods: {
            validateActivityName(rule, value, callback) {
                if (this.activityInfo.activityname == "" || this.activityInfo.activityname == null) {
                    callback(new Error('请输入活动名称'));
                } else {
                    callback();
                }
            },
            checkname() {
                this.activityInfo.activityname = ECRUtil.removespace(this.activityInfo.activityname);
            },
            validateDescription(rule, value, callback) {
                if (this.activityInfo.description == "" || this.activityInfo.description == null) {
                    callback(new Error('请输入活动介绍'));
                } else if(this.activityInfo.descriptiontext.length > 1000) {
                    callback(new Error('请输入1-1000位字符'));
                } else {
                    callback();
                }
            },
            validateEndDescription(rule, value, callback) {
                if (this.activityInfo.enddescription == "" || this.activityInfo.enddescription == null) {
                    callback(new Error('请输入评比结果公布'));
                } else if(this.activityInfo.enddescriptiontext.length > 1000) {
                    callback(new Error('请输入1-1000位字符'));
                } else {
                    callback();
                }
            },
            validateRequirement(rule, value, callback) {
                if (this.activityInfo.requirement == "" || this.activityInfo.requirement == null) {
                    callback(new Error('请输入评比要求'));
                } else if(this.activityInfo.requirementtext.length > 500) {
                    callback(new Error('请输入1-500位字符'));
                } else {
                    callback();
                }
            },
            validateActivityTime(rule, value, callback) {
                if (this.activityInfo.starttime == '' || this.activityInfo.starttime == null || this.activityInfo.endtime == '' || this.activityInfo.endtime == null) {
                    callback(new Error('请输入活动有效期'));
                } else if(new Date(this.activityInfo.starttime) > new Date(this.activityInfo.endtime)){
                    callback(new Error('查询结束时间不得大于开始时间。'));
                } else if(ECRUtil.formatDate.format(new Date(this.activityInfo.starttime), 'yyyy-MM-dd') == ECRUtil.formatDate.format(new Date(this.activityInfo.endtime), 'yyyy-MM-dd')){
                    callback(new Error('结束日期不能等于开始日期。'));
                } else {
                    callback();
                }
            },
            validateActivityTime2(rule, value, callback) {
                if (this.activityInfo.votestarttime == '' || this.activityInfo.votestarttime == null || this.activityInfo.voteendtime == '' || this.activityInfo.voteendtime == null) {
                    callback(new Error('请输入投票日期设定'));
                } else {
                    callback();
                }
            },
            validateCheck(rule, value, callback) {
                if (this.activityInfo.formats.length == 0) {
                    callback(new Error('请输入资源格式设置'));
                } else {
                    callback();
                }
            },
            openThumbFile() {
                document.getElementById('coursethumb').click();
            },
            openThumbFile1() {
                document.getElementById('coursethumb1').click();
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
            clearThumbFile() {
                this.form.coursethumb.file = null;
                this.form.coursethumb.blobfile = '';
                document.getElementById('coursethumb').value = null;
                this.activityInfo.according = '';
            },
            clearThumbFile1() {
                this.form.coursethumb.file1 = null;
                this.form.coursethumb.blobfile1 = '';
                document.getElementById('coursethumb1').value = null;
                this.activityInfo.logopath = '';
            },
            save() {
                if (this.form.coursethumb.file != null) {
                    const data = new FormData();
                    data.append('file', this.form.coursethumb.file);
                    this.addLoading = true;
                    uploadFile({ data:data, onUploadProgress:null }).then((res) => {
                        if (res.data.serverReults.resultCode == "200") {
                            var path = res.data.fileInfos[0].localPath;
                            this.activityInfo.according = path;
                            this.uploadLogoPath();
                        } else {
                            this.$message({
                                  message: res.data.serverReults.resultMessage,
                                  type: 'error'
                            });
                            return;
                        }
                        this.addLoading = false;
                    });
                } else {
                    this.uploadLogoPath();
                }
            },
            uploadLogoPath() {
                if (this.form.coursethumb.file1 != null) {
                    const data1 = new FormData();
                    data1.append('file1', this.form.coursethumb.file1);
                    this.addLoading = true;
                    uploadFile({ data:data1, onUploadProgress:null }).then((res) => {
                        if (res.data.serverReults.resultCode == "200") {
                            var path = res.data.fileInfos[0].localPath;
                            this.activityInfo.logopath = path;
                            this.getUEContent();
                        } else {
                            this.$message({
                                  message: res.data.serverReults.resultMessage,
                                  type: 'error'
                            });
                            return;
                        }
                        this.addLoading = false;
                    });
                } else {
                    this.getUEContent();
                }
            },
            editSubmit() {
                this.$refs.activityForm.validate((valid) => {
                      if (valid) {
                        this.addLoading = true;
                        if (this.activityInfo.starttime != '' && this.activityInfo.endtime != '') {
                            if (new Date(this.activityInfo.starttime) > new Date(this.activityInfo.endtime)) {
                                this.$message({
                                    message: '查询结束时间不得大于开始时间。',
                                    type: 'error'
                                });
                                this.addLoading = false;
                                return;
                            } else if (ECRUtil.formatDate.format(new Date(this.activityInfo.starttime), 'yyyy-MM-dd') == ECRUtil.formatDate.format(new Date(this.activityInfo.endtime), 'yyyy-MM-dd')) {
                                this.$message({
                                    message: '结束日期不能等于开始日期。',
                                    type: 'warning'
                                });
                                this.addLoading = false;
                                return;
                            }
                        }
                        if (this.activityInfo.votestarttime != '' && this.activityInfo.voteendtime != '') {
                            if (new Date(this.activityInfo.votestarttime) > new Date(this.activityInfo.voteendtime)) {
                                this.$message({
                                    message: '投票结束时间不得大于开始时间。',
                                    type: 'error'
                                });
                                this.addLoading = false;
                                return;
                            } else if (ECRUtil.formatDate.format(new Date(this.activityInfo.votestarttime), 'yyyy-MM-dd') == ECRUtil.formatDate.format(new Date(this.activityInfo.voteendtime), 'yyyy-MM-dd')) {
                                this.$message({
                                    message: '投票日期不能等于开始日期。',
                                    type: 'warning'
                                });
                                this.addLoading = false;
                                return;
                            }
                        }
                        let params = {
                            activityid: this.activityInfo.activityid,
                            activityname: this.activityInfo.activityname,
                            starttime: ECRUtil.formatDate.format(new Date(this.activityInfo.starttime), 'yyyy-MM-dd hh:mm:ss'),
                            endtime: ECRUtil.formatDate.format(new Date(this.activityInfo.endtime), 'yyyy-MM-dd hh:mm:ss'),
                            requirement: this.activityInfo.requirement,
                            requirementtext: this.activityInfo.requirementtext,
                            formats: this.activityInfo.formats,
                            description: this.activityInfo.description,
                            descriptiontext: this.activityInfo.descriptiontext,
                            according: this.activityInfo.according,
                            logopath: this.activityInfo.logopath,
                            contenttype: this.activityInfo.contenttype,
                            votestarttime: ECRUtil.formatDate.format(new Date(this.activityInfo.votestarttime), 'yyyy-MM-dd hh:mm:ss'),
                            voteendtime: ECRUtil.formatDate.format(new Date(this.activityInfo.voteendtime), 'yyyy-MM-dd hh:mm:ss'),
                            enddescription: this.activityInfo.enddescription,
                            enddescriptiontext: this.activityInfo.enddescriptiontext
                        };
                        editEstimateActivity(params).then((res) => {
                            if(res.data.serverResult.resultCode == "200") {
                                this.$router.push('/compareappr');
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
                });
            },
            onChangeContentType(contenttype) {
                this.activityInfo.formats = [];
                for(var i=0; i<this.contentTypes.length; i++) {
                    if (this.contentTypes[i].contenttype == contenttype) {
                        this.extensions = this.contentTypes[i].extensions;
                        break;
                    }        
                }
            },
            getExtensions(contenttype) {
                for(var i=0; i<this.contentTypes.length; i++) {
                    if (this.contentTypes[i].contenttype == contenttype) {
                        return this.contentTypes[i].extensions;
                    }
                }
                return [];
            },
            goBack() {
                this.$router.push('/compareappr');
            },
            handleGetActivity(activityid) {
                this.listLoading = true;
                getEstimateActivity( activityid ).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.activityInfo = res.data.responseEntity;
                        this.activityInfo.requirement = ECRUtil.getHtmlCode(this.activityInfo.requirement);
                        this.activityInfo.description = ECRUtil.getHtmlCode(this.activityInfo.description);
                        this.activityInfo.enddescription = ECRUtil.getHtmlCode(this.activityInfo.enddescription);
                        this.form.coursethumb.blobfile = ECO_MEDIA_PATH + this.activityInfo.according;
                        this.form.coursethumb.blobfile1 = ECO_MEDIA_PATH + this.activityInfo.logopath;
                        this.extensions = this.getExtensions(this.activityInfo.contenttype);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = false;

                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            getUEContent() {
                let enddescription = this.$refs.ue2.getUEContent();
                let description = this.$refs.desc.getUEContent();
                let requirement = this.$refs.req.getUEContent();
                this.activityInfo.enddescription = encodeURI(enddescription);
                this.activityInfo.description = encodeURI(description);
                this.activityInfo.requirement = encodeURI(requirement);
                this.getUEContentTxt();
            },
            getUEContentTxt() {
                let enddescription = this.$refs.ue2.getUEContentTxt();
                let descriptiontext = this.$refs.desc.getUEContentTxt();
                let requirementtext = this.$refs.req.getUEContentTxt();
                this.activityInfo.descriptiontext = descriptiontext;
                this.activityInfo.enddescriptiontext = enddescription;
                this.activityInfo.requirementtext = requirementtext;
                this.editSubmit();
            }
        },
        created() {
            this.badWords = localStorage.getItem('badwords');
            let activityid = this.$route.params.id;
            this.handleGetActivity(activityid);
        }
    }

</script>

<style lang="scss" scoped>
    @import '~scss_vars';
    
    section>.el-form>.content {
        max-width: 800px;
    }
</style>