<template>
  <section>
    <el-col :span="24">
      <el-form ref="form" :inline="true" :model="form" style="margin-top:10px; min-width:600px;">
        <el-form-item label="产品类型 :">
          <el-select v-model="form.sysType" placeholder="请选择活动产品类型">
            <el-option label="资源中心" value="资源中心"></el-option>
            <el-option label="资源中心-管理端" value="资源中心-管理端"></el-option>
            <el-option label="题库中心" value="题库中心"></el-option>
            <el-option label="题库中心-管理端" value="题库中心-管理端"></el-option>
            <el-option label="运营系统" value="运营系统"></el-option>
            <el-option label="交易系统" value="交易系统"></el-option>
            <el-option label="积分系统" value="积分系统"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="handlePowerSetting" :disabled="this.sels.length===0">配置权限</el-button>
      </el-form>
      <el-form
        :inline="true"
        :model="filters"
        style="margin-bottom: 20px; width:60%; min-width:800px;"
      >
        <el-form-item label="学校名称 :">
          <el-col :span="24">
            <el-input v-model="filters.schoolname" placeholder="学校名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- 		<el-col style="margin-bottom:10px;" align="right">
			<el-button type="table-op" size="small" @click="handleAdd">新增</el-button>
			<el-button type="table-op" size="small" @click="handleEdit" :disabled="this.sels.length != 1">修改</el-button>
			<el-button type="table-op" size="small" @click="batchRemove" :disabled="this.sels.length===0">删除</el-button>
    </el-col>-->
    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
      :border="true"
    >
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column prop="schoolid" label="学校ID" align="center"></el-table-column>
      <el-table-column prop="schoolname" label="学校名称" align="center"></el-table-column>
    </el-table>

    <el-col style="margin-bottom: 50px; margin-top: 30px">
      <my-pagination
        @current-change="handleCurrentChange"
        @pgSize-change="handlePageSizeChange"
        :page-size="10"
        :total="total"
      ></my-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="用户ID :" label-width="10%">
          <el-input v-model="editForm.age" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学校名称 :" label-width="10%" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">确定</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="用户ID :" label-width="10%">
          <el-input v-model="addForm.age" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学校名称 :" label-width="10%" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="配置权限" v-model="powerSettingVisible" :close-on-click-modal="false">
      <el-form
        :model="setPrivSchoolForm"
        label-width="80px"
        :rules="setPrivSchoolFormRules"
        ref="setPrivSchoolForm"
      >
        <el-tree
          style="margin-bottom: 20px"
          :data="treeData"
          :default-expand-all="true"
          :expand-on-click-node="false"
          :show-checkbox="false"
          :accordion="false"
          :highlight-current="false"
          @node-click="nodeClicked"
        ></el-tree>
        <el-form-item label="终止日期:">
          <el-date-picker type="date" placeholder="终止日期" v-model="setPrivSchoolForm.expiredate"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="powerSettingVisible = false">取消</el-button>
        <el-button type="primary" @click.native="setPrivSchool" :loading="privLoading">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import {
  getSchoolListPage,
  batchRemoveAccount,
  editAccount,
  addAccount,
  setSchoolPriv
} from "../../api/api";

export default {
  data() {
    return {
      treeData: [
        {
          icon: "icon",
          label: "档目资源管理",
          children: [
            {
              label: "我的首页"
            }
          ]
        },
        {
          label: "设备管理",
          children: [
            {
              label: "设备信息",
              children: [
                {
                  label: "设备休息管理"
                },
                {
                  label: "参加设备休息"
                }
              ]
            }
          ]
        }
      ],
      form: {
        name: "",
        sysType: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      filters: {
        schoolname: ""
      },
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      },
      powerSettingVisible: false,
      privLoading: false,
      setPrivSchoolFormRules: {
        expiredate: [
          { required: true, message: "请输入终止日期", trigger: "blur" }
        ]
      },
      setPrivSchoolForm: {
        privid: "",
        expiredate: ""
      }
    };
  },
  methods: {
    nodeClicked: function(nodeData, node, obj) {
      this.setPrivSchoolForm.privid = nodeData.label;
    },
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getUsers();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    //获取用户列表
    getUsers() {
      let para = {
        page: this.page,
        schoolname: this.filters.schoolname
      };
      this.listLoading = true;

      getSchoolListPage(para).then(res => {
        this.total = res.data.total;
        this.users = res.data.data;
        this.listLoading = false;
      });
    },
    //显示编辑界面
    handleEdit: function() {
      this.editFormVisible = true;
      var names = this.sels.map(item => item.name).toString();
      var ages = this.sels.map(item => item.age).toString();
      var addrs = this.sels.map(item => item.addr).toString();
      var births = this.sels.map(item => item.birth).toString();
      this.editForm = {
        name: names,
        sex: -1,
        age: ages,
        birth: births,
        addr: addrs
      };
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      };
    },

    handlePowerSetting: function() {
      this.powerSettingVisible = true;
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;

            let para = Object.assign({}, this.editForm);
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            editAccount(para).then(res => {
              this.editLoading = false;

              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getUsers();
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
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            addAccount(para).then(res => {
              this.addLoading = false;

              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getUsers();
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
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;

          let para = { ids: ids };
          batchRemoveAccount(para).then(res => {
            this.listLoading = false;

            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    },
    setPrivSchool: function() {
      var schoolids = this.sels.map(item => item.schoolid).toString();
      var checkedSysType = this.form.sysType.toString();
      this.$refs.setPrivSchoolForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.privLoading = true;
            let para = Object.assign(
              { checkedSysType, schoolids },
              this.setPrivSchoolForm
            );
            para.expiredate =
              !para.expiredate || para.expiredate == ""
                ? ""
                : util.formatDate.format(
                    new Date(para.expiredate),
                    "yyyy-MM-dd"
                  );
            setSchoolPriv(para).then(res => {
              this.privLoading = false;
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["setPrivSchoolForm"].resetFields();
              this.powerSettingVisible = false;
              this.getUsers();
            });
          });
        }
      });
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";
</style>