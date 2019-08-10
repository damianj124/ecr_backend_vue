<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<div class="logo">
				<img src="static/img/ecr-logo-main.jpg" />
			</div>
			<div class="userinfo">
				<a href="javascript:;" class="userinfo-inner">{{sysUserName}}</a>|
				<a href="javascript:;" class="userinfo-quit" @click="logout">退出</a>
			</div>
		</el-col>
		<el-col :span="24" class="main">
			<aside>
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="vscroll el-menu-vertical-demo" unique-opened router>
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<section class="content-container vscroll">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
		<el-col :span="24" class="footer">
			Copyright ©  2008-2017 天闻数媒科技（北京）有限公司, All Rights Reserved版本号V001R001C01版权 
		</el-col>
	</el-row>
</template>

<script>
	export default {
		data() {
			return {
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		methods: {
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {

				});
			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.realname || '';
				this.sysUserAvatar = user.avatar || '';
			}
		}
	}

</script>
<style scoped lang="scss">
	@import '~scss_vars';
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 70px;
			line-height: 70px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				a {
				    margin: 0px 18px 0px 18px;
				    color: #fff;
				    padding: 10px 0px;
				    display: inline-block;
				    font-size: 16px;
				    text-decoration: none;
				}
				img {
					width: 40px;
					height: 40px;
					border-radius: 20px;
					margin: 10px 0px 0px 10px;
				}
				.userinfo-inner {
					background-image: url(/static/img/ecr-icon.png);
					background-repeat: no-repeat;
					background-position-y: center;
					background-position-x: left;
					padding-left: 50px;
					cursor: pointer;
					color:#fff;
				}
				.userinfo-quit {
				    margin-right: 0px;
					color: #ffff33;
				}
			}
			.logo {
				height:70px;
				font-size: 22px;
				padding-left:20px;
				float: left;
				img {
					height: 70px;
					float: left;
					margin: 0;
				}
			}
		}
		.main {
			display: flex;
			position: absolute;
			top: 70px;
			bottom: 70px;
			overflow: hidden;
			aside {
				flex:0 0 154px;
				width: 154px;
			}
			.content-container {
				flex:1;
				padding: 20px;
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
		.footer {
			position: absolute;
			height: 70px;
			bottom: 0px;
		    line-height: 70px;
		    color: #666;
		    text-align: Center;
		    background: #ebebeb;
		    padding: 0;
		    margin: 0;
		}
	}

	.el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active {
	    color: #07b9ad;
	}
</style>