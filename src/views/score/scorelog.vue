<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">积分日志管理</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <el-form label-width="100px">
        <el-col :span="5">
          <el-form-item label="用户名:">
            <el-input v-model="filters.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item label="充值日期:">
            <el-date-picker type="date" v-model="filters.begin_time" style="width:150px;"></el-date-picker>-
            <el-date-picker type="date" v-model="filters.end_time" style="width:150px;"></el-date-picker>
            <el-button style="margin-left:10px" type="primary" v-on:click="search" id="searchBtn">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="scorelog.length==0"
      >
      <el-table :data="scorelog" v-loading="listLoading" v-if="scorelog.length>0">
        <el-table-column prop="loginname" label="用户名" align="center"></el-table-column>
        <el-table-column prop="realname" label="姓名" align="center"></el-table-column>
        <el-table-column prop="createtime" label="日期" align="center"></el-table-column>
        <el-table-column
          prop="operationtype"
          label="事件"
          align="center"
          :formatter="formatOperation"
        ></el-table-column>
        <el-table-column prop="integralvalue" label="积分" align="center">
          <template slot-scope="log">
            <span
              :class="{ 'ecrm-color-red': log.row.incometype == 1, 'ecrm-color-green': log.row.incometype == 0 }"
            >
              <span v-if="log.row.incometype == 0">+</span>
              <span v-if="log.row.incometype == 1">-</span>
              {{ log.row.integralvalue }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="userintegralvalue" label="积分余额" align="center"></el-table-column>
        <el-table-column prop="realname" label="操作人" align="center"></el-table-column>
      </el-table>

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
import { getAccountScoreLog } from "../../api/api";

export default {
  data() {
    return {
      filters: {
        username: "",
        begin_time: "",
        end_time: ""
      },
      scorelog: [],

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 10,
      page_total: 0,
      /////////// Pagination End ////////

      listLoading: false,
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    formatOperation: function(row, col) {
      return ECRUtil.getScoreMNGType(row.operationtype);
    },
    getAccountScoreLog() {
      let param = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
          {
            fieldName: "username",
            fieldValues: [this.filters.username],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ]
      };

      if (this.filters.begin_time != "" && this.filters.end_time != "") {
        if (
          new Date(this.filters.begin_time) > new Date(this.filters.end_time)
        ) {
          this.$message({
            message: "查询结束时间不得大于开始时间。",
            type: "error"
          });
          return;
        }
      }
      if (this.filters.begin_time != "") {
        param.conditions.push({
          fieldName: "begin_time",
          fieldValues: [
            ECRUtil.formatDate.format(new Date(this.filters.begin_time))
          ],
          prepender: null,
          operator: "EQUAL",
          childCondtions: null
        });
      }
      if (this.filters.end_time != "") {
        param.conditions.push({
          fieldName: "end_time",
          fieldValues: [
            ECRUtil.formatDate.format(new Date(this.filters.end_time))
          ],
          prepender: null,
          operator: "EQUAL",
          childCondtions: null
        });
      }

      this.listLoading = true;
      getAccountScoreLog(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.scorelog = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.scorelog = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(res => {
          this.total = 0;
          this.scorelog = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getAccountScoreLog();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getAccountScoreLog();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    search() {
      this.page = 1;
      this.getAccountScoreLog();
    }
  },
  created() {
    this.getAccountScoreLog();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";

.el-input {
  width: 100%;
}
</style>