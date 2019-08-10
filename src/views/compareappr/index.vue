<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">评比活动管理</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <el-form label-width="120px">
        <el-col :span="6">
          <el-form-item label="活动名称:">
            <el-input v-model="filters.activityname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="格式:">
            <el-input v-model="filters.format"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" v-on:click="search" id="searchBtn" style="margin-left: 10px">查询</el-button>
        </el-col>
      </el-form>

      <el-col :span="24" style="margin-bottom: 10px">
        <el-button
          style="float: right;"
          type="table-op"
          size="small"
          :disabled="this.sels.length==0"
          @click="doBatchRemove"
        >批量删除</el-button>
      </el-col>
      <!-- Data Table -->
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="estimate_activities.length==0"
      >
      <el-table
        :data="estimate_activities"
        v-loading="listLoading"
        @selection-change="selsChange"
        v-if="estimate_activities.length>0"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="活动ID" prop="activityid" align="center"></el-table-column>
        <el-table-column label="活动名称" prop="activityname" align="center"></el-table-column>
        <el-table-column
          label="类型"
          prop="contenttype"
          align="center"
          :formatter="formatContentType"
          width="100"
        ></el-table-column>
        <el-table-column label="有效期" align="center">
          <template slot-scope="activity">
            <span>
              {{ ECRUtil.formatDate.format(new Date(activity.row.starttime), 'y/M/d') }}
              -
              {{ ECRUtil.formatDate.format(new Date(activity.row.endtime), 'y/M/d') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="征集要求" prop="requirementtext" align="center"></el-table-column>
        <el-table-column label="格式" prop="format" align="center"></el-table-column>
        <el-table-column label="活动介绍" prop="descriptiontext" align="center"></el-table-column>
        <el-table-column label="发文原件" align="center" width="100">
          <template slot-scope="scope">
            <el-button size="small" @click="handlePreview(scope.$index, scope.row)">预览</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            <el-button size="small" @click="handleStat(scope.$index, scope.row)">详情</el-button>
            <el-button
              size="small"
              v-if="scope.row.status=='1'"
              @click="handleClose(scope.$index, scope.row)"
            >结束</el-button>
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
import { CONTENT_TYPE } from "../../common/js/const.js";
import {
  getEstimateActivityList,
  endEstimateActivity,
  deleteEstimateActivity,
  batchRemoveEstimateActivity
} from "../../api/api";

export default {
  data() {
    return {
      ECRUtil: ECRUtil,
      FRONTEND_CONTEXT: FRONTEND_CONTEXT,
      filters: {
        activityname: "",
        format: ""
      },
      contentTypes: CONTENT_TYPE,
      estimate_activities: [],

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 5,
      page_total: 0,
      /////////// Pagination End ////////

      addLoading: false,
      listLoading: false,
      sels: [], //列表选中列
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    formatContentType(row, col) {
      for (var i = 0; i < this.contentTypes.length; i++) {
        if (this.contentTypes[i].contenttype == row.contenttype) {
          return this.contentTypes[i].contentname;
        }
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getEstimateActivityLists();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getEstimateActivityLists();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    selsChange: function(sels) {
      this.sels = sels;
    },
    getEstimateActivityLists() {
      let params = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
          {
            fieldName: "activityname",
            fieldValues: [this.filters.activityname],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "format",
            fieldValues: [this.filters.format],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ]
      };
      this.listLoading = true;
      getEstimateActivityList(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.estimate_activities = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.estimate_activities = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.total = 0;
          this.estimate_activities = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    doBatchRemove() {
      this.$confirm("是否批量删除过该资源？", "提示", {
        type: "warning"
      })
        .then(() => {
          let activityIds = this.sels
            .map(item => item.activityid)
            .toString()
            .split(",");
          this.listLoading = true;
          batchRemoveEstimateActivity(activityIds)
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.getEstimateActivityLists();
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
            });
        })
        .catch(() => {
          this.listLoading = false;

          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    handleDel(index, activity) {
      this.$confirm("是否删除当前资源？", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
        batchRemoveEstimateActivity([activity.activityid])
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.getEstimateActivityLists();
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
      });
    },
    handlePreview(index, activity) {
      var w = window.open(
        this.FRONTEND_CONTEXT + "compareappr/" + activity.activityid
      );
      w.focus();
    },
    handleStat(index, activity) {
      this.$router.push("/compareappr_stat/" + activity.activityid);
    },
    handleClose(index, activity) {
      this.$confirm("是否结束当前资源？", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
        endEstimateActivity(activity.activityid)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.getEstimateActivityLists();
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
      });
    },
    handleEdit(index, activity) {
      this.$router.push("/compareappr/" + activity.activityid);
    },
    search() {
      this.page = 1;
      this.getEstimateActivityLists();
    }
  },
  created() {
    this.getEstimateActivityLists();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";
</style>