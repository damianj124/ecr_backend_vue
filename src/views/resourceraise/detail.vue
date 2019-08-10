<template>
    <section v-if="activityInfo != null">
        <el-row>
            <el-col :span="24" class="ecrm-search-title">
                <a class="selected">征集活动详情</a>
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
                            <el-form-item label="奖励积分:" prop="bonuspoints" class="is-required">
                                <el-input-number v-model.number="activityInfo.bonuspoints" :min="1"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="活动类型:">
                                <el-select v-model="activityInfo.contenttype" @change="onChangeConentType(activityInfo.contenttype)">
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
                            <el-form-item label="征集要求:" prop="requirement" class="is-required">
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
                            <el-form-item label="推荐:">
                                <el-checkbox-group v-model="activityInfo.recommand">
                                    <el-checkbox></el-checkbox>
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
                            <el-form-item label="奖励说明:" prop="bonusnote" class="is-required">
                                <div class="components-container">
                                    <div class="editor-container">
                                          <UE :defaultMsg="activityInfo.bonusnote" :config="ueConfig" id="ue_bonus" ref="bonus" :maxlength="500"></UE>
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
    import { editCollectionActivity, getActivity, uploadFile } from '../../api/api';

    export default {
        data() {
            return {
                ECRUtil: ECRUtil,
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
                activityFormRules: {
                    timeprop: [
                        { validator: this.validateActivityTime, trigger: 'blur' },
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
                    bonusnote: [
                        { validator: this.validateCheckBonusnote, trigger: 'blur' }
                    ],
                    bonuspoints: [
                        { validator: this.validateBonuspoint, trigger: 'blur' }
                    ]
                },
                contentTypes: CONTENT_TYPE,
                /////////// Pagination ///////////
                total: 0,
                page: 1,
                page_size: 5,
                /////////// Pagination End ////////
                addLoading: false,
                listLoading: false,
                extensions: [],
                activityInfo: null,
                ueConfig: {
                  initialFrameWidth: null,
                  initialFrameHeight: 150
                },
                ue2: "ue2",
                ue3: "ue3",
                badWords: ''
            }
        },
        methods: {
            validateBonuspoint(rule, value, callback) {
                if (this.activityInfo.bonuspoints != parseInt(this.activityInfo.bonuspoints)) {
                    callback(new Error('不能输入小数'));
                } else {
                    callback();
                }
            },
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
            validateRequirement(rule, value, callback) {
                if (this.activityInfo.requirement == "" || this.activityInfo.requirement == null) {
                    callback(new Error('请输入征集要求'));
                } else if(this.activityInfo.requirementtext.length > 500) {
                    callback(new Error('请输入1-500位字符'));
                } else {
                    callback();
                }
            },
            validateCheckBonusnote(rule, value, callback) {
                if(this.activityInfo.bonusnote == '' || this.activityInfo.bonusnote == null) {
                    callback(new Error('请输入奖励说明'));
                } else if(this.activityInfo.bonusnotetext.length > 500) {
                    callback(new Error('请输入1-500位字符'));
                } else {
                    callback();
                }        
            },
            validateCheck(rule, value, callback) {
                if(this.activityInfo.formats == null){
                    this.activityInfo.formats = [];
                }
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
            openThumbFile2() {
                document.getElementById('coursethumb2').click();
            },
            openThumbFile3() {
                document.getElementById('coursethumb3').click();
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
                this.activityInfo.logopath = '';
            },
            clearThumbFile1() {
                this.form.coursethumb.file1 = null;
                this.form.coursethumb.blobfile1 = '';
                document.getElementById('coursethumb1').value = null;
                this.activityInfo.accordings[0] = '';
            },
            clearThumbFile2() {
                this.form.coursethumb.file2 = null;
                this.form.coursethumb.blobfile2 = '';
                document.getElementById('coursethumb2').value = null;
                this.activityInfo.accordings[1] = '';
            },
            clearThumbFile3() {
                this.form.coursethumb.file3 = null;
                this.form.coursethumb.blobfile3 = '';
                document.getElementById('coursethumb3').value = null;
                this.activityInfo.accordings[2] = '';
            },
            save() {
                if (this.form.coursethumb.file != null) {
                    const data = new FormData();
                    data.append('file', this.form.coursethumb.file);
                    this.addLoading = true;
                    uploadFile({ data:data, onUploadProgress:null }).then((res) => {
                        if (res.data.serverReults.resultCode == "200") {
                            var path = res.data.fileInfos[0].localPath;
                            this.activityInfo.accordings[0] = path;

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
                            this.save1();
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
                    this.save1();
                }
            },
            save1() {
                if (this.form.coursethumb.file2 != null) {
                    const data2 = new FormData();
                    data2.append('file2', this.form.coursethumb.file2);
                    this.addLoading = true;
                    uploadFile({ data:data2, onUploadProgress:null }).then((res) => {
                        if (res.data.serverReults.resultCode == "200") {
                            var path = res.data.fileInfos[0].localPath;
                            this.activityInfo.accordings[1] = path;
                            this.save2();
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
                    this.save2();
                }
            },
            save2() {
                if (this.form.coursethumb.file3 != null) {
                    const data3 = new FormData();
                    data3.append('file3', this.form.coursethumb.file3);
                    this.addLoading = true;
                    uploadFile({ data:data3, onUploadProgress:null }).then((res) => {
                        if (res.data.serverReults.resultCode == "200") {
                            var path = res.data.fileInfos[0].localPath;
                            this.activityInfo.accordings[2] = path;
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
                        if ((!this.activityInfo.starttime)  || (!this.activityInfo.endtime)){
                            this.$message({
                                message: '请输入活动有效期。',
                                type: 'error'
                            });
                            this.addLoading = false;
                            return;
                        }                      
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
                            bonusnote: this.activityInfo.bonusnote,
                            bonusnotetext: this.activityInfo.bonusnotetext,
                            bonuspoints: this.activityInfo.bonuspoints,
                            activitytemplate: this.activityInfo.activitytemplate,
                            accordings: this.activityInfo.accordings,
                            logopath: this.activityInfo.logopath,
                            contenttype: this.activityInfo.contenttype,
                            recommand: (this.activityInfo.recommand == true)?'1':'0'
                        };
                        editCollectionActivity(params).then((res) => {
                            if(res.data.serverResult.resultCode == "200") {
                                this.$router.push('/raise');
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
            onChangeConentType(contenttype) {
                this.activityInfo.formats = [];
                for(var i=0; i<this.contentTypes.length; i++) {
                    if (this.contentTypes[i].contenttype == contenttype) {
                        this.extensions = this.contentTypes[i].extensions;
                    }        
                }
            },
            getExtensions(contenttype) {
                for(var i=0; i<this.contentTypes.length; i++) {
                    if (this.contentTypes[i].contenttype == contenttype) {
                        return this.contentTypes[i].extensions;
                    }        
                }
                return "";
            },
            goBack() {
                this.$router.push('/raise');
            },
            handleGetActivity(activityid) {
                this.listLoading = true;
                getActivity( activityid ).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.activityInfo = res.data.responseEntity;
                        this.activityInfo.requirement = ECRUtil.getHtmlCode(this.activityInfo.requirement);
                        this.activityInfo.description = ECRUtil.getHtmlCode(this.activityInfo.description);
                        this.activityInfo.bonusnote = ECRUtil.getHtmlCode(this.activityInfo.bonusnote);
                        this.activityInfo.recommand = (this.activityInfo.recommand == "1")?true:false;
                        this.form.coursethumb.blobfile = ECO_MEDIA_PATH + this.activityInfo.accordings[0];
                        this.form.coursethumb.blobfile2 = ECO_MEDIA_PATH + this.activityInfo.accordings[1];
                        this.form.coursethumb.blobfile3 = ECO_MEDIA_PATH + this.activityInfo.accordings[2];
                        this.form.coursethumb.blobfile1 = ECO_MEDIA_PATH + this.activityInfo.logopath;
                        this.extensions = this.getExtensions(this.activityInfo.contenttype);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.activityInfo = null;
                    }
                    this.listLoading = false;
                }).catch(() => {
                    this.activityInfo = null;
                    this.listLoading = false;

                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            getUEContent() {
                let description = this.$refs.desc.getUEContent();
                let requirement = this.$refs.req.getUEContent();
                let bonusnote = this.$refs.bonus.getUEContent();
                this.activityInfo.description = encodeURI(description);
                this.activityInfo.requirement = encodeURI(requirement);
                this.activityInfo.bonusnote = encodeURI(bonusnote);
                this.getUEContentTxT();
            },
            getUEContentTxT() {
                let descriptiontext = this.$refs.desc.getUEContentTxt();
                let requirementtext = this.$refs.req.getUEContentTxt();
                let bonusnotetext = this.$refs.bonus.getUEContentTxt();
                this.activityInfo.descriptiontext = descriptiontext;
                this.activityInfo.requirementtext = requirementtext;
                this.activityInfo.bonusnotetext = bonusnotetext;
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