<template>
	<el-row>
		<el-col :span="24" class="ecrm-search-title">
			<a href="#/younghuquanxian" :class="{ 'selected':$route.path=='/younghuquanxian' }">账号授权</a>
			<a href="#/juesequanxian" :class="{ 'selected':$route.path=='/juesequanxian' }">角色授权</a>
			<a href="#/xuexiaoquanxian" :class="{ 'selected':$route.path=='/xuexiaoquanxian' }">学校授权</a>
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