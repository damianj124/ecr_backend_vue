<template>
  <section>
    <el-col :span="24">
      <el-form :model="filters" label-width="120px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="机构名称：">
              <el-input v-model="filters.orgname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="机构代码：">
              <el-input v-model="filters.orgcode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="机构类型：">
              <el-input v-model="filters.orgtype"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="padding-left: 15px;">
            <el-button type="primary" @click="load()">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-col>
    <el-col :span="24" style="text-align:right; margin-bottom: 10px;">
      <el-button type="table-op" size="small" @click="add">新增</el-button>
      <el-button type="table-op" size="small" @click="edit" :disabled="this.sels.length!==1">修改</el-button>
      <el-button type="table-op" size="small" @click="remove" :disabled="this.sels.length===0">删除</el-button>
    </el-col>
    <!--列表-->
    <el-table
      :data="organizations"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="orgid" label="机构ID" width="100" align="center"></el-table-column>
      <el-table-column prop="parentorgid" label="上级机构ID" align="center"></el-table-column>
      <el-table-column prop="orgname" label="机构名称" align="center"></el-table-column>
      <el-table-column prop="weburl" label="机构描述" align="center"></el-table-column>
      <el-table-column prop="tenantid" label="排列顺序编号" align="center"></el-table-column>
      <el-table-column prop="orgcode" label="机构代码" align="center"></el-table-column>
      <el-table-column prop="orgtype" label="机构类型" :formatter="formatOrgType" align="center"></el-table-column>
      <el-table-column prop="orgaddr" label="机构地址" align="center"></el-table-column>
      <el-table-column prop="creatorid" label="创建人" align="center"></el-table-column>
      <el-table-column prop="createtime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="lastmodifierid" label="最后修改人" align="center"></el-table-column>
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

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="上级机构" prop="parentorgid">
          <el-select v-model="editForm.parentorgid">
            <el-option :value="org.orgid" :label="org.orgname" v-for="org in organizations"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构名称" prop="orgname">
          <el-input v-model="editForm.orgname" auto-complete="false"></el-input>
        </el-form-item>
        <el-form-item label="机构描述">
          <el-input v-model="editForm.weburl" auto-complete="false"></el-input>
        </el-form-item>
        <el-form-item label="排列顺序编号">
          <el-input v-model="editForm.tenantid" auto-complete="false"></el-input>
        </el-form-item>
        <el-form-item label="机构代码">
          <el-input v-model="editForm.orgcode" auto-complete="false"></el-input>
        </el-form-item>
        <el-form-item label="机构类型" prop="orgtype">
          <el-select v-model="editForm.orgtype">
            <el-option value="0" label="天闻"></el-option>
            <el-option value="1" label="区县级教育局"></el-option>
            <el-option value="3" label="地市级教育行政部门"></el-option>
            <el-option value="4" label="省级教育行政部门"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构地址">
          <el-input v-model="editForm.orgaddr" auto-complete="false"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="上级机构" prop="parentorgid">
          <el-select v-model="addForm.parentorgid">
            <el-option :value="org.orgid" :label="org.orgname" v-for="org in organizations"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构名称" prop="orgname">
          <el-input v-model="addForm.orgname" auto-complete="false"></el-input>
        </el-form-item>
        <el-form-item label="机构描述">
          <el-input v-model="addForm.weburl" auto-complete="false"></el-input>
        </el-form-item>
        <el-form-item label="排列顺序编号">
          <el-input v-model="addForm.tenantid" auto-complete="false"></el-input>
        </el-form-item>
        <el-form-item label="机构代码">
          <el-input v-model="addForm.orgcode" auto-complete="false"></el-input>
        </el-form-item>
        <el-form-item label="机构类型" prop="orgtype">
          <el-select v-model="addForm.orgtype">
            <el-option value="0" label="天闻"></el-option>
            <el-option value="1" label="区县级教育局"></el-option>
            <el-option value="3" label="地市级教育行政部门"></el-option>
            <el-option value="4" label="省级教育行政部门"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构地址">
          <el-input v-model="addForm.orgaddr" auto-complete="false"></el-input>
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
  getOrganizationListPage,
  batchRemoveOrganization,
  editOrganization,
  addOrganization
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        orgname: "",
        orgcode: "",
        orgtype: ""
      },
      organizations: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        orgname: [{ required: true, message: "机构名称", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        orgid: 0,
        orgname: "",
        parentorgid: "",
        orgtype: "",
        orgaddr: "",
        zipcode: "",
        orgmanager: "",
        linkman: "",
        linktel: "",
        email: "",
        weburl: "",
        description: "",
        areaid: "",
        tenantid: "",
        orgcode: "",
        synurl: "",
        syncode: "",
        title: "",
        linenum: 0
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        orgname: [{ required: true, message: "机构名称", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        orgname: "",
        parentorgid: "",
        orgtype: "",
        orgaddr: "",
        zipcode: "",
        orgmanager: "",
        linkman: "",
        linktel: "",
        email: "",
        weburl: "",
        description: "",
        areaid: "",
        tenantid: "",
        orgcode: "",
        synurl: "",
        syncode: "",
        title: "",
        linenum: 0
      }
    };
  },
  methods: {
    formatOrgType: function(row, column) {
      if (row.orgtype == 0) {
        return "天闻";
      } else if (row.orgtype == 1) {
        return "区县级教育局";
      } else if (row.orgtype == 3) {
        return "地市级教育行政部门";
      } else if (row.orgtype == 4) {
        return "省级教育行政部门";
      }
      return "";
    },
    //性别显示转换
    handleCurrentChange(val) {
      this.page = val;
      this.load();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.load();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    //获取用户列表
    load() {
      let para = {
        page: this.page,
        orgname: this.filters.orgname,
        orgcode: this.filters.orgcode,
        orgtype: this.filters.orgtype
      };
      this.listLoading = true;
      //NProgress.start();
      getOrganizationListPage(para).then(res => {
        this.total = res.data.total;
        this.organizations = res.data.data;
        this.listLoading = false;
      });
    },
    //显示编辑界面
    edit: function() {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, this.sels[0]);
    },
    //显示新增界面
    add: function() {
      this.addFormVisible = true;
      this.addForm = {
        orgname: "",
        parentorgid: "",
        orgtype: "",
        orgaddr: "",
        zipcode: "",
        orgmanager: "",
        linkman: "",
        linktel: "",
        email: "",
        weburl: "",
        description: "",
        areaid: "",
        tenantid: "",
        orgcode: "",
        synurl: "",
        syncode: "",
        title: "",
        linenum: 0
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            editOrganization(para).then(res => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.load();
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
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            addOrganization(para).then(res => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.load();
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    remove: function() {
      var orgids = this.sels.map(item => item.orgid).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { orgids: orgids };
          batchRemoveOrganization(para).then(res => {
            this.listLoading = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.load();
          });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.load();
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";
</style>