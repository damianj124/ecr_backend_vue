<template>
	<el-row>
		<el-col :span="24" class="ecrm-search-title">
			<a href="#/xuexiaoguanli" :class="{ 'selected':$route.path=='/xuexiaoguanli' }">学校管理</a>
			<a href="#/jigouguanli" :class="{ 'selected':$route.path=='/jigouguanli' }">机构管理</a>
			<a href="#/quyuguanli" :class="{ 'selected':$route.path=='/quyuguanli' }">区域管理</a>
		</el-col>
		<el-col :span="24" class="main">
			<section class="vscroll">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
		},
		mounted() {
		}
	}
</script>

<style scoped lang="scss">
	@import '~scss_vars';
	
	.main {
		padding: 20px;
	}
</style>