<template>
  <section>
    <el-col :span="24" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <span>角色名称 :</span>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.rolename"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getRoles" id="searchBtn">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :span="24" style="margin-bottom: 10px">
      <el-button
        style="float: right;"
        type="table-op"
        size="small"
        @click="batchRemove"
        :disabled="this.sels.length===0"
      >删除</el-button>
      <el-button
        style="float: right; margin-right: 10px"
        type="table-op"
        size="small"
        @click="handleEdit"
        :disabled="this.sels.length!=1"
      >修改</el-button>
      <el-button style="float: right;" type="table-op" size="small" @click="handleAdd">新增</el-button>
    </el-col>

    <el-table
      :data="roles"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
      border
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!--<el-table-column type="index" width="60" align="center">
      </el-table-column>-->
      <el-table-column prop="roleid" label="角色 ID" align="center"></el-table-column>
      <el-table-column prop="rolename" label="角色名称" align="center"></el-table-column>
      <el-table-column prop="description" label="创建人" align="center"></el-table-column>
      <el-table-column prop="createtime" label="创建时间" align="center"></el-table-column>
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
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="editForm.rolename" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="addForm.rolename" auto-complete="off"></el-input>
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
  editRole,
  addRole,
  getRoleListPage,
  batchRemoveRole
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        rolename: ""
      },
      roles: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        rolename: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        rolename: "",
        role_id: 0,
        create_time: new Date(),
        creater: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        rolename: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        rolename: ""
      }
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getRoles();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getRoles();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    getRoles() {
      let para = {
        page: this.page,
        rolename: this.filters.rolename
      };
      this.listLoading = true;

      getRoleListPage(para).then(res => {
        this.total = res.data.total;
        this.roles = res.data.data;
        this.listLoading = false;
      });
    },
    //显示编辑界面
    handleEdit: function() {
      this.editFormVisible = true;
      var rolename = this.sels.map(item => item.rolename).toString();
      this.editForm.rolename = rolename;
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        rolename: ""
      };
    },
    //编辑
    editSubmit: function() {
      var roleid = this.sels.map(item => item.roleid).toString();
      var rolename = this.editForm.rolename;

      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = { roleid: roleid, rolename: rolename, status: 0 };
            editRole(para).then(res => {
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
              this.getRoles();
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
            addRole(para).then(res => {
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
              this.getRoles();
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
      var ids = this.sels.map(item => item.roleid).toString();
      this.$confirm("确认提交吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { roleid: ids };

          batchRemoveRole(para).then(res => {
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
            this.getRoles();
          });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.getRoles();
  }
};
</script>
<style lang="scss" scoped>
@import "~scss_vars";
</style>