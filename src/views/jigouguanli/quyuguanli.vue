<template>
  <section>
    <el-col :span="24">
      <el-form :model="filters" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="区域名称：">
              <el-input v-model="filters.areaname" style="width: 200px;"></el-input>
              <el-button type="primary" @click="load()">查询</el-button>
            </el-form-item>
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
      :data="regions"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="areaid" label="区域 ID" width="100" align="center"></el-table-column>
      <el-table-column prop="areaname" label="区域名称" align="center"></el-table-column>
      <el-table-column prop="sortid" label="排列顺序编号" align="center"></el-table-column>
      <el-table-column prop="creatorname" label="创建人" align="center"></el-table-column>
      <el-table-column prop="createtime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="lastmodifiername" label="最后修改人" align="center"></el-table-column>
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
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item label="区域名称" prop="areaname">
          <el-input v-model="editForm.areaname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排列顺序编号" prop="sortid">
          <el-input v-model="editForm.sortid" auto-complete="off"></el-input>
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
        <el-form-item label="区域名称" prop="areaname">
          <el-input v-model="addForm.areaname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排列顺序编号" prop="sortid">
          <el-input v-model="addForm.sortid" auto-complete="off"></el-input>
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
  getRegionListPage,
  batchRemoveRegion,
  editRegion,
  addRegion
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        areaname: ""
      },
      regions: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [],

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        areaname: [{ required: true, message: "区域名称", trigger: "blur" }]
      },
      editForm: {
        areaid: "",
        areaname: "",
        sortid: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        areaname: [{ required: true, message: "区域名称", trigger: "blur" }]
      },
      addForm: {
        areamame: "",
        sortid: ""
      }
    };
  },
  methods: {
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
    load() {
      let para = {
        page: this.page,
        areaname: this.filters.areaname
      };
      this.listLoading = true;
      getRegionListPage(para).then(res => {
        console.log(res.data);
        this.total = res.data.total;
        this.regions = res.data.data;
        this.listLoading = false;
      });
    },
    edit: function() {
      var row = this.sels[0];
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    add: function() {
      this.addFormVisible = true;
      this.addForm = {
        areaname: "",
        sortid: ""
      };
    },
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = Object.assign({}, this.editForm);
            editRegion(para).then(res => {
              this.editLoading = false;
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
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            let para = Object.assign({}, this.addForm);
            addRegion(para).then(res => {
              this.addLoading = false;
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
    remove: function() {
      var areaids = this.sels.map(item => item.areaid).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { areaids: areaids };
          batchRemoveRegion(para).then(res => {
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