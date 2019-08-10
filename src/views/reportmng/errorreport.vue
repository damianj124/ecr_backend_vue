<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">报错管理</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <el-form label-width="120px">
        <el-col :span="6">
          <el-form-item label="处理状态:">
            <el-select v-model="filters.handlestatus">
              <el-option label="全部" value></el-option>
              <el-option label="未处理" value="0"></el-option>
              <el-option label="已处理" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="处理人:">
            <el-input v-model="filters.handler" style="float:left; width: calc(100% - 70px)"></el-input>
            <el-button
              style="margin-left:10px; float:right"
              type="primary"
              v-on:click="search"
              id="searchBtn"
            >查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>

      <el-col :span="24" style="margin-bottom:10px;text-align:right;">
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="batchRemove"
          :loading="deleteLoading"
        >删除</el-button>
      </el-col>
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="errors.length==0"
      >
      <el-table
        :data="errors"
        v-loading="listLoading"
        @selection-change="selsChange"
        v-if="errors.length>0"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column prop="feedbackid" label="挑错ID" align="center"></el-table-column>
        <el-table-column label="商品名称" align="center" width="360">
          <template slot-scope="error">
            <my-resource :resource="error.row.resource"></my-resource>
          </template>
        </el-table-column>
        <el-table-column label="详情页面" align="center">
          <template slot-scope="error">
            <el-button size="small" @click="doEdit(error.$index, error.row)" style="margin:0px">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="章" align="center" :formatter="formatChapter"></el-table-column>
        <el-table-column label="节" align="center" :formatter="formatSection"></el-table-column>
        <el-table-column prop="resource.realname" label="知识点" align="center"></el-table-column>
        <el-table-column label="错误问题描述" align="center">
          <template slot-scope="error">
            <el-tooltip class="item" effect="dark" :content="error.row.remark" placement="left">
              <span>{{ error.row.remark }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="错误问题截图" align="center" width="100">teachingmaterial
          <template slot-scope="error">
            <el-button size="small" @click="showCapture(error.$index, error.row)">预览</el-button>
          </template>
        </el-table-column>
        <el-table-column label="报错提交人" align="center">
          <template slot-scope="error">
           <span> {{ error.row.username.replace(/#/g, "-") }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="school" label="所属学校" align="center"></el-table-column>
        <el-table-column prop="createtime" label="报错提交时间" align="center"></el-table-column>
        <el-table-column prop="status" label="处理状态" align="center">
          <template slot-scope="error">
            <span
              :class="{ 'ecrm-color-red':error.row.status.trim()=='0', 'ecrm-color-green':error.row.status.trim()=='1'}"
            >{{ formatStatus(error.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="audituser" label="处理人" align="center">
          <template slot-scope="error">
            <span>
              {{ error.row.audituser ? error.row.audituser.replace(/#/g, "-") : ''}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="audittime" label="处理时间" align="center"></el-table-column>
        <el-table-column label="奖励积分" align="center" width="120px">
          <template slot-scope="error">
            <el-button
              size="small"
              @click="doPrize(error.$index, error.row)"
              style="margin:0px"
              v-if="error.row.isscored != '1'"
            >奖励</el-button>
            <el-button
              size="small"
              @click="doNotPrize(error.$index, error.row)"
              style="margin:0px"
              v-if="error.row.isscored != '1'"
            >不奖励</el-button>
            <span class="ecrm-color-red" v-if="error.row.isscored == '1'">{{ error.row.score }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="error">
            <el-button
              size="small"
              @click="doHandle(error.$index, error.row)"
              style="margin:0px"
              v-if="error.row.status.trim() == '0' && error.row.isscored == '1'"
            >处理</el-button>
            <el-button size="small" @click="doDetail(error.$index, error.row)" style="margin:0px">详情</el-button>
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
    </el-col>

    <!-- DetailForm Start -->
    <el-dialog
      v-model="detailFormVisible"
      :close-on-click-modal="true"
      style="background: transparent"
    >
      <el-row>
        <el-col :span="24">{{ detailForm.remark }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <img :src="detailForm.imageurl" style="width:100%;">
        </el-col>
      </el-row>
    </el-dialog>
    <!-- DetailForm End -->
    <!-- prizeForm Start -->
    <el-dialog title="奖励积分" v-model="prizeFormVisible" :close-on-click-modal="false">
      <el-form :model="prizeForm" label-width="100px" ref="prizeForm">
        <el-row>
          <el-col :span="24" v-if="prizeForm.prizeStatus">
            <el-form-item label="积分:" prop="prize">
              <el-input-number v-model="prizeForm.prize" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="!prizeForm.prizeStatus">
            <el-form-item label="专家团队意见:" prop="opinion">
              <el-input type="textarea" v-model="prizeForm.opinion"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="prizeFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="prizeSubmit" :loading="addLoading">保存</el-button>
      </div>
    </el-dialog>
    <!-- prizeForm Start -->
  </section>
</template>

<script>
import ECRUtil from "../../common/js/util";
import {} from "../../common/js/const.js";
import {
  getFeedBackDataList,
  batchDeleteFeedback,
  setScore2Feedback,
  auditFeedback
} from "../../api/api";

export default {
  data() {
    return {
      ECRUtil: ECRUtil,
      filters: {
        handlestatus: "",
        begin_time: "",
        end_time: "",
        handler: ""
      },
      errors: [],
      curError: null,
      listLoading: false,
      deleteLoading: false,
      sels: [],
      detailFormVisible: false,
      detailForm: {
        detailshow: false,
        imageurl: "",
        remark: ""
      },
      prizeFormVisible: false,
      prizeForm: {
        prize: 0,
        prizeStatus: false,
        opinion: ""
      },
      addLoading: false,

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 5,
      page_total: 0,
      /////////// Pagination End ////////
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    search() {
      this.page = 1;
      this.getErrors();
    },
    formatChapter(row, col) {
      if (row.resource.subnaviInfos == null) return;
      let chapters = row.resource.subnaviInfos
        .map(item => item.chapter)
        .toString();
      return chapters;
    },
    formatSection(row, col) {
      if (row.resource.subnaviInfos == null) return;
      let sections = row.resource.subnaviInfos
        .map(item => item.section)
        .toString();
      return sections;
    },
    getErrors() {
      var params = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
          {
            fieldName: "type",
            fieldValues: ["1"],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "audituser",
            fieldValues: [this.filters.handler],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "status",
            fieldValues: [this.filters.handlestatus],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ]
      };

      this.listLoading = true;
      getFeedBackDataList(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.errors = res.data.pageInfo.list;
            this.total = res.data.pageInfo.total;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.errors = [];
            this.total = 0;
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.errors = [];
          this.total = 0;
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getErrors();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getErrors();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    selsChange: function(sels) {
      this.sels = sels;
    },
    batchRemove() {
      this.$confirm("是否批量删除该记录？", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = [];
          this.sels.forEach(function(error) {
            params.push(error.feedbackid);
          });
          this.deleteLoading = true;
          batchDeleteFeedback(params)
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.$message({
                  message: "删除成功！",
                  type: "success"
                });
                this.getErrors();
              } else {
                this.$message({
                  message: res.data.serverResult.resultMessage,
                  type: "error"
                });
              }
              this.deleteLoading = false;
            })
            .catch(() => {
              this.deleteLoading = false;

              this.$message({
                message: "操作失败",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    doEdit(index, error) {
      this.$router.push("/resource/" + error.objectid);
    },
    showCapture(index, error) {
      this.doDetail(index, error);
    },
    doPrize(index, error) {
      this.curError = error;
      this.prizeFormVisible = true;
      this.prizeForm.prize = 0;
      this.prizeForm.opinion = "";
      this.prizeForm.prizeStatus = true;
    },
    doNotPrize(index, error) {
      this.curError = error;
      this.prizeFormVisible = true;
      this.prizeForm.prize = 0;
      this.prizeForm.opinion = "";
      this.prizeForm.prizeStatus = false;
    },
    doHandle(index, error) {
      var param = error.feedbackid;
      auditFeedback(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "标记成功！",
              type: "success"
            });

            this.getErrors();
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
    doDetail(index, error) {
      this.detailForm.detailshow = true;
      if (error.screenshot != null) {
        this.detailForm.imageurl = ECO_MEDIA_PATH + error.screenshot.localpath;
      } else {
        this.detailForm.imageurl = "";
      }

      this.detailForm.remark = error.remark;
      this.detailFormVisible = true;
    },
    prizeSubmit() {
      var param = {};
      if (this.prizeForm.prizeStatus) {
        param = {
          feedbackid: this.curError.feedbackid,
          score: this.prizeForm.prize,
          replycontent: this.prizeForm.opinion
        };
      } else {
        param = {
          feedbackid: this.curError.feedbackid,
          score: 0,
          replycontent: this.prizeForm.opinion
        };
      }

      this.addLoading = true;
      setScore2Feedback(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "标记成功！",
              type: "success"
            });
            this.getErrors();
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

      this.prizeFormVisible = false;
    },
    formatStatus(status) {
      if (status.trim() == "1") {
        return "已处理";
      } else if (status.trim() == "0") {
        return "未处理";
      }
    }
  },
  created() {
    this.getErrors();

    window.EventHub.$emit("mode-changed", 1);
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";

.el-input,
.el-select {
  width: 100%;
}
</style>