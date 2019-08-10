<template>
	<section class="vscroll" v-if="activityInfo != null">
		<el-col :span="24" class="ecrm-search-title">
			<a class="selected">发起资源征集</a>
		</el-col>

		<el-col :span="24" class="ecrm-content-panel">
			<!-- Filter Panel -->

			<el-form ref="activityForm" :model="activityInfo" :rules="activityFormRules" label-width="120px">
				<el-row>
					<el-col :span="10">
						<el-form-item label="活动名称:" prop="activityname">
							<el-input type="text" v-model="activityInfo.activityname"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="活动类型:">
							<el-select v-model="activityInfo.contenttype" @change="onChangeConentType(activityInfo.contenttype)">
								<el-option :label="item.contentname" :value="item.contenttype" v-for="(item, idx) in contentTypes" :key="idx" :data="item"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="活动有效期:" class="is-required" prop="timeprop">
							<el-date-picker type="date" v-model="activityInfo.starttime"></el-date-picker>
							-
							<el-date-picker type="date" v-model="activityInfo.endtime"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="征集要求:" prop="requirement">
							<el-input type="textarea" :rows.native="5" v-model="activityInfo.requirement" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="资源格式设置:" class="is-required" prop="checkprop">
							<el-checkbox-group v-model="activityInfo.formats">
								<el-checkbox :label="item" v-for="(item, idx) in extensiontype" :key="idx" :data="item"></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="活动介绍:" prop="description">
							<el-input type="textarea" :rows.native="5" v-model="activityInfo.description" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="奖励说明:" prop="bonusnote">
							<el-input type="textarea" :rows.native="5" v-model="activityInfo.bonusnote" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<div style="padding: 20px 0px 50px 0px; border-top: 1px dashed #e8e8e8; text-align: center">
					<el-button type="primary" @click="save" :loading="addLoading">保存</el-button>
					<el-button @click="goBack">取消</el-button>
				</div>
			</el-form>
		</el-col>
	</section>
</template>

<script>
	import ECRUtil from '../../common/js/util'
	import { CONTENT_TYPE, EXTENSION_TYPE } from '../../common/js/const.js';
	import { editCollectionActivity, getActivity, uploadFile } from '../../api/api';

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
				contentTypes: CONTENT_TYPE,
				extexsionTypes: EXTENSION_TYPE,
				/////////// Pagination ///////////
				total: 0,
				page: 1,
				page_size: 5,
				/////////// Pagination End ////////
				addLoading: false,
				listLoading: false,
				extensiontype: [],
				activityInfo: null
			}
		},
		methods: {
			validateCheck(rule, value, callback) {
				if (this.activityInfo.formats.length == 0) {
					callback(new Error('请输入资源格式设置'));
				} else {
					callback();
				}
			},
			save() {
				this.editSubmit();
			},
			editSubmit() {
				this.$refs.activityForm.validate((valid) => {
          			if (valid) {
						this.addLoading = true;
						let params = {
							activityid: this.activityInfo.activityid,
							activityname: this.activityInfo.activityname,
							starttime: ECRUtil.formatDate.format(new Date(this.activityInfo.starttime), 'yyyy-MM-dd hh:mm:ss'),
							endtime: ECRUtil.formatDate.format(new Date(this.activityInfo.endtime), 'yyyy-MM-dd hh:mm:ss'),
							requirement: this.activityInfo.requirement,
							formats: this.activityInfo.formats,
							description: this.activityInfo.description,
							bonusnote: this.activityInfo.bonusnote,
							contenttype: this.activityInfo.contenttype
						};
						editCollectionActivity(params).then((res) => {
							if(res.data.serverResult.resultCode == "200") {
								this.$router.push({ path: '/raise'});
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
			onChangeConentType(contenttype) {
				this.activityInfo.formats = [];
				for(var i=0; i<this.extexsionTypes.length; i++) {
					if (this.extexsionTypes[i].contenttype == contenttype) {
						this.extensiontype = this.extexsionTypes[i].extensiontype;
					}		
				}
			},
			getExtensionType(contenttype) {
				for(var i=0; i<this.extexsionTypes.length; i++) {
					if (this.extexsionTypes[i].contenttype == contenttype) {
						this.extensiontype = this.extexsionTypes[i].extensiontype;
					}		
				}
			},
			goBack() {
				this.$router.push({ path: '/wager'});
			},
			handleGetActivity(activityid) {
				this.listLoading = true;
				getActivity( activityid ).then((res) => {
					if (res.data.serverResult.resultCode == "200") {
						this.activityInfo = res.data.responseEntity;
						this.getExtensionType(this.activityInfo.contenttype);
					} else {
						var resultMessage = res.data.serverResult.resultMessage;
						this.$message({
							message: resultMessage,
							type: 'error'
						});
					}
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
				});
			}
		},
		created() {
			let activityid = this.$route.params.id;
			this.handleGetActivity(activityid);
		}
	}

</script>

<style lang="scss" scoped>
	@import '~scss_vars';
	
</style>