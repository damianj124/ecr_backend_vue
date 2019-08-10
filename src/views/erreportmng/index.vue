<template>
  <section class="vscroll">
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">挑错管理</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <el-form label-width="120px">
        <el-col :span="8">
          <el-form-item label="创建日期:">
            <el-date-picker type="date" v-model="filters.begin_time" style="width:209px;"></el-date-picker>-
            <el-date-picker type="date" v-model="filters.end_time" style="width:209px;"></el-date-picker>
          </el-form-item>
        </el-col>
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
        >删除</el-button>
      </el-col>

      <el-table :data="errors" v-loading="listLoading" @selection-change="selsChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="feedbackid" label="挑错ID1" align="center"></el-table-column>
        <el-table-column prop="resource.name" label="商品名称" align="center"></el-table-column>
        <el-table-column label="详情页面" align="center">
          <template slot-scope="error">
            <el-button size="small" @click="doEdit(error.$index, error.row)" style="margin:0px">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="resource.schoolsection" label="学段" align="center"></el-table-column>
        <el-table-column prop="resource.subject" label="学科" align="center"></el-table-column>
        <el-table-column prop="resource.editiontype" label="教材版本" align="center"></el-table-column>
        <el-table-column prop="resource.grade" label="年级" align="center"></el-table-column>
        <el-table-column prop="resource.bookmodel" label="册别" align="center"></el-table-column>
        <el-table-column prop="resource.chapter" label="章" align="center"></el-table-column>
        <el-table-column prop="resource.section" label="节" align="center"></el-table-column>
        <el-table-column prop="resource.realname" label="知识点" align="center"></el-table-column>
        <el-table-column prop="errproblem" label="错误问题描述" align="center"></el-table-column>
        <el-table-column label="错误问题截图" align="center">
          <template slot-scope="error">
            <el-button
              size="small"
              @click="showCapture(error.$index, error.row)"
              style="margin:0px"
            >查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="挑错人姓名" align="center"></el-table-column>
        <el-table-column prop="userphone" label="挑错人联系电话" align="center"></el-table-column>
        <el-table-column prop="school" label="所属学校" align="center"></el-table-column>
        <el-table-column prop="createtime" label="举报时间" align="center"></el-table-column>
        <el-table-column prop="status" label="处理状态" align="center">
          <template slot-scope="error">
            <span
              :class="{ 'ecrm-color-red':error.row.status=='0 ', 'ecrm-color-green':error.row.status=='1 '}"
            >{{ formatStatus(error.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="audituser" label="处理人" align="center"></el-table-column>
        <el-table-column prop="audittime" label="处理时间" align="center"></el-table-column>
        <el-table-column label="奖励积分" align="center">
          <template slot-scope="error">
            <el-button
              size="small"
              @click="doHandlePrize(error.$index, error.row)"
              style="margin:0px"
            >奖励</el-button>
            <el-button
              size="small"
              @click="doNotPrize(error.$index, error.row)"
              style="margin:0px"
            >不奖励</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="error">
            <el-button size="small" @click="doHandle(error.$index, error.row)" style="margin:0px">奖励</el-button>
            <el-button
              size="small"
              @click="doDetail(error.$index, error.row)"
              style="margin:0px"
            >不奖励</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
        <my-pagination
          @current-change="handleCurrentChange"
          @pgSize-change="handlePageSizeChange"
          :page-size="page_size"
          :total="total"
        ></my-pagination>
      </el-col>
    </el-col>
  </section>
</template>

<script>
import ECRUtil from "../../common/js/util";
import {} from "../../common/js/const.js";
import {
  getFeedBackDataList,
  detailResource,
  batchDeleteFeedback
} from "../../api/api";

export default {
  data() {
    return {
      ECRUtil: ECRUtil,
      filters: {
        errtype: "",
        handlestatus: "",
        opertype: "",
        begin_time: "",
        end_time: "",
        handler: ""
      },
      errors: [],
      listLoading: false,
      sels: [],

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 5
      /////////// Pagination End ////////
    };
  },
  methods: {
    search() {
      this.getErrors();
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

      getFeedBackDataList(params).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.errors = res.data.pageInfo.list;
          this.total = res.data.pageInfo.total;
          if (this.errors.length > 0) {
            this.errors.forEach(function(error) {
              let resourceId = error.objectid;
              detailResource(resourceId).then(res => {
                if (res.data.serverResult.resultCode == "200") {
                  error.resource = res.data.responseEntity;
                } else {
                  var resultMessage = res.data.serverResult.resultMessage;
                  this.$message({
                    message: resultMessage,
                    type: "error"
                  });
                }
              });
            });
          }
        } else {
          var resultMessage = res.data.serverResult.resultMessage;
          this.$message({
            message: resultMessage,
            type: "error"
          });
        }
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
      this.$confirm("确定从ECR系统中删除学校？", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = [];
          this.sels.forEach(function(error) {
            params.push(error.feedbackid);
          });

          batchDeleteFeedback(params)
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.$message({
                  message: "删除成功！",
                  type: "success"
                });

                this.getErrors();
              } else {
                var resultMessage = res.data.serverResult.resultMessage;
                this.$message({
                  message: resultMessage,
                  type: "error"
                });
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    doEdit(index, error) {
      this.$router.push({ path: "/resource/" + error.resource.contentid });
    },
    showCapture(index, error) {},
    doPrize(index, error) {},
    doNotPrize(index, error) {},
    doHandle(index, error) {},
    doDetail(index, error) {},
    formatStatus(status) {
      if (status == "1 ") {
        return "已处理";
      } else if (status == "0 ") {
        return "未处理";
      }
    }
  },
  created() {
    this.getErrors();
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