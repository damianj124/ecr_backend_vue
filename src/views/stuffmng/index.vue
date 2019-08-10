<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">商品管理</a>
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
          <el-form-item label="上架下架状态:">
            <el-select v-model="filters.status">
              <el-option label="全部" value></el-option>
              <el-option label="已上架" value="1"></el-option>
              <el-option label="已下架" value="0"></el-option>
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
                v-if="((oneLabels.length != 0) && (one_label_page < one_labe_total_page))"
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
        <el-col :span="4">
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
              placeholder="请输入商品名称 / 关键词 / 作者"
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
          @click="doBatchChange"
        >更改积分</el-button>
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="doBatchAccept"
        >上架</el-button>
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="doBatchStop"
        >下架</el-button>
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="doBatchBasket"
        >移入打包盒</el-button>
      </el-col>

      <!-- Batch Operation Panel End -->
      <!-- Data Table -->
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="goodsList.length==0"
      >
      <el-table
        :data="goodsList"
        v-loading="listLoading"
        @selection-change="selsChange"
        v-if="goodsList.length>0"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="goodid" label="商品编码" align="center"></el-table-column>
        <el-table-column
          prop="status"
          label="上架下架状态"
          align="center"
          :formatter="formatStatus"
          width="120"
        >
          <template slot-scope="goods">
            <span
              :class="{ 'ecrm-color-red':goods.row.status!='1', 'ecrm-color-green':goods.row.status=='1'}"
            >{{ formatGoodsStatus(goods.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodprice" label="积分值" align="center" width="80"></el-table-column>
        <el-table-column label="打包商品标识" align="center" :formatter="formatPackage" width="120"></el-table-column>
        <el-table-column label="商品名称" align="center" width="400">
          <template slot-scope="goods">
            <my-resource :resource="goods.row.resource"></my-resource>
          </template>
        </el-table-column>
        <el-table-column label="一级标签" align="center" min-width="120">
          <template slot-scope="goods">
            <el-select
              @change="fillTwoLabelsForRow(goods.$index, goods.row.resource)"
              v-model="goods.row.resource.onelabelid"
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
        <el-table-column label="二级标签" align="center" min-width="120">
          <template slot-scope="goods">
            <el-select
              @change="fillThreeLabelsForRow(goods.$index, goods.row.resource)"
              v-model="goods.row.resource.twolabelid"
            >
              <el-option
                v-for="(twolabel,idx) in twoLabelsForRow[goods.$index].labels"
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
        <el-table-column label="三级标签" align="center" min-width="120">
          <template slot-scope="goods">
            <el-select v-model="goods.row.resource.threelabelid">
              <el-option
                v-for="(threelabel,idx) in threeLabelsForRow[goods.$index].labels"
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
          <template slot-scope="goods">
            <el-button size="small" @click="doChangeLabel(goods.$index, goods.row.resource)">变更标签</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="goods">
            <div style="margin-bottom: 5px;">
              <!-- Author : GOD 2019-2-12 Bug ID: #682 -->
              <el-button size="small" @click="doEdit(goods.$index, goods.row)" v-if="goods.row.status != '1'" style="margin:0px">修改</el-button>
              <!-- Author : GOD 2019-2-12 Bug ID: #682 -->
              <el-button
                size="small"
                @click="doChange(goods.$index, goods.row)"
                style="margin:0px; width:80px;"
              >更改积分</el-button>
            </div>
            <div>
              <el-button
                size="small"
                @click="doAccept(goods.$index, goods.row)"
                style="margin:0px"
                v-if="goods.row.status!='1'"
              >上架</el-button>
              <el-button
                size="small"
                @click="doStop(goods.$index, goods.row)"
                style="margin:0px"
                v-if="goods.row.status=='1'"
              >下架</el-button>
              <!-- <el-button size="small" @click="doBasket(goods.$index, goods.row)" style="margin:0px">移入打包盒</el-button> -->
            </div>
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

    <!-- Change Price Dialog -->
    <el-dialog title="更改积分" v-model="changeFormVisible" :close-on-click-modal="false">
      <el-form :model="changeForm" label-width="100px" :rules="changeFormRules" ref="changeForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="价格:" prop="goodprice">
              <!-- kung: 2019/1/26:bug.No 603: 管理端/资源管理/商品管理，变更商品积分值可为负数。-->
              <el-input-number
                :min="1"
                v-model="changeForm.goodprice"
                @keypress.native="detectDecimal($event)"
              />
              <!-- kung: 2019/1/26:bug.No 603: 管理端/资源管理/商品管理，变更商品积分值可为负数。-->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="changeFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="changeSubmit" :loading="addLoading">更改</el-button>
      </div>
    </el-dialog>

    <!-- Change Price End -->
    <!-- Allow Sell For Goods Dialog -->
    <el-dialog title="上架" v-model="acceptFormVisible" :close-on-click-modal="false">
      <el-form :model="acceptForm" label-width="100px" :rules="acceptFormRules" ref="acceptForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="有效日期:" class="is-required" prop="property">
              <el-date-picker type="date" v-model="acceptForm.onshelftime" style="width:120px;"></el-date-picker>-
              <el-date-picker type="date" v-model="acceptForm.downshelftime" style="width:120px;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="acceptFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="acceptSubmit" :loading="addLoading">上架</el-button>
      </div>
    </el-dialog>

    <!-- Allow Sell For Goods Dialog End -->
  </section>
</template>

<script>
import ECRUtil from "../../common/js/util";
import {
  CONTENT_TYPE,
  SHARE_RANGE,
  REVIEW_STATUS
} from "../../common/js/const.js";
import {
  getGoodsList,
  getGoodsListByStatus,
  getSchoolSectionList,
  getSubjectList,
  getNaviGradeList,
  getNaviBookModelList,
  getNaviEditionTypeList,
  getOneLabelList,
  getTwoLabelList,
  getThreeLabelList,
  setResourceLabel,
  modifyPriceToGoodsList,
  modifySellStatusToGoodsList
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
        sharerange: "",
        status: "",
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
      shareRanges: SHARE_RANGE,
      /////////// Filter Data End //////////

      goodsList: [],

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 5,
      page_total: 0,
      /////////// Pagination End ////////
      /////////// Label Pagination //////////
      one_label_page: 1,
      one_labe_total_page: 0,
      two_label_page: 1,
      two_label_page1: 1,
      two_label_total_page: 0,
      two_label_total_page1: 0,
      three_label_page: 1,
      three_label_page1: 1,
      three_label_total_page: 0,
      three_label_total_page1: 0,
      label_page_size: 50,
      /////////// Label Pagination End //////////

      goodsIds: [],
      addLoading: false,
      listLoading: false,
      sels: [],

      /////////// Price Change Form //////////
      changeFormVisible: false,
      changeFormRules: {},
      changeForm: {
        goodprice: 0
      },
      /////////// Price Change Form End //////////

      /////////// Accept Form //////////
      acceptFormVisible: false,
      acceptForm: {
        onshelftime: "",
        downshelftime: ""
      },
      acceptFormRules: {
        property: [{ validator: this.validateAcceptProperty, trigger: "blur" }]
      },
      /////////// Accept Form End//////////
      got: false,
      imageSize: {
        width: 0,
        height: 0
      },
      searchFlag: 0, // 0: search by
      ////////// Search flag /////

    };
  },
  watch: {
      'filters.schoolsectionid': function (val) {
          this.searchByNotStatus(val);
      },
      'filters.subjectid': function (val) {
          this.searchByNotStatus(val);
      },
      'filters.gradeid': function (val) {
          this.searchByNotStatus(val);
      },
      'filters.editiontypeid': function (val) {
          this.searchByNotStatus(val);
      },
      'filters.bookmodelid': function (val) {
          this.searchByNotStatus(val);
      },
      'filters.contenttype': function (val) {
          this.searchByNotStatus(val);
      },
      'filters.onelabel': function (val) {
          this.searchByNotStatus(val);
      },
      'filters.twolabel': function (val) {
          this.searchByNotStatus(val);
      },
      'filters.threelabel': function (val) {
          this.searchByNotStatus(val);
      },
      'filters.sharerange': function (val) {
          this.searchByNotStatus(val);
      },
      'filters.begin_time': function (val) {
          this.searchByNotStatus(val);
      },
      'filters.end_time': function (val) {
          this.searchByNotStatus(val);
      },
      'filters.searchkey': function (val) {
          this.searchByNotStatus(val);
      },
      'filters.status': function (val) {
          this.searchByStatus(val);
      }
  },
  methods: {
      searchByStatus(val) {
          if (val === '') {
            this.searchFlag = 0;
            return;
          }
          this.searchFlag = 1;
          this.filters.schoolsectionid = '';
          this.filters.subjectid = '';
          this.filters.gradeid = '';
          this.filters.editiontypeid = '';
          this.filters.bookmodelid = '';
          this.filters.contenttype = '';
          this.filters.onelabel = '';
          this.filters.twolabel = '';
          this.filters.threelabel = '';
          this.filters.sharerange = '';
          this.filters.begin_time = '';
          this.filters.end_time = '';
          this.filters.searchkey = '';
      },
      searchByNotStatus(val) {
          if (val === '') return;
          this.searchFlag = 0;
          this.filters.status = '';
      },
    ////////////////////<!-- kung: 2019/1/26:bug.No 603: 管理端/资源管理/商品管理，变更商品积分值可为负数。-->/////////////
    detectDecimal(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) ) {
            evt.preventDefault();
        } else {
            return true;
        }
    },
    ////////////////////<!-- kung: 2019/1/26:bug.No 603: 管理端/资源管理/商品管理，变更商品积分值可为负数。-->/////////////
    formatGoodsStatus(status) {
      if (status == "1") {
        return "已上架";
      } else {
        return "已下架";
      }
    },
    // Author : GOD
    // Date Start : 2019-2-12
    // Bug ID : 643
    validateAcceptProperty(rule, value, callback) {
      if (
        this.acceptForm.onshelftime == "" ||
        this.acceptForm.downshelftime == "" ||
        this.acceptForm.onshelftime == null ||
        this.acceptForm.downshelftime == null || new Date(this.acceptForm.onshelftime) > new Date(this.acceptForm.downshelftime)
      ) {
        callback(new Error("请输入有效日期"));
      } else {
        callback();
      }
    },
    // Author : GOD
    // Date End : 2019-2-12
    // Bug ID : 643
    formatStatus(row, col) {
      if (row.status == "0") {
        return "已下架";
      } else if (row.status == "1") {
        return "已上架";
      }
    },
    formatPackage(row, col) {},
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
    getOneLabelList() {
      let param = {
        pageNo: this.one_label_page,
        numPerPage: this.label_page_size
      };
      getOneLabelList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.oneLabels = res.data.pageInfo.list;
          this.one_labe_total_page = Math.ceil(
            res.data.pageInfo.total / this.label_page_size
          );
        } else {
          this.oneLabels = [];
          this.one_labe_total_page = 0;
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
    getGoods() {
      if (this.searchFlag == 0) {
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
                      fieldName: "status",
                      fieldValues: [this.filters.status],
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

          this.listLoading = true;
          getGoodsList(param)
              .then(res => {
                  if (res.data.serverResult.resultCode == "200") {
                      this.total = res.data.pageInfo.total;
                      this.goodsList = res.data.pageInfo.list;
                      this.page_total = res.data.pageInfo.list.length;
                      if (!this.got) {
                          this.getOneLabelList();
                          this.getTwoLabelList("");
                          this.getThreeLabelList("", "");
                      }
                      this.got = true;
                      for (var i = 0; i < this.goodsList.length; i++) {
                          this.fillTwoLabelsForRow(i, this.goodsList[i].resource, "");
                          this.fillThreeLabelsForRow(i, this.goodsList[i].resource, "");
                      }
                  } else {
                      this.$message({
                          message: res.data.serverResult.resultMessage,
                          type: "error"
                      });
                      this.total = 0;
                      this.goodsList = [];
                  }
                  this.listLoading = false;
                  this.imageSize.width = $("section").width();
                  this.imageSize.height = $("section").height();
              })
              .catch(() => {
                  this.total = 0;
                  this.goodsList = [];
                  this.listLoading = false;

                  this.$message({
                      message: "加载失败!",
                      type: "error"
                  });
              });
      } else {
          let param = {
              pagination: {
                  numPerPage: this.page_size,
                  pageNo: this.page,
                  calTotal: true
              },
              conditions: [
                  {
                      fieldName: "status",
                      fieldValues: [this.filters.status],
                      prepender: null,
                      operator: "EQUAL",
                      childCondtions: null
                  },
              ]
          };

          this.listLoading = true;
          getGoodsListByStatus(param)
              .then(res => {
                  if (res.data.serverResult.resultCode == "200") {
                      this.total = res.data.pageInfo.total;
                      this.goodsList = res.data.pageInfo.list;
                      this.page_total = res.data.pageInfo.list.length;
                      if (!this.got) {
                          this.getOneLabelList();
                          this.getTwoLabelList("");
                          this.getThreeLabelList("", "");
                      }
                      this.got = true;
                      for (var i = 0; i < this.goodsList.length; i++) {
                          this.fillTwoLabelsForRow(i, this.goodsList[i].resource, "");
                          this.fillThreeLabelsForRow(i, this.goodsList[i].resource, "");
                      }
                  } else {
                      this.$message({
                          message: res.data.serverResult.resultMessage,
                          type: "error"
                      });
                      this.total = 0;
                      this.goodsList = [];
                  }
                  this.listLoading = false;
                  this.imageSize.width = $("section").width();
                  this.imageSize.height = $("section").height();
              })
              .catch(() => {
                  this.total = 0;
                  this.goodsList = [];
                  this.listLoading = false;

                  this.$message({
                      message: "加载失败!",
                      type: "error"
                  });
              });
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getGoods();
    },
    // Author : GOD, 
    // Modify Reason : Bug Number #649
    // Data Start : 2019-2-11 7:00 PM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      for (var i = 0; i < this.page_size; i++) {
        this.twoLabelsForRow.push({ labels: [] });
        this.threeLabelsForRow.push({ labels: [] });
      }
      this.getGoods();
    },
    // Author : GOD, 
    // Data End : 2019-2-11 7:03 PM
    selsChange: function(sels) {
      this.sels = sels;
    },
    onOneLabelChange(onelabel) {
      this.getTwoLabelList(onelabel);
      this.getThreeLabelList(onelabel, "");
    },
    onTwoLabelChange(onelabel, twolabel) {
      this.getThreeLabelList(onelabel, twolabel);
    },
    doEdit(index, goods) {
      this.$router.push("/stuff/" + goods.resource.contentid);
    },
    doChange(index, goods) {
      this.changeFormVisible = true;
      this.changeForm.goodprice = goods.goodprice;
      this.goodsIds = [goods.goodid];
    },
    doBasket(index, goods) {},
    doBatchChange() {
      this.changeFormVisible = true;
      this.changeForm.goodprice = 0;
      this.goodsIds = this.sels
        .map(item => item.goodid)
        .toString()
        .split(",");
    },
    changeSubmit() {
      this.$refs.changeForm.validate(valid => {
        if (valid) {
          let para = {
            goodids: this.goodsIds,
            goodprice: parseInt(this.changeForm.goodprice)
          };

          this.addLoading = true;
          modifyPriceToGoodsList(para)
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.getGoods();
              } else {
                this.$message({
                  message: res.data.serverResult.resultMessage,
                  type: "error"
                });
              }
              this.addLoading = false;
              this.changeFormVisible = false;
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
    doStop(index, goods) {
      this.$confirm("是否下架？", "提示", {
        type: "info"
      }).then(() => {
        let para = {
          goodids: [goods.goodid],
          sellstatus: "0"
        };

        this.listLoading = true;
        modifySellStatusToGoodsList(para)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.getGoods();
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
    doBatchStop() {
      this.$confirm("是否下架？", "提示", {
        type: "info"
      }).then(() => {
        this.goodsIds = this.sels
          .map(item => item.goodid)
          .toString()
          .split(",");
        let para = {
          goodids: this.goodsIds,
          sellstatus: "0"
        };

        this.listLoading = true;
        modifySellStatusToGoodsList(para)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.getGoods();
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
    doAccept(index, goods) {
      this.acceptFormVisible = true;
      this.acceptForm.onshelftime = goods.onshelftime;
      this.acceptForm.downshelftime = goods.downshelftime;
      this.goodsIds = [goods.goodid];
    },
    doBatchAccept() {
      this.acceptFormVisible = true;
      this.acceptForm.onshelftime = "";
      this.acceptForm.downshelftime = "";
      this.goodsIds = this.sels
        .map(item => item.goodid)
        .toString()
        .split(",");
    },
    acceptSubmit() {
      this.$refs.acceptForm.validate(valid => {
        if (valid) {
          let para = {
            goodids: this.goodsIds,
            sellstatus: "1",
            onshelftime: ECRUtil.formatDate.format(
              new Date(this.acceptForm.onshelftime),
              "yyyy-MM-dd hh:mm:ss"
            ),
            downshelftime: ECRUtil.formatDate.format(
              new Date(this.acceptForm.downshelftime),
              "yyyy-MM-dd hh:mm:ss"
            )
          };

          this.addLoading = true;
          modifySellStatusToGoodsList(para)
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.getGoods();
              } else {
                this.$message({
                  message: res.data.serverResult.resultMessage,
                  type: "error"
                });
              }
              this.addLoading = false;
              this.acceptFormVisible = false;
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
    doBatchBasket() {},
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
        let param = {};
        param = {
          parentlabelid: resource.twolabelid,
          pageNo: this.three_label_page1,
          numPerPage: this.label_page_size
        };
        getThreeLabelList(param).then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.threeLabelsForRow[$index].labels = res.data.pageInfo.list;
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
      this.getGoods();
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
    }
    this.getGoods();
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