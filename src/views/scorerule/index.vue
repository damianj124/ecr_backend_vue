<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">积分规则配置</a>
    </el-col>
    <el-col :span="24" class="ecrm-content-panel">
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="rules.length==0"
      >
      <el-table :data="rules" v-loading="listLoading" v-if="rules.length>0">
        <el-table-column prop="ruleid" label="ID" align="center"></el-table-column>
        <el-table-column
          prop="bussinesstype"
          :formatter="formatBussiness"
          label="大类"
          align="center"
        ></el-table-column>
        <el-table-column prop="contenttype" label="小类" align="center">
          <template slot-scope="rule">
            <span>{{ formatContentType(rule.row.contenttype) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        <el-table-column
          prop="sharerange"
          :formatter="formatShareRange"
          label="范围"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column label="获得积分值" align="center" width="200">
          <template slot-scope="rule">
            <el-input v-model="rule.row.score"></el-input>
            <el-button size="small" @click="setScore(rule.$index, rule.row)" style="margin:0px">设置</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="forobject" label="适用对象" :formatter="formatObject" align="center"></el-table-column>
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
  </section>
</template>

<script>
import ECRUtil from "../../common/js/util.js";
import { CONTENT_TYPE } from "../../common/js/const.js";
import { getScoreRule, setScoreRule } from "../../api/api";

export default {
  data() {
    return {
      contentTypes: CONTENT_TYPE,
      listLoading: false,
      rules: [],

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 10,
      page_total: 0,
      /////////// Pagination End ////////
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    getRules() {
      var param = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        }
      };

      this.listLoading = true;
      getScoreRule(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.rules = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.rules = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.total = 0;
          this.rules = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getRules();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getRules();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    formatBussiness(row, col) {
      if (row.bussinesstype == "0") {
        return "上传资源";
      } else if (row.bussinesstype == "1") {
        return "参与征集资源";
      } else if (row.bussinesstype == "2") {
        return "评星";
      } else if (row.bussinesstype == "3") {
        return "点赞";
      } else if (row.bussinesstype == "4") {
        return "挑错";
      } else if (row.bussinesstype == "5") {
        return "收藏";
      } else if (row.bussinesstype == "6") {
        return "完善个人信息";
      } else if (row.bussinesstype == "7") {
        return "登录";
      } else if (row.bussinesstype == "8") {
        return "题库设置积分";
      }

      return "";
    },
    formatContentType(contenttype) {
      for (var i = 0; i < this.contentTypes.length; i++) {
        if (contenttype == "T") {
          return "文本";
        } else if (contenttype == "T4") {
          return "试题";
        }

        if (this.contentTypes[i].contenttype == contenttype) {
          return this.contentTypes[i].contentname;
        }
      }

      return contenttype;
    },
    formatShareRange(row, col) {
      if (row.sharerange == 2) {
        return "本校、本区、本市、本省";
      } else if (row.sharerange == 1) {
        return "全网";
      }

      return "";
    },
    formatObject(row, col) {
      if (row.forobject == "0") {
        return "学生, 老师";
      } else if (row.forobject == "1") {
        return "学生";
      } else if (row.forobject == "2") {
        return "老师";
      } else if (row.forobject == "3") {
        return "管理员";
      }
    },
    setScore(index, rule) {
      var param = {
        ruleid: rule.ruleid,
        score: rule.score
      };
      setScoreRule(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "标记成功！",
              type: "success"
            });
            this.getRules();
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
    }
  },
  created() {
    this.getRules();
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";

.el-input {
  width: 70%;
}
</style>