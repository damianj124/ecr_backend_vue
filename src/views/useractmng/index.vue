<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">用户行为管理</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <el-form label-width="100px">
        <el-col :span="6">
          <el-form-item label="用户行为ID:">
            <el-input v-model="filters.actionid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户ID:">
            <el-input v-model="filters.userid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="场景:">
            <el-select v-model="filters.actiontype">
              <el-option label="全部" value></el-option>
              <el-option label="名校资源" value="名校资源"></el-option>
              <el-option label="同步资源" value="同步资源"></el-option>
              <el-option label="试卷" value="试卷"></el-option>
              <el-option label="特供专题" value="特供专题"></el-option>
              <el-option label="微视频课程" value="微视频课程"></el-option>
              <el-option label="培生英语课程" value="培生英语课程"></el-option>
              <el-option label="STEM课程" value="STEM课程"></el-option>
              <el-option label="美育课程" value="美育课程"></el-option>
              <el-option label="品牌专区" value="品牌专区"></el-option>
              <el-option label="课例资源包" value="课例资源包"></el-option>
              <el-option label="精品学堂" value="精品学堂"></el-option>
              <el-option label="参与征集" value="参与征集"></el-option>
              <el-option label="参与悬赏" value="参与悬赏"></el-option>
              <el-option label="参与评比" value="参与评比"></el-option>
              <el-option label="上传资源" value="上传资源"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资源ID:">
            <el-input style="width: calc(100% - 70px)" v-model="filters.contentid"></el-input>
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
        v-if="useracts.length==0"
      >
      <el-table
        :data="useracts"
        v-loading="listLoading"
        @selection-change="selsChange"
        v-if="useracts.length>0"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="actionid" label="用户行为ID" align="center"></el-table-column>
        <el-table-column prop="userid" label="用户ID" align="center"></el-table-column>
        <el-table-column prop="actiontype" label="场景" align="center"></el-table-column>
        <el-table-column prop="contentid" label=" 资源ID" align="center"></el-table-column>
        <el-table-column prop="starttime" label="开始时间" align="center"></el-table-column>
        <el-table-column prop="actiontime" label="耗时" align="center" :formatter="timeFormatter"></el-table-column>
        <el-table-column prop="ipaddress" label="IP" align="center"></el-table-column>
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
import {} from "../../common/js/const.js";
import { getActionList, batchActionDelete } from "../../api/api";

export default {
  data() {
    return {
      ECRUtil: ECRUtil,
      filters: {
        actionid: "",
        userid: "",
        actiontype: "",
        contentid: ""
      },
      useracts: [],
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
    timeFormatter(row, col) {
      return ECRUtil.formatDuration(row.actiontime);
    },
    search() {
      this.page = 1;
      this.getUserActions();
    },
    getUserActions() {
      let params = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
          {
            fieldName: "actionid",
            fieldValues: [this.filters.actionid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "userid",
            fieldValues: [this.filters.userid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "actiontype",
            fieldValues: [this.filters.actiontype],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "contentid",
            fieldValues: [this.filters.contentid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ]
      };

      this.listLoading = true;
      getActionList(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.useracts = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.useracts = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.total = 0;
          this.useracts = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUserActions();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getUserActions();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    selsChange: function(sels) {
      this.sels = sels;
    },
    batchRemove() {
      this.$confirm("是否批量删除过该用户行为？", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = [];
          this.sels.forEach(function(useract) {
            params.push(useract.actionid);
          });
          this.listLoading = true;
          batchActionDelete(params)
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.$message({
                  message: "删除成功！",
                  type: "success"
                });
                this.getUserActions();
              } else {
                this.$message({
                  message: res.data.serverResult.resultMessage,
                  type: "error"
                });
                this.listLoading = false;
              }
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
    this.getUserActions();
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";

.el-input,
.el-select {
  width: 100%;
}
</style>