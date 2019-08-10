<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">资源审核</a>
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
            <el-select v-model="filters.status">
              <el-option
                :label="state.label"
                :value="state.value"
                v-for="(state, idx) in status"
                :key="idx"
                :data="state"
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
            <el-date-picker type="date" v-model="filters.begin_time" style="width: 45%"></el-date-picker> -
            <el-date-picker type="date" v-model="filters.end_time" style="width: 45%"></el-date-picker>
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
      <!-- Batch Operation Panel -->
      <el-col :span="24" style="margin-bottom:10px;text-align:right;">
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="doAllowResources"
          :loading="batchOpsLoading"
        >审核通过</el-button>
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="denyResources"
        >审核不通过</el-button>
      </el-col>

      <!-- Batch Operation Panel End -->
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
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="资源名称" align="center" width="450">
          <template slot-scope="resource">
            <my-resource :resource="resource.row"></my-resource>
          </template>
        </el-table-column>
        <el-table-column label="审核" align="center">
          <template slot-scope="resource">
            <el-select
              @change="review(resource.$index, resource.row)"
              v-model="resourceStatus[resource.$index].status"
            >
              <el-option label="待审核" disabled value="1"></el-option>
              <el-option label="审核通过" value="3"></el-option>
              <el-option label="审核不通过" value="4"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="一级标签" align="center">
          <template slot-scope="resource">
            <el-select
              @change="fillTwoLabelsForRow(resource.$index, resource.row, '')"
              v-model="resource.row.onelabelid"
            >
              <el-option
                v-for="(onelabel,idx) in oneLabels"
                :key="idx"
                :data="onelabel"
                :label="onelabel.labelname"
                :value="onelabel.labelid"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="二级标签" align="center">
          <template slot-scope="resource">
            <el-select
              @change="fillThreeLabelsForRow(resource.$index, resource.row, '')"
              v-model="resource.row.twolabelid"
            >
              <el-option
                v-for="(twolabel,idx) in twoLabelsForRow[resource.$index].labels"
                :key="idx"
                :data="twolabel"
                :label="twolabel.labelname"
                :value="twolabel.labelid"
              ></el-option>
              <a
                href="javascript:;"
                v-if="((twoLabelsForRow.length != 0) && (two_label_page1 < two_label_total_page1))"
                @click="fillTwoLabelsForRow(resource.$index, resource.row, 'inc')"
                class="ecrm-tabl-level-ico ecrm-dialog-icon-down"
              ></a>
              <a
                href="javascript:;"
                v-if="((twoLabelsForRow.length != 0) && (1 < two_label_page1))"
                class="ecrm-tabl-level-ico ecrm-dialog-icon-up"
                @click="fillTwoLabelsForRow(resource.$index, resource.row, 'dec')"
              ></a>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="三级标签" align="center">
          <template slot-scope="resource">
            <el-select v-model="resource.row.threelabelid">
              <el-option
                v-for="(threelabel,idx) in threeLabelsForRow[resource.$index].labels"
                :key="idx"
                :data="threelabel"
                :label="threelabel.labelname"
                :value="threelabel.labelid"
              ></el-option>
              <a
                href="javascript:;"
                v-if="((threeLabelsForRow.length != 0) && (three_label_page1 < three_label_total_page1))"
                @click="fillThreeLabelsForRow(resource.$index, resource.row, 'inc')"
                class="ecrm-tabl-level-ico ecrm-dialog-icon-down"
              ></a>
              <a
                href="javascript:;"
                v-if="((threeLabelsForRow.length != 0) && (1 < three_label_page1))"
                class="ecrm-tabl-level-ico ecrm-dialog-icon-up"
                @click="fillThreeLabelsForRow(resource.$index, resource.row, 'dec')"
              ></a>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="搜索标签" align="center">
          <template slot-scope="resource">
            <el-button size="small" @click="doChangeLabel(resource.$index, resource.row)">变更标签</el-button>
          </template>
        </el-table-column>
        <el-table-column label="商品生成状态" align="center" width="120">
          <template slot-scope="resource">
            <span
              :class="{ 'ecrm-color-red':resource.row.isgoods=='0', 'ecrm-color-green':resource.row.isgoods=='1'}"
            >{{ formatGoodsStatus(resource.row.isgoods) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="resource">
            <el-button
              size="small"
              @click="doEdit(resource.$index, resource.row)"
              style="margin:0px"
            >修改</el-button>
            <el-button
              size="small"
              @click="doDetail(resource.$index, resource.row)"
              style="margin:0px"
            >详情</el-button>
            <el-button
              size="small"
              @click="doDelete(resource.$index, resource.row)"
              style="margin:0px"
              v-if="resource.row.isgoods!='1'"
            >删除</el-button>
            <el-button
              size="small"
              @click="doStuffCreate(resource.$index, resource.row)"
              style="margin:0px"
              v-if="resource.row.status=='3' && resource.row.isgoods=='0'"
            >生成</el-button>
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

    <!-- Goods Creation Dialog -->
    <el-dialog title="生成" v-model="createFormVisible" :close-on-click-modal="false">
      <el-form :model="createForm" label-width="100px" :rules="createFormRules" ref="createForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="价格:" class="is-required" prop="goodprice">
              <el-input-number v-model="createForm.goodprice" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="有效日期:" class="is-required" prop="property">
              <el-date-picker type="date" v-model="createForm.sell_begindate" style="width:150px;" @change="onChangeCreateFormStartDate"></el-date-picker>-
              <el-date-picker type="date" v-model="createForm.sell_enddate" style="width:150px;" @change="onChangeCreateFormEndDate"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="createFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="createSubmit" :loading="addLoading">生成</el-button>
      </div>
    </el-dialog>

    <!-- Goods Creation Dialog End -->
    <el-dialog
      title="审核不通过"
      v-model="disallowFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form :model="disallowForm" label-width="100px" ref="disallowForm">
        <el-form-item label="驳回原因" prop="reason">
          <el-input
            type="textarea"
            :rows.native="8"
            v-model="disallowForm.reason"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelDisallow">取消</el-button>
        <el-button type="primary" @click.native="doDisallow" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import ECRUtil from "../../common/js/util";
import config from "../../../config";
import {
  CONTENT_TYPE,
  SHARE_RANGE,
  REVIEW_STATUS
} from "../../common/js/const.js";
import {
  getUploadResourceList,
  getSchoolSectionList,
  getSubjectList,
  getNaviGradeList,
  getNaviBookModelList,
  getNaviEditionTypeList,
  getOneLabelList,
  getTwoLabelList,
  getThreeLabelList,
  allowResource,
  denyResource,
  batchRemoveResources,
  setResourceLabel,
  addBatchGoods
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
        searchkey: "",
        status: "1",
        sharerange: "",
        begin_time: "",
        end_time: ""
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
      twoLabelsForRow: [],
      threeLabelsForRow: [],
      resourceStatus: [],
      status: REVIEW_STATUS,
      shareRanges: SHARE_RANGE,
      /////////// Filter Data End //////////
      resources: [],

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
      two_label_page1: 1,
      two_label_total_page: 0,
      two_label_total_page1: 0,
      three_label_page: 1,
      three_label_page1: 1,
      three_label_total_page: 0,
      three_label_total_page1: 0,
      label_page_size: 10,
      /////////// Label Pagination End //////////

      resourceIds: [],
      addLoading: false,
      listLoading: false,
      batchOpsLoading: false,
      sels: [], //列表选中列

      /////////// 驳回 Reason Form //////////
      currentIndex: -1,
      currentResource: null,
      disallowFormVisible: false,
      disallowForm: {
        reason: ""
      },
      /////////// 驳回 Reason Form End //////

      /////////// Goods Creation Form //////////
      createFormVisible: false,
      createForm: {
        goodprice: 0,
        sell_begindate: "",
        sell_enddate: ""
      },
      createFormRules: {
        property: [{ validator: this.validateCreateProperty, trigger: "blur" }]
      },
      /////////// Goods Creation Form End //////
      got: false,
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    onChangeCreateFormEndDate(date) {
      if (new Date(this.createForm.sell_begindate) > new Date(date)) {
          this.createForm.sell_enddate = '';
      }
    },
    onChangeCreateFormStartDate(date) {
      if (new Date(this.createForm.sell_enddate) < new Date(date)) {
        this.createForm.sell_begindate = '';
      }
    },
    formatGoodsStatus(isgoods) {
      if (isgoods == "1") return "已生成";
      return "未生成";
    },
    validateCreateProperty(rule, value, callback) {
      if (
        this.createForm.sell_begindate == "" ||
        this.createForm.sell_enddate == "" ||
        this.createForm.sell_begindate == null ||
        this.createForm.sell_enddate == null
      ) {
        callback(new Error("请输入有效日期"));
      } else {
        callback();
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
      if(!twolabel){
        return;
      }
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
    getResources() {
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
            fieldName: "status",
            fieldValues: [this.filters.status],
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
      getUploadResourceList(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.resources = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
            if (!this.got) {
              this.getOneLabelList();
              this.getTwoLabelList("");
              this.getThreeLabelList("", "");
            }
            this.got = true;
            console.log(this.resourceStatus);
            console.log(param);
            for (var i = 0; i < this.resources.length; i++) {
              this.fillTwoLabelsForRow(i, this.resources[i], "");
              this.fillThreeLabelsForRow(i, this.resources[i], "");
              this.resourceStatus[i].status = this.resources[i].status;
              console.log(i + ": " + this.resources[i].status);
            }
            console.log(this.resourceStatus);
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
      for (var i = 0; i < this.page_size; i++) {
        this.twoLabelsForRow.push({ labels: [] });
        this.threeLabelsForRow.push({ labels: [] });
        this.resourceStatus.push({ status: "1" });
      }
      this.getResources();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    selsChange: function(sels) {
      this.sels = sels;
    },
    review(index, resource) {
      if (this.resourceStatus[index].status == resource.status) return;

      this.isBatch = false;
      if (this.resourceStatus[index].status == "3") {
        //审核
        // Author : GOD
        // Date Start : 2019-2-8 2 PM
        // Reason : Bug ID 503
        this.currentIndex = index;
        this.currentResource = resource;
        // Author : GOD
        // Date End : 2019-2-8 4:20 PM
        // Reason : Bug ID 503
        this.doAllow(index, resource);
      } else if (this.resourceStatus[index].status == "4") {
        //驳回
        this.currentIndex = index;
        this.currentResource = resource;
        this.disallowForm.reason = "";
        this.disallowFormVisible = true;
      }
    },
    onOneLabelChange(onelabel) {
      this.getTwoLabelList(onelabel);
      this.getThreeLabelList(onelabel, "");
    },
    onTwoLabelChange(onelabel, twolabel) {
      this.getThreeLabelList(onelabel, twolabel);
    },
    createSubmit() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          let para = {
            resourceids: this.resourceIds,
            goodprice: parseInt(this.createForm.goodprice),
            sell_begindate: ECRUtil.formatDate.format(
              new Date(this.createForm.sell_begindate),
              "yyyy-MM-dd hh:mm:ss"
            ),
            sell_enddate: ECRUtil.formatDate.format(
              new Date(this.createForm.sell_enddate),
              "yyyy-MM-dd hh:mm:ss"
            )
          };
          this.addLoading = true;
          addBatchGoods(para)
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.getResources();
              } else {
                this.$message({
                  message: res.data.serverResult.resultMessage,
                  type: "error"
                });
              }
              this.addLoading = false;
              this.createFormVisible = false;
            })
            .catch(() => {
              this.addLoading = false;

              this.$message({
                message: "操作失败",
                type: "error"
              });
            });
        }
      });
    },
    doAllowResources() {
      this.$confirm("是否将选中记录全部审核通过？", "提示", {
        type: "info"
      })
        .then(() => {
          let para = {
            audittype: 1,
            contentids: this.sels
              .map(item => item.contentid)
              .toString()
              .split(",")
          };
          this.batchOpsLoading = true;
          allowResource(para)
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                for (var i = 0; i < this.sels.length; i++) {
                  this.sels[i].status = "3"; //审核
                }
              } else {
                this.$message({
                  message: res.data.serverResult.resultMessage,
                  type: "error"
                });
              }
              this.getResources();
              this.batchOpsLoading = false;
            })
            .catch(() => {
              this.batchOpsLoading = false;

              this.$message({
                message: "操作失败",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    denyResources() {
      this.isBatch = true;
      this.disallowForm.reason = "";
      this.disallowFormVisible = true;
    },
    doDenyResources() {
      let para = {
        audittype: 1,
        contentids: this.sels
          .map(item => item.contentid)
          .toString()
          .split(","),
        remark: this.disallowForm.reason
      };
      this.addLoading = true;
      denyResource(para)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            for (var i = 0; i < this.sels.length; i++) {
              this.sels[i].status = "4"; //驳回
            }
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
          }
          this.addLoading = false;
          this.disallowFormVisible = false;
          this.getResources();
        })
        .catch(() => {
          this.addLoading = false;

          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    doAllow(index, resource) {
      this.$confirm("是否审核通过该资源？", "提示", {
        type: "info"
      }).then(() => {
        let para = {
          audittype: 1,
          contentids: [resource.contentid]
        };
        allowResource(para)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              resource.status = this.resourceStatus[index].status;
            } else {
              this.$message({
                message: res.data.serverResult.resultMessage,
                type: "error"
              });
              this.resourceStatus[index].status = resource.status;
            }
            this.getResources();
          })
          .catch(() => {
            this.$message({
              message: "操作失败",
              type: "error"
            });
          });
          // Author : GOD
          // Date Start : 2019-2-8 2 PM
          // Reason : Bug ID 503
      }).catch(() => {
        this.resourceStatus[
          this.currentIndex
        ].status = this.currentResource.status;
      });
      // Author : GOD
      // Date Start : 2019-2-8 4:20 PM
      // Reason : Bug ID 503
    },
    doDisallow() {
      if (this.isBatch) {
        this.doDenyResources();
      } else {
        this.addLoading = true;
        let para = {
          audittype: 1,
          contentids: [this.currentResource.contentid],
          remark: this.disallowForm.reason
        };
        denyResource(para)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.currentResource.status = this.resourceStatus[
                this.currentIndex
              ].status;
            } else {
              this.$message({
                message: res.data.serverResult.resultMessage,
                type: "error"
              });
              this.resourceStatus[
                this.currentIndex
              ].status = this.currentResource.status;
            }
            this.addLoading = false;
            this.disallowFormVisible = false;
            this.getResources();
          })
          .catch(() => {
            this.addLoading = false;

            this.$message({
              message: "操作失败",
              type: "error"
            });
          });
      }
    },
    cancelDisallow() {
      this.disallowFormVisible = false;
      this.resourceStatus[
        this.currentIndex
      ].status = this.currentResource.status;
    },
    doEdit(index, resource) {
      this.$router.push("/review/" + resource.contentid);
    },
    doDetail(index, resource) {
      let w = window.open("resource/preview/" + resource.contentid);
      w.focus();
    },
    doDelete(index, resource) {
      this.$confirm("是否删除当前资源？", "提示", {
        type: "warning"
      }).then(() => {
        batchRemoveResources([resource.contentid])
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.getResources();
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
      });
    },
    doStuffCreate(index, resource) {
      this.resourceIds = [resource.contentid];
      this.setCreateFormDeafaultValues(resource);
      this.createFormVisible = true;
    },
    setCreateFormDeafaultValues(resource){
      var scores = [0,0,0,10,0,5,30,10,30,30,0,0];
      this.createForm.sell_enddate = '2099-12-31';
      this.createForm.goodprice = resource.score? resource.score: scores[resource.contenttype];
      this.createForm.sell_begindate = ECRUtil.formatDate.format(new Date(),"yyyy-MM-dd");
    },        
    setLabelForResource(resource) {
      let param = {
        contentid: resource.contentid,
        onelabel: resource.onelabelid,
        twolabel: resource.twolabelid,
        threelabel: resource.threelabelid
      };
      return setResourceLabel(param);
    },
    fillTwoLabelsForRow($index, resource, index) {
      if (index == "") {
        this.two_label_page1 = 1;
      } else if (index == "inc") {
        this.two_label_page1++;
      } else if (index == "dec") {
        this.two_label_page1--;
      }

      if (resource.onelabelid != null) {
        let param = {
          parentlabelid: resource.onelabelid,
          pageNo: this.two_label_page1,
          numPerPage: this.label_page_size
        };
        getTwoLabelList(param).then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.twoLabelsForRow[$index].labels = res.data.pageInfo.list;
            this.two_label_total_page1 = Math.ceil(
              res.data.pageInfo.total / this.label_page_size
            );
            if (this.twoLabelsForRow[$index].labels.length > 0) {
              var twolabelid = resource.twolabelid;
              resource.twolabelid = null;
              for (
                var i = 0;
                i < this.twoLabelsForRow[$index].labels.length;
                i++
              ) {
                if (
                  twolabelid == this.twoLabelsForRow[$index].labels[i].labelid
                ) {
                  resource.twolabelid = twolabelid;
                  break;
                }
              }
              if (resource.twolabelid == null)
                resource.twolabelid = this.twoLabelsForRow[
                  $index
                ].labels[0].labelid;
            } else {
              resource.twolabelid = null;
            }
          } else {
            this.twoLabelsForRow[$index].labels = [];
          }
        });
      }
    },
    fillThreeLabelsForRow($index, resource, index) {
      if (index == "") {
        this.three_label_page1 = 1;
      } else if (index == "inc") {
        this.three_label_page1++;
      } else if (index == "dec") {
        this.three_label_page1--;
      }
      if (resource.twolabelid == null) {
        this.threeLabelsForRow[$index].labels = [];
        resource.threelabelid = "";
      } else if (resource.twolabelid != null && resource.twolabelid != "") {
        let param = {
          parentlabelid: resource.twolabelid,
          pageNo: this.three_label_page1,
          numPerPage: this.label_page_size
        };
        getThreeLabelList(param).then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.threeLabelsForRow[$index].labels = res.data.pageInfo.list;
            this.three_label_total_page1 = Math.ceil(
              res.data.pageInfo.total / this.label_page_size
            );
            if (this.threeLabelsForRow[$index].labels.length > 0) {
              var threelabelid = resource.threelabelid;
              resource.threelabelid = null;
              for (
                var i = 0;
                i < this.threeLabelsForRow[$index].labels.length;
                i++
              ) {
                if (
                  threelabelid ==
                  this.threeLabelsForRow[$index].labels[i].labelid
                ) {
                  resource.threelabelid = threelabelid;
                  break;
                }
              }
              if (resource.threelabelid == null)
                resource.threelabelid = this.threeLabelsForRow[
                  $index
                ].labels[0].labelid;
            } else {
              resource.threelabelid = null;
            }
          } else {
            this.threeLabelsForRow[$index].labels = [];
          }
        });
      }
    },
    doChangeLabel($index, resource) {
      this.setLabelForResource(resource)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "变更成功",
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
    search() {
      this.page = 1;
      this.getResources();
    }
  },
  created() {
    this.getSchoolSectionList();
    this.getSubjectList();
    this.getNaviGradeList();
    this.getNaviBookModelList();
    this.getNaviEditionTypeList();
    for (var i = 0; i < this.page_size; i++) {
      this.twoLabelsForRow.push({ labels: [] });
      this.threeLabelsForRow.push({ labels: [] });
      this.resourceStatus.push({ status: "1" });
    }
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