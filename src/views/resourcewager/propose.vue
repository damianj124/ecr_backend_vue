<template>
	<section class="vscroll">
		<el-col :span="24" class="ecrm-search-title">
			<a class="selected">发起评比活动</a>
		</el-col>

		<el-col :span="24" class="ecrm-content-panel">
			<!-- Filter Panel -->

			<el-form :model="activityForm" :rules="activityFormRules" ref="activityForm" label-width="120px">
				<el-row>
					<el-col :span="10">
						<el-form-item label="活动名称:" prop="activityname">
							<el-input type="text" v-model="activityForm.activityname"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="活动类型:">
							<el-select v-model="activityForm.contenttype" @change="onChangeConentType(activityForm.contenttype)">
								<el-option :label="item.contentname" :value="item.contenttype" v-for="(item, idx) in contentTypes" :key="idx" :data="item"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="活动有效期:" class="is-required" prop="timeprop">
							<el-date-picker type="date" v-model="activityForm.starttime"></el-date-picker>
							-
							<el-date-picker type="date" v-model="activityForm.endtime"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="征集要求:" prop="requirement">
							<el-input type="textarea" :rows.native="5" v-model="activityForm.requirement" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="资源格式设置:" class="is-required" prop="checkprop">
							<el-checkbox-group v-model="activityForm.formats">
								<el-checkbox :label="item" v-for="(item, idx) in extensiontype" :key="idx" :data="item"></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="活动介绍:" prop="description">
							<el-input type="textarea" :rows.native="5" v-model="activityForm.description" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="奖励说明:" prop="bonusnote">
							<el-input type="textarea" :rows.native="5" v-model="activityForm.bonusnote" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<div style="padding: 20px 0px 50px 0px; border-top: 1px dashed #e8e8e8; text-align: center">
					<el-button type="primary" @click="save" :loading="addLoading">保存</el-button>
					<el-button type="success" @click="preview" :loading="previewLoading">预览</el-button>
					<el-button type="default" @click="cancel">取消</el-button>
				</div>
			</el-form>
		</el-col>
	</section>
</template>

<script>
	import ECRUtil from '../../common/js/util'
	import { CONTENT_TYPE, EXTENSION_TYPE } from '../../common/js/const.js';
	import { addCollectionActivity, uploadFile } from '../../api/api';

	export default {
		data() {
			return {
				contentTypes: CONTENT_TYPE,
				extexsionTypes: EXTENSION_TYPE,
				/////////// Pagination ///////////
				total: 0,
				page: 1,
				page_size: 5,
				/////////// Pagination End ////////
				addLoading: false,
				listLoading: false,
				previewLoading: false,
				previewstatus: false,
				previewFormVisible: false,
				previewForm: {
					imageurl: ''
				},
				activityForm: {
					activityname: '',
					starttime: '',
					endtime: '',
					requirement: '',
					formats: [],
					description: '',
					bonusnote: '',
					contenttype: 'K'
				},
				activityFormRules: {
					timeprop: [
						{ validator: this.validateActivityTime, trigger: 'blur' },
					],
					checkprop: [
						{ validator: this.validateCheck, trigger: 'blur' },
					],
					activityname: [
						{ required: true, message: '请输入活动名称', trigger: 'blur' }
					],
					requirement: [
						{ required: true, message: '请输入征集要求', trigger: 'blur' }
					],
					description: [
						{ required: true, message: '请输入活动介绍', trigger: 'blur' }
					],
					bonusnote: [
						{ required: true, message: '请输入奖励说明', trigger: 'blur' }
					]
				},
				extensiontype: ['ppt', 'pptx', 'pdf']
			}
		},
		methods: {
			validateActivityTime(rule, value, callback) {
				if (this.activityForm.starttime == '' || this.activityForm.endtime == '') {
					callback(new Error('请输入活动有效期'));
				} else {
					callback();
				}
			},
			validateCheck(rule, value, callback) {
				if (this.activityForm.formats.length == 0) {
					callback(new Error('请输入资源格式设置'));
				} else {
					callback();
				}
			},
			cancel() {
				this.$router.push('/wager');
			},
			onUploadProgress(progressEvent) {

			},
			addSubmit() {
				this.$refs.activityForm.validate((valid) => {
          			if (valid) {
						this.addLoading = true;
						let params = {
							activityname: this.activityForm.activityname,
							starttime: ECRUtil.formatDate.format(new Date(this.activityForm.starttime), 'yyyy-MM-dd hh:mm:ss'),
							endtime: ECRUtil.formatDate.format(new Date(this.activityForm.endtime), 'yyyy-MM-dd hh:mm:ss'),
							requirement: this.activityForm.requirement,
							formats: this.activityForm.formats,
							description: this.activityForm.description,
							bonusnote: this.activityForm.bonusnote,
							contenttype: this.activityForm.contenttype
						};
						addCollectionActivity(params).then((res) => {
							if(res.data.serverResult.resultCode == "200") {
								if (this.previewstatus == false) {
									this.$router.push({ path: '/wager'});
								} else if (this.previewstatus == true) {
									this.previewFormVisible = true;
									this.previewForm.imageurl = DOWNLOADURL + 'fs/media/' + res.data.responseEntity.according;
								}
								
							} else {
								var resultMessage = res.data.serverResult.resultMessage;
								this.$message({
								  	message: resultMessage,
								  	type: 'error'
								});
							}
							this.addLoading = false;
						}).catch(() => {
							this.addLoading = false;
						});
					}
				});
			},
			save() {

			},
			preview() {

			},
			onChangeConentType(contenttype) {
				for(var i=0; i<this.extexsionTypes.length; i++) {
					if (this.extexsionTypes[i].contenttype == contenttype) {
						this.extensiontype = this.extexsionTypes[i].extensiontype;
					}		
				}
			}
		},
		created() {
		}
	}

</script>

<style lang="scss" scoped>
	@import '~scss_vars';

</style>