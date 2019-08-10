<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">征集活动管理</a>
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
            <el-input v-model="filters.format" style="float:left; width: calc(100% - 70px)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束状态:">
            <el-select v-model="filters.status">
              <el-option label="全部" value></el-option>
              <el-option label="已结束" value="0"></el-option>
              <el-option label="未结束" value="1"></el-option>
            </el-select>
            <el-button type="primary" v-on:click="search" id="searchBtn">查询</el-button>
          </el-form-item>
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
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="activities.length==0"
      >
      <!-- Data Table -->
      <el-table
        :data="activities"
        v-loading="listLoading"
        @selection-change="selsChange"
        v-if="activities.length > 0"
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
              {{ECRUtil.formatDate.format(new Date(activity.row.starttime), 'y-M-d')}}
              -
              {{ECRUtil.formatDate.format(new Date(activity.row.endtime), 'y-M-d')}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="征集要求" prop="requirementtext" align="center"></el-table-column>
        <el-table-column label="格式" prop="format" align="center"></el-table-column>
        <el-table-column label="活动介绍" prop="descriptiontext" align="center"></el-table-column>
        <el-table-column label="奖励说明" prop="bonusnotetext" align="center"></el-table-column>
        <el-table-column label="奖励积分" prop="bonuspoints" align="center" width="100"></el-table-column>
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
              v-if="scope.row.status== 1"
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
  getCollectionActivityList,
  deleteActivity,
  batchRemoveActivity,
  endCollectionActivity
} from "../../api/api";

export default {
  data() {
    return {
      ECRUtil: ECRUtil,
      FRONTEND_CONTEXT: FRONTEND_CONTEXT,
      filters: {
        activityname: "",
        format: "",
        status: ""
      },
      contentTypes: CONTENT_TYPE,
      activities: [],

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 5,
      page_total: 0,
      /////////// Pagination End ////////

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
      this.getActivityLists();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getActivityLists();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    selsChange: function(sels) {
      this.sels = sels;
    },
    getActivityLists() {
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
          },
          {
            fieldName: "status",
            fieldValues: [this.filters.status],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ]
      };
      this.listLoading = true;
      getCollectionActivityList(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.activities = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.activities = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.total = 0;
          this.activities = [];
          this.listLoading = false;

          this.$message({
            message: "操作失败",
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
          batchRemoveActivity(activityIds)
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.getActivityLists();
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
        .catch(() => {
          this.listLoading = false;
        });
    },
    handlePreview(index, activity) {
      var w = window.open(
        this.FRONTEND_CONTEXT + "collection/detail/" + activity.activityid
      );
      w.focus();
    },
    handleDel(index, activity) {
      this.$confirm("是否删除当前资源？", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
        deleteActivity(activity.activityid)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.getActivityLists();
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
      });
    },
    handleClose(index, activity) {
      this.$confirm("是否结束当前活动？", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
        endCollectionActivity(activity.activityid)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.getActivityLists();
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
      });
    },
    handleEdit(index, activity) {
      this.$router.push("/raise/" + activity.activityid);
    },
    handleStat(index, activity) {
      this.$router.push("/raisestat/" + activity.activityid);
    },
    search() {
      this.page = 1;
      this.getActivityLists();
    }
  },
  created() {
    this.getActivityLists();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";
</style>