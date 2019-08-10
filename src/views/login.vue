<template>
  <div>
    <div id="header">
      <a href="javascript:;" class="logo"></a>
    </div>
    <div id="body" class="scroll vscroll">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h3 class="title">管理员登录</h3>
        <el-form-item prop="account">
          <el-input type="text" v-model="ruleForm2.account" ref="account" auto-complete="off" @keyup.native="checkAccount" placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" ref="password" auto-complete="off" @keyup.native="checkPassword" placeholder="请输入登录密码"></el-input>
        </el-form-item>
        <el-form-item id="capchaText" prop="capchaKey">
          <el-col :span="10">
            <el-input type="text" v-model="ruleForm2.capchaKey" ref="capcha" @keyup.enter.native="login" @keyup.native="checkCapcha" placeholder="请输入验证码"></el-input>
          </el-col>
          <el-col :span="10">
            <span class="capcha"><img :src="ruleForm2.capcha" style="height: 44px; width: 108px"/></span> 
          </el-col>
          <el-col :span="3">
            <a href="javascript:;" @click="changeCapcha">刷新</a>
          </el-col>
        </el-form-item>
        <el-checkbox class="remember" v-model="autoLogin">自动登录</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="login" :loading="logining">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="footer">
      Copyright ©  2008-2018 天闻数媒科技（北京）有限公司, All Rights Reserved版本号V001R001C01版权
    </div>
  </div>
</template>

<script>
  import ECRUtil from '../common/js/util';
  import { requestLogin, requestCapcha } from '../api/api';
  import CryptoJS from 'crypto-js';

  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: '',
          capchaKey: '',
          capcha: '',
          verifyKey: ''
        },
        rules2: {
          account: [
            { validator: this.validateAccount, trigger: 'blur' }
          ],
          checkPass: [
            { validator: this.validatePassword, trigger: 'blur' }
          ],
          capchaKey: [
            { validator: this.validateCapcha, trigger: 'blur' }
          ]
        },
        autoLogin: true,
        userAccount: ''
      };
    },
    computed: {},
    methods: {
      checkAccount() {
        this.ruleForm2.account = ECRUtil.alphanumeric(this.ruleForm2.account);
      },
      checkPassword() {
        // this.ruleForm2.checkPass = ECRUtil.alphanumeric(this.ruleForm2.checkPass);
      },
      checkCapcha() {
        this.ruleForm2.capchaKey = ECRUtil.alphanumeric(this.ruleForm2.capchaKey);
      },
      validateAccount(rule, value, callback) {
        if (this.ruleForm2.account == "" || this.ruleForm2.account == null) {
            callback(new Error('请输入登录账号'));
        } else {
            callback();
        }
      },
      validatePassword(rule, value, callback) {
        if (this.ruleForm2.checkPass == "" || this.ruleForm2.checkPass == null) {
            callback(new Error('请输入登录密码'));
        } else {
            callback();
        }
      },
      validateCapcha(rule, value, callback) {
          if (this.ruleForm2.capchaKey == "" || this.ruleForm2.capchaKey == null) {
            callback(new Error('请输入登录验证码'));
          } else {
            callback();
          }
      },
      login: function() {

        // If logining return 
        if (this.logining) {
          return;
        }

        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            // 对密码进行加密
            var key = CryptoJS.enc.Utf8.parse(ENCRYPT_KEY);
            //这一段就是上面的client_secret
            var encryptPassword = CryptoJS.AES.encrypt(this.ruleForm2.checkPass, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
            var loginParams = { username: this.ruleForm2.account, password: encryptPassword.toString(), capcha: this.ruleForm2.capchaKey, verifykey: this.ruleForm2.verifyKey, kind: 'manager', autologin:this.autoLogin?'1':'0'};

            this.logining = true;
            requestLogin(loginParams).then((res) => {
              this.logining = false;
              if (res.data.serverResult.resultCode == "200") {
                var jsonUser = JSON.stringify(res.data.responseEntity);

                localStorage.setItem('backend-user', jsonUser);
                localStorage.setItem('backend-token', JSON.parse(jsonUser).token);
                localStorage.setItem('autologin', this.autoLogin?'1':'0');
                localStorage.setItem('badwords', JSON.parse(jsonUser).badwords);
                this.$router.push('/home');
              } else {
                var responseMessage = res.data.serverResult.resultMessage;
                this.$message({
                  message: responseMessage,
                  type: 'error'
                });
                this.ruleForm2.capchaKey = "";
                this.changeCapcha();
                if (res.data.serverResult.resultCode == -1) {
                  this.ruleForm2.account = '';
                  this.ruleForm2.checkPass = '';
                } else if (res.data.serverResult.resultCode == -4) {
                }
              }
            });
          } else {
            return false;
          }
        });
      },
      changeCapcha() {
        this.loading = true;
        requestCapcha().then((res) => {
          this.loading = false;
          if(res.data.responseEntity){
            this.ruleForm2.capcha = res.data.responseEntity.captchaUrl;
            this.ruleForm2.verifyKey = res.data.responseEntity.verifykey;
          }
        });
      }
    },
    mounted() {
      this.changeCapcha();
    }
  }

</script>

<style lang="scss" scoped>
  @import '~scss_vars';
  
  #header {
    /*margin-top: 70px;*/
    width: 100%;
    position: relative;
    height: 100%;
    max-width: 99%;
    .logo {
      height: 60px;
      line-height: 60px;
      background: url('../../static/img/ecr-logo.jpg') no-repeat left center;
      display: block;
      width: 450px;
      margin: 10px 0px 0px 10px;
    }
  }
  #body {
    /*top: 130px;*/
    top: 70px;
    bottom: 0px;
    width: 100%;
    background: #0bc2b6 url('../../static/img/ecr-bg.png') no-repeat center center;
    position: fixed;
    padding-bottom: 80px;
  }
  #footer {
    bottom: 0px;
    height: 70px;
    line-height: 70px;
    width: 100%;
    color: #666;
    text-align: Center;
    background: #ebebeb;
    position: fixed;
  }
  .login-container {
    margin: 100px 129px 0px 0px;
    width: 320px;
    height: 400px;
    padding: 50px 50px 0px;
    background: #fff;
    float: right;
    border-radius: 5px;
    box-shadow: 0px 0px 5px #ccc;
    .title {
      margin-bottom: 30px;
      font-size: 20px;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
    #capchaText {
      img {
        margin: 0px 10px;
        vertical-align: top;
      }
      a {
        color: #333;
        text-decoration: none;
      }
    }
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #0bc2b6;
    border-color: #0cafa4;
  }
</style>