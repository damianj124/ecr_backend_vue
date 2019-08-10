<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">统计概况-报表</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <!-- Filter Panel -->
      <el-form label-width="100px">
        <el-col :span="6">
          <el-form-item label="省份:">
            <el-select v-model="filters.departid" @change="getCityByDepart()">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.areaname"
                :value="item.areaid"
                v-for="(item, idx) in departlist"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="城市:">
            <el-select v-model="filters.cityid" @change="getAreaByCity()">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.areaname"
                :value="item.areaid"
                v-for="(item, idx) in cities"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="区域:">
            <el-select v-model="filters.areaid" @change="getSchoolByArea()">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.areaname"
                :value="item.areaid"
                v-for="(item, idx) in areas"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学校:">
            <el-select v-model="filters.orgid">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.orgname"
                :value="item.orgid"
                v-for="(item, idx) in schools"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资源类别:">
            <el-select v-model="filters.contenttype">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.contentname"
                :value="item.contenttype"
                v-for="(item, idx) in contentTypes"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="创建日期:">
            <el-date-picker type="date" v-model="filters.begin_time" style="width:150px;"></el-date-picker>-
            <el-date-picker
              type="date"
              v-model="filters.end_time"
              style="width:150px; margin-right: 20px;"
            ></el-date-picker>
            <el-button type="primary" v-on:click="search" id="searchBtn">查询</el-button>
            <el-button type="primary" v-on:click="onExport" :loading="exportLoading">导出</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <!-- Filter Panel End -->
      <!-- Data Table -->
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="resources.length==0"
      >
      <el-table
        :data="resources"
        v-loading="listLoading"
        @selection-change="selsChange"
        v-if="resources.length>0"
      >
        <el-table-column prop="area1" label="省份" align="center"></el-table-column>
        <el-table-column prop="area2" label="城市" align="center"></el-table-column>
        <el-table-column prop="area3" label="区域" align="center"></el-table-column>
        <el-table-column prop="orgname" label="学校" align="center"></el-table-column>
        <el-table-column prop="contypename" label="类别" align="center"></el-table-column>
        <el-table-column prop="goodscount" label="数量" align="center"></el-table-column>
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
import { CONTENT_TYPE, SHARE_RANGE, BOOK_MODEL } from "../../common/js/const";
import {
  getAreasByParent,
  getSchoolList,
  getStatusBySchool,
  exportToExcelSchool
} from "../../api/api";

export default {
  data() {
    return {
      ECRUtil: ECRUtil,
      FRONTEND_CONTEXT: FRONTEND_CONTEXT,
      filters: {
        departid: "",
        cityid: "",
        areaid: "",
        orgid: "",
        contenttype: "",
        begin_time: "",
        end_time: ""
      },
      ////////// Filter Data /////////////
      departlist: [],
      cities: [],
      areas: [],
      schools: [],
      shareRanges: SHARE_RANGE,
      contentTypes: CONTENT_TYPE,
      /////////// Filter Data End //////////
      resources: [],

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 5,
      page_total: 0,
      /////////// Pagination End ////////

      addLoading: false,
      exportLoading: false,
      listLoading: false,
      sels: [], //列表选中列
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    load() {
      let param = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
          {
            fieldName: "orgid",
            fieldValues: [this.filters.orgid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "contenttype",
            fieldValues: [this.filters.contenttype],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ]
      };
      if (this.filters.departid == "") {
        param.conditions.push({
          fieldName: "areaid",
          fieldValues: [this.filters.departid],
          prepender: null,
          operator: "EQUAL",
          childCondtions: null
        });
      }
      if (this.filters.departid != "" && this.filters.cityid == "") {
        param.conditions.push({
          fieldName: "areaid",
          fieldValues: [this.filters.departid],
          prepender: null,
          operator: "EQUAL",
          childCondtions: null
        });
      }
      if (this.filters.cityid != "") {
        param.conditions.push({
          fieldName: "areaid",
          fieldValues: [this.filters.cityid],
          prepender: null,
          operator: "EQUAL",
          childCondtions: null
        });
      }
      if (this.filters.areaid != "") {
        param.conditions.push({
          fieldName: "areaid",
          fieldValues: [this.filters.areaid],
          prepender: null,
          operator: "EQUAL",
          childCondtions: null
        });
      }
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
      getStatusBySchool(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.resources = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.resources = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.total = 0;
          this.resources = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    getDepartlist() {
      getAreasByParent("-1")
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.departlist = res.data.pageInfo.list;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.departlist = [];
          }
        })
        .catch(() => {
          this.departlist = [];
        });
    },
    getCityByDepart() {
      if(this.filters.departid != "") {
        getAreasByParent(this.filters.departid)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.cities = res.data.pageInfo.list;
              this.filters.cityid = "";
              this.filters.areaid = "";
              this.areas = [];
            } else {
              this.$message({
                message: res.data.serverResult.resultMessage,
                type: "error"
              });
              this.cities = [];
            }
          })
          .catch(() => {
            this.cities = [];
          });
      } else {
        this.filters.cityid = "";
        this.filters.areaid = "";
        this.filters.orgid = "";
        this.cities = [];
        this.areas = [];
        this.schools = [];
      }
    },
    getAreaByCity() {
      if (this.filters.cityid != "") {
        getAreasByParent(this.filters.cityid)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.areas = res.data.pageInfo.list;
              this.filters.areaid = "";
            } else {
              this.areas = [];
            }
          })
          .catch(() => {
            this.areas = [];
          });
      } else {
        this.filters.areaid = "";
      }
    },
    getSchoolByArea() {
      let param = {
        conditions: [
          {
            fieldName: "areaid",
            fieldValues: [this.filters.areaid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ]
      };
      getSchoolList(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.schools = res.data.pageInfo.list;
            this.filters.orgid = "";
          } else {
            this.schools = [];
          }
        })
        .catch(() => {
          this.schools = [];
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
      this.load();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    selsChange: function(sels) {
      this.sels = sels;
    },
    search() {
      this.page = 1;
      this.load();
    },
    onExport() {
      let param = {
        conditions: [
          {
            fieldName: "orgid",
            fieldValues: [this.filters.orgid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "contenttype",
            fieldValues: [this.filters.contenttype],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ]
      };
      if (this.filters.departid == "") {
        param.conditions.push({
          fieldName: "areaid",
          fieldValues: [this.filters.departid],
          prepender: null,
          operator: "EQUAL",
          childCondtions: null
        });
      }
      if (this.filters.departid != "" && this.filters.cityid == "") {
        param.conditions.push({
          fieldName: "areaid",
          fieldValues: [this.filters.departid],
          prepender: null,
          operator: "EQUAL",
          childCondtions: null
        });
      }
      if (this.filters.cityid != "") {
        param.conditions.push({
          fieldName: "areaid",
          fieldValues: [this.filters.cityid],
          prepender: null,
          operator: "EQUAL",
          childCondtions: null
        });
      }
      if (this.filters.areaid != "") {
        param.conditions.push({
          fieldName: "areaid",
          fieldValues: [this.filters.areaid],
          prepender: null,
          operator: "EQUAL",
          childCondtions: null
        });
      }
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
      this.exportLoading = true;
      exportToExcelSchool(param)
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
  created() {
    this.getDepartlist();
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
.cell .el-select {
  width: auto;
}
</style>