<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">学校查询</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <!-- Filter Panel -->
      <el-form label-width="120px">
        <el-col :span="6">
          <el-form-item label="省份:">
            <el-select v-model="filters.areaid" @change="onChangeArea()">
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
          <el-form-item label="城市:">
            <el-select v-model="filters.cityid" @change="onChangeCity()">
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
          <el-form-item label="区县:">
            <el-select v-model="filters.countryid">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.areaname"
                :value="item.areaid"
                v-for="(item, idx) in countries"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="机构名称:">
            <el-input v-model="filters.orgname" style="float:left; width: calc(100% - 70px)"></el-input>
            <el-button
              style="margin-left:10px; float:right"
              type="primary"
              v-on:click="search"
              id="searchBtn"
            >查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>

      <!-- Filter Panel End -->
      <!-- Batch Operation Panel -->
      <el-col :span="24" style="margin-bottom:10px;text-align:right;">
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="doBatchSave"
          :loading="addLoading"
        >保存到ECR</el-button>
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="doBatchMark"
          :loading="addLoading"
        >标记为名校</el-button>
      </el-col>

      <!-- Batch Operation Panel End -->
      <!-- Data Table -->
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="schools.length==0"
      >
      <el-table
        :data="schools"
        v-loading="listLoading"
        @selection-change="selsChange"
        v-if="schools.length>0"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="orgId" label="学校ID" align="center"></el-table-column>
        <el-table-column prop="orgName" label="学校名称" align="center"></el-table-column>
        <el-table-column prop="schoolTypeName" label="学校类型中文" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="lastModifyTime" label="最后更新时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="school">
            <el-button
              size="small"
              @click="doSave(school.$index, school.row)"
              style="margin:0px"
            >保存到ECR</el-button>
            <el-button
              size="small"
              @click="doMark(school.$index, school.row)"
              style="margin:0px"
            >标记为名校</el-button>
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
import {} from "../../common/js/const.js";
import {
  getEcoSearchSchool,
  getEcoSchoolList,
  batchRegisterSchoolList,
  getAreasByParent
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        areaid: "110000", //Beijing
        cityid: "",
        countryid: "",
        orgname: ""
      },

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 10,
      page_total: 0,
      /////////// Pagination End ////////

      schools: [],
      schoolInfoes: [],
      areas: [],
      cities: [],
      countries: [],
      listLoading: false,
      addLoading: false,
      sels: [], //列表选中列
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getSchools();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getSchools();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    selsChange: function(sels) {
      this.sels = sels;
    },
    search() {
      this.page = 1;
      this.getSchools();
    },
    doBatchSave() {
      let params = [];
      this.sels.forEach(function(school) {        
        params.push({
          orgid: school.orgId,
          orgcode: school.orgCode,
          orgname: school.orgName,
          parentorgid: school.parentOrgId,
          orgtype: school.orgType,
          orgaddr: school.orgAddr,
          status: school.status,
          createtime: school.createTime,
          lastmodifytime: school.lastModifyTime,
          creatorid: school.creatorId,
          lastmodifierid: school.lastModifierId,
          areaid: school.areaId,
          tenantid: school.tenantId,
          classnamingrule: school.classNamingRule,
          schooltypeid: school.schoolTypeId,
          schooltypename: school.schoolTypeName,
          isnamed: "0"
        });
      });
      this.addLoading = true;
      batchRegisterSchoolList(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "保存成功！",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
          }
          this.addLoading = false;
        })
        .catch(() => {
          this.addLoading = false;

          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    doBatchMark() {
      let params = [];
      this.sels.forEach(function(school) {
        params.push({
          orgid: school.orgId,
          orgcode: school.orgCode,
          orgname: school.orgName,
          parentorgid: school.parentOrgId,
          orgtype: school.orgType,
          orgaddr: school.orgAddr,
          status: school.status,
          createtime: school.createTime,
          lastmodifytime: school.lastModifyTime,
          creatorid: school.creatorId,
          lastmodifierid: school.lastModifierId,
          areaid: school.areaId,
          tenantid: school.tenantId,
          classnamingrule: school.classNamingRule,
          schooltypeid: school.schoolTypeId,
          schooltypename: school.schoolTypeName,
          isnamed: "1"
        });
      });
      this.addLoading = true;
      batchRegisterSchoolList(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "保存成功！",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
          }
          this.addLoading = false;
        })
        .catch(() => {
          this.addLoading = false;

          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    doSave(index, school) {
      let params = [
        {
          orgid: school.orgId,
          orgcode: school.orgCode,
          orgname: school.orgName,
          parentorgid: school.parentOrgId,
          orgtype: school.orgType,
          orgaddr: school.orgAddr,
          status: school.status,
          createtime: school.createTime,
          lastmodifytime: school.lastModifyTime,
          creatorid: school.creatorId,
          lastmodifierid: school.lastModifierId,
          areaid: school.areaId,
          tenantid: school.tenantId,
          classnamingrule: school.classNamingRule,
          schooltypeid: school.schoolTypeId,
          schooltypename: school.schoolTypeName,
          isnamed: "0"
        }
      ];
      batchRegisterSchoolList(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "保存成功！",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    doMark(index, school) {
      let params = [
        {
          orgid: school.orgId,
          orgcode: school.orgCode,
          orgname: school.orgName,
          parentorgid: school.parentOrgId,
          orgtype: school.orgType,
          orgaddr: school.orgAddr,
          status: school.status,
          createtime: school.createTime,
          lastmodifytime: school.lastModifyTime,
          creatorid: school.creatorId,
          lastmodifierid: school.lastModifierId,
          areaid: school.areaId,
          tenantid: school.tenantId,
          classnamingrule: school.classNamingRule,
          schooltypeid: school.schoolTypeId,
          schooltypename: school.schoolTypeName,
          isnamed: "1"
        }
      ];
      batchRegisterSchoolList(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "保存成功！",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    getSchools() {
      var fuzzyAreaId = "";
      if (this.filters.countryid != "") {
        fuzzyAreaId = this.filters.countryid;
      } else if (this.filters.cityid != "") {
        fuzzyAreaId = this.filters.cityid;
      } else {
        fuzzyAreaId = this.filters.areaid;
      }
      let param = {
        singleTable: false,
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
          {
            fieldName: "orgName",
            fieldValues: [this.filters.orgname],
            prepender: "AND",
            operator: "FUZZY_MATCH"
          },
          {
            fieldName: "incloudParent",
            fieldValues: ["1"],
            prepender: "AND",
            operator: "EQUAL"
          }
        ]
      };

      if(fuzzyAreaId != ""){
        param.conditions.push({
            fieldName: "fuzzyAreaId",
            fieldValues: [fuzzyAreaId],
            prepender: "AND",
            operator: "EQUAL"
          });
      }

      this.listLoading = true;
      getEcoSchoolList(param, this.$message)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.schools = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
            if (this.schools.length > 0) {
              var orgParam = { orgIdList: [] };
              for (var i = 0; i < this.schools.length; i++) {
                orgParam.orgIdList.push(this.schools[i].orgId);
              }
              getEcoSearchSchool(orgParam, this.$message)
                .then(res => {
                  if (res.data.serverResult.resultCode == "200") {
                    this.schoolInfoes = res.data.pageInfo.list;
                    if (this.schoolInfoes.length > 0) this.setSchoolInfo();
                  } else {
                    this.schoolInfoes = [];
                  }
                })
                .catch(() => {
                  this.schoolInfoes = [];
                });
            }
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.schools = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.total = 0;
          this.schools = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    setSchoolInfo() {
      for (var i = 0; i < this.schoolInfoes.length; i++) {
        for (var j = 0; j < this.schools.length; j++) {
          if (
            this.getOrgId(this.schoolInfoes[i]) ==
            this.getOrgId(this.schools[j])
          ) {
            this.schools[j]["classNamingRule"] = this.schoolInfoes[
              i
            ].classNamingRule;
            this.schools[j]["schoolTypeId"] = this.schoolInfoes[i].schoolTypeId;
            this.schools[j]["schoolTypeName"] = this.schoolInfoes[
              i
            ].schoolTypeName;
            break;
          }
        }
      }
    },
    getOrgId(school) {
      return school.orgId;
    },
    getAreas() {
      getAreasByParent("-1")
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.areas = res.data.pageInfo.list;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.areas = [];
          }
        })
        .catch(() => {
          this.areas = [];
        });
    },
    onChangeArea() {
      this.filters.cityid = "";
      this.cities = [];
      if (this.filters.areaid != "") {
        getAreasByParent(this.filters.areaid)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.cities = res.data.pageInfo.list;
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
      }
    },
    onChangeCity() {
      this.filters.countryid = "";
      this.countries = [];
      if (this.filters.cityid != "") {
        getAreasByParent(this.filters.cityid)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.countries = res.data.pageInfo.list;
            } else {
              this.$message({
                message: res.data.serverResult.resultMessage,
                type: "error"
              });
              this.countries = [];
            }
          })
          .catch(() => {
            this.countries = [];
          });
      }
    }
  },
  created() {
    this.getSchools();
    this.getAreas();
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