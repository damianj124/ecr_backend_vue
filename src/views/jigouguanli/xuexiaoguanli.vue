<template>
  <section>
    <el-col :span="24">
      <el-form :model="filters" label-width="120px">
        <el-row>
          <el-col :span="10">
            <el-col :span="12">
              <el-form-item label="学校名称：">
                <el-input v-model="filters.schoolname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学校英文缩写：">
                <el-input v-model="filters.schoolengname"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="10">
            <el-col :span="12">
              <el-form-item label="机构：">
                <el-input v-model="filters.organization"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="区域：">
                <el-input v-model="filters.area"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="地址：">
              <el-input v-model="filters.schooladdr"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="10">
            <el-col :span="12">
              <el-form-item label="创建人：">
                <el-input v-model="filters.creatorname"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="创建时间：">
              <el-col :span="24">
                <el-date-picker type="date" v-model="filters.createtime.start" placeholder></el-date-picker>-
                <el-date-picker type="date" v-model="filters.createtime.end" placeholder></el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="10">
            <el-form-item label="最后修改时间：">
              <el-col :span="24">
                <el-date-picker type="date" v-model="filters.lastmodifytime.start" placeholder></el-date-picker>-
                <el-date-picker type="date" v-model="filters.lastmodifytime.end" placeholder></el-date-picker>
                <el-button type="primary" @click="load()">查询</el-button>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-col>
    <el-col :span="24" style="text-align:right; margin-bottom: 10px;">
      <el-button type="table-op" size="small" @click="add">新增</el-button>
      <el-button type="table-op" size="small" @click="edit" :disabled="this.sels.length!==1">修改</el-button>
      <el-button type="table-op" size="small" @click="remove" :disabled="this.sels.length===0">删除</el-button>
    </el-col>
    <!--列表-->
    <el-table
      :data="schools"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="schoolid" label="学校 ID" width="150" align="center"></el-table-column>
      <el-table-column prop="schoolname" label="学校名称" width="120" align="center"></el-table-column>
      <el-table-column prop="schoolengname" label="学校英文缩写" width="150" align="center"></el-table-column>
      <el-table-column prop="classnamingrule" label="班级命名方式" width="150" align="center"></el-table-column>
      <!--<el-table-column prop="schooltag" label="学校标签" width="70" align="center">
      </el-table-column>-->
      <el-table-column prop="orgaddr" label="地址" align="center"></el-table-column>
      <!--<el-table-column prop="schoolpos" label="坐标" :formatter="formatPos" width="120" align="center">
      </el-table-column>-->
      <el-table-column prop="orgname" label="机构" width="150" align="center"></el-table-column>
      <el-table-column prop="areaname" label="区域" width="150" align="center"></el-table-column>
      <el-table-column prop="creatorname" label="创建人" width="100" align="center"></el-table-column>
      <el-table-column prop="createtime" label="创建时间" width="120" align="center"></el-table-column>
      <el-table-column prop="lastmodifytime" label="最后修改时间" width="120" align="center"></el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
      <my-pagination
        @current-change="handleCurrentChange"
        @pgSize-change="handlePageSizeChange"
        :page-size="10"
        :total="total"
      ></my-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="学校名称" prop="schoolname">
          <el-input v-model="editForm.schoolname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学校英文缩写" prop="schoolengname">
          <el-input v-model="editForm.schoolengname" auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="类型" prop="schooltype">
					<el-select v-model="editForm.schooltype">
						<el-option :value="schooltype.id" :label="schooltype.name" v-for="schooltype in schooltypes"></el-option>
					</el-select>
				</el-form-item>--?
				<el-form-item label="班级命名方式" prop="classnamingrule">
					<el-input v-model="editForm.classnamingrule" auto-complete="off"></el-input>
				</el-form-item>
				<!--<el-form-item label="学校标签" prop="schooltag">
					<el-input v-model="editForm.schooltag" auto-complete="off"></el-input>
        </el-form-item>-->
        <el-form-item label="地址" prop="orgaddr">
          <el-input v-model="editForm.orgaddr" auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="坐标"">
					<el-col :span="6">
						<el-input v-model="editForm.schoolpos_latitude" auto-complete="off"></el-input>
					</el-col>
					<el-col :span="1" style="text-align:center">,</el-col>
					<el-col :span="6">
						<el-input v-model="editForm.schoolpos_longitude" auto-complete="off"></el-input>
					</el-col>
        </el-form-item>-->
        <el-col :span="12">
          <el-form-item label="机构" prop="orgname">
            <el-input v-model="editForm.orgname" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区域" prop="areaid">
            <el-select v-model="editForm.areaid">
              <el-option :value="ea.areaid" :label="ea.areaname" v-for="ea in areas"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
        <el-form-item label="学校名称" prop="schoolname">
          <el-input v-model="addForm.schoolname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学校英文缩写" prop="schoolengname">
          <el-input v-model="addForm.schoolengname" auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="类型" prop="schooltype">
					<el-select v-model="addForm.schooltype">
						<el-option :value="schooltype.id" :label="schooltype.name" v-for="schooltype in schooltypes"></el-option>
					</el-select>
				</el-form-item>--?
				<el-form-item label="班级命名方式" prop="classnamingrule">
					<el-input v-model="addForm.classnamingrule" auto-complete="off"></el-input>
				</el-form-item>
				<!--<el-form-item label="学校标签" prop="schooltag">
					<el-input v-model="addForm.schooltag" auto-complete="off"></el-input>
        </el-form-item>-->
        <el-form-item label="地址" prop="orgaddr">
          <el-input v-model="addForm.orgaddr" auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="坐标"">
					<el-col :span="6">
						<el-input v-model="addForm.schoolpos_latitude" auto-complete="off"></el-input>
					</el-col>
					<el-col :span="1" style="text-align:center">,</el-col>
					<el-col :span="6">
						<el-input v-model="addForm.schoolpos_longitude" auto-complete="off"></el-input>
					</el-col>
        </el-form-item>-->
        <el-col :span="12">
          <el-form-item label="机构" prop="orgname">
            <el-input v-model="addForm.orgname" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区域" prop="areaid">
            <el-select v-model="addForm.areaid">
              <el-option :value="aa.areaid" :label="aa.areaname" v-for="aa in areas"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import {
  getSchoolListPage,
  batchRemoveSchool,
  editSchool,
  addSchool,
  getRegionListPage
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        schoolname: "",
        schoolengname: "",
        orgname: "",
        areaname: "",
        schooladdr: "",
        creatorname: "",
        createtime: {
          start: "",
          end: ""
        },
        lastmodifytime: {
          start: "",
          end: ""
        }
      },
      schools: [],
      areas: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        schoolname: [{ required: true, message: "学校名称", trigger: "blur" }],
        orgname: [{ required: true, message: "机构", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        schoolid: 0,
        schoolname: "",
        schoolengname: "",
        //schooltype: -1,
        classnamingrule: "",
        //schooltag: '',
        orgaddr: "",
        //schoolpos_latitude: '',
        //schoolpos_longitude: '',
        orgname: "",
        areaid: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        schoolname: [{ required: true, message: "学校名称", trigger: "blur" }],
        orgname: [{ required: true, message: "机构", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        schoolname: "",
        schoolengname: "",
        //schooltype: -1,
        classnamingrule: "",
        //schooltag: '',
        orgaddr: "",
        //schoolpos_latitude: '',
        //schoolpos_longitude: '',
        orgname: "",
        areaid: ""
      }
    };
  },
  methods: {
    //性别显示转换
    formatPos: function(row, column) {
      return row.schoolpos.latitude + "\n" + row.schoolpos.longitude;
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
    //获取用户列表
    load() {
      let para = {
        page: this.page,
        schoolname: this.filters.schoolname,
        schooladdr: this.filters.schooladdr
      };
      this.listLoading = true;
      getSchoolListPage(para).then(res => {
        this.total = res.data.total;
        this.schools = res.data.data;
        this.listLoading = false;
      });
      getRegionListPage({}).then(res => {
        this.areas = res.data.data;
      });
    },
    //显示编辑界面
    edit: function() {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, this.sels[0]);
    },
    //显示新增界面
    add: function() {
      this.addFormVisible = true;
      this.addForm = {
        schoolname: "",
        schoolengname: "",
        //schooltype: -1,
        classnamingrule: "",
        //schooltag: '',
        orgaddr: "",
        //schoolpos_latitude: '',
        //schoolpos_longitude: '',
        orgname: "",
        areaid: ""
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = Object.assign({}, this.editForm);
            editSchool(para).then(res => {
              this.editLoading = false;
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.load();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            let para = Object.assign({}, this.addForm);
            addSchool(para).then(res => {
              this.addLoading = false;
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.load();
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    remove: function() {
      var schoolids = this.sels.map(item => item.schoolid).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { schoolids: schoolids };
          batchRemoveSchool(para).then(res => {
            this.listLoading = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.load();
          });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.load();
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";
</style>