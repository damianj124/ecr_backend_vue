<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">订单详情</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <!-- Data Table -->
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="goodsList.length==0"
      >
      <el-table :data="goodsList" v-loading="listLoading" v-if="goodsList.length>0">
        <el-table-column prop="goodid" label="商品编码" align="center" width="200"></el-table-column>
        <el-table-column prop="goodprice" label="积分值" align="center" width="200"></el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="goods">
            <my-resource :resource="goods.row.resource"></my-resource>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="goods">
            <div style="margin-bottom: 5px;">
              <el-button size="small" @click="doEdit(goods.$index, goods.row)" style="margin:0px">详情</el-button>
            </div>
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

      <!-- Data Table End -->
    </el-col>
  </section>
</template>

<script>
import ECRUtil from "../../common/js/util";
import { getGoodsListByOrder } from "../../api/api";

export default {
  data() {
    return {
      listLoading: false,
      goodsList: [],
      orderId: "",
      total: 0,
      page: 1,
      page_size: 5,
      page_total: 0,
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    load() {
      let params = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page
        },
        conditions: [
          {
            fieldName: "orderid",
            fieldValues: [this.orderId],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ]
      };

      this.listLoading = true;
      getGoodsListByOrder(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.goodsList = res.data.pageInfo.list;
            this.total = res.data.pageInfo.total;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.goodsList = [];
            this.total = 0;
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.goodsList = [];
          this.total = 0;
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    handleCurrentChange(val) {
      this.page = val;

      this.load();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.orderId = this.$route.params.id;
      this.load();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    doEdit(index, goods) {
      this.$router.push("/stuff/" + goods.resource.contentid);
    }
  },
  created() {
    this.orderId = this.$route.params.id;
    this.load();
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