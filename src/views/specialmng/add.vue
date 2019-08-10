<template>
	<section>
		<el-col :span="24" class="ecrm-search-title">
            <a class="selected">新增专题</a>
        </el-col>
		<el-col :span="24" class="ecrm-content-panel">
			<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px">
				<el-row>
                    <el-col :span="8">
						<el-form-item label="专题名称:" prop="themename">
							<el-input type="text" v-model="addForm.themename"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="8">
						<el-form-item label="专题描述:" prop="description">
							<el-input type="text" v-model="addForm.description"></el-input>
						</el-form-item>
					</el-col>
					
                    <el-col :span="8">
						<el-form-item label="父专题ID:" prop="parentthemeid">
							<el-input v-model="addForm.parentthemeid" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
	                <el-col :span="8">
	                    <el-form-item label="学段:" prop="schoolsection" class="is-required">
	                        <el-select v-model="filters.schoolsectionid" @change="onSchoolSectionChange()">
	                            <el-option label="全部" value=""></el-option>
	                            <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in schoolSections" :key="idx" :data="item"></el-option>
	                        </el-select>
	                    </el-form-item>
	                </el-col>
	                <el-col :span="8">
	                    <el-form-item label="学科:" prop="subject" class="is-required">
	                        <!-- <el-select v-model="filters.subjectid" @change="getNaviEditionTypeList()"> -->
                            <el-select v-model="filters.subjectid">
	                            <el-option label="全部" value=""></el-option>
	                            <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in subjects" :key="idx" :data="item"></el-option>
	                        </el-select>
	                    </el-form-item>
	                </el-col>
	                <el-col :span="8">
	                    <el-form-item label="年级:" prop="grade" class="is-required">
	                        <el-select v-model="filters.gradeid">
	                            <el-option label="全部" value=""></el-option>
	                            <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in grades" :key="idx" :data="item"></el-option>
	                        </el-select>
	                    </el-form-item>
	                </el-col>
	            </el-row>
	            <el-row>
	                <!-- <el-col :span="8">
	                    <el-form-item label="版本:" prop="editiontype" class="is-required">
	                        <el-select v-model="filters.editiontypeid" @change="getNaviBookModelList()">
	                            <el-option label="全部" value=""></el-option>
	                            <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in editionTypes" :key="idx" :data="item"></el-option>
	                        </el-select>
	                    </el-form-item>
	                </el-col>
	                <el-col :span="8">
	                    <el-form-item label="册别:" prop="term" class="is-required">
	                        <el-select v-model="filters.bookmodelid">
	                            <el-option label="全部" value=""></el-option>
	                            <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in bookModels" :key="idx" :data="item"></el-option>
	                        </el-select>
	                    </el-form-item>
	                </el-col> -->
	                <el-col :span="8">
	            		<el-form-item label="专题类型:" prop="themetype">
	            			<el-select v-model="addForm.themetype">
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
                            <img :src="form.coursethumb.blobfile1" style="width: 210px; height: 121px; border: 1px dashed gray; float:left; margin-right: 10px;" @click="openThumbFile1"/>
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
							<el-input-number v-model.number="addForm.orderno" :min="1"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="使用年份:" prop="copyright">
							<el-input type="text" v-model="addForm.copyright"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
                        <el-form-item label="是否允许下载:">
                            <el-checkbox-group v-model="addForm.isallowdownload">
                                <el-checkbox></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
				</el-row>
				<el-row>
	                <el-col :span="24">
	                    <div style="padding: 20px 0px 50px 0px; border-top: 1px dashed #e8e8e8; text-align: center">
	                        <el-button type="primary" @click="save" :loading="addLoading">保存</el-button>
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
	import { getSchoolSectionList, getSubjectList, getNaviBookModelList, getNaviEditionTypeList, getNaviGradeList, uploadFile, insertTheme } from '../../api/api';
	export default {
		data() {
			return {
				ECRUtil: ECRUtil,
				filters: {
                    schoolsectionid: '',
                    subjectid: '',
                    gradeid: '',
                    // editiontypeid: '',
                    // bookmodelid: '',
                },
                form: {
                    coursethumb: {
                        blobfile1: '',
                        file1: null
                    }
                },
                schoolSections: [],
                subjects: [],
                grades: [],
                // bookModels: [],
                // editionTypes: [],
                addForm: {
                	description:'',
					schoolsection:'',
					grade:'',
					// term:'',
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
                addFormRules: {
                    description: [
                        { required: true, message: '请输入父专题', trigger: 'blur' },
                    ],
                    schoolsection: [
                        { validator: this.validateSchoolSection, trigger: 'blur' },
                    ],
                    grade: [
                        { validator: this.validateGrdae, trigger: 'blur' }
                    ],
                    // editiontype: [
                    //     { validator: this.validateEditionType, trigger: 'blur' }
                    // ],
                    // term: [
                    //     { validator: this.validateTerm, trigger: 'blur' }
                    // ],
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
                addLoading: false

			}
		},
		computed: {
        },
		methods: {
            validateSchoolSection(rule, value, callback) {
                if (this.filters.schoolsectionid == '' || this.filters.schoolsectionid == null) {
                    callback(new Error('请输入学段'));
                } else {
                    callback();
                }
            },
            validateSubject(rule, value, callback) {
                if (this.filters.subjectid == '' || this.filters.subjectid == null) {
                    callback(new Error('请输入学科'));
                } else {
                    callback();
                }
            },
            validateGrdae(rule, value, callback) {
                if (this.filters.gradeid == '' || this.filters.gradeid == null) {
                    callback(new Error('请输入年级'));
                } else {
                    callback();
                }
            },
            // validateEditionType(rule, value, callback) {
            //     if (this.filters.editiontypeid == '' || this.filters.editiontypeid == null) {
            //         callback(new Error('请输入版本'));
            //     } else {
            //         callback();
            //     }
            // },
            // validateTerm(rule, value, callback) {
            //     if (this.filters.bookmodelid == '' || this.filters.bookmodelid == null) {
            //         callback(new Error('请输入册别'));
            //     } else {
            //         callback();
            //     }
            // },
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
                // this.filters.editiontypeid = '';
                // this.filters.bookmodelid = '';
                if (this.filters.schoolsectionid == "") {
                    this.subjectlist = [];
                    this.gradelist = [];
                    // this.editiontypelist = [];
                    // this.bookmodellist = [];
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
            // getNaviEditionTypeList() {
            //     this.filters.editiontypeid = '';

            //     if (this.filters.subjectid == "") {
            //         this.editiontypelist = [];
            //         this.bookmodellist = [];
            //     } else {
            //         let param = {
            //             schoolsectionid: this.filters.schoolsectionid,
            //             subjectid: this.filters.subjectid
            //         };
            //         getNaviEditionTypeList(param).then((res) => {
            //             if (res.data.serverResult.resultCode == "200") {
            //                 this.editionTypes = ECRUtil.composeSysDict(res.data.pageInfo.list);
            //                 this.filters.editiontypeid = '';
            //             } else {
            //                 this.editionTypes = [];
            //             }
            //         });
            //     }
            // },
            // getNaviBookModelList() {
            //     this.filters.bookmodelid = '';

            //     if (this.filters.editiontypeid == "") {
            //         this.bookmodellist = [];
            //     } else {
            //         let param = {
            //             schoolsectionid: this.filters.schoolsectionid,
            //             subjectid: this.filters.subjectid,
            //             editiontypeid: this.filters.editiontypeid
            //         };
            //         getNaviBookModelList(param).then((res) => {
            //             if (res.data.serverResult.resultCode == "200") {
            //                 this.bookModels = ECRUtil.composeSysDict(res.data.pageInfo.list);
            //                 this.filters.bookmodelid = '';
            //             } else {
            //                 this.bookModels = [];
            //             }
            //         });    
            //     }
            // },
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
            openThumbFile1() {
                document.getElementById('coursethumb1').click();
            },
            clearThumbFile1() {
                this.form.coursethumb.file1 = null;
                this.form.coursethumb.blobfile1 = '';
                document.getElementById('coursethumb1').value = null;
            },
            save() {
            	if (this.form.coursethumb.file1 != null) {
                    const data = new FormData();
                    data.append('file1', this.form.coursethumb.file1);
                    this.addLoading = true;
                    uploadFile({ data:data, onUploadProgress:null }).then((res) => {
                        if (res.data.serverReults.resultCode == "200") {
                            var path = res.data.fileInfos[0].localPath;
                            this.addForm.logopath = path;

                            this.addAction();
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
                    this.addAction();
                }
            },
            addAction() {
                this.addLoading = true;
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                    	var param = {
                    		description: this.addForm.description,
        					schoolsection: this.filters.schoolsectionid,
        					grade: this.filters.gradeid,
        					// term: this.filters.bookmodelid,
        					subjectid: this.filters.subjectid,
        					logopath: this.addForm.logopath,
        					themetype: this.addForm.themetype,
        					subthemetype: '',
        					parentthemeid: this.addForm.parentthemeid,
        					copyright: this.addForm.copyright,
        					isallowdownload: (this.addForm.isallowdownload)?'1':'0',
        					orderno: this.addForm.orderno,
        					themename: this.addForm.themename
                    	};
                    	insertTheme(param).then((res) => {
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
                    } else{
                        this.addLoading = false;
                    }
                });
            },
            cancel() {
                this.$router.push('/special');
            },
            load() {
                // this.addForm.description = this.theme.description;
            }
		},
		created() {
			this.getSchoolSectionList();
            this.getSubjectList();
            // this.getNaviEditionTypeList();
            this.addForm.parentthemeid = this.$route.params.id;
            this.load();
		},
		mounted() {

		}
	}
</script>
<style lang="scss" scoped>
    @import '~scss_vars';
    
</style>