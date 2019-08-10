<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">审核记录</a>
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
          <el-form-item label="一级标签:">
            <el-select v-model="filters.onelabel" @change="onOneLabelChange(filters.onelabel)">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.labelname"
                :value="item.labelname"
                v-for="(item, idx) in oneLabels"
                :key="idx"
                :data="item"
              ></el-option>
              <a
                href="javascript:;"
                v-if="((oneLabels.length != 0) && (one_label_page < one_label_total_page))"
                @click="setLabelInc('1')"
                class="ecrm-tabl-level-ico ecrm-dialog-icon-down"
              ></a>
              <a
                href="javascript:;"
                v-if="((oneLabels.length != 0) && (1 < one_label_page))"
                class="ecrm-tabl-level-ico ecrm-dialog-icon-up"
                @click="setLabelDec('1')"
              ></a>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="二级标签:">
            <el-select
              v-model="filters.twolabel"
              @change="onTwoLabelChange(filters.onelabel, filters.twolabel)"
            >
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.labelname"
                :value="item.labelname"
                v-for="(item, idx) in twoLabels"
                :key="idx"
                :data="item"
              ></el-option>
              <a
                href="javascript:;"
                v-if="((twoLabels.length!=0) && (two_label_page < two_label_total_page))"
                @click="setLabelInc('2')"
                class="ecrm-tabl-level-ico ecrm-dialog-icon-down"
              ></a>
              <a
                href="javascript:;"
                v-if="((twoLabels.length!=0) && (1 < two_label_page))"
                class="ecrm-tabl-level-ico ecrm-dialog-icon-up"
                @click="setLabelDec('2')"
              ></a>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="三级标签:">
            <el-select v-model="filters.threelabel">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.labelname"
                :value="item.labelname"
                v-for="(item, idx) in threeLabels"
                :key="idx"
                :data="item"
              ></el-option>
              <a
                href="javascript:;"
                v-if="((threeLabels.length!=0) && (three_label_page < three_label_total_page))"
                @click="setLabelInc('3')"
                class="ecrm-tabl-level-ico ecrm-dialog-icon-down"
              ></a>
              <a
                href="javascript:;"
                v-if="((threeLabels.length!=0) && (1 < three_label_page))"
                class="ecrm-tabl-level-ico ecrm-dialog-icon-up"
                @click="setLabelDec('3')"
              ></a>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="状态:">
            <el-select v-model="filters.result">
              <el-option label="全部" value></el-option>
              <el-option
                :label="result.label"
                :value="result.value"
                v-for="(result, idx) in reviewResults"
                :key="idx"
                :data="result"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="共享范围:">
            <el-select v-model="filters.sharerange">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item, idx) in shareRanges"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建日期:">
            <el-date-picker type="date" v-model="filters.begin_time" style="width:150px;"></el-date-picker>-
            <el-date-picker type="date" v-model="filters.end_time" style="width:150px;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="搜索框:">
            <el-input
              v-model="filters.searchkey"
              placeholder="请输入资源名称 / 关键词 / 作者"
              style="width:calc(100% - 65px)"
              @keyup.enter.native="search"
            ></el-input>
            <el-button type="primary" v-on:click="search" id="searchBtn">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>

      <!-- Filter Panel End -->
      <!-- Data Table -->
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="records.length==0"
      >
      <el-table
        :data="records"
        v-loading="listLoading"
        @sort-change="doSort"
        v-if="records.length>0"
      >
        <el-table-column prop="auditid" label="审核ID" align="center"></el-table-column>
        <el-table-column label="资源名称" align="center" width="400">
          <template slot-scope="record">
            <my-resource :resource="record.row.resource"></my-resource>
          </template>
        </el-table-column>
        <el-table-column label="审核类型" align="center" sortable="custom">
          <template slot-scope="record">
            <span
              :class="{ 'ecrm-color-red':record.row.result=='0', 'ecrm-color-green':record.row.result=='1'}"
            >{{ formatResult(record.row.result) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="audituser" label="审核人" align="center"></el-table-column>
        <el-table-column prop="audittime" label="审核日期" align="center" sortable="custom"></el-table-column>
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
  </section>
</template>

<script>
import ECRUtil from "../../common/js/util";
import config from "../../../config";
import {
  CONTENT_TYPE,
  SHARE_RANGE,
  REVIEW_RESULT
} from "../../common/js/const.js";
import {
  getAuditList,
  getSchoolSectionList,
  getSubjectList,
  getNaviGradeList,
  getNaviBookModelList,
  getNaviEditionTypeList,
  getOneLabelList,
  getTwoLabelList,
  getThreeLabelList
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
        onelabel: "",
        twolabel: "",
        threelabel: "",
        result: "",
        sharerange: "",
        begin_time: "",
        end_time: "",
        searchkey: ""
      },
      ////////// Filter Data /////////////
      schoolSections: [],
      subjects: [],
      grades: [],
      bookModels: [],
      editionTypes: [],
      contentTypes: CONTENT_TYPE,
      oneLabels: [],
      twoLabels: [],
      threeLabels: [],
      reviewResults: REVIEW_RESULT,
      shareRanges: SHARE_RANGE,
      /////////// Filter Data End //////////
      records: [],

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 5,
      page_total: 0,
      /////////// Pagination End ////////
      /////////// Label Pagination //////////
      one_label_page: 1,
      one_label_total_page: 0,
      two_label_page: 1,
      two_label_total_page: 0,
      three_label_page: 1,
      three_label_total_page: 0,
      label_page_size: 10,
      /////////// Label Pagination End //////////

      /////////// SortMode Start ////////
      resultSortMode: "",
      timeSortMode: "DESC",
      /////////// SortMode End ////////

      listLoading: false,
      got: false,
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    formatResult: function(result) {
      if (result == "1") {
        return "通过";
      } else if (result == "0") {
        return "不通过";
      }
    },
    doSort: function(col) {
      this.resultSortMode = "";
      this.timeSortMode = "";
      if (col.prop == "result") {
        if (col.order == "ascending") {
          this.resultSortMode = "ASC";
        } else {
          this.resultSortMode = "DESC";
        }
      } else if (col.prop == "audittime") {
        if (col.order == "ascending") {
          this.timeSortMode = "ASC";
        } else {
          this.timeSortMode = "DESC";
        }
      }
      this.getRecords();
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
      this.getSubjectList();
      this.getNaviGradeList();
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
      let param = {
        schoolsectionid: this.filters.schoolsectionid,
        subjectid: this.filters.subjectid
      };
      getNaviEditionTypeList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.editionTypes = ECRUtil.composeSysDict(res.data.pageInfo.list);
          this.filters.editiontypeid = "";
        } else {
          this.editionTypes = [];
        }
      });
    },
    getNaviBookModelList() {
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
    },
    setLabelInc(index) {
      if (index == "1") {
        this.one_label_page++;
        this.getOneLabelList();
      } else if (index == "2") {
        this.two_label_page++;
        this.getTwoLabelList(this.filters.onelabel);
      } else if (index == "3") {
        this.three_label_page++;
        this.getThreeLabelList(this.filters.onelabel, this.filters.twolabel);
      }
    },
    setLabelDec(index) {
      if (index == "1") {
        this.one_label_page--;
        this.getOneLabelList();
      } else if (index == "2") {
        this.two_label_page--;
        this.getTwoLabelList(this.filters.onelabel);
      } else if (index == "3") {
        this.three_label_page--;
        this.getThreeLabelList(this.filters.onelabel, this.filters.twolabel);
      }
    },
    getOneLabelList() {
      let param = {
        pageNo: this.one_label_page,
        numPerPage: this.label_page_size
      };
      getOneLabelList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.oneLabels = res.data.pageInfo.list;
          this.one_label_total_page = Math.ceil(
            res.data.pageInfo.total / this.label_page_size
          );
        } else {
          this.oneLabels = [];
          this.one_label_total_page = 0;
        }
      });
    },
    getTwoLabelList(onelabel) {
      let param = {
        labelname: onelabel,
        pageNo: this.two_label_page,
        numPerPage: this.label_page_size
      };
      getTwoLabelList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.twoLabels = res.data.pageInfo.list;
          this.two_label_total_page = Math.ceil(
            res.data.pageInfo.total / this.label_page_size
          );
          this.filters.twolabel = "";
        } else {
          this.two_label_total_page = 0;
          this.twoLabels = [];
        }
      });
    },
    getThreeLabelList(onelabel, twolabel) {
      let param = {
        onelabelname: onelabel,
        twolabelname: twolabel,
        pageNo: this.three_label_page,
        numPerPage: this.label_page_size
      };
      getThreeLabelList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.threeLabels = res.data.pageInfo.list;
          this.three_label_total_page = Math.ceil(
            res.data.pageInfo.total / this.label_page_size
          );
          this.filters.threelabel = "";
        } else {
          this.three_label_total_page = 0;
          this.threeLabels = [];
        }
      });
    },
    getRecords() {
      let param = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
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
            fieldName: "onelabel",
            fieldValues: [this.filters.onelabel],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "twolabel",
            fieldValues: [this.filters.twolabel],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "threelabel",
            fieldValues: [this.filters.threelabel],
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
          },
          {
            fieldName: "sharerange",
            fieldValues: [this.filters.sharerange],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "result",
            fieldValues: [this.filters.result],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ],
        orderMethods: []
      };

      if (this.filters.begin_time != "" && this.filters.end_time != "") {
        if (
          new Date(this.filters.begin_time) > new Date(this.filters.end_time)
        ) {
          this.$message({
            message: "结束日期不能小于开始日期。",
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

      if (this.resultSortMode != "") {
        param.orderMethods.push({
          field: "result",
          method: this.resultSortMode
        });
      }
      if (this.timeSortMode != "") {
        param.orderMethods.push({
          field: "audittime",
          method: this.timeSortMode
        });
      }

      this.listLoading = true;
      getAuditList(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.records = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
            if (!this.got) {
              this.getOneLabelList();
              this.getTwoLabelList("");
              this.getThreeLabelList("", "");
            }
            this.got = true;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.records = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.total = 0;
          this.records = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getRecords();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getRecords();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    search() {
      this.page = 1;
      this.getRecords();
    },
    onOneLabelChange(onelabel) {
      this.getTwoLabelList(onelabel);
      this.getThreeLabelList(onelabel, "");
    },
    onTwoLabelChange(onelabel, twolabel) {
      this.getThreeLabelList(onelabel, twolabel);
    }
  },
  created() {
    this.getSchoolSectionList();
    this.getSubjectList();
    this.getNaviGradeList();
    this.getNaviBookModelList();
    this.getNaviEditionTypeList();
    this.getRecords();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";

.el-input,
.el-select {
  width: 100%;
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