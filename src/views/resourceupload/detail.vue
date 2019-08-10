<template>
    <section>
        <el-col :span="24" class="ecrm-search-title">
            <a class="selected">资源批量导入详情</a>
        </el-col>
        <el-col :span="24" class="ecrm-content-panel" style="max-width:1080px;min-height:300px" v-loading="editLoading">
            <el-form ref="resourceForm" :model="resourceInfo" :rules="formRules" label-width="120px" v-if="resourceInfo != null">
                <div style="background: #ededed; padding: 5px 20px; width: 60px;">
                    <span>
                        资源ID
                    </span>
                </div>
                <div style="padding: 15px 30px; border-bottom: 1px dashed #e8e8e8;">
                    <el-row>
                        <el-col :span="9">
                            {{ resourceInfo.contentid }}&nbsp;
                        </el-col>
                        <el-col :span="3">
                            浏览: <span class="value">{{ resourceInfo.viewtimes }}</span> 次
                        </el-col>
                        <el-col :span="3">
                            点赞: <span class="value">{{ resourceInfo.clicktimes }}</span> 次
                        </el-col>
                        <el-col :span="3">
                            收藏: <span class="value">{{ resourceInfo.collectiontimes }}</span> 次
                        </el-col>
                        <el-col :span="3">
                            下载: <span class="value">{{ resourceInfo.downtimes }}</span> 次
                        </el-col>
                    </el-row>
                </div>
                <div style="background: #ededed; padding: 5px 20px; width: 60px; margin-top: 15px">
                    <span>
                        基本信息
                    </span>
                </div>
                <div style="padding: 20px 0px;">
                    <el-row>
                        <el-col :span="21">
                            <el-form-item label="标题:" prop="name">
                                <el-input type="text" v-model="resourceInfo.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="resourceInfo.remarks.filepath==''">
                        <el-col :span="14">
                            <el-form-item label="资源文件:">
                                <span v-if="resourceInfo.fileInfo!=null">{{resourceInfo.fileInfo.filename}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="文件大小:">
                                <span v-if="resourceInfo.fileInfo!=null">{{ ECRUtil.getFileSize(resourceInfo.fileInfo.size, 2) }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="resourceInfo.remarks.filepath!=''">
                        <el-col :span="21">
                            <el-form-item label="资源变更:" prop="filepath">
                                <el-input type="text" v-model="resourceInfo.filepath" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="状态:">
                                <el-select v-model="resourceInfo.importstatus">
                                    <el-option value="0" label="未导入"></el-option>
                                    <el-option value="1" label="已导入"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="导入时间:">
                                <el-date-picker type="date" v-model="resourceInfo.createtime"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="资源类型:" prop="contenttype">
                                <el-select v-model="resourceInfo.contenttype">
                                    <el-option :label="item.contentname" :value="item.contenttype" v-for="(item, idx) in contentTypes" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!--<el-col :span="7">
                            <el-form-item label="媒体格式:">
                                <el-select>
                                    <el-option value="0" label="未生成"></el-option>
                                    <el-option value="3" label="已生成"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>-->
                        <el-col :span="7">
                            <el-form-item label="共享范围:" prop="sharerange">
                                <el-select v-model="resourceInfo.sharerange">
                                    <el-option :label="item.label" :value="item.value" v-for="(item, idx) in shareRanges" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="21">
                            <el-form-item label="资源描述:" prop="description">
                                <el-input type="textarea" :rows.native="5" v-model="resourceInfo.description" auto-complete="off" maxlength.native="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="21">
                            <el-form-item label="作者:">
                                <el-input type="text" v-model="resourceInfo.creatorname"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="学段:" prop="schoolsectionid">
                                <el-select v-model="resourceInfo.schoolsectionid" @change="onChangeSchoolSection(resourceInfo.schoolsectionid)">
                                    <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in schoolSections" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="学科:" prop="subjectid">
                                <el-select v-model="resourceInfo.subjectid" @change="onChangeSubject(resourceInfo.subjectid)">
                                    <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in subjects" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="适用年级:" prop="gradeid">
                                <el-select v-model="resourceInfo.gradeid" @change="onChangeNaviDetail">
                                    <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in grades" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="教材版本:">
                                <el-select v-model="resourceInfo.editiontypeid" @change="onChangeEditionType(resourceInfo.editiontypeid)">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in editionTypes" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="册别:">
                                <el-select v-model="resourceInfo.bookmodelid" @change="onChangeNaviDetail">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option :label="item.dictname" :value="item.dictvalue" v-for="(item, idx) in bookModels" :key="idx" :data="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item prop="catalogids" :label="idx==0?'教材章节:':''" v-for="(catalogid, idx) in resourceInfo.catalogids" :key="idx" :data="catalogid">
                                <el-col :span="18">
                                    <ecr-tree-input @click.native="getChapter(idx)" placeholder="请选择所属章节" :models="resourceInfo.chapterPath[idx]"></ecr-tree-input>
                                </el-col>
                                <el-col :span="4" style="padding-left: 15px;">
                                    <el-button type="primary" @click="addChapterForm" v-if="idx==0"><b>+</b></el-button>
                                    <el-button type="primary"  @click="delChapterForm()" v-if="idx==0"><b>-</b></el-button>
                                </el-col>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="21">
                            <el-form-item label="关联知识点:">
                                <el-input type="text" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="21">
                            <el-form-item label="资源呈现路径:">
                                <el-input type="text" auto-complete="off" v-model="resourceInfo.fileInfo.localpath"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="资源标签:">
                                <el-select v-model="resourceInfo.onelabelid" @change="onOneLabelChange()">
                                    <el-option :label="item.labelname" :value="item.labelid" v-for="(item, idx) in oneLabels" :key="idx" :data="item"></el-option>
                                    <a href="javascript:;" v-if="((oneLabels.length != 0) && (one_label_page < one_label_total_page))" @click="setLabelInc('1')" class="ecrm-tabl-level-ico ecrm-dialog-icon-down"></a>
                                    <a href="javascript:;" v-if="((oneLabels.length != 0) && (1 < one_label_page))" class="ecrm-tabl-level-ico ecrm-dialog-icon-up" @click="setLabelDec('1')"> </a>
                                </el-select>
                                <el-select v-model="resourceInfo.twolabelid" @change="onTwoLabelChange()">
                                    <el-option :label="item.labelname" :value="item.labelid" v-for="(item, idx) in twoLabels" :key="idx" :data="item"></el-option>
                                    <a href="javascript:;" v-if="((twoLabels.length != 0) && (two_label_page < two_label_total_page))" @click="setLabelInc('2')" class="ecrm-tabl-level-ico ecrm-dialog-icon-down"></a>
                                    <a href="javascript:;" v-if="((twoLabels.length != 0) && (1 < two_label_page))" class="ecrm-tabl-level-ico ecrm-dialog-icon-up" @click="setLabelDec('2')"> </a>
                                </el-select>
                                <el-select v-model="resourceInfo.threelabelid">
                                    <el-option :label="item.labelname" :value="item.labelid" v-for="(item, idx) in threeLabels" :key="idx" :data="item"></el-option>
                                    <a href="javascript:;" v-if="((threeLabels.length != 0) && (three_label_page < three_label_total_page))" @click="setLabelInc('3')" class="ecrm-tabl-level-ico ecrm-dialog-icon-down"></a>
                                    <a href="javascript:;" v-if="((threeLabels.length != 0) && (1 < three_label_page))" class="ecrm-tabl-level-ico ecrm-dialog-icon-up" @click="setLabelDec('3')"> </a>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div style="padding: 20px 0px 50px 0px; border-bottom: 1px dashed #e8e8e8; text-align: center">
                    <el-button type="primary" @click="editSubmit" :loading="addLoading">提交</el-button>
                    <el-button @click="goBack">取消</el-button>
                </div>
            </el-form>
        </el-col>

        <!-- Catalog Tree Dialog -->

        <el-dialog title="所属章节选项" v-model="includedChapterVisible" :close-on-click-modal="false">
            <el-tree
                style="width: 100%"
                :data="treeData"
                :default-expand-all="true"
                :expand-on-click-node="false"
                :show-checkbox="false"
                :accordion="false"
                :highlight-current="true"
                @node-click="nodeClicked"
                class="tree-dialog">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="addCatalog" :disabled="selectedRootBool">确定</el-button>
                <el-button @click.native="includedChapterVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <!-- Catalog Tree Dialog End -->

    </section>
</template>
<script>
    import ECRUtil from '../../common/js/util'
    import { CONTENT_TYPE, SHARE_RANGE, BOOK_MODEL } from '../../common/js/const.js';
    import { getSchoolSectionList, getNaviGradeList, getSubjectList, getNaviEditionTypeList, getNaviBookModelList, detailResource , getTeachCatalogList, getOneLabelList, getTwoLabelList, getThreeLabelList, editResource } from '../../api/api';

    export default {
        data() {
            return {
                ////////// Filter Data /////////////
                schoolSections: [],
                subjects: [],
                grades: [],
                editionTypes: [],
                bookModels: [],
                contentTypes: [],
                shareRanges: SHARE_RANGE,
                oneLabels: [],
                twoLabels: [],
                threeLabels: [],
                /////////// Filter Data End //////////

                formRules: {
                    name: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ],
                    contenttype: [
                        { required: true, message: '请输入资源类型', trigger: 'blur' }
                    ],
                    sharerange: [
                        { required: true, message: '请输入共享范围', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请输入资源描述', trigger: 'blur' }
                    ],
                    schoolsectionid: [
                        { required: true, message: '请输入学段', trigger: 'blur' }
                    ],
                    subjectid: [
                        { required: true, message: '请输入学科', trigger: 'blur' }
                    ],
                    gradeid: [
                        { required: true, message: '请输入适用年级', trigger: 'blur' }
                    ]
                },

                ECRUtil: ECRUtil,
                resourceInfo: null,
                addLoading: false,
                editLoading: false,

                /////////// 驳回 Reason Form //////////
                currentIndex: -1,
                currentResource: null,
                disallowFormVisible: false,
                disallowForm: {
                    reason: ''
                },
                
                resourceIds: '',
                /////////// 驳回 Reason Form End //////

                ////// tree //////////
                includedChapterVisible: false,
                selectedRootBool: true,
                treeData:[],
                chapterThread: [],
                clickedCptId:-1,
                curChapterIndex: 0,
                changedFileName: '',

                selectedSchoolSection:'',
                selectedSubject:'',
                selectedBookModel:'',
                selectedEditionType:'',
                /////////// Label Pagination //////////
                one_label_page: 1,
                one_label_total_page: 0,
                two_label_page: 1,
                two_label_total_page: 0,
                three_label_page: 1,
                three_label_total_page: 0,
                label_page_size: 10,
                /////////// Label Pagination End //////////
            }
        },
        methods: {
            validateChapterProperty(rule, value, callback) {
                for (var i=0; i<this.resourceInfo.catalogids.length; i++) {
                    if (this.resourceInfo.catalogids[i] != '') {
                        callback();
                        return;
                    }
                }
                callback(new Error('请输入教材章节'));
            },
            getSchoolSection() {
                getSchoolSectionList({}).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.schoolSections = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.schoolSections = [];
                    }
                });
            },
            getSubjectOfSchoolSection(section) {
                let param = {
                    schoolsectionid:section
                };
                getSubjectList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.subjects = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.subjects = [];
                    }
                });
            },
            getGradeOfSchoolSection(section) {
                let param = {
                    schoolsectionid:section
                };
                getNaviGradeList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.grades = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.grades = [];
                    }
                });
            },
            getEditionTypeOfOptions(section, subject) {
                let param = {
                    schoolsectionid:section,
                    subjectid:subject
                };
                getNaviEditionTypeList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.editionTypes = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.editionTypes = [];
                    }
                });
            },
            getBookModelOfOptions(section, subject, editiontype) {
                let param = {
                    schoolsectionid:section,
                    subjectid:subject,
                    editiontypeid:editiontype
                };
                getNaviBookModelList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.bookModels = ECRUtil.composeSysDict(res.data.pageInfo.list);
                    } else {
                        this.bookModels = [];
                    }
                });
            },
            setLabelInc(index) {
                if(index == '1') {
                    this.one_label_page ++;    
                    this.getOneLabelList();
                } else if (index == '2') {
                    this.two_label_page ++;
                    this.getTwoLabelList(this.resourceInfo.onelabelid);
                } else if (index == '3') {
                    this.three_label_page ++;
                    this.getThreeLabelList(this.resourceInfo.onelabelid, this.resourceInfo.twolabelid);
                }
            },
            setLabelDec(index) {
                if(index == '1') {
                    this.one_label_page --;    
                    this.getOneLabelList();
                } else if (index == '2') {
                    this.two_label_page --;
                    this.getTwoLabelList(this.resourceInfo.onelabelid);
                } else if (index == '3') {
                    this.three_label_page --;
                    this.getThreeLabelList(this.resourceInfo.onelabelid, this.resourceInfo.twolabelid);
                }
            },
            getOneLabelList() {
                let param = { pageNo:this.one_label_page, numPerPage:this.label_page_size };
                getOneLabelList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.oneLabels = res.data.pageInfo.list;
                        this.one_label_total_page = Math.ceil(res.data.pageInfo.total / this.label_page_size);
                    } else {
                        this.oneLabels = [];
                        this.one_label_total_page = 0;
                    }
                });
            },
            getTwoLabelList(onelabel) {
                let param = {parentlabelid: onelabel, pageNo: this.two_label_page, numPerPage: this.label_page_size};
                getTwoLabelList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.twoLabels = res.data.pageInfo.list;
                        this.two_label_total_page = Math.ceil(res.data.pageInfo.total / this.label_page_size);
                    } else {
                        this.two_label_total_page = 0;
                        this.twoLabels = [];
                    }
                });
            },
            getThreeLabelList(onelabel, twolabel) {
                let param = {onelabelid: onelabel, twolabelid: twolabel, pageNo: this.three_label_page, numPerPage: this.label_page_size};
                getThreeLabelList(param).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.threeLabels = res.data.pageInfo.list;
                        this.three_label_total_page = Math.ceil(res.data.pageInfo.total / this.label_page_size);
                    } else {
                        this.three_label_total_page = 0;
                        this.threeLabels = [];
                    }
                });
            },
            onChangeSchoolSection(section) {
                this.selectedSchoolSection = section;
                this.resourceInfo.subjectid = '';
                this.resourceInfo.gradeid = '';
                this.resourceInfo.editiontypeid = '';
                this.resourceInfo.bookmodelid = '';

                this.getSubjectOfSchoolSection(this.selectedSchoolSection);
                this.getGradeOfSchoolSection(this.selectedSchoolSection);
                this.onChangeNaviDetail();
            },
            onChangeSubject(subject){
                this.selectedSubject = subject;
                this.resourceInfo.editiontypeid = '';
                this.resourceInfo.bookmodelid = '';

                this.getEditionTypeOfOptions(this.selectedSchoolSection, this.selectedSubject);
                this.onChangeNaviDetail();
            },
            onChangeEditionType(editiontype) {
                this.selectedEditionType = editiontype;
                this.resourceInfo.bookmodelid = '';
                
                this.getBookModelOfOptions(this.selectedSchoolSection, this.selectedSubject, this.selectedEditionType);
                this.onChangeNaviDetail();
            },
            onChangeNaviDetail() {
                for (var i=0; i<this.resourceInfo.catalogids.length; i++) {
                    if (this.resourceInfo.chapterPath[i].length == 0) continue;
                    if ((this.resourceInfo.schoolsectionid != '' && this.resourceInfo.schoolsectionid != this.resourceInfo.chapterPath[i][0].dictvalue) || 
                        (this.resourceInfo.subjectid != '' && this.resourceInfo.subjectid != this.resourceInfo.chapterPath[i][1].dictvalue) || 
                        (this.resourceInfo.gradeid != '' && this.resourceInfo.gradeid != this.resourceInfo.chapterPath[i][2].dictvalue) ||
                        (this.resourceInfo.editiontypeid != '' && this.resourceInfo.editiontypeid != this.resourceInfo.chapterPath[i][3].dictvalue) || 
                        (this.resourceInfo.bookmodelid != '' && this.resourceInfo.bookmodelid != this.resourceInfo.chapterPath[i][4].dictvalue)) {

                        this.resourceInfo.catalogids.splice(i, 1);
                        this.resourceInfo.chapterPath.splice(i, 1);

                        if (this.resourceInfo.catalogids == null || this.resourceInfo.catalogids.length == 0) {
                            this.resourceInfo.catalogids = [''];
                            this.resourceInfo.chapterPath.push([]);
                        }
                        if (this.resourceInfo.subnaviInfos == null) {
                            this.resourceInfo.subnaviInfos = [];
                        }
                        this.onChangeNaviDetail();
                    }

                }
            },
            onOneLabelChange() {
                this.resourceInfo.twolabelid = '';
                this.getTwoLabelList(this.resourceInfo.onelabelid);
            },
            onTwoLabelChange() {
                this.resourceInfo.threelabelid = '';
                this.getThreeLabelList(this.resourceInfo.onelabelid, this.resourceInfo.twolabelid);
            },
            load() {
                let resourceId = this.$route.params.id;
                this.editLoading = true;
                detailResource(resourceId).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.resourceInfo = res.data.responseEntity;
                        if (this.resourceInfo.remarks != '')
                            this.resourceInfo.remarks = JSON.parse(this.resourceInfo.remarks);

                        if (this.resourceInfo.catalogids == null || this.resourceInfo.catalogids.length == 0) {
                            this.resourceInfo.catalogids = [''];
                        }
                        if (this.resourceInfo.subnaviInfos == null) {
                            this.resourceInfo.subnaviInfos = [];
                        }

                        this.resourceInfo.chapterPath = [];
                        for (var i = 0; i < this.resourceInfo.catalogids.length; i++) {
                            if (this.resourceInfo.subnaviInfos.length - 1 < i) {
                                this.resourceInfo.chapterPath.push([]);
                                continue;
                            }
                            this.resourceInfo.chapterPath.push([
                                { label: this.resourceInfo.subnaviInfos[i].schoolsection, dictvalue: this.resourceInfo.subnaviInfos[i].schoolsectionid },
                                { label: this.resourceInfo.subnaviInfos[i].subject, dictvalue: this.resourceInfo.subnaviInfos[i].subjectid },
                                { label: this.resourceInfo.subnaviInfos[i].grade, dictvalue: this.resourceInfo.subnaviInfos[i].gradeid },
                                { label: this.resourceInfo.subnaviInfos[i].editiontype, dictvalue: this.resourceInfo.subnaviInfos[i].editiontypeid },
                                { label: this.resourceInfo.subnaviInfos[i].bookmodel, dictvalue: this.resourceInfo.subnaviInfos[i].bookmodelid },
                                { label: this.resourceInfo.subnaviInfos[i].bookname, dictvalue: this.resourceInfo.subnaviInfos[i].bookid },
                                { label: this.resourceInfo.subnaviInfos[i].chapter },
                                { label: this.resourceInfo.subnaviInfos[i].section },
                                { label: this.resourceInfo.subnaviInfos[i].lesson }
                                
                            ]);
                        }

                        if (this.resourceInfo.fileInfo == null) {
                            this.contentTypes = CONTENT_TYPE;
                        } else {
                            this.contentTypes = ECRUtil.getContentTypesOfExt(this.resourceInfo.fileInfo.format);
                        }

                        if (this.resourceInfo.fileInfo == null) {
                            this.resourceInfo.fileInfo = {
                                name:'',
                                size:0
                            };
                        }
                                                
                        this.selectedSchoolSection = this.resourceInfo.schoolsectionid;
                        this.selectedSubject = this.resourceInfo.subjectid;
                        this.selectedEditionType = this.resourceInfo.editiontypeid;
                        this.selectedBookModel = this.resourceInfo.bookmodelid;
                        
                        this.getGradeOfSchoolSection(this.resourceInfo.schoolsectionid);
                        this.getSubjectOfSchoolSection(this.resourceInfo.schoolsectionid);
                        this.getEditionTypeOfOptions(this.resourceInfo.schoolsectionid, this.resourceInfo.subjectid);
                        this.getBookModelOfOptions(this.resourceInfo.schoolsectionid, this.resourceInfo.subjectid, this.resourceInfo.editiontypeid);

                        this.getOneLabelList();
                        this.getTwoLabelList(this.resourceInfo.onelabelid);
                        this.getThreeLabelList(this.resourceInfo.onelabelid, this.resourceInfo.twolabelid);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                    this.editLoading = false;
                }).catch((res) => {
                    this.editLoading = false;

                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            editSubmit() {
                this.$refs.resourceForm.validate((valid) => {
                    if (valid) {
                        let params = {
                            contentid: this.resourceInfo.contentid,
                            name: this.resourceInfo.name,
                            fileInfo: this.resourceInfo.fileInfo,
                            contenttype: this.resourceInfo.contenttype,
                            sharerange: this.resourceInfo.sharerange,
                            description: this.resourceInfo.description,
                            schoolsectionid: this.resourceInfo.schoolsectionid,
                            subjectid: this.resourceInfo.subjectid,
                            editiontypeid: this.resourceInfo.editiontypeid,
                            bookmodelid: this.resourceInfo.bookmodelid,
                            gradeid: this.resourceInfo.gradeid,
                            catalogids: this.resourceInfo.catalogids,
                            onelabelid: this.resourceInfo.onelabelid,
                            twolabelid: this.resourceInfo.twolabelid,
                            threelabelid: this.resourceInfo.threelabelid,
                            importstatus: this.resourceInfo.importstatus,
                            createtime: ECRUtil.formatDate.format(new Date(this.resourceInfo.createtime), 'yyyy-MM-dd hh:mm:ss'),
                            localpath: this.resourceInfo.fileInfo.localpath,
                            filepath: this.resourceInfo.filepath
                        };
                        this.addLoading = true;
                        editResource(params).then((res) => {
                            if (res.data.serverResult.resultCode == "200") {
                                this.$router.push('/import');
                            } else {
                                this.$message({
                                    message: res.data.serverResult.resultMessage,
                                    type: 'error'
                                });
                            }
                            this.addLoading = false;
                        }).catch(() => {
                            this.addLoading = false;

                            this.$message({
                                message: '操作失败',
                                type: 'error'
                            });
                        });
                    }
                });
            },
            goBack() {
                this.$router.push('/import');
            },
            getChapter: function(idx) {
                this.includedChapterVisible = true;
                this.curChapterIndex = idx;
                let para = {
                    lang:'zh_CN',
                    schoolsectionid:this.resourceInfo.schoolsectionid,
                    subjectid:this.resourceInfo.subjectid,
                    gradeid:this.resourceInfo.gradeid,
                    editiontypeid: this.resourceInfo.editiontypeid,
                    bookmodelid: this.resourceInfo.bookmodelid
                };
                this.treeData = [];
                getTeachCatalogList(para).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.treeData = res.data.pageInfo.list;
                    } else {
                        this.treeData = [];
                    }
                });
            },
            addCatalog: function() {
                for (var i=0; i<this.resourceInfo.catalogids.length; i++) {
                    if (this.resourceInfo.catalogids[i] == this.clickedCptId) {
                        this.$message({
                            message: '章节重复',
                            type: 'error'
                        });
                        return;
                    }
                }
                this.resourceInfo.chapterPath[this.curChapterIndex] = this.chapterThread;
                this.resourceInfo.catalogids[this.curChapterIndex] = this.clickedCptId;

                if (this.chapterThread.length > 0) {
                    this.resourceInfo.schoolsection = this.chapterThread[0].label;
                    this.resourceInfo.schoolsectionid = this.chapterThread[0].dictvalue;
                }
                if (this.chapterThread.length > 1) {
                    this.resourceInfo.subject = this.chapterThread[1].label;
                    this.resourceInfo.subjectid = this.chapterThread[1].dictvalue;
                }
                if (this.chapterThread.length > 2) {
                    this.resourceInfo.grade = this.chapterThread[2].label;
                    this.resourceInfo.gradeid = this.chapterThread[2].dictvalue;
                }
                if (this.chapterThread.length > 3) {
                    this.resourceInfo.editiontype = this.chapterThread[3].label;
                    this.resourceInfo.editiontypeid = this.chapterThread[3].dictvalue;
                    this.onChangeEditionType(this.resourceInfo.editiontypeid);
                }
                if (this.chapterThread.length > 4) {
                    let _this = this;
                    this.$nextTick(function() {
                        _this.resourceInfo.bookmodel = _this.chapterThread[4].label;
                        _this.resourceInfo.bookmodelid = _this.chapterThread[4].dictvalue;
                    });
                }

                this.includedChapterVisible = false; 
            },
            nodeClicked:function(nodeData, node, obj) {
                this.chapterThread = this.getThread(node, []).reverse();
                if (nodeData.children.length == 0 && this.chapterThread.length > 6) {
                    this.selectedRootBool = false;
                    this.clickedCptId = nodeData.catalogids[0];
                } else {
                    this.selectedRootBool = true;
                }
            },
            getThread: function(node, thread) {
                if (node.parent != null) {
                    thread.push({ label: node.label, dictvalue: node.data.id });
                    thread = this.getThread(node.parent, thread);
                }
                return thread;
            },
            addChapterForm: function() {
                this.resourceInfo.catalogids.push("");
                this.resourceInfo.chapterPath.push([]);
            },
            delChapterForm: function() {
                var number = this.resourceInfo.catalogids.length - 1;
                if(number >= 1) {
                    this.resourceInfo.catalogids.splice(number , 1);
                    this.resourceInfo.chapterPath.splice(number , 1);
                }
            }
        },
        created() {
            this.load();
            this.getSchoolSection();
        }
    }

</script>
<style lang="scss" scoped>
    @import '~scss_vars';
    
    span.value {
        color: red;
    }
    .ecrm-tabl-level-ico{
      width:22px;
      height:22px;
      display:inline-block;
      margin-left:8px;
      vertical-align:middle;
      zoom: 1;
      margin-top: 6px;
    }
    .ecrm-dialog-icon-up{background:url('../../../static/img/ecrw-icon-up.png') no-repeat;}
    .ecrm-dialog-icon-down{background:url('../../../static/img/ecrw-icon-down.png') no-repeat;}
    .ecrm-dialog-icon-up:hover{background:url('../../../static/img/ecrw-icon-up-sel.png') no-repeat;}
    .ecrm-dialog-icon-down:hover{background:url('../../../static/img/ecrw-icon-down-sel.png') no-repeat;}
</style>