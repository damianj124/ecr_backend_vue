<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">用户积分管理</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <el-form label-width="100px">
        <el-col :span="5">
          <el-form-item label="用户名:">
            <el-input v-model="filters.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="19">
          <el-form-item label="搜索框:">
            <el-input
              v-model="filters.searchkey"
              placeholder="请输入用户名 / 姓名"
              style="width:calc(100% - 65px);max-width:300px;"
              @keyup.enter.native="search"
            ></el-input>
            <el-button type="primary" v-on:click="search" id="searchBtn">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="userscore.length==0"
      >
      <el-table :data="userscore" v-loading="listLoading" v-if="userscore.length>0">
        <el-table-column prop="userid" label="用户ID" align="center"></el-table-column>
        <el-table-column prop="loginname" label="用户名" align="center"></el-table-column>
        <el-table-column prop="realname" label="姓名" align="center"></el-table-column>
        <el-table-column prop="useintegral" label="可用积分" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="score">
            <el-button size="small" @click="showDetail(score.row)">明细</el-button>
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
import { getAccountScoreList } from "../../api/api";

export default {
  data() {
    return {
      filters: {
        username: "",
        searchkey: ""
      },
      userscore: [],

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
    getAccountScoreList() {
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
          },
          {
            fieldName: "searchkey",
            fieldValues: [this.filters.searchkey.trim()],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ]
      };

      this.listLoading = true;
      getAccountScoreList(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.userscore = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.userscore = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(res => {
          this.total = 0;
          this.userscore = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getAccountScoreList();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getAccountScoreList();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    search() {
      this.page = 1;
      this.getAccountScoreList();
    },
    showDetail(user) {
      this.$router.push("/score/scoredetail/" + user.userid);
    }
  },
  created() {
    this.getAccountScoreList();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";

.el-input {
  width: 100%;
}
</style>