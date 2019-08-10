<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">充值日志管理</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <el-form label-width="100px">
        <el-col :span="4">
          <el-form-item label="用户名:">
            <el-input v-model="filters.loginname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="姓名:">
            <el-input v-model="filters.realname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="充值状态:">
            <el-select v-model="filters.chargestatus">
              <el-option label="全部" value></el-option>
              <el-option label="成功" value="1"></el-option>
              <el-option label="失败" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
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
        v-if="chargelog.length==0"
      >
      <el-table :data="chargelog" v-loading="listLoading" v-if="chargelog.length>0">
        <el-table-column prop="loginname" label="用户名" align="center"></el-table-column>
        <el-table-column prop="realname" label="姓名" align="center"></el-table-column>
        <el-table-column prop="createtime" label="充值日期" align="center"></el-table-column>
        <el-table-column prop="cost" label="充值金额（元）" align="center"></el-table-column>
        <el-table-column label="充值状态" align="center">
          <template slot-scope="user">
            <span
              :class="{ 'ecrm-color-red':user.row.status=='0', 'ecrm-color-green':user.row.status=='1'}"
            >{{ formatStatus(user.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="chargername" label="操作人" align="center"></el-table-column>
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
import { getChargeItemList } from "../../api/api";

export default {
  data() {
    return {
      filters: {
        loginname: "",
        realname: "",
        chargestatus: "",
        begin_time: "",
        end_time: ""
      },
      chargelog: [],

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
    getChargeLog() {
      let param = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
          {
            fieldName: "loginname",
            fieldValues: [this.filters.loginname],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "realname",
            fieldValues: [this.filters.realname],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "status",
            fieldValues: [this.filters.chargestatus],
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
      getChargeItemList(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.chargelog = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.chargelog = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(res => {
          this.total = 0;
          this.chargelog = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getChargeLog();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getChargeLog();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    search() {
      this.page = 1;
      this.getChargeLog();
    },
    formatStatus: function(chargestatus) {
      if (chargestatus == "1") {
        return "成功";
      } else if (chargestatus == "0") {
        return "失败";
      }
    }
  },
  created() {
    this.getChargeLog();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";

.el-select {
  width: 100%;
}
.el-input {
  width: 100%;
}
</style>