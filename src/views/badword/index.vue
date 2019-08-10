<template>
	<section class="vscroll">
        <el-col :span="24" class="ecrm-search-title">
            <a class="selected">敏感词管理</a>
        </el-col>
        <el-col :span="24" class="ecrm-content-panel" style="margin-top: 100px;">
    		<el-form ref="addForm" :rules="formRules" :model="form" label-width="140px">
    			<el-row>
    				<el-form-item class="is-required" label="目录 :" prop="coursefile">
    		            <input type="file" id="coursefile" @change="readCourse" style="display:none" accept=".txt" />
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
                    <el-col :span="24" style="text-align:center;margin-top: 350px">
                        <el-button style="width: 100px;" @click="cancel">取消</el-button>
                        <el-button type="primary" style="width: 100px;" @click="save" :loading="addLoading" :disabled="flag">保存</el-button>
                    </el-col>
                </el-row>
    		</el-form>
        </el-col>
	</section>
</template>
<script>
	import ECRUtil from '../../common/js/util';
    import { uploadFile, addBadWord } from '../../api/api';
	export default {
		data() {
			return {
				form: {
					coursefile: {
	                    name: '',
	                    file: null
	                },
				},
                formRules: {
                    coursefile: [
                        { validator: this.validateCourseFile, trigger: 'blur' },
                    ]
                },
				addLoading: false,
                flag: false
			}
		},
		methods: {
            validateCourseFile(rule, value, callback) {
                if (this.form.coursefile.file == null) {
                    callback(new Error('请输入目录'));
                } else {
                    callback();
                }
            },
			readCourse() {
                this.flag = false;
                var input = document.getElementById('coursefile');
                var filepath = document.getElementById('coursefile').value;
                this.form.coursefile.name = input.files[0].name;
                this.form.coursefile.file = input.files[0];
                var ext = this.form.coursefile.name.split(".")[1];
                if (ext != 'txt') {
                    this.$message({
                        message: '文件类型是只可以txt!',
                        type: 'error'
                    });
                    this.flag = true;
                    return;
                }
            },
            openCourseFile() {
                document.getElementById('coursefile').click();
            },
            clearCourseFile() {
                this.form.coursefile.file = null;
                this.form.coursefile.name = '';
                document.getElementById('coursefile').value = null;
            },
            cancel() {
            	this.$router.push('/home');
            },
            save() {
            	this.$refs.addForm.validate((valid) => {
                      if (valid) {
                        if (this.form.coursefile.file != null) {
                            const data = new FormData();
                            data.append('file', this.form.coursefile.file);
                            uploadFile({ data:data, onUploadProgress:null }).then((res) => {
                                if (res.data.serverReults.resultCode == "200") {
                                    var path = res.data.fileInfos[0].localPath;
                                    this.addBadWord(path);
                                } else {
                                    this.$message({
                                          message: res.data.serverReults.resultMessage,
                                          type: 'error'
                                    });
                                }
                            });
                        } else {
                            this.addBadWord(null);
                        }
                    } else {
                        return false;
                    }
                });
            },
            addBadWord(path) {
            	addBadWord({confvalue: path}).then((res) => {
            		if (res.data.serverResult.resultCode == "200") {
            			this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'success'
                        });
            			this.$router.push('/home');
            		} else {
            			this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
            		}
            	}).catch((res) => {
            		
            	});
            }
		},
		created() {

		},
		mounted() {

		}
	}
</script>
<style scoped lang="scss">
    @import '~scss_vars';

</style>