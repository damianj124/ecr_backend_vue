<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <div class="logo">
                <img src="static/img/ecr-logo-main.jpg" />
            </div>
            <div class="userinfo">
                <el-dropdown trigger="hover">
                    <a href="javascript:;" class="el-dropdown-link userinfo-inner">{{sysUserName}}</a>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="changePwd">修改密码</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <a href="javascript:;" class="userinfo-quit" @click="logout">退出</a>
            </div>
        </el-col>
        <el-dialog title="密码变更" v-model="passwordFormVisible" :close-on-click-modal="false">
            <el-form :model="passwordForm" label-width="100px" :rules="passwordFormRules" ref="passwordForm">
                <el-form-item label="以前密码" prop="originPass">
                    <el-input type="password" v-model="passwordForm.originPass" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="现在密码" prop="currentPass">
                    <el-input type="password" v-model="passwordForm.currentPass" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码确认" prop="confirmPass">
                    <el-input type="password" v-model="passwordForm.confirmPass" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="passwordFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="confirmSubmit" :loading="confirmLoading">提交</el-button>
            </div>
        </el-dialog>

        <el-col :span="24" class="main">
            <aside class="vscroll">
                <!--导航菜单-->
                <el-menu :default-active="$route.path" class="el-menu-vertical-demo" unique-opened router>
                    <div class="el-menu-empty"></div>
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
            Copyright ©  2008-2018 天闻数媒科技（北京）有限公司, All Rights Reserved版本号V001R001C01版权 
        </el-col>

        <iframe id="download_iframe" src="" style="display:none"></iframe>
    </el-row>
</template>

<script>
    import { updatePwdECO } from '../api/api';

    export default {
        data() {
            return {
                sysUserName: '',
                sysUserAvatar: '',
                sysUserId: '',
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                passwordFormVisible: false,//新增界面是否显示
                confirmLoading: false,
                passwordFormRules: {
                    originPass: [
                        { required: true, message: '请输入以前密码', trigger: 'blur' }
                    ],
                    currentPass: [
                        { required: true, message: '请输入现在密码', trigger: 'blur' }
                    ],
                    confirmPass: [
                        { required: true, message: '请输入密码确认', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                passwordForm: {
                    originPass: "",
                    currentPass: "",
                    confirmPass: ""
                },
                autoLogin: 0
            }
        },
        methods: {
            //退出登录
            logout: function () {
                var _this = this;
                this.$confirm('确认退出吗?', '提示', {
                    type: 'info'
                }).then(() => {
                    _this.doLogout();
                }).catch(() => {
                });
            },
            doLogout() {
                localStorage.removeItem('backend-user');
                localStorage.removeItem('backend-token');
                this.$router.push('/login');
            },
            changePwd: function() {
                this.passwordForm.originPass = "";
                this.passwordForm.currentPass = "";
                this.passwordForm.confirmPass = "";
                this.passwordFormVisible = true;
            },
            confirmSubmit: function() {
                this.$refs.passwordForm.validate((valid) => {
                    if (valid) {
                        if (this.passwordForm.currentPass == this.passwordForm.confirmPass) {
                            let param ={
                                "oldPassword": this.passwordForm.originPass,
                                "staticPassword": this.passwordForm.currentPass,
                                "userId": JSON.parse(localStorage.getItem('backend-user')).userId
                            };
                            updatePwdECO(param, this.$message).then((res) =>{
                                this.updateLoading = false;
                                if (res.data.serverResult.resultCode == "200") {
                                    var resultMessage = res.data.serverResult.resultMessage;
                                    this.$message({
                                        message: resultMessage,
                                        type: 'success'
                                    });
                                } else {
                                    var resultMessage = res.data.serverResult.resultMessage;
                                    this.$message({
                                        message: resultMessage,
                                        type: 'error'
                                    });
                                }
                            });
                        } else {
                            this.$message({
                                message: "重复密码与新密码不一致",
                                type: 'error'
                            });
                        }
                    }
                });
            },
            onWindowUnload() {
                if (!this.autoLogin) {
                    this.doLogout();
                }
            }
        },
        created() {
            var user = localStorage.getItem('backend-user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.realName || '';
                this.sysUserAvatar = user.avatar || '';
                this.sysUserId = user.userId;
            }
            this.autoLogin = localStorage.getItem('autologin')?parseInt(localStorage.getItem('autologin')):0;
            window.EventHub.$on('token-is-expired', this.doLogout);
            window.EventHub.$on('token-has-caught', this.doLogout);
            window.EventHub.$on('token-is-invalid', this.doLogout);
            window.EventHub.$on('window-unload', this.onWindowUnload);
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
                    background-image: url('../../static/img/ecr-icon.png');
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
                flex:0 0 166px;
                width: 166px;
                background-color: #ededed;
            }
            .content-container {
                flex:1;
                padding: 20px;
                .content-wrapper {
                    background-color: #fff;
                    box-sizing: border-box;
                    margin-bottom: 40px;
                }
            }
        }
        .footer {
            position: absolute;
            height: 70px;
            bottom: 0px;
            line-height: 70px;
            color: #666;
            text-align: center;
            background: #ebebeb;
            padding: 0;
            margin: 0;
        }
    }
    .el-menu {
        .el-menu-empty {
            display: block;
            height: 46px;
            line-height: 46px;
            border-bottom: 1px solid #dddddd;
        }
    }
    .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active {
        color: #07b9ad;
    }
    li.el-submenu {
        i {
            color: $color-primary;
        }
    }
    .el-submenu.is-opened>.el-submenu__title{padding-left:14px !important}
    .is-opened, .is-opened * {
        background-color: white;
    }
</style>