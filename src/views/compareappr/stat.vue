<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a :class="{'selected':curKind=='0'}" @click="changeKind(0)">评比教师排行</a>
      <a :class="{'selected':curKind=='1'}" @click="changeKind(1)">评比资源排行</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel" v-show="curKind == '0'">
      <el-form label-width="120px" v-if="countInfo!= null">
        <el-col :span="4">
          <el-form-item label="评比参与人数:">{{ countInfo.joinercount }} 人</el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="评比资源总数:">{{ countInfo.resourcecount }} 个</el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="日期:">
            <el-date-picker type="date" v-model="filters.begin_time" style="width:150px;"></el-date-picker>-
            <el-date-picker type="date" v-model="filters.end_time" style="width:150px;"></el-date-picker>
            <el-button style="margin-left:10px" type="primary" v-on:click="search" id="searchBtn">查询</el-button>
            <el-button
              style="margin-left:10px"
              type="primary"
              v-on:click="doExport"
              id="exportBtn"
              :loading="exportLoading"
            >导出</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="teacherList.length==0"
      >
      <el-table
        :data="teacherList"
        v-loading="listLoading"
        @selection-change="selsChange"
        v-if="teacherList.length>0"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="姓名" prop="realName" align="center"></el-table-column>
        <el-table-column label="区域" prop="areaName" align="center"></el-table-column>
        <el-table-column label="学校" prop="orgName" align="center" width="100"></el-table-column>
        <!--<el-table-column label="年级" prop="gradename" align="center" width="100">
        </el-table-column>-->
        <!--<el-table-column label="任教学科" prop="schoolsectionname" align="center">
        </el-table-column>-->
        <el-table-column label="参与评比时间" align="center">
          <template slot-scope="teacher">
            <span>{{ ECRUtil.formatDate.format(new Date(teacher.row.lastuploadtime), 'y-M-d') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="得票数" prop="votetimes" align="center"></el-table-column>
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

    <el-col :span="24" class="ecrm-content-panel" v-show="curKind == '1'">
      <el-form label-width="120px" v-if="countInfo!= null">
        <el-col :span="4">
          <el-form-item label="评比参与人数:">{{ countInfo.joinercount }} 人</el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="评比资源总数:">{{ countInfo.resourcecount }} 个</el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="日期:">
            <el-date-picker type="date" v-model="filters.begin_time" style="width:150px;"></el-date-picker>-
            <el-date-picker type="date" v-model="filters.end_time" style="width:150px;"></el-date-picker>
            <el-button style="margin-left:10px" type="primary" v-on:click="search" id="searchBtn">查询</el-button>
            <el-button
              style="margin-left:10px"
              type="primary"
              v-on:click="doExport"
              id="exportBtn"
              :loading="exportLoading"
            >导出</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="resourceList.length==0"
      >
      <el-table
        :data="resourceList"
        v-loading="listLoading"
        @selection-change="selsChange"
        v-if="resourceList.length>0"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="姓名" prop="realName" align="center"></el-table-column>
        <el-table-column label="区域" prop="areaName" align="center"></el-table-column>
        <el-table-column label="学校" prop="orgName" align="center" width="100"></el-table-column>
        <el-table-column label="年级" prop="gradename" align="center" width="100"></el-table-column>
        <el-table-column label="任教学科" prop="schoolsectionname" align="center"></el-table-column>
        <el-table-column label="参与评比时间" align="center">
          <template slot-scope="resource">
            <span>{{ ECRUtil.formatDate.format(new Date(resource.row.createtime), 'y-M-d') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传资源名称" prop="name" align="center"></el-table-column>
        <el-table-column label="资源浏览次数" prop="viewtimes" align="center"></el-table-column>
        <el-table-column label="资源点赞次数" prop="votetimes" align="center"></el-table-column>
        <el-table-column label="资源收藏次数" prop="collectiontimes" align="center" width="100"></el-table-column>
        <el-table-column label="资源下载次数" prop="downtimes" align="center" width="100"></el-table-column>
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
import {
  getActivityDetailList,
  getEstimateTeacherList,
  getCollectionCountInfo,
  exportActivityDetail,
  exportTeacherDetail
} from "../../api/api";

export default {
  data() {
    return {
      ECRUtil: ECRUtil,
      filters: {
        begin_time: "",
        end_time: ""
      },
      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 5,
      page_total: 0,
      /////////// Pagination End ////////
      curKind: "0",
      countInfo: null,
      resourceList: [],
      teacherList: [],

      listLoading: false,
      exportLoading: false,
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    changeKind(kind) {
      this.curKind = kind;
      this.getData(this.curKind);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData(this.curKind);
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.activityid = this.$route.params.id;
      this.getData(this.curKind);
      this.getCollectionCountInfo();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    selsChange: function(sels) {
      this.sels = sels;
    },
    getData(kind) {
      let params = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
          {
            fieldName: "begin_time",
            fieldValues: [this.filters.begin_time],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "end_time",
            fieldValues: [this.filters.end_time],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "activityid",
            fieldValues: [this.activityid],
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
        params.conditions.push({
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
        params.conditions.push({
          fieldName: "end_time",
          fieldValues: [
            ECRUtil.formatDate.format(new Date(this.filters.end_time))
          ],
          prepender: null,
          operator: "EQUAL",
          childCondtions: null
        });
      }

      if (kind == 0) {
        this.listLoading = true;
        getEstimateTeacherList(params)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.total = res.data.pageInfo.total;
              this.teacherList = res.data.pageInfo.list;
              this.page_total = res.data.pageInfo.list.length;
            } else {
              this.$message({
                message: res.data.serverResult.resultMessage,
                type: "error"
              });
              this.total = 0;
              this.teacherList = [];
            }
            this.listLoading = false;
            this.imageSize.width = $("section").width();
            this.imageSize.height = $("section").height();
          })
          .catch(() => {
            this.total = 0;
            this.teacherList = [];
            this.listLoading = false;

            this.$message({
              message: "加载失败!",
              type: "error"
            });
          });
      } else if (kind == 1) {
        this.listLoading = true;
        getActivityDetailList(params)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.total = res.data.pageInfo.total;
              this.resourceList = res.data.pageInfo.list;
              this.page_total = res.data.pageInfo.list.length;
            } else {
              this.$message({
                message: res.data.serverResult.resultMessage,
                type: "error"
              });
              this.total = 0;
              this.resourceList = [];
            }
            this.listLoading = false;
            this.imageSize.width = $("section").width();
            this.imageSize.height = $("section").height();
          })
          .catch(() => {
            this.total = 0;
            this.resourceList = [];
            this.listLoading = false;

            this.$message({
              message: "加载失败!",
              type: "error"
            });
          });
      }
    },
    getCollectionCountInfo() {
      this.listLoading = true;
      getCollectionCountInfo(this.activityid).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.countInfo = res.data.responseEntity;
        } else {
          this.$message({
            message: res.data.serverResult.resultMessage,
            type: "error"
          });
        }
      });
    },
    doExport() {
      let params = {
        pagination: {},
        conditions: [
          {
            fieldName: "begin_time",
            fieldValues: [this.filters.begin_time],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "end_time",
            fieldValues: [this.filters.end_time],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "activityid",
            fieldValues: [this.activityid],
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
        params.conditions.push({
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
        params.conditions.push({
          fieldName: "end_time",
          fieldValues: [
            ECRUtil.formatDate.format(new Date(this.filters.end_time))
          ],
          prepender: null,
          operator: "EQUAL",
          childCondtions: null
        });
      }

      if (this.curKind == 0) {
        this.exportLoading = true;
        exportTeacherDetail(params)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.ECRUtil.download(res.data.responseEntity.downloadUrl);
            } else {
              this.$message({
                message: res.data.serverResult.resultMessage,
                type: "error"
              });
            }
            this.exportLoading = false;
          })
          .catch(() => {
            this.exportLoading = false;

            this.$message({
              message: "操作失败",
              type: "error"
            });
          });
      } else if (this.curKind == 1) {
        this.exportLoading = true;
        exportActivityDetail(params)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.ECRUtil.download(res.data.responseEntity.downloadUrl);
            } else {
              this.$message({
                message: res.data.serverResult.resultMessage,
                type: "error"
              });
            }
            this.exportLoading = false;
          })
          .catch(() => {
            this.exportLoading = false;

            this.$message({
              message: "操作失败",
              type: "error"
            });
          });
      }
    },
    search() {
      this.page = 1;
      this.getData(this.curKind);
    }
  },
  created() {
    this.activityid = this.$route.params.id;
    this.getData(this.curKind);
    this.getCollectionCountInfo();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";
</style>