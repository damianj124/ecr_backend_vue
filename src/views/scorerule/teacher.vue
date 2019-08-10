<template>
    <section class="vscroll">
        <el-col :span="24" class="ecrm-search-title">
            <a class="selected">积分规则配置</a>
        </el-col>

        <div class="ecrw-profile-det">
            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-table-title">
                    1、上传
                </div>

                <div class="ecrw-profile-det-det">
                    <table class="ecrw-profile-det-table">
                        <tr>
                            <th>资源类型</th>
                            <th>资源格式</th>
                            <th>共享范围</th>
                            <th>单位</th>
                            <th>上传对应积分</th>
                            <th>备注</th>
                        </tr>
                        <tr v-for="(item, idx) in upload" :key="idx" :data="item">
                            <td rowspan="2" v-if="idx % 2 == 0">{{ formatContentType(item.contenttype) }}</td>
                            <td rowspan="2" v-if="idx % 2 == 0">{{ formatExtentionType(item.contenttype) }}</td>
                            <td>
                                {{ idx % 2 == 0?"本校、本区、本市、本省":"全网" }}
                            </td>
                            <td>
                                {{ item.unit }}
                            </td>
                            <td>
                                <el-input v-model="item.score" />
                            </td>
                            <td rowspan="2" v-if="idx % 2 == 0">
                                <el-input type="textarea" v-model="item.remark" />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-table-title">
                    2、征集
                </div>

                <div class="ecrw-profile-det-det">
                    <table class="ecrw-profile-det-table">
                        <tr>
                            <th>资源类型</th>
                            <th>资源格式</th>
                            <th>共享范围</th>
                            <th>单位</th>
                            <th>上传对应积分</th>
                            <th>备注</th>
                        </tr>
                        <tr v-for="(item,idx) in rule.collection" :key="idx" :data="item">
                            <td>{{ formatContentType(item.contenttype) }}</td>
                            <td>{{ formatExtentionType(item.contenttype) }}</td>
                            <td>全网</td>
                            <td>{{ item.unit }}</td>
                            <td><el-input v-model="item.score" /></td>
                            <td><el-input type="textarea" v-model="item.remark" /></td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-table-title">
                    3、悬赏
                </div>
                <ul>
                    <li class="ecrw-profile-table-list">
                        被采用的答案获得单条资源所给出的积分
                    </li>
                </ul>
            </div>
            
            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-table-title">
                    4、评星
                </div>
                <ul>
                    <li class="ecrw-profile-table-list">
                        每评星一次，积 <input v-model="rule.rating.score">分。每个用户对每个资源，只能评星一次，不能重复。
                    </li>
                </ul>
            </div>
            
            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-table-title">
                    5、点赞
                </div>
                <ul>
                    <li class="ecrw-profile-table-list">
                        每点赞一次，积 <input v-model="rule.click.score">分。每个用户对每个资源，只能点赞一次，不能重复。
                    </li>
                </ul>
            </div>
            
            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-table-title">
                        6、收藏
                </div>
                <ul>
                    <li class="ecrw-profile-table-list">
                            每收藏一次，积 <input v-model="rule.collect.score">分。重复收藏资源不重复积分。
                    </li>
                </ul>
            </div>
            
            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-table-title">
                    7、纠错
                </div>
                <ul>
                    <li class="ecrw-profile-table-list">
                        每提交一个经过平台确认的纠错，奖励 <input v-model="rule.revision.score">积分。
                    </li>
                </ul>
            </div>
            
            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-table-title">
                    8、下载
                </div>

                <div class="ecrw-profile-det-det">
                    <table class="ecrw-profile-det-table">
                        <tr>
                            <th>资源类型</th>
                            <th>资源格式</th>
                            <th>单位</th>
                            <th>下载扣除对应积分</th>
                            <th>备注</th>
                        </tr>
                        <tr v-for="(item, idx) in rule.download" :key="idx" :data="item">
                            <td>{{ formatContentType(item.contenttype) }}</td>
                            <td>{{ formatExtentionType(item.contenttype) }}</td>
                            <td>{{ item.unit }}</td>
                            <td><el-input v-model="item.score" /></td>
                            <td><el-input type="textarea" v-model="item.remark" /></td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-table-title">
                    9、提出悬赏
                </div>

                <div class="ecrw-profile-det-det">
                    <table class="ecrw-profile-det-table">
                        <tr>
                            <th>资源类型</th>
                            <th>资源格式</th>
                            <th>单位</th>
                            <th>最低分值</th>
                            <th>推荐分值</th>
                            <th>最高分值</th>
                            <th>备注</th>
                        </tr>
                        <tr v-for="(item, idx) in rule.reward" :key="idx" :data="item">
                            <td>{{ formatContentType(item.contenttype) }}</td>
                            <td>{{ formatExtentionType(item.contenttype) }}</td>
                            <td>{{ item.unit }}</td>
                            <td><el-input v-model="item.minscore" /></td>
                            <td><el-input v-model="item.score" /></td>
                            <td><el-input v-model="item.maxscore" /></td>
                            <td><el-input type="textarea" v-model="item.remark" /></td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-table-title">
                    10.用户完善个人信息，获得 <input v-model="rule.usersuccess.score">积分
                </div>
            </div>

            <div style="text-align:center">
                <el-button type="primary" size="large" style="margin-right:100px" @click="save">保存</el-button>
            </div>            
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util.js'
    import { CONTENT_TYPE, EXTENSION_TYPE } from '../../common/js/const.js';
    import { getScoreRuleList, setScoreRule } from '../../api/api'

    export default {
        data() {
            return {
                upload: [],
                rule: {
                    upload: [],
                    collection: [],
                    rating: {},
                    click: {},
                    collect: {},
                    revision: {},
                    download: [],
                    reward: [],
                    usersuccess: {}
                },
                contentTypes: CONTENT_TYPE,
                extensionTypes: EXTENSION_TYPE
            }
        },
        methods: {
            save() {
                var params = [];
                for(var i=0; i<this.upload.length; i+=2) {
                    params.push({
                        allnetscore: parseInt(this.upload[i+1].score),
                        ruleid: this.upload[i].ruleid,
                        score: parseInt(this.upload[i].score),
                        remark: this.upload[i].remark
                    });
                }

                this.rule.collection.forEach(function(rule){
                    params.push({
                        ruleid: rule.ruleid,
                        score: parseInt(rule.score),
                        remark: rule.remark
                    });
                });
                params.push({
                    ruleid: this.rule.rating.ruleid,
                    score: parseInt(this.rule.rating.score),
                    remark: this.rule.rating.remark
                });
                params.push({
                    ruleid: this.rule.click.ruleid,
                    score: parseInt(this.rule.click.score),
                    remark: this.rule.click.remark
                });
                params.push({
                    ruleid: this.rule.collect.ruleid,
                    score: parseInt(this.rule.collect.score),
                    remark: this.rule.collect.remark
                });
                params.push({
                    ruleid: this.rule.revision.ruleid,
                    score: parseInt(this.rule.revision.score),
                    remark: this.rule.revision.remark
                });                
                this.rule.download.forEach(function(rule){
                    params.push({
                        ruleid: rule.ruleid,
                        score: parseInt(rule.score),
                        remark: rule.remark
                    });
                });
                this.rule.reward.forEach(function(rule){
                    params.push({
                        ruleid: rule.ruleid,
                        score: parseInt(rule.score),
                        remark: rule.remark
                    });
                });
                params.push({
                    ruleid: this.rule.usersuccess.ruleid,
                    score: parseInt(this.rule.usersuccess.score),
                    remark: this.rule.usersuccess.remark
                });

                setScoreRule(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.$message({
                            message: '标记成功！',
                            type: 'success'
                        });

                        this.load();
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                }).catch(() => {

                }); 
            },
            formatContentType(contenttype) {
                for(var i=0; i<this.contentTypes.length; i++) {
                    if (contenttype == 'T')
                        return "文本";

                    if (this.contentTypes[i].contenttype == contenttype) {
                        return this.contentTypes[i].contentname;
                    }
                }
            },
            formatExtentionType(contenttype) {
                for(var i=0; i<this.extensionTypes.length; i++) {
                    if (contenttype == 'T')
                        return "doc, docx, pdf";

                    if (this.extensionTypes[i].contenttype == contenttype) {                            
                        var formats = this.extensionTypes[i].extensiontype[0];
                        for (var j=1; j<this.extensionTypes[i].extensiontype.length; j++) {
                            formats += ", " + this.extensionTypes[i].extensiontype[j];
                        }
                        return formats;
                    }       
                }
            },
            load() {
                this.upload = [];
                this.rule = {
                    upload: [],
                    collection: [],
                    rating: {},
                    click: {},
                    collect: {},
                    revision: {},
                    download: [],
                    reward: [],
                    usersuccess: {}
                };

                 getScoreRuleList("0").then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        var rules = res.data.pageInfo.list;

                        for (var i=0;i<rules.length;i++) {
                            switch (rules[i].bussinesstype) {
                                case '1': 
                                    this.rule.upload.push(rules[i])
                                    break
                                case '2':
                                    this.rule.collection.push(rules[i])
                                    break
                                case '3':
                                    this.rule.rating = rules[i]
                                    break
                                case '4':
                                    this.rule.click = rules[i]
                                    break
                                case '5':
                                    this.rule.collect = rules[i]
                                    break
                                case '6':
                                    this.rule.revision = rules[i]
                                    break
                                case '7':
                                    this.rule.download.push(rules[i])
                                    break
                                case '8':
                                    this.rule.reward.push(rules[i])
                                    break
                                case '9':
                                    this.rule.usersuccess = rules[i]
                                    break
                            }
                        }

                        this.loadupload();
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                });
            },
            loadupload() {
                for (var i=0; i<(this.rule.upload.length); i++) {
                    this.upload.push({
                        ruleid: this.rule.upload[i].ruleid,
                        contenttype: this.rule.upload[i].contenttype,
                        unit: this.rule.upload[i].unit,
                        score: this.rule.upload[i].score,
                        remark: this.rule.upload[i].remark
                    });

                    this.upload.push({
                        ruleid: this.rule.upload[i].ruleid,
                        contenttype: this.rule.upload[i].contenttype,
                        unit: this.rule.upload[i].unit,
                        score: this.rule.upload[i].allnetscore,
                        remark: this.rule.upload[i].remark
                    });
                }
            }          
        },   
        created() {
            this.load();
        },
        mounted() {
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

    table {
        border-collapse: collapse;
        border-spacing: 0;
        table-layout: fixed;
    }
    th {
        font-weight: normal;
        font-style: normal;
    }
    .ecrw-profile-det {
        padding: 30px;
    }
    ul {
        height: 34px;
        margin-top: 15px;
    }
    li {
        min-width: 160px;
    }
    li a {
        width: calc(100% - 30px);
        text-align: center;
    }
    input {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        color: #1f2d3d;
        font-size: inherit;
        height: 36px;
        line-height: 1;
        outline: 0;
        padding: 3px 10px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    }
    .ecrw-profile-det-table{width:100%; max-width:1200px;}
    .ecrw-profile-det-table label{margin-left:10px;}
    .ecrw-profile-det-table th{background:#fafafa;}
    .ecrw-profile-det-table th,.ecrw-profile-det-table td{line-height:40px;border:1px solid #e5e5e5;text-align:center;}
    .ecrw-profile-det-table tr:hover{background:#fafafa;}
    .ecrw-profile-table{width:100%;}
    .ecrw-profile-table-title{margin:20px 0px 10px 0px;}
</style>