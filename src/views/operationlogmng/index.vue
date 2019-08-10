<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">操作日志管理</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <el-form label-width="120px">
        <el-col :span="6">
          <el-form-item label="操作对象ID:">
            <el-input v-model="filters.optionedid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="产品类型:">
            <el-select v-model="filters.objecttype">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.contentname"
                :value="item.contenttype"
                v-for="(item, idx) in CONTENT_TYPE"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="操作类型:">
            <el-input v-model="filters.optionname" style="width:calc(100% - 70px);"></el-input>
            <el-button type="primary" v-on:click="search" id="searchBtn">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>

      <el-col :span="24" style="margin-bottom:10px;text-align:right;">
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="batchRemove"
        >删除</el-button>
      </el-col>
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="logs.length==0"
      >
      <el-table
        :data="logs"
        v-loading="listLoading"
        @selection-change="selsChange"
        v-if="logs.length>0"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="optionid" label="流水ID" align="center"></el-table-column>
        <el-table-column prop="optionedid" label="操作对象ID" align="center" width="400"></el-table-column>
        <el-table-column prop="objecttype" label="产品类型" align="center" :formatter="getObjectType"></el-table-column>
        <el-table-column prop="optionname" label="操作类型" align="center"></el-table-column>
        <el-table-column prop="creator" label="操作人" align="center"></el-table-column>
        <!--<el-table-column prop="operatorIP" label="操作人IP" align="center">
        </el-table-column>-->
        <el-table-column prop="optiontime" label="操作时间" align="center"></el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
        <my-pagination
          @current-change="handleCurrentChange"
          @pgSize-change="handlePageSizeChange"
          :page="page"
          :page-size="page_size"
          :total="total"
          :pagetotal="page_total"
        ></my-pagination>
      </el-col>
    </el-col>
  </section>
</template>

<script>
import ECRUtil from "../../common/js/util";
import { CONTENT_TYPE } from "../../common/js/const.js";
import { getOperationList, batchOptionDelete } from "../../api/api";

export default {
  data() {
    return {
      ECRUtil: ECRUtil,
      CONTENT_TYPE: CONTENT_TYPE,
      filters: {
        optionedid: "",
        objecttype: "",
        optionname: ""
      },
      logs: [],
      listLoading: false,
      sels: [],

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 5,
      page_total: 0,
      /////////// Pagination End ////////
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    getObjectType(row, col) {
      return ECRUtil.resourceLabel(
        row.objecttype != null ? row.objecttype.trim() : null
      );
    },
    search() {
      this.page = 1;
      this.getLogs();
    },
    getLogs() {
      let param = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
          {
            fieldName: "optionedid",
            fieldValues: [this.filters.optionedid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "objecttype",
            fieldValues: [this.filters.objecttype],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "optionname",
            fieldValues: [this.filters.optionname],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ]
      };

      this.listLoading = true;
      getOperationList(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.logs = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.logs = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.total = 0;
          this.logs = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getLogs();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getLogs();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    selsChange: function(sels) {
      this.sels = sels;
    },
    batchRemove() {
      this.$confirm("是否批量删除操作日志？", "提示", {
        type: "warning"
      })
        .then(() => {
          let optionids = this.sels.map(item => item.optionid);

          this.listLoading = true;
          batchOptionDelete(optionids)
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.getLogs();
              } else {
                this.$message({
                  message: res.data.serverResult.resultMessage,
                  type: "error"
                });
              }
              this.listLoading = false;
            })
            .catch(() => {
              this.listLoading = false;

              this.$message({
                message: "操作失败",
                type: "error"
              });
            });
        })
        .catch(() => {});
    }
  },
  created() {
    this.getLogs();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";

.el-input,
.el-select {
  width: 100%;
}
</style>