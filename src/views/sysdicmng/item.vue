<template>
  <section>
    <el-row>
      <el-col :span="24" class="ecrm-search-title">
        <a class="selected">字典项管理</a>
      </el-col>
    </el-row>
    <el-row :span="24" class="ecrm-content-panel">
      <el-form label-width="100px">
        <el-col :span="6">
          <el-form-item label="字典类型ID :">
            <el-input placeholder="请输入字典类型ID" v-model="filters.dicTypeID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="字典项ID :">
            <el-input placeholder="请输入字典项ID" v-model="filters.dicItemID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="字典项名称 :">
            <el-input placeholder="请输入字典项名称" v-model="filters.dicItemName"></el-input>
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
        v-if="sysdicItemList.length==0"
      >
      <el-table
        :data="sysdicItemList"
        v-loading="listLoading"
        @selection-change="selsChange"
        v-if="sysdicItemList.length>0"
      >
        <el-table-column prop="dictid" label="字典项ID" align="center"></el-table-column>
        <el-table-column prop="dictname" label="字典项名称" align="center"></el-table-column>
        <el-table-column prop="dictvalue" label="字典项值" align="center"></el-table-column>
        <el-table-column prop="parentdictid" label="父级字典ID" align="center"></el-table-column>
        <el-table-column prop="remark" label="描述" align="center"></el-table-column>
        <el-table-column prop="sortno" label="排序" align="center" width="80"></el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="editItem(scope.$index, scope.row)"
              :disabled="scope.row.iseditable == '0'"
            >修改</el-button>
            <el-button
              size="small"
              @click="deleteItem(scope.$index, scope.row)"
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
    <el-dialog title="新增字典项" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item prop="itemname" label="字典项名称 :">
          <el-input placeholder="请输入字典项名称" v-model="addForm.itemname"></el-input>
        </el-form-item>
        <el-form-item prop="dicitem" label="字典项值 :">
          <el-input placeholder="请输入字典项值" v-model="addForm.dicitem"></el-input>
        </el-form-item>
        <el-form-item prop="itemexplain" label="字典描述 :">
          <el-input placeholder="请输入字典描述" v-model="addForm.itemexplain"></el-input>
        </el-form-item>
        <el-form-item prop="parentid" label="父字典ID :">
          <el-input type="number" placeholder="请输入父字典ID" v-model="addForm.parentid" :min="0"></el-input>
        </el-form-item>
        <el-form-item prop="dicttypeid" label="字典类型 :">
          <el-select placeholder="字典类型" v-model="addForm.dicttypeid">
            <el-option
              :label="item.dicttypename"
              :value="item.dicttypeid"
              v-for="(item, idx) in dicttypelist"
              :key="idx"
              :data="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sequence" label="序号 :" class="is-required">
          <el-input-number placeholder="请输入序号" v-model="addForm.sequence" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
      </div>
    </el-dialog>

    <!-- Modify Dialog -->
    <el-dialog title="修改字典项" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item prop="itemname" label="字典项名称 :">
          <el-input placeholder="请输入字典项名称" v-model="editForm.itemname"></el-input>
        </el-form-item>
        <el-form-item prop="dicitem" label="字典项值 :">
          <el-input placeholder="请输入字典项值" v-model="editForm.dicitem"></el-input>
        </el-form-item>
        <el-form-item prop="itemexplain" label="字典描述 :">
          <el-input placeholder="请输入字典描述" v-model="editForm.itemexplain"></el-input>
        </el-form-item>
        <el-form-item prop="parentid" label="父字典ID :">
          <el-input type="number" placeholder="请输入父字典ID" v-model="editForm.parentid" :min="0"></el-input>
        </el-form-item>
        <el-form-item prop="dicttypeid" label="字典类型 :">
          <el-select placeholder="字典类型" v-model="editForm.dicttypeid">
            <el-option
              :label="item.dicttypename"
              :value="item.dicttypeid"
              v-for="(item, idx) in dicttypelist"
              :key="idx"
              :data="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sequence" label="序号 :" class="is-required">
          <el-input-number placeholder="请输入序号" v-model="editForm.sequence" :min="1"></el-input-number>
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
import {
  getItemList,
  insertItem,
  modifyItem,
  getTypeList,
  removeItem
} from "../../api/api";

export default {
  data() {
    return {
      sysdicItemList: [],
      filters: {
        dicItemID: "",
        dicItemName: "",
        dicTypeID: ""
      },
      sels: [],
      listLoading: false,
      dicttypelist: [],

      page_size: 10,
      total: 0,
      page: 1,
      page_total: 0,

      addFormVisible: false,
      addLoading: false,
      addForm: {
        dicitem: "",
        itemname: "",
        itemexplain: "",
        dicttypeid: "",
        parentid: "0",
        sequence: "0"
      },
      addFormRules: {
        dicitem: [
          { required: true, message: "请输入字典项值", trigger: "blur" }
        ],
        itemname: [
          { required: true, message: "请输入字典类型名称", trigger: "blur" }
        ],
        itemexplain: [
          { required: true, message: "请输入字典描述", trigger: "blur" }
        ],
        parentid: [
          { required: true, message: "请输入父字典ID", trigger: "blur" }
        ],
        dicttypeid: [
          { required: true, message: "请输入字典类型", trigger: "blur" }
        ]
      },
      editFormVisible: false,
      editLoading: false,
      editForm: {
        dictid: "",
        dicitem: "",
        itemname: "",
        itemexplain: "",
        parentid: "0",
        dicttypeid: "",
        sequence: "0",
        dictvalue: "",
        status: "",
        lang: ""
      },
      editFormRules: {
        dicitem: [
          { required: true, message: "请输入字典项值", trigger: "blur" }
        ],
        itemname: [
          { required: true, message: "请输入字典类型名称", trigger: "blur" }
        ],
        itemexplain: [
          { required: true, message: "请输入字典描述", trigger: "blur" }
        ],
        parentid: [
          { required: true, message: "请输入父字典ID", trigger: "blur" }
        ],
        dicttypeid: [
          { required: true, message: "请输入字典类型", trigger: "blur" }
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
            fieldName: "dicttypeid",
            fieldValues: [this.filters.dicTypeID],
            prepender: null,
            operator: "EQUAL",
            childConditions: null
          },
          {
            fieldName: "dictname",
            fieldValues: [this.filters.dicItemName],
            prepender: null,
            operator: "EQUAL",
            childConditions: null
          },
          {
            fieldName: "dictid",
            fieldValues: [this.filters.dicItemID],
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
      getItemList(para)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.sysdicItemList = res.data.pageInfo.list;
            this.total = res.data.pageInfo.total;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.sysdicItemList = [];
            this.total = 0;
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.sysdicItemList = [];
          this.total = 0;
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    getDictTypeList() {
      let para = {
        conditions: [
          {
            fieldName: "dicttypename",
            fieldValues: [""],
            prepender: null,
            operator: "EQUAL",
            childConditions: null
          },
          {
            fieldName: "dicttypeid",
            fieldValues: [""],
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
      getTypeList(para)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.dicttypelist = res.data.pageInfo.list;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.dicttypelist = [];
          }
        })
        .catch(() => {
          this.dicttypelist = [];
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
    editItem(index, item) {
      this.editFormVisible = true;

      this.editForm.dictid = item.dictid;
      this.editForm.itemname = item.dictname;
      this.editForm.dicitem = item.dictvalue;
      this.editForm.itemexplain = item.remark;
      this.editForm.parentid = item.parentdictid;
      this.editForm.sequence = item.sortno;
      this.editForm.dicttypeid = item.dicttypeid;
      this.editForm.dictvalue = item.dictvalue;
      this.editForm.status = item.status;
      this.editForm.lang = item.lang;
    },
    deleteItem(index, item) {
      this.$confirm("确认删除当前字典？", "提示", {
        type: "warning"
      }).then(() => {
        removeItem(item.dictid).then(res => {
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
            dictname: this.addForm.itemname,
            dictvalue: this.addForm.dicitem,
            remark: this.addForm.itemexplain,
            parentdictid: this.addForm.parentid,
            dicttypeid: this.addForm.dicttypeid,
            sortno: this.addForm.sequence
          };
          this.addLoading = true;
          insertItem(para)
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.load();
                this.addFormVisible = false;
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
          this.editLoading = true;
          let para = {
            dictid: this.editForm.dictid,
            dictvalue: this.editForm.dictvalue,
            dictname: this.editForm.itemname,
            dictvalue: this.editForm.dicitem,
            remark: this.editForm.itemexplain,
            parentdictid: this.editForm.parentid,
            dicttypeid: this.editForm.dicttypeid,
            sortno: this.editForm.sequence,
            status: this.editForm.status,
            lang: this.editForm.lang,
            iseditable: "1"
          };
          modifyItem(para)
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
    this.getDictTypeList();
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";
</style>