<template>
  <section>
    <el-row>
      <el-col :span="24" class="ecrm-search-title">
        <a class="selected">字典类型管理</a>
      </el-col>
    </el-row>
    <el-row :span="24" class="ecrm-content-panel">
      <el-form label-width="100px">
        <el-col :span="7">
          <el-form-item label="字典ID :">
            <el-input placeholder="请输入字典ID" v-model="filters.dicTypeID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="字典名称 :">
            <el-input placeholder="请输入字典名称" v-model="filters.dicTypeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" style="margin-left: 30px;">
          <el-button type="primary" @click="search">查询</el-button>
        </el-col>
      </el-form>
      <!-- Batch Operation Panel -->
      <el-col :span="24" style="margin-bottom:10px;text-align:right;">
        <el-button type="table-op" size="small" @click="doAdd">新增</el-button>
      </el-col>

      <!-- Batch Operation Panel End -->
      <!--Data Table -->
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="sysdicTypeList.length==0"
      >
      <el-table
        :data="sysdicTypeList"
        v-loading="listLoading"
        @selection-change="selsChange"
        v-if="sysdicTypeList.length>0"
      >
        <el-table-column prop="dicttypeid" label="字典ID" align="center"></el-table-column>
        <el-table-column prop="dicttypename" label="字典名称" align="center"></el-table-column>
        <el-table-column prop="parenttypeid" label="父级字典ID" align="center" width="80"></el-table-column>
        <el-table-column prop="description" label="描述" align="center"></el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="editType(scope.$index, scope.row)">修改</el-button>
            <el-button
              size="small"
              @click="deleteType(scope.$index, scope.row)"
              :disabled="scope.row.iseditable == '0' "
            >删除</el-button>
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
    </el-row>

    <!-- Add Dialog -->
    <el-dialog title="新增字典类型" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item prop="typeid" label="字典类型ID :">
          <el-input placeholder="请输入字典类型ID" v-model="addForm.typeid"></el-input>
        </el-form-item>
        <el-form-item prop="typename" label="字典类型名称 :">
          <el-input placeholder="请输入字典类型名称" v-model="addForm.typename"></el-input>
        </el-form-item>
        <el-form-item prop="typeexplain" label="字典描述 :">
          <el-input placeholder="请输入字典描述" v-model="addForm.typeexplain"></el-input>
        </el-form-item>
        <el-form-item prop="parentid" label="父字典ID :">
          <el-input  placeholder="请输入父字典ID" v-model="addForm.parentid" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
      </div>
    </el-dialog>

    <!-- Modify Dialog -->
    <el-dialog title="修改字典类型" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item prop="typeid" label="字典类型ID :">
          <el-input placeholder="请输入字典类型ID" v-model="editForm.typeid"></el-input>
        </el-form-item>
        <el-form-item prop="typename" label="字典类型名称 :">
          <el-input placeholder="请输入字典类型名称" v-model="editForm.typename"></el-input>
        </el-form-item>
        <el-form-item prop="typeexplain" label="字典描述 :">
          <el-input placeholder="请输入字典描述" v-model="editForm.typeexplain"></el-input>
        </el-form-item>
        <el-form-item prop="parentid" label="父字典ID :">
          <el-input  placeholder="请输入父字典ID" v-model="editForm.parentid" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getTypeList, insertType, modifyType, removeType } from "../../api/api";

export default {
  data() {
    return {
      sysdicTypeList: [],
      filters: {
        dicTypeID: "",
        dicTypeName: ""
      },
      sels: [],
      listLoading: false,

      page_size: 10,
      total: 0,
      page: 1,
      page_total: 0,

      addFormVisible: false,
      addLoading: false,
      addForm: {
        typeid: "",
        typename: "",
        typeexplain: "",
        parentid: "0"
      },
      addFormRules: {
        typeid: [
          { required: true, message: "请输入字典类型ID", trigger: "blur" }
        ],
        typename: [
          { required: true, message: "请输入字典类型名称", trigger: "blur" }
        ],
        typeexplain: [
          { required: true, message: "请输入字典描述", trigger: "blur" }
        ],
        parentid: [
          { required: true, message: "请输入父字典ID", trigger: "blur" }
        ]
      },
      editFormVisible: false,
      editLoading: false,
      editForm: {
        typeid: "",
        typename: "",
        typeexplain: "",
        parentid: "0",
        oldid: ""
      },
      editFormRules: {
        typeid: [
          { required: true, message: "请输入字典类型ID", trigger: "blur" }
        ],
        typename: [
          { required: true, message: "请输入字典类型名称", trigger: "blur" }
        ],
        typeexplain: [
          { required: true, message: "请输入字典描述", trigger: "blur" }
        ],
        parentid: [
          { required: true, message: "请输入父字典ID", trigger: "blur" }
        ]
      },
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    load() {
      let para = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
          {
            fieldName: "dicttypename",
            fieldValues: [this.filters.dicTypeName],
            prepender: null,
            operator: "EQUAL",
            childConditions: null
          },
          {
            fieldName: "dicttypeid",
            fieldValues: [this.filters.dicTypeID],
            prepender: null,
            operator: "EQUAL",
            childConditions: null
          },
          {
            fieldName: "lang",
            fieldValues: ["zh_CN"],
            prepender: null,
            operator: "EQUAL",
            childConditions: null
          }
        ]
      };
      this.listLoading = true;
      getTypeList(para)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.sysdicTypeList = res.data.pageInfo.list;
            this.total = res.data.pageInfo.total;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.sysdicTypeList = [];
            this.total = 0;
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.sysdicTypeList = [];
          this.total = 0;
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    search() {
      this.page = 1;
      this.load();
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
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
    doAdd: function() {
      this.addFormVisible = true;
    },
    editType(index, item) {
      this.editFormVisible = true;

      this.editForm.typeid = item.dicttypeid;
      this.editForm.typename = item.dicttypename;
      this.editForm.parentid = item.parenttypeid;
      this.editForm.typeexplain = item.description;
      this.editForm.oldid = item.dicttypeid;
    },
    deleteType(index, item) {
      this.$confirm("是否删除当前字典？", "提示", {
        type: "warning"
      }).then(() => {
        removeType(item.dicttypeid).then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.load();
          }
        });
      });
    },
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let para = {
            dicttypeid: this.addForm.typeid,
            dicttypename: this.addForm.typename,
            parenttypeid: this.addForm.parentid,
            description: this.addForm.typeexplain,
            sortno: 1,
            lang: "zh_CN"
          };
          this.addLoading = true;
          insertType(para)
            .then(res => {             
              if (res.data.serverResult.resultCode == "200") {
                this.addFormVisible = false;
                this.load();
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
        }
      });
    },
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let para = {
            oldid: this.editForm.oldid,
            dicttypeid: this.editForm.typeid,
            dicttypename: this.editForm.typename,
            parenttypeid: this.editForm.parentid,
            description: this.editForm.typeexplain,
            sortno: 1,
            lang: "zh_CN"
          };
          this.editLoading = true;
          modifyType(para)
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.editFormVisible = false;
                this.load();
              } else {
                this.$message({
                  message: res.data.serverResult.resultMessage,
                  type: "error"
                });
              }
              this.editLoading = false;
            })
            .catch(() => {
              this.editLoading = false;

              this.$message({
                message: "操作失败",
                type: "error"
              });
            });
        }
      });
    }
  },
  created() {
    this.load();
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";
</style>