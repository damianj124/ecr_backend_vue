// Author : GOD, Date : 2010-2-26 Bug ID: #911
<template>
	<section>
		<el-col :span="24" class="ecrm-search-title">
            <a class="selected">修改专题</a>
        </el-col>
		<el-col :span="24" class="ecrm-content-panel">
			<el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px">
				<el-row>
					<el-col :span="8">
						<el-form-item label="专题描述:" prop="description">
							<el-input type="text" v-model="editForm.description"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="父专题ID:" prop="parentthemeid">
							<el-input v-model="editForm.parentthemeid" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="专题名称:" prop="themename">
							<el-input type="text" v-model="editForm.themename"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
	                <el-col :span="8">
	                    <el-form-item label="学段:" prop="schoolsection" class="is-required">
	                        <el-select v-model="editForm.schoolsection" @change="onSchoolSectionChange(editForm.schoolsection)">
	                            <el-option label="全部" value=""></el-option>
	                            <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in schoolSections" :key="idx" :data="item"></el-option>
	                        </el-select>
	                    </el-form-item>
	                </el-col>
	                <el-col :span="8">
	                    <el-form-item label="学科:" prop="subjectid" class="is-required">
	                        <el-select v-model="editForm.subjectid">
	                            <el-option label="全部" value=""></el-option>
	                            <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in subjects" :key="idx" :data="item"></el-option>
	                        </el-select>
	                    </el-form-item>
	                </el-col>
	                <el-col :span="8">
	                    <el-form-item label="年级:" prop="grade" class="is-required">
	                        <el-select v-model="editForm.grade">
	                            <el-option label="全部" value=""></el-option>
	                            <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in grades" :key="idx" :data="item"></el-option>
	                        </el-select>
	                    </el-form-item>
	                </el-col>
	            </el-row>
	            <el-row>
	                <el-col :span="8">
	            		<el-form-item label="专题类型:" prop="themetype">
	            			<el-select v-model="editForm.themetype">
	            				<el-option label="全部" value=""></el-option>
	            				<el-option label="天闻专题" value="1"></el-option>
	            				<el-option label="第三方应用专题" value="2"></el-option>
	            			</el-select>
	            		</el-form-item>
	            	</el-col>
	            </el-row>
	            <el-row>
                    <el-col :span="24">
                        <el-form-item label="图片:">
                            <input type="file" id="coursethumb1" @change="readThumb1" style="display:none" accept=".png,.jpg"/>
                            <!-- <img :src="form.coursethumb.blobfile1" style="width: 210px; height: 121px; border: 1px dashed gray; float:left; margin-right: 10px;" @click="openThumbFile1" v-if="form.coursethumb.blobfile1 != null"/> -->
                            <img :src="logopath" style="width: 210px; height: 121px; border: 1px dashed gray; float:left; margin-right: 10px;" @click="openThumbFile1"/>
                            <div style="height: 121px;">
                                <el-button type="small" style="width: 80px; margin-top: 30px;" @click="openThumbFile1">本地上传</el-button><br>
                                <el-button type="small" style="width: 80px;" @click="clearThumbFile1">清空</el-button>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
					<el-col :span="8">
						<el-form-item label="顺序号:" prop="orderno">
							<el-input-number v-model.number="editForm.orderno" :min="1"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="使用年份:" prop="copyright">
							<el-input type="text" v-model="editForm.copyright"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
                        <el-form-item label="是否允许下载:">
                            <el-checkbox-group v-model="editForm.isallowdownload">
                                <el-checkbox></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
				</el-row>
				<el-row>
	                <el-col :span="24">
	                    <div style="padding: 20px 0px 50px 0px; border-top: 1px dashed #e8e8e8; text-align: center">
	                        <el-button type="primary" @click="update" :loading="addLoading">保存</el-button>
	                        <el-button type="default" @click="cancel">取消</el-button>
	                    </div>
	                </el-col>
	            </el-row>
            </el-form>
		</el-col>
	</section>
</template>
<script>
	import ECRUtil from '../../common/js/util'
	import { getSchoolSectionList, getSubjectList, getNaviGradeList, uploadFile, getThemeDetail, modifyTheme} from '../../api/api';
	export default {
		data() {
			return {
				ECRUtil: ECRUtil,
				filters: {
                    schoolsectionid: '',
                    subjectid: '',
                    gradeid: ''
                },
                form: {
                    coursethumb: {
                        blobfile1: '',
                        file1: null
                    }
                },
                schoolSections: [],
                selectedSchoolSection: '',
                selectedSubject: '',
                subjects: [],
                grades: [],
                editForm: {
                	description:'',
					schoolsection:'',
					grade:'',
					subjectid:'',
					logopath:'',
					themetype:'',
					subthemetype:'',
					parentthemeid:'',
					copyright:'',
					isallowdownload: false,
					orderno:1,
					themename:''
                },
                editFormRules: {
                    description: [
                        { required: true, message: '请输入父专题', trigger: 'blur' },
                    ],
                    schoolsection: [
                        { validator: this.validateSchoolSection, trigger: 'blur' },
                    ],
                    grade: [
                        { validator: this.validateGrdae, trigger: 'blur' }
                    ],
                    subject: [
                        { validator: this.validateSubject, trigger: 'blur' }
                    ],
                    copyright: [
                        { required: true, message: '请输入使用年份', trigger: 'blur' }
                    ],
                    themename: [
                        { required: true, message: '请输入专题名称', trigger: 'blur' }
                    ]
                },
                addLoading: false,
                logopath: ''

			}
		},
		computed: {
        },
		methods: {
            validateSchoolSection(rule, value, callback) {
                if (this.editForm.schoolsection == '' || this.editForm.schoolsection == null) {
                    callback(new Error('请输入学段'));
                } else {
                    callback();
                }
            },
            validateSubject(rule, value, callback) {
                if (this.editForm.subjectid == '' || this.editForm.subjectid == null) {
                    callback(new Error('请输入学科'));
                } else {
                    callback();
                }
            },
            validateGrdae(rule, value, callback) {
                if (this.editForm.grade == '' || this.editForm.grade == null) {
                    callback(new Error('请输入年级'));
                } else {
                    callback();
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
                if (this.editForm.schoolsection == "") {
                    this.subjectlist = [];
                    this.gradelist = [];
                } else {
                    this.getSubjectList();
                    this.getNaviGradeList();
                }
            },
            getSubjectList() {
                let param = {
                    schoolsectionid: this.editForm.schoolsection
                };
                getSubjectList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.subjects = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        for(var i = 0; i<this.subjects.length; i++) {
                            if(this.subjects[i].dictvalue == this.editForm.subjectid) {
                                this.editForm.subjectid = this.subjects[i].dictvalue;
                                return;
                            }
                        }
                        this.editForm.subjectid = '';
                    } else {
                        this.subjects = [];
                    }
                });
            },
            getNaviGradeList() {
                let param = {
                    schoolsectionid: this.editForm.schoolsection
                };
                getNaviGradeList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.grades = ECRUtil.composeSysDict(res.data.pageInfo.list);
                        
                        for(var i = 0; i<this.grades.length; i++) {
                            console.log(this.editForm.grade)
                            if(this.grades[i].dictvalue == this.editForm.grade) {
                                this.editForm.grade = this.grades[i].dictvalue;
                                console.log(this.editForm.grade)
                                return;
                            }
                        }
                        this.editForm.grade = '';
                    } else {
                        this.grades = [];
                    }
                });
            },
            readThumb1() {
                var input = document.getElementById('coursethumb1');
                var reader = new FileReader();
                var _this = this;

                reader.onload = function (e) {
                    _this.form.coursethumb.blobfile1 = e.target.result;
                    _this.logopath = e.target.result;
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
            openThumbFile1() {
                document.getElementById('coursethumb1').click();
            },
            clearThumbFile1() {
                this.form.coursethumb.file1 = null;
                this.form.coursethumb.blobfile1 = '';
                document.getElementById('coursethumb1').value = null;
            },
            update() {
            	if (this.form.coursethumb.file1 != null) {
                    const data = new FormData();
                    data.append('file1', this.form.coursethumb.file1);
                    this.addLoading = true;
                    uploadFile({ data:data, onUploadProgress:null }).then((res) => {
                        if (res.data.serverReults.resultCode == "200") {
                            var path = res.data.fileInfos[0].localPath;
                            this.editForm.logopath = path;

                            this.updateAction();
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
                    this.updateAction();
                }
            },
            updateAction() {
                this.addLoading = true;
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                    	var param = {
                            themeid: this.editForm.themeid,
                    		description: this.editForm.description,
        					schoolsection: this.editForm.schoolsection,
        					grade: this.editForm.grade,
        					subjectid: this.editForm.subjectid,
        					logopath: this.editForm.logopath,
        					themetype: this.editForm.themetype,
        					subthemetype: '',
        					parentthemeid: this.editForm.parentthemeid,
        					copyright: this.editForm.copyright,
        					isallowdownload: (this.editForm.isallowdownload)?'1':'0',
        					orderno: this.editForm.orderno,
        					themename: this.editForm.themename
                    	};
                    	modifyTheme(param).then((res) => {
                    		if(res.data.serverResult.resultCode == "200") {
                                this.$message({ 
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.$router.push('/special');
                    		} else {
        						this.$message({	
                                    message: res.data.serverResult.resultMessage,
                                    type: 'error'
                                });
                    		}
                            this.addLoading = false;
                    	}).catch((res) => {
                            this.addLoading = false;
                    		this.$message({	
                                message: res.data.serverResult.resultMessage,
                                type: 'error'
                            });
                    	});
                    }
                });
            },
            cancel() {
                this.$router.push('/special');
            },
            load() {
                // this.editForm.description = this.theme.description;
                let themeid = this.$route.params.id;
                getThemeDetail(themeid).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {

                        this.editForm = res.data.responseEntity;

                        this.selectedSchoolSection = this.editForm.schoolsection;
                        this.selectedSubject = this.editForm.subjectid;
                        

                        this.logopath = 'http://open.teewon.net:9000/fs/media/' + this.editForm.logopath;

                        this.editForm.isallowdownload = (this.editForm.isallowdownload=="1")?true:false;

                        // this.getSubjectList(this.selectedSchoolSection);
                        // this.getNaviGradeList(this.selectedSchoolSection);

                        // this.load();
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            }
		},
		created() {
			this.getSchoolSectionList();
            this.getSubjectList();
            this.load();
		},
		mounted() {

		}
	}
</script>
<style lang="scss" scoped>
    @import '~scss_vars';
    
</style>