<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">征集资源审核</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <!-- Filter Panel -->
      <el-form label-width="100px">
        <el-col :span="6">
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
        <el-col :span="6">
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
        <el-col :span="6">
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
        <el-col :span="6">
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
        <el-col :span="6">
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
        <el-col :span="6">
          <el-form-item label="资源类型:">
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
        <el-col :span="6">
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
        <el-col :span="6">
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
        <el-col :span="6">
          <el-form-item label="创建日期:">
            <el-date-picker type="date" v-model="filters.begin_time" style="width:46%;"></el-date-picker> -
            <el-date-picker type="date" v-model="filters.end_time" style="width:46%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="活动名称:">
            <el-input type="text" v-model="filters.activitynamekey" placeholder="请输入活动名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="活动ID:">
            <el-input type="text" v-model="filters.activityidkey" placeholder="请输入活动ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="搜索框:">
            <el-input
              v-model="filters.searchkey"
              placeholder="请输入资源名称 / 作者"
              style="width:calc(100% - 65px)"
              @keyup.enter.native="search"
            ></el-input>
            <el-button type="primary" v-on:click="search" id="searchBtn">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>

      <!-- Filter Panel End -->
      <el-col :span="24" style="margin-bottom:10px;text-align:right;">
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length==0"
          @click="doBatchAllow"
        >批量通过</el-button>
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length==0"
          @click="doBatchDeny"
        >批量不通过</el-button>
      </el-col>

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
        <el-table-column label="资源名称" align="center" width="400">
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
        <el-table-column label="活动名称" prop="activityName" align="center"></el-table-column>
        <el-table-column label="活动ID" prop="activityid" align="center"></el-table-column>
        <el-table-column label="评分" align="center">
          <template slot-scope="resource">
            <my-rate :rate="resource.row.ratesum==null?0:resource.row.ratesum"></my-rate>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="resource">
            <el-button
              size="small"
              @click="doDetail(resource.$index, resource.row)"
              style="margin:0px"
            >详情</el-button>
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

    <el-dialog
      title="审核通过"
      v-model="allowFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form :model="allowForm" label-width="100px" ref="allowForm">
        <el-form-item label="积分:" class="is-required">
          <el-input-number
            v-model.number="allowForm.collectscore"
            :min="0" :max="99999"
            @keypress.native="validateDecimal($event)"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelAllow">取消</el-button>
        <el-button type="primary" @click.native="doAllowSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="审核不通过"
      v-model="disallowFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form :model="disallowForm" label-width="100px" ref="disallowForm">
        <el-form-item label="驳回原因:" prop="remark">
          <el-input
            type="textarea"
            :rows.native="8"
            v-model="disallowForm.remark"
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
  getSchoolSectionList,
  getSubjectList,
  getNaviGradeList,
  getNaviBookModelList,
  getNaviEditionTypeList,
  getCollectedResourceList,
  denyResource,
  allowResource
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
        activitynamekey: "",
        activityidkey: "",
        searchkey: "",
        sharerange: "",
        begin_time: "",
        end_time: "",
        status: "1"
      },
      isRating: false,
      myRating: 0,
      ////////// Filter Data /////////////
      schoolSections: [],
      subjects: [],
      grades: [],
      bookModels: [],
      editionTypes: [],
      contentTypes: CONTENT_TYPE,
      shareRanges: SHARE_RANGE,
      status: REVIEW_STATUS,
      resourceStatus: [],
      /////////// Filter Data End //////////
      resources: [],

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 5,
      page_total: 0,
      /////////// Pagination End ////////

      addLoading: false,
      listLoading: false,
      sels: [], //列表选中列
      allowFormVisible: false,
      allowForm: {
        collectscore: 0
      },
      disallowFormVisible: false,
      disallowForm: {
        remark: ""
      },
      currentResource: null,
      currentIndex: -1,
      contentIds: [],
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
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
    search() {
      this.page = 1;
      this.getResources();
    },
    review(index, resource) {
      this.currentIndex = index;
      if (this.resourceStatus[index].status == resource.status) return;
      if (this.resourceStatus[index].status == "3") {
        //审核
        this.doAllow(index, resource);
      } else if (this.resourceStatus[index].status == "4") {
        //驳回
        this.currentResource = resource;
        this.contentIds = this.currentResource.contentid.split(",");
        this.disallowForm.remark = "";
        this.disallowFormVisible = true;
      }
    },
    cancelDisallow() {
      this.disallowFormVisible = false;
      this.resourceStatus[
        this.currentIndex
      ].status = this.currentResource.status;
    },
    cancelAllow() {
      this.allowFormVisible = false;
      this.resourceStatus[
        this.currentIndex
      ].status = this.currentResource.status;
    },
    getResources() {
      let params = {
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
            fieldName: "activitynamekey",
            fieldValues: [this.filters.activitynamekey.trim()],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "activityidkey",
            fieldValues: [this.filters.activityidkey.trim()],
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

      this.listLoading = true;
      getCollectedResourceList(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.resources = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
            this.resourceStatus = [];
            for (var i = 0; i < this.resources.length; i++) {
              this.resourceStatus.push({
                status: this.resources[i].status
              });
            }
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.resources = [];
            this.resourceStatus = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.total = 0;
          this.resources = [];
          this.resourceStatus = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    doDetail(index, resource) {
      let w = window.open("resource/preview/" + resource.contentid);
      w.focus();
    },
    doDisallow() {
      this.addLoading = true;
      let params = {
        audittype: 1,
        contentids: this.contentIds,
        remark: this.disallowForm.remark
      };
      denyResource(params)
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
    },
    doAllow(index, resource) {
      this.allowFormVisible = true;
      this.currentResource = resource;
      this.contentIds = this.currentResource.contentid.split(",");
    },
    doAllowSubmit() {
      this.$confirm("是否审核通过该资源？", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = {
            audittype: 1,
            contentids: this.contentIds,
            auditscore: this.allowForm.collectscore
          };
          this.addLoading = true;
          allowResource(params)
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
                this.resourceStatus[
                  this.currentIndex
                ].status = this.currentResource.status;
              }
              this.addLoading = false;
              this.allowFormVisible = false;
              this.getResources();
            })
            .catch(() => {
              this.addLoading = false;

              this.$message({
                message: "操作失败",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    doBatchAllow() {
      this.allowFormVisible = true;
      this.contentIds = this.sels
        .map(item => item.contentid)
        .toString()
        .split(",");
    },
    doBatchDeny() {
      this.disallowForm.remark = "";
      this.disallowFormVisible = true;
      this.contentIds = this.sels
        .map(item => item.contentid)
        .toString()
        .split(",");
    },
    validateDecimal(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    }
  },
  created() {
    this.getSchoolSectionList();
    this.getSubjectList();
    this.getNaviGradeList();
    this.getNaviBookModelList();
    this.getNaviEditionTypeList();
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
</style>