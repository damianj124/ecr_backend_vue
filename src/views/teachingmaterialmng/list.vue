<template>
  <section>
    <el-col>
      <el-col :span="24" class="ecrm-search-title">
        <a class="selected">教材教辅目录管理</a>
      </el-col>
      <el-col :span="24" style="margin-top: 30px; margin-bottom: 20px;">
        <el-button style="float: right;" type="table-op" size="small" @click="addBook">添加</el-button>
      </el-col>

      <el-col :span="24">
        <el-table
          :data="books"
          highlight-current-row
          v-loading="listLoading"
          style="width: 100%;"
          border
        >
          <el-table-column prop="bookinfo.bookname" align="center" label="名称"></el-table-column>
          <el-table-column prop="subjectnaviinfo.schoolsection" align="center" label="学段"></el-table-column>
          <el-table-column prop="subjectnaviinfo.subject" align="center" label="学科"></el-table-column>
          <el-table-column prop="subjectnaviinfo.grade" align="center" label="年级"></el-table-column>
          <el-table-column prop="subjectnaviinfo.term" align="center" label="学期"></el-table-column>
          <el-table-column prop="subjectnaviinfo.editiontype" align="center" label="版本"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button size="small" @click="editBook(scope.$index, scope.row)">修改</el-button>
              <el-button size="small" @click="deleteBook(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
          <my-pagination
            @current-change="handleCurrentChange"
            @pgSize-change="handlePageSizeChange"
            :page-size="page_size"
            :total="total"
          ></my-pagination>
        </el-col>
      </el-col>
    </el-col>
  </section>
</template>

<script>
import { getBookInfoList, deleteBook } from "../../api/api";
export default {
  data() {
    return {
      books: [],
      total: 0,
      page_size: 10,
      page: 1,
      listLoading: false
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.load();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.load();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    deleteBook(index, row) {
      this.$confirm("确认删除吗？", "提示", {
        type: "warning"
      }).then(() => {
        deleteBook(row.bookinfo.bookid).then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.load();
          } else {
            var resultMessage = res.data.serverResult.resultMessage;
            this.$message({
              message: resultMessage,
              type: "error"
            });
          }
        });
      });
    },
    addBook() {
      this.$router.push("/teachingmaterial");
    },
    editBook(index, row) {
      this.$router.push("/teachingmaterial/edit/" + row.bookinfo.bookid);
    },
    load() {
      let para = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page
        }
      };

      this.listLoading = true;
      getBookInfoList(para)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.books = res.data.pageInfo.list;
            this.total = res.data.pageInfo.total;
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";
</style>