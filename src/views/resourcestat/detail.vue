<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">详情统计</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <!-- Filter Panel -->
      <el-form label-width="100px">
        <el-col :span="4">
          <el-form-item label="学段:">
            <el-select v-model="filters.schoolsection" @change="onSchoolSectionChange()">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.dictname"
                :value="item.dictvalue"
                v-for="(item, idx) in schoolSections"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="年级:">
            <el-select v-model="filters.grade" @change="getNaviEditionTypeList()">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.dictname"
                :value="item.dictvalue"
                v-for="(item, idx) in grades"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="学科:">
            <el-select v-model="filters.subject">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.dictname"
                :value="item.dictvalue"
                v-for="(item, idx) in subjects"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="册别:">
            <el-select v-model="filters.editiontype">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.dictname"
                :value="item.dictvalue"
                v-for="(item, idx) in editionTypes"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
                    <el-form-item label="资源类别:">
                        <el-select v-model="filters.contenttype">
                            <el-option label="全部" value=""></el-option>
                            <el-option :label="item.contentname" :value="item.contenttype" v-for="(item, idx) in contentTypes" :key="idx" :data="item"></el-option>
                        </el-select>
                    </el-form-item>
        </el-col>-->
        <el-col :span="4" style="margin-left: 20px;">
          <el-button type="primary" v-on:click="search" id="searchBtn">查询</el-button>
          <el-button type="primary" v-on:click="onExport" :loading="exportLoading">导出</el-button>
        </el-col>
      </el-form>
      <!-- Filter Panel End -->
      <!-- Data Table -->
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="showResources.length==0"
      >
      <el-table :data="showResources" v-loading="listLoading" v-if="showResources.length>0">
        <el-table-column label="层级" align="center" width="400">
          <template slot-scope="resource">
            <div style="width:100%;text-align:left;">
              <span
                @click="selected(resource.row, resource.$index)"
                :class="{ 'ecrm-table-left-list-open':resource.row.childcount>0&&resource.row.expand, 'ecrm-table-left-list-close':resource.row.childcount>0&&!resource.row.expand }"
                :style="{ marginLeft:((resource.row.level + 1) * 10) + 'px' }"
              ></span>
              <span>
                {{resource.row.label}}
                <a
                  href="javascript:;"
                  v-if="resource.row.level >= 5 && 
                                            resource.row.childcount > 0 && 
                                            count[resource.row.catalogids[0]] != pageCount[resource.row.catalogids[0]] && 
                                            resource.row.expand == true"
                  class="ecrm-tabl-level-ico ecrm-dialog-icon-down"
                  @click="setInc(resource, resource.row.catalogids[0])"
                ></a>
                <a
                  href="javascript:;"
                  v-if="resource.row.level >= 5 && 
                                        ((count[resource.row.catalogids[0]] > 1) && resource.row.expand == true)"
                  class="ecrm-tabl-level-ico ecrm-dialog-icon-up"
                  @click="setDec(resource, resource.row.catalogids[0])"
                ></a>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(name, idx) in showResources[0].typeNames"
          :key="idx"
          :label="name"
          align="center"
        >
          <template slot-scope="resource">
            <span>{{resource.row.typeCnts[idx]}}</span>
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
import { CONTENT_TYPE, SHARE_RANGE, BOOK_MODEL } from "../../common/js/const";
import {
  getNaviSchoolSectionList,
  getNaviSubjectList,
  getNaviGradeList,
  getNaviBookModelList,
  getNaviEditionTypeList,
  getCatalogHeader,
  getCatalogList,
  exportCatalogExcel
} from "../../api/api";

export default {
  data() {
    return {
      ECRUtil: ECRUtil,
      FRONTEND_CONTEXT: FRONTEND_CONTEXT,
      filters: {
        schoolsection: "",
        grade: "",
        subject: "",
        bookmodel: "",
        editiontype: "",
        contenttype: ""
      },
      ////////// Filter Data /////////////
      schoolSections: [],
      subjects: [],
      grades: [],
      bookModels: [],
      editionTypes: [],
      contentTypes: CONTENT_TYPE,
      /////////// Filter Data End //////////
      totalResources: [],
      visibleResources: [],
      showResources: [],
      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 5,
      page_total: 0,
      /////////// Pagination End ////////
      /////////// Label Pagination //////
      label_page_size: 3,
      label_page_no: 1,
      /////////// Label Pagination //////
      addLoading: false,
      exportLoading: false,
      listLoading: false,
      sels: [], //列表选中列
      resultData: [],
      count: [],
      pageCount: [],
      orderIndex: false,
      firstTotal: [],
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    toggleVisible(item, visible) {
      if (visible) {
        for (var i = 0; i < item.children.length; i++) {
          item.children[i].visible = visible;
        }
      } else {
        var childCount = 0;
        for (var i = parseInt(item.index) + 1; ; i++) {
          if (this.totalResources[i] == undefined) {
            break;
          } else if (this.totalResources[i].level <= item.level) {
            break;
          } else {
            childCount++;
          }
        }
        for (var i = 0; i < childCount; i++) {
          this.totalResources[parseInt(item.index) + 1 + i].visible = visible;
          this.totalResources[parseInt(item.index) + 1 + i].expand = false;
        }
      }
    },
    selected(resource, index) {
      this.label_page_no = 1;
      var list = Object.keys(this.totalResources);
      for (var i = 0; i < this.totalResources.length; i++) {
        this.totalResources[i].index = list[i];
      }
      if (resource.catalogids.length > 0 && resource.expand == false) {
        let param = {
          pagination: {
            numPerPage: this.label_page_size,
            pageNo: this.label_page_no
          },
          conditions: [
            {
              fieldName: "parentcatalogid",
              fieldValues: [resource.catalogids[0]],
              prepender: null,
              operator: "EQUAL",
              childConditions: null
            }
          ]
        };
        getCatalogList(param).then(res => {
          if (res.data.serverResult.resultCode == "200") {
            //mine
            if (resource.level > 5) {
              this.pageCount[resource.catalogids[0]] = Math.ceil(
                resource.childcount / this.label_page_size
              );
              this.count[resource.catalogids[0]] = 1;
            }
            //end mine
            let resources = res.data.pageInfo.list;
            resource.expand = !resource.expand;
            for (var i = 0; i < resources.length; i++) {
              resources[i].expand = !resource.expand;
              //    resources[i].showLength = resources.length;
              resources[i].visible = true;
              resources[i].level = resource.level + 1;
              this.totalResources.splice(
                parseInt(resource.index) + 1 + i,
                0,
                resources[i]
              );
            }
            this.totalResources[parseInt(resource.index)].showLength =
              resources.length;
            if (resource.level == 5) {
              this.firstTotal[resource.id] = resources.length;
            }
            if (resource.level == 6) {
              this.firstTotal[resource.parentcatalogid] += resources.length;
            }
            this.getVisibleResources();
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
          }
        });
      } else {
        if (resource.level == 5) {
          this.totalResources.splice(
            parseInt(resource.index) + 1,
            this.firstTotal[resource.id]
          );
          this.firstTotal[resource.id] = 0;
        }
        if (resource.level == 6) {
          this.totalResources.splice(
            parseInt(resource.index) + 1,
            resource.showLength
          );
          this.firstTotal[resource.parentcatalogid] -= resource.showLength;
        }
        var list = Object.keys(this.totalResources);
        for (var i = 0; i < this.totalResources.length; i++) {
          this.totalResources[i].index = list[i];
        }
        resource.expand = !resource.expand;
        this.toggleVisible(resource, resource.expand);
        this.getVisibleResources();
      }
    },
    onSchoolSectionChange() {
      this.getNaviGradeList();
      this.getNaviSubjectList();
    },
    getNaviSchoolSectionList() {
      getNaviSchoolSectionList({}).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.schoolSections = res.data.pageInfo.list;
        } else {
          this.schoolSections = [];
        }
      });
    },
    onTreeItemOperate(target, level, parent, model, opIdx) {
      this.getNaviEditionTypeList();
    },
    getNaviSubjectList() {
      let param = {
        schoolsectionid: this.filters.schoolsection
      };
      getNaviSubjectList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.subjects = res.data.pageInfo.list;
          this.filters.subject = "";
          this.getNaviEditionTypeList();
        } else {
          this.subjects = [];
        }
      });
    },
    getNaviGradeList() {
      let param = {
        schoolsectionid: this.filters.schoolsection
      };
      getNaviGradeList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.grades = res.data.pageInfo.list;
          this.filters.grade = "";
        } else {
          this.grades = [];
        }
      });
    },
    getNaviEditionTypeList() {
      let param = {
        schoolsectionid: this.filters.schoolsection,
        subjectid: this.filters.subject
      };
      getNaviEditionTypeList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.editionTypes = res.data.pageInfo.list;
          this.filters.editiontype = "";
        } else {
          this.editionTypes = [];
        }
      });
    },
    composeData(data, level) {
      let resources = [];
      data.level = level;
      data.visible = false;
      data.expand = false;
      data.childCount = data.children.length;
      resources.push(data);

      for (var i = 0; i < data.children.length; i++) {
        let childTree = this.composeData(data.children[i], level + 1);
        for (var j = 0; j < childTree.length; j++) {
          resources.push(childTree[j]);
          if (childTree[j].level == level + 1) {
            data.childCount += childTree[j].childCount;
          }
        }
      }
      return resources;
    },
    getResources() {
      let para = {
        lang: "zh_CN",
        schoolsectionid: this.filters.schoolsection,
        subjectid: this.filters.subject,
        gradeid: this.filters.grade,
        editiontypeid: this.filters.editiontype,
        level: 1
      };
      this.listLoading = true;
      getCatalogHeader(para)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            let resources = res.data.pageInfo.list;
            let resourceList = [];
            for (var i = 0; i < resources.length; i++) {
              ECRUtil.concat(resourceList, this.composeData(resources[i], 0));
            }
            this.totalResources = resourceList;
            var list = Object.keys(this.totalResources);
            for (var i = 0; i < this.totalResources.length; i++) {
              //mine
              if (this.totalResources[i].level >= 5) {
                this.pageCount[
                  this.totalResources[i].catalogids[0]
                ] = Math.ceil(
                  this.totalResources[i].childcount / this.label_page_size
                );
                this.count[this.totalResources[i].catalogids[0]] = 1;
              }
              //end mine
              this.totalResources[i].index = list[i];
              if (this.totalResources[i].level == 0) {
                this.totalResources[i].visible = true;
              }
            }
            this.getVisibleResources();
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.totalResources = [];
            this.visibleResources = [];
            this.showResources = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.total = 0;
          this.totalResources = [];
          this.visibleResources = [];
          this.showResources = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    getVisibleResources() {
      this.visibleResources = [];
      for (var i = 0; i < this.totalResources.length; i++) {
        if (this.totalResources[i].visible == true) {
          this.visibleResources.push(this.totalResources[i]);
        }
      }
      this.total = this.visibleResources.length;
      this.getShowResources(this.page);
    },
    getShowResources(page) {
      this.showResources = [];
      if (page * 10 > this.visibleResources.length) {
        for (var i = (page - 1) * 10; i < this.visibleResources.length; i++) {
          this.showResources.push(this.visibleResources[i]);
        }
      } else {
        for (var i = page * 10 - 10; i < page * 10; i++) {
          this.showResources.push(this.visibleResources[i]);
        }
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getShowResources(this.page);
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getResources();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    search() {
      this.page = 1;
      this.getResources();
    },
    onExport() {
      this.exportLoading = true;
      let param = {
        lang: "zh_CN",
        schoolsectionid: this.filters.schoolsection,
        subjectid: this.filters.subject,
        gradeid: this.filters.grade,
        editiontypeid: this.filters.editiontype,
        level: 1
      };
      exportCatalogExcel(param)
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
        .catch(res => {
          this.$message({
            message: res.data.serverResult.resultMessage,
            type: "error"
          });
          this.exportLoading = false;
        });
    },
    setInc(resource, catalogids) {
      this.orderIndex = true;
      this.count[catalogids]++;
      this.getMoreData(resource, this.count[catalogids], catalogids);
    },
    getMoreData(resource, pageNo, catalogids) {
      if (this.orderIndex) this.label_page_no++;
      else this.label_page_no--;

      var list = Object.keys(this.totalResources);
      for (var i = 0; i < this.totalResources.length; i++) {
        this.totalResources[i].index = list[i];
      }
      let param = {
        pagination: {
          numPerPage: this.label_page_size,
          pageNo: pageNo
        },
        conditions: [
          {
            fieldName: "parentcatalogid",
            fieldValues: [catalogids],
            prepender: null,
            operator: "EQUAL",
            childConditions: null
          }
        ]
      };
      getCatalogList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          let resources = res.data.pageInfo.list;
          if (resource.row.level == 5) {
            this.totalResources.splice(
              parseInt(resource.row.index) + 1,
              this.firstTotal[resource.row.id]
            );
          }
          if (resource.row.level == 6) {
            this.totalResources.splice(
              parseInt(resource.row.index) + 1,
              resource.row.showLength
            );
          }
          for (var i = 0; i < resources.length; i++) {
            resources[i].expand = !resource.row.expand;
            resources[i].visible = true;
            resources[i].level = resource.row.level + 1;
            this.totalResources.splice(
              parseInt(resource.row.index) + 1 + i,
              0,
              resources[i]
            );
          }
          this.totalResources[parseInt(resource.row.index)].showLength =
            resources.length;
          if (resource.row.level == 5) {
            this.firstTotal[resource.row.id] = resources.length;
          }
          if (resource.row.level == 6) {
            this.firstTotal[
              resource.row.parentcatalogid
            ] -= this.label_page_size;
            this.firstTotal[resource.row.parentcatalogid] += resources.length;
          }
          this.getVisibleResources();
        } else {
          this.$message({
            message: res.data.serverResult.resultMessage,
            type: "error"
          });
        }
      });
    },
    setDec(resource, catalogids) {
      this.orderIndex = false;
      this.count[catalogids]--;
      this.getMoreData(resource, this.count[catalogids], catalogids);
    }
  },
  created() {
    this.getNaviSchoolSectionList();
    this.getNaviGradeList();
    this.getNaviSubjectList();
    this.getResources();
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
.ecrm-table-left-list-open {
  background: url("../../../static/img/ecrm-icon-open-open.png") no-repeat left
    center;
  display: inline-block;
  cursor: pointer;
  width: 18px;
  height: 11px;
}
.ecrm-table-left-list-close {
  background: url("../../../static/img/ecrm-icon-open-close.png") no-repeat left
    center;
  display: inline-block;
  cursor: pointer;
  width: 18px;
  height: 11px;
}
.ecrm-table-text {
  width: 85px;
  text-align: center;
}
.ecrm-tab-level-col {
  float: left;
  display: none;
  line-height: 34px;
  height: 34px;
  padding-left: 10px;
}
.ecrm-tabl-level-ico {
  width: 22px;
  height: 22px;
  display: inline-block;
  margin-left: 8px;
  vertical-align: middle;
  zoom: 1;
  margin-top: 6px;
}
.ecrm-dialog-icon-up {
  background: url("../../../static/img/ecrw-icon-up.png") no-repeat;
}
.ecrm-dialog-icon-down {
  background: url("../../../static/img/ecrw-icon-down.png") no-repeat;
}
.ecrm-dialog-icon-up:hover {
  background: url("../../../static/img/ecrw-icon-up-sel.png") no-repeat;
}
.ecrm-dialog-icon-down:hover {
  background: url("../../../static/img/ecrw-icon-down-sel.png") no-repeat;
}
</style>