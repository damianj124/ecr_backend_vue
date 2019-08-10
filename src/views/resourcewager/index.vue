<template>
  <section class="vscroll">
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
            <el-input v-model="filters.format" style="float:left; width: calc(100% - 70px)"></el-input>
            <el-button
              style="margin-left:10px; float:right"
              type="primary"
              v-on:click="search"
              id="searchBtn"
            >查询</el-button>
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
      <!-- Data Table -->
      <el-table :data="activities" v-loading="listLoading" @selection-change="selsChange">
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
            <span>{{activity.row.starttime}}-{{activity.row.endtime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="征集要求" prop="requirement" align="center"></el-table-column>
        <el-table-column label="格式" prop="format" align="center"></el-table-column>
        <el-table-column label="活动介绍" prop="description" align="center"></el-table-column>
        <el-table-column label="奖励说明" prop="bonusnote" align="center"></el-table-column>
        <el-table-column label="奖励积分" prop="bonuspoints" align="center" width="100"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            <el-button
              size="small"
              v-if="scope.row.status=='2'"
              @click="handleClose(scope.$index, scope.row)"
            >结束</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
        <my-pagination
          @current-change="handleCurrentChange"
          @pgSize-change="handlePageSizeChange"
          :page-size="page_size"
          :total="total"
        ></my-pagination>
      </el-col>
      <!-- Data Table End -->
    </el-col>
  </section>
</template>

<script>
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
      filters: {
        activityname: "",
        format: ""
      },
      contentTypes: CONTENT_TYPE,
      activities: [],

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 5,
      /////////// Pagination End ////////

      addLoading: false,
      listLoading: false,
      sels: [] //列表选中列
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
          }
        ]
      };
      this.listLoading = true;
      getCollectionActivityList(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.activities = res.data.pageInfo.list;
          } else {
            var resultMessage = res.data.serverResult.resultMessage;
            this.$message({
              message: resultMessage,
              type: "error"
            });
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
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
                var resultMessage = res.data.serverResult.resultMessage;
                this.$message({
                  message: resultMessage,
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
        });
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
              var resultMessage = res.data.serverResult.resultMessage;
              this.$message({
                message: resultMessage,
                type: "error"
              });
            }
            this.listLoading = false;
          })
          .catch(() => {
            this.listLoading = false;
          });
      });
    },
    handleClose(index, activity) {
      this.$confirm("是否结束当前资源？", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
        endCollectionActivity(activity.activityid)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.getActivityLists();
            } else {
              var resultMessage = res.data.serverResult.resultMessage;
              this.$message({
                message: resultMessage,
                type: "error"
              });
            }
            this.listLoading = false;
          })
          .catch(() => {
            this.listLoading = false;
          });
      });
    },
    handleEdit(index, activity) {
      this.$router.push({ path: "/wager/" + activity.activityid });
    },
    search() {
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