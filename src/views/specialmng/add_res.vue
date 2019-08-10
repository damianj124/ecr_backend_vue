<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">资源管理</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <!-- Filter Panel -->
      <el-form label-width="100px">
        <el-col :span="5">
          <el-form-item label="学段:">
            <el-select v-model="filters.schoolsectionid" @change="onSchoolSectionChange()">
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
        <el-col :span="5">
          <el-form-item label="学科:">
            <el-select v-model="filters.subjectid" @change="getNaviEditionTypeList()">
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
        <el-col :span="5">
          <el-form-item label="年级:">
            <el-select v-model="filters.gradeid">
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
        <el-col :span="5">
          <el-form-item label="版本:">
            <el-select v-model="filters.editiontypeid" @change="getNaviBookModelList()">
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
        <el-col :span="4">
          <el-form-item label="册别:">
            <el-select v-model="filters.bookmodelid">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.dictname"
                :value="item.dictvalue"
                v-for="(item, idx) in bookModels"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
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
        <el-col :span="5">
          <el-form-item label="标题:">
            <el-input
              v-model="filters.name"
              placeholder="标题"
              style="width: 70%; margin-right: 20px;"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="创建人:">
            <el-input
              v-model="filters.creatorname"
              placeholder="创建人"
              style="width: 70%; margin-right: 20px;"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form>

      <!-- Filter Panel End -->
      <!-- Batch Operation Panel -->
      <el-col :span="24" style="margin-bottom:10px;text-align:right;">
        <el-button
          type="table-op"
          size="small"
          :disabled="themeid==''||sels.length==0"
          @click="addRes"
        >添加到专题</el-button>
      </el-col>

      <!-- Batch Operation Panel End -->
      <!-- Data Table -->
      <el-col :span="6">
        <theme-tree
          v-loading="treeLoading"
          :data="themeData"
          :tools="tools"
          :openlevel="1"
          ref="catalogTree"
          @item-select="onTreeItemSelect"
          @item-deselect="onTreeItemDeSelect"
          @item-operate="onTreeItemOperate"
        ></theme-tree>
      </el-col>
      <el-col :span="18">
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
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="contentid" label="资源ID" align="center"></el-table-column>
          <el-table-column label="资源类型" align="center" :formatter="formatContentType"></el-table-column>
          <el-table-column prop="name" label="标题" align="center"></el-table-column>
          <el-table-column prop="schoolsection" label="学段" align="center"></el-table-column>
          <el-table-column prop="grade" label="年级" align="center"></el-table-column>
          <el-table-column prop="subject" label="学科" align="center"></el-table-column>
          <el-table-column prop="lastupdatetime" label="最后修改时间" align="center"></el-table-column>
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

      <!-- Data Table End -->
    </el-col>
  </section>
</template>
<script>
import ECRUtil from "../../common/js/util";
import { CONTENT_TYPE } from "../../common/js/const";
import {
  getThemeResourceList,
  getSchoolSectionList,
  getSubjectList,
  getNaviGradeList,
  getNaviBookModelList,
  getNaviEditionTypeList,
  getThemeList,
  insertThemeRes
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        schoolsectionid: "",
        subjectid: "",
        gradeid: "",
        editiontypeid: "",
        bookmodelid: "",
        contenttype: "",
        name: "",
        creatorname: ""
      },
      ////////// Filter Data /////////////
      schoolSections: [],
      subjects: [],
      grades: [],
      bookModels: [],
      editionTypes: [],
      contentTypes: CONTENT_TYPE,
      /////////// Filter Data End //////////
      resources: [],

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 10,
      page_total: 0,
      /////////// Pagination End ////////

      resourceIds: [],
      addLoading: false,
      listLoading: false,
      treeLoading: false,
      sels: [], //列表选中列
      themeData: [
        {
          children: []
        }
      ],
      tools: [],
      selectedThemeItem: null,
      themeid: "",
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {},
  methods: {
    getThemes() {
      var param = {
        conditions: [
          {
            fieldName: "parentthemeid",
            fieldValues: ["0"],
            prepender: null,
            operator: "EQUAL",
            childConditions: null
          },
          {
            fieldName: "themename",
            fieldValues: [""],
            prepender: null,
            operator: "EQUAL",
            childConditions: null
          },
          {
            fieldName: "schoolsection",
            fieldValues: [this.filters.schoolsectionid],
            prepender: null,
            operator: "EQUAL",
            childConditions: null
          },
          {
            fieldName: "subjectid",
            fieldValues: [this.filters.subjectid],
            prepender: null,
            operator: "EQUAL",
            childConditions: null
          }
        ]
      };
      this.treeLoading = true;
      getThemeList(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.themeData[0].children = res.data.pageInfo.list;
          } else {
            this.themeData[0].children = [];
          }
          this.treeLoading = false;
        })
        .catch(res => {
          this.themeData[0].children = [];
          this.treeLoading = false;
        });
    },
    formatContentType(row, col) {
      for (var i = 0; i < this.contentTypes.length; i++) {
        if (this.contentTypes[i].contenttype == row.contenttype)
          return this.contentTypes[i].contentname;
      }
    },
    getSchoolSectionList() {
      getSchoolSectionList({}).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.schoolSections = ECRUtil.composeSysDict(res.data.pageInfo.list);
        } else {
          this.schoolSections = [];
        }
      });
    },
    onSchoolSectionChange() {
      this.filters.subjectid = "";
      this.filters.gradeid = "";
      this.filters.editiontypeid = "";
      this.filters.bookmodelid = "";
      if (this.filters.schoolsectionid == "") {
        this.subjectlist = [];
        this.gradelist = [];
        this.editiontypelist = [];
        this.bookmodellist = [];
      } else {
        this.getSubjectList();
        this.getNaviGradeList();
        this.getThemes();
      }
    },
    getSubjectList() {
      let param = {
        schoolsectionid: this.filters.schoolsectionid
      };
      getSubjectList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.subjects = ECRUtil.composeSysDict(res.data.pageInfo.list);
          this.filters.subjectid = "";
        } else {
          this.subjects = [];
        }
      });
    },
    getNaviGradeList() {
      let param = {
        schoolsectionid: this.filters.schoolsectionid
      };
      getNaviGradeList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.grades = ECRUtil.composeSysDict(res.data.pageInfo.list);
          this.filters.gradeid = "";
        } else {
          this.grades = [];
        }
      });
    },
    getNaviEditionTypeList() {
      this.filters.editiontypeid = "";

      if (this.filters.subjectid == "") {
        this.editiontypelist = [];
        this.bookmodellist = [];
      } else {
        let param = {
          schoolsectionid: this.filters.schoolsectionid,
          subjectid: this.filters.subjectid
        };
        getNaviEditionTypeList(param).then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.editionTypes = ECRUtil.composeSysDict(res.data.pageInfo.list);
            this.getThemes();
            this.filters.editiontypeid = "";
          } else {
            this.editionTypes = [];
          }
        });
      }
    },
    getNaviBookModelList() {
      this.filters.bookmodelid = "";

      if (this.filters.editiontypeid == "") {
        this.bookmodellist = [];
      } else {
        let param = {
          schoolsectionid: this.filters.schoolsectionid,
          subjectid: this.filters.subjectid,
          editiontypeid: this.filters.editiontypeid
        };
        getNaviBookModelList(param).then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.bookModels = ECRUtil.composeSysDict(res.data.pageInfo.list);
            this.filters.bookmodelid = "";
          } else {
            this.bookModels = [];
          }
        });
      }
    },
    getResources() {
      let param = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
          {
            fieldName: "themeids",
            fieldValues: [this.themeid == "" ? "" : this.themeid],
            prepender: null,
            operator: "EQUAL",
            childConditions: null
          },
          {
            fieldName: "schoolsectionid",
            fieldValues: [this.filters.schoolsectionid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "subjectid",
            fieldValues: [this.filters.subjectid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "gradeid",
            fieldValues: [this.filters.gradeid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "bookmodelid",
            fieldValues: [this.filters.bookmodelid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "editiontypeid",
            fieldValues: [this.filters.editiontypeid],
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
          },
          {
            fieldName: "creatorname",
            fieldValues: [this.filters.creatorname],
            prepender: null,
            operator: "EQUAL",
            childConditions: null
          },
          {
            fieldName: "name",
            fieldValues: [this.filters.name],
            prepender: null,
            operator: "EQUAL",
            childConditions: null
          },
          {
              fieldName: 'isgoods',
              fieldValues: [
                  '1'
              ],
              prepender: null,
              operator: 'EQUAL',
              childCondtions: null
          }
        ]
      };

      this.listLoading = true;
      getThemeResourceList(param)
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
    handleCurrentChange(val) {
      this.page = val;
      this.getResources();
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
    selsChange: function(sels) {
      this.sels = sels;
    },
    addRes() {
      this.$confirm("要将这些资源添加到该专题吗？", "提示", {
        type: "warning"
      }).then(() => {
        var res = [];
        var resIds = this.sels
          .map(item => item.contentid)
          .toString()
          .split(",");
        for (var i = 0; i < resIds.length; i++) {
          res.push({
            themeid: this.themeid,
            resourceno: resIds[i],
            resourcetype: this.filters.contenttype
          });
        }
        insertThemeRes(res)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.themeid = "";
              this.getResources();
            } else if (res.data.responseEntity == -1) {
              this.$message({
                message: "资源重复!",
                type: "error"
              });
            } else {
              this.$message({
                message: res.data.serverResult.resultMessage,
                type: "error"
              });
            }
          })
          .catch(res => {
            this.$message({
              message: "加载失败!",
              type: "error"
            });
          });
      });
    },
    search() {
      this.page = 1;
      this.getResources();
    },
    onTreeItemSelect(target, model) {
      // this.selectedThemeItem = model;
      this.themeid = model.themeData.themeid;
    },
    onTreeItemDeSelect(target, model) {
      this.themeid = "";
    },
    onTreeItemOperate(target, level, parent, model, opIdx) {}
  },
  created() {
    this.getSchoolSectionList();
    this.getSubjectList();
    this.getNaviGradeList();
    this.getNaviBookModelList();
    this.getNaviEditionTypeList();
    this.getResources();
    this.getThemes();
  }
};
</script>
<style lang="scss" scoped>
@import "~scss_vars";
</style>