<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">订单管理</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <el-form label-width="100px">
        <el-col :span="5">
          <el-form-item label="订单编号:">
            <el-input v-model="filters.orderid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="状态:">
            <el-select v-model="filters.ispaid">
              <el-option label="全部" value></el-option>
              <el-option label="待支付" value="0"></el-option>
              <el-option label="已支付" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="购买人:">
            <el-input v-model="filters.realname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-button style="margin-left:10px" type="primary" v-on:click="search" id="searchBtn">查询</el-button>
        </el-col>
      </el-form>
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="orderLog.length==0"
      >
      <el-table :data="orderLog" v-loading="listLoading" v-if="orderLog.length>0">
        <el-table-column label="订单编号" align="center">
          <template slot-scope="order">{{ order.row.orderid }}</template>
        </el-table-column>
        <el-table-column prop="integralprice" label="订单金额" align="center"></el-table-column>
        <el-table-column prop="ispaid" label="状态" align="center">
          <template slot-scope="order">
            <span
              :class="{ 'ecrm-color-red':order.row.ispaid=='0', 'ecrm-color-green':order.row.ispaid=='1'}"
            >{{ getOrderStatus(order.row.ispaid) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realname" label="购买人" align="center"></el-table-column>
        <el-table-column label="购买时间" align="center" :formatter="formatPaidTime"></el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="order">
            <el-button size="small" @click="detail(order.row)">详情</el-button>
          </template>
        </el-table-column>
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
import { getOrderItemList } from "../../api/api";

export default {
  data() {
    return {
      filters: {
        orderid: "",
        realname: "",
        ispaid: ""
      },
      orderLog: [],

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
    formatPaidTime(row, col) {
      if (row.paidtime == null) return "";
      return row.paidtime;
    },
    getOrderStatus(ispaid) {
      if (ispaid == "0") return "待支付";
      return "已支付";
    },
    getOrderLog() {
      let param = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
          {
            fieldName: "orderid",
            fieldValues: [this.filters.orderid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "ispaid",
            fieldValues: [this.filters.ispaid],
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
          }
        ]
      };

      this.listLoading = true;
      getOrderItemList(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.orderLog = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.orderLog = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(res => {
          this.total = 0;
          this.orderLog = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getOrderLog();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getOrderLog();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    detail(order) {
      this.$router.push("/order/detail/" + order.orderid);
    },
    search() {
      this.page = 1;
      this.getOrderLog();
    }
  },
  created() {
    this.getOrderLog();
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