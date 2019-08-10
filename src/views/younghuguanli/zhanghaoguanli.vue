<template>
  <section>
    <el-col :span="24">
      <el-form label-width="120px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="用户名：">
              <el-input v-model="filters.loginname"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="姓名：">
              <el-input v-model="filters.realname"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="角色：">
              <el-input v-model="filters.role"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="会员：">
              <el-input v-model="filters.member"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="身份证：">
              <el-input v-model="filters.idcardno"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="手机：">
              <el-input v-model="filters.loginmobile"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="邮箱：">
              <el-input v-model="filters.loginemail"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="禁用状态：">
              <el-input v-model="filters.status"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="锁定状态：">
              <el-input v-model="filters.islocked"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="创建时间">
              <el-date-picker type="date" v-model="filters.create_time"></el-date-picker>-
              <el-date-picker type="date" v-model="filters.last_time"></el-date-picker>
              <el-button type="primary" v-on:click="getAccounts" id="searchBtn">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-col>

    <el-col :span="24" style="margin-bottom: 10px">
      <el-button style="float: right;" type="table-op" size="small">禁用 / 启用</el-button>
      <el-button style="float: right; margin-right: 10px" type="table-op" size="small">锁定 / 解锁</el-button>
      <el-button
        style="float: right;"
        type="table-op"
        size="small"
        @click="resetPassword"
        :disabled="this.sels.length===0"
      >重置密码</el-button>
      <el-button style="float: right;" type="table-op" size="small">下载模板</el-button>
      <el-button
        style="float: right;"
        type="table-op"
        size="small"
        @click="batchRemove"
        :disabled="this.sels.length===0"
      >删除</el-button>
      <el-button
        style="float: right;"
        type="table-op"
        size="small"
        @click="handleEdit"
        :disabled="this.sels.length!=1"
      >修改</el-button>
      <el-button style="float: right;" type="table-op" size="small" @click="handleAdd">新增</el-button>
    </el-col>

    <el-table
      :data="accounts"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
      border
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!--<el-table-column type="index" width="60" align="center">
      </el-table-column>-->
      <el-table-column
        prop="status"
        label="禁用状态"
        width="100"
        align="center"
        :formatter="formatStatus"
      ></el-table-column>
      <el-table-column
        prop="islocked"
        label="锁定状态"
        width="100"
        align="center"
        :formatter="formatLock"
      ></el-table-column>
      <el-table-column prop="birthday" label="自动解锁时间" align="center"></el-table-column>
      <el-table-column prop="userid" label="账号 ID" align="center"></el-table-column>
      <el-table-column prop="loginname" label="用户名" align="center"></el-table-column>
      <el-table-column prop="realname" label="姓名" align="center"></el-table-column>
      <el-table-column prop="role" label="角色" align="center"></el-table-column>
      <el-table-column prop="sex" label="性别" align="center" :formatter="formatSex"></el-table-column>
      <el-table-column prop="idcardno" label="身份证号码" align="center"></el-table-column>
      <el-table-column prop="loginmobile" label="手机号码" align="center"></el-table-column>
      <el-table-column prop="loginemail" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="member" label="会员" width="80" align="center"></el-table-column>
      <el-table-column prop="currentlogintime" label="注册时间" align="center"></el-table-column>
      <el-table-column prop="lastmodifytime" label="最后修改时间" align="center"></el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
      <my-pagination
        @current-change="handleCurrentChange"
        @pgSize-change="handlePageSizeChange"
        :page-size="10"
        :total="total"
      ></my-pagination>
    </el-col>

    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="自动解锁时间" prop="birthday">
          <el-date-picker type="date" placeholder="自动解锁时间" v-model="editForm.birthday"></el-date-picker>
        </el-form-item>
        <el-form-item label="用户名" prop="loginname">
          <el-input v-model="editForm.loginname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="editForm.realname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-input v-model="editForm.role" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idcardno">
          <el-input v-model="editForm.idcardno" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="loginmobile">
          <el-input v-model="editForm.loginmobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="loginemail">
          <el-input v-model="editForm.loginemail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员" prop="member">
          <el-input v-model="editForm.member" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
        <el-form-item label="自动解锁时间" prop="birthday">
          <el-date-picker type="date" placeholder="自动解锁时间" v-model="addForm.birthday"></el-date-picker>
        </el-form-item>
        <el-form-item label="用户名" prop="loginname">
          <el-input v-model="addForm.loginname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="addForm.realname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-input v-model="addForm.role" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idcardno">
          <el-input v-model="addForm.idcardno" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="loginmobile">
          <el-input v-model="addForm.loginmobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="loginemail">
          <el-input v-model="addForm.loginemail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员" prop="member">
          <el-input v-model="addForm.member" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import {
  getAccountListPage,
  batchRemoveAccount,
  addAccount,
  editAccount,
  batchResetPassword
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        loginname: "",
        realname: "",
        loginemail: "",
        loginmobile: "",
        idcardno: ""
      },
      accounts: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        realname: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //编辑界面数据 편집대면부 자료
      editForm: {
        loginname: "",
        birthday: "",
        userid: "",
        realname: "",
        sex: 1,
        idcardno: "",
        loginmobile: "",
        loginemail: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        realname: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {}
    };
  },
  methods: {
    formatSex: function(row, col) {
      if (row.sex == 0) {
        return "女";
      } else {
        return "男";
      }
    },
    formatStatus: function(row, col) {
      if (row.status == 1) {
        return "正常";
      } else if (row.status == 2) {
        return "待审核";
      } else if (row.status == 3) {
        return "待激活";
      } else if (row.status == 4) {
        return "审核不通过";
      } else if (row.status == 7) {
        return "冻结";
      } else if (row.status == 9) {
        return "删除";
      }
    },
    formatLock: function(row, col) {
      if (row.islocked == true) return "禁用";
      else return "许可";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getAccounts();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getAccounts();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    getAccounts() {
      let para = {
        page: this.page,
        loginname: this.filters.loginname,
        realname: this.filters.realname,
        loginemail: this.filters.loginemail,
        loginmobile: this.filters.loginmobile,
        idcardno: this.filters.idcardno
      };
      this.listLoading = true;
      getAccountListPage(para).then(res => {
        this.total = res.data.total;
        this.accounts = res.data.data;

        this.listLoading = false;
      });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认提交吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { id: row.id };
          removeAccount(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getAccounts();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function() {
      this.editFormVisible = true;
      this.editForm.userid = this.sels.map(item => item.userid).toString();
      this.editForm.loginname = this.sels
        .map(item => item.loginname)
        .toString();
      this.editForm.sex = parseInt(this.sels.map(item => item.sex));
      this.editForm.realname = this.sels.map(item => item.realname).toString();
      this.editForm.idcardno = this.sels.map(item => item.idcardno).toString();
      this.editForm.loginmobile = this.sels
        .map(item => item.loginmobile)
        .toString();
      this.editForm.loginemail = this.sels
        .map(item => item.loginemail)
        .toString();
      this.editForm.birthday = this.sels.map(item => item.birthday).toString();
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        birthday: new Date(),
        sex: 1
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = Object.assign({}, this.editForm);

            editAccount(para).then(res => {
              this.editLoading = false;
              var responseRes = res.data.responseRes;
              if (responseRes !== 200) {
                this.$message({
                  message: "提交失败",
                  type: "error"
                });
              } else {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
              }
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getAccounts();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            let para = Object.assign({}, this.addForm);
            para.birthday =
              !para.birthday || para.birthday == ""
                ? ""
                : util.formatDate.format(new Date(para.birthday), "yyyy-MM-dd");
            addAccount(para).then(res => {
              this.addLoading = false;
              var responseRes = res.data.responseRes;
              if (responseRes !== 200) {
                this.$message({
                  message: "提交失败",
                  type: "error"
                });
              } else {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
              }
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getAccounts();
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.userid).toString();
      this.$confirm("确认提交吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { userid: ids };
          batchRemoveAccount(para).then(res => {
            this.listLoading = false;
            var responseRes = res.data.responseRes;
            if (responseRes !== 200) {
              this.$message({
                message: "提交失败",
                type: "error"
              });
            } else {
              this.$message({
                message: "提交成功",
                type: "success"
              });
            }
            this.getAccounts();
          });
        })
        .catch(() => {});
    },
    resetPassword: function() {
      var ids = this.sels.map(item => item.userid).toString();
      this.$confirm("确认提交吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { userid: ids };
          batchResetPassword(para).then(res => {
            this.listLoading = false;
            var responseRes = res.data.responseRes;
            if (responseRes !== 200) {
              this.$message({
                message: "提交失败",
                type: "error"
              });
            } else {
              this.$message({
                message: "提交成功",
                type: "success"
              });
            }
            this.getAccounts();
          });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.getAccounts();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";
</style>