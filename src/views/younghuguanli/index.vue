<template>
	<el-row>
		<el-col :span="24" class="ecrm-search-title">
			<a href="#/zhanghaoguanli" :class="{ 'selected':$route.path=='/zhanghaoguanli' }">账号管理</a>
			<a href="#/jueseguanli" :class="{ 'selected':$route.path=='/jueseguanli' }">角色管理</a>
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