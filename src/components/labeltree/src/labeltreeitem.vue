<template>
  <li :class="[isFolder?'ecrw-ready-left-li':'ecrw-ready-left-li-last', selected?'ecrw-ready-left-li-selected':'']">
    <span class="item-content">
        <span class="toggle" :class="{'ecrw-ready-left-list-toggle': isFolder&&!isOpen}" v-show="isFolder" @click.stop="toggle()"></span>
        <a class="title" href="javascript:;" :class="{ 'highlight':highlight , 'bigtype':model.parent==null }" @dblclick.stop="dblclick()" @click.stop="click()">{{ model.label }}</a>
        <span class="ecrm-tab-level-col" v-if="tools.length>0 && level>=toolMinLevel">
            <a href="javascript:;" class="ecrm-tabl-level-ico" v-if="level>=tool.level" :class="tool.class" v-for="(tool,idx) in tools" :key="idx" :data="tool" @click="operate(idx)"></a>
        </span>
        <a href="javascript:;" v-if="(model.children.length==this.pageSize)&&(typeof model.children[0].labelData !== 'undefined')&&(count[model.children[0].labelData.parentlabelid] != pageCount[model.children[0].labelData.parentlabelid])" @click="setInc(model.children[0].labelData.parentlabelid)" class="ecrm-tabl-level-ico ecrm-dialog-icon-down"></a>
        <a href="javascript:;" v-if="showBeforeBu == true && (typeof model.children[0].labelData !== 'undefined')" class="ecrm-tabl-level-ico ecrm-dialog-icon-up" @click="setDec(model.children[0].labelData.parentlabelid)"></a>
    </span>
        <ul v-show="isOpen" v-if="model.children!=null && model.children.length>0">
            <label-treeitem
                v-for="(item, idx) in model.children"
                :key="idx"
                :data="item"
                :parent="model"
                :selectable="selectable"
                :model="item"
                :tools="tools"
                :tool-min-level="toolMinLevel"
                :level="level+1"
                :openlevel="openlevel"
                :openstep="openstep"
                :highlight="highlight"
                ref="treeitem"
                @item-click="onItemClick"
                @item-dblclick="onItemDblClick"
                @item-select="onItemSelected"
                @item-deselect="onItemDeselected"
                @item-operate="onItemOperate"
                @remove-node="onRemoveRequest">
            </label-treeitem>
        </ul>
    </li>
</template>

<script>
    import ECRUtil from '../../../common/js/util';
    import { getLabelList } from '../../../api/api';
    export default {
    props: {
        model: {
            type: Object,
            default: null,
            required: false
        },
        selectable: {
            type: Boolean,
            default: true,
            required: false
        },
        openlevel: {
            type: Number,
            default: 0,
            required: false
        },
        openstep: {
            type: Number,
            default: 2,
            required: false
        },
        parent: {
            type: Object,
            default: null,
            required: false
        },
        open: {
            type: Boolean,
            default: true,
            required: false
        },
        level: {
            type: Number,
            default: 0,
            required: false
        },
        tools: {
            type: Array,
            required: true
        },
        toolMinLevel: {
            type: Number,
            default: 0,
            required: false
        },
        highlight: {
            type: Boolean,
            default: false,
            required: false
        }
    },

    data: function () {
        this.model.parent = this.parent;
        return {
            isOpen: this.level < this.openlevel,
            selected: false,
            LabelDataList: [],
            pageSize: 10,
            pageCount: [],
            total: 0,
            pageinfo: [],
            count: [],
            showBeforeBu: false
        }
    },
    watch: {
        model: function(val, oldval) {
            this.collapse();
            this.model.parent = this.parent;
        },
    },
    computed: {
        isFolder: function () {
            return this.model.labelData != null && this.model.labelData.childcount > 0;
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        setInc(parentid) {
            this.count[parentid] ++;
            this.toggleHandle(this.count[parentid], parentid);
            if (this.count[parentid] > 1)
                this.showBeforeBu = true;
        },
        setDec(parentid) {
            this.count[parentid] --;
            this.toggleHandle(this.count[parentid], parentid);
            if (this.count[parentid] == 1)
                this.showBeforeBu = false;
        },
        toggle: function() {
            let para1 = {
                pagination:{
                    numPerPage:this.pageSize,
                },
                conditions:[
                    {
                        fieldName: "parentlabelid",
                        fieldValues: [this.model.labelData.labelid],
                        prepender: null,
                        operator: "EQUAL",
                        childConditions: null,
                    },
                ]
            };
            getLabelList(para1).then((res) => {
                if (res.data.serverResult.resultCode == "200") {
                    this.pageinfo = res.data.pageInfo;
                    this.LabelDataList = res.data.pageInfo.list;
                    this.total = res.data.pageInfo.total;
                    this.model.children = this.LabelDataList;
                    this.pageCount[this.model.children[0].labelData.parentlabelid] = Math.ceil(this.total/this.pageSize);
                    this.count[this.model.children[0].labelData.parentlabelid] = 1;
                    this.doToggle();
                } else {
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                    this.LabelDataList = [];
                }
            });
        },
        toggleHandle: function(pageNo, parentid) {
            let para1 = {
                pagination:{
                    numPerPage:this.pageSize,
                    pageNo:pageNo,
                },
                conditions:[
                    {
                        fieldName: "parentlabelid",
                        fieldValues: [parentid],
                        prepender: null,
                        operator: "EQUAL",
                        childConditions: null,
                    },
                ]
            };
            getLabelList(para1).then((res) => {
                if (res.data.serverResult.resultCode == "200") {
                    this.pageinfo = res.data.pageInfo;
                    this.LabelDataList = res.data.pageInfo.list;
                    this.total = res.data.pageInfo.total;
                    this.model.children = this.LabelDataList;
                } else {
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                    this.LabelDataList = [];
                }
            });
        },
        doToggle() {
            this.isOpen = !this.isOpen;
            if (this.$refs.treeitem && !this.isOpen) {
                    this.$refs.treeitem.forEach(function(treeitem) {
                    treeitem.collapse();
                });
            } else {
                var _this = this;
                if(this.$refs && this.$refs.treeitem){
                    this.$refs.treeitem.forEach(function(treeitem) {
                        treeitem.incollapse(_this.level + _this.openstep);
                    });
                }
            }
        },
        collapse() {
            this.isOpen = false;
            if (this.$refs.treeitem) {
                this.$refs.treeitem.forEach(function(treeitem) {
                    treeitem.collapse();
                });
            }
        },
        incollapse(level) {
            if (this.level < level) {
                this.isOpen = true;
            }
            if (this.$refs.treeitem) {
                var _this = this;
                this.$refs.treeitem.forEach(function(treeitem) {
                    treeitem.incollapse(_this.level + _this.openstep);
                });
            }
        },
        remove: function() {
            for (var i=0; i<this.parent.children.length; i++) {
                if (this.parent.children[i] == this.model) {
                    this.parent.children.splice(i, 1);
                }       
            }
        },
        click: function () {
            this.$emit('item-click', this, this.model);
            this.doClick();
        },
        doClick: function() {
            this.selected = !this.selected;
            if (this.selected)
                this.$emit('item-select', this, this.model);
            else
                this.$emit('item-deselect', this, this.model);
        },
        dblclick: function() {
            this.$emit('item-dblclick', this, this.model);
        },
        operate: function(opIdx) {
            this.$emit('item-operate', this, this.level, this.parent, this.model, opIdx);
        },
        ///////////// EVENT HANDLER /////////////////
        onItemClick(target, model) {
            this.$emit('item-click', target, model);
        },
        onItemDblClick(target, model) {
            this.$emit('item-dblclick', target, model);
        },
        onItemSelected: function(target, model) {
            this.$emit('item-select', target, model);
        },
        onItemDeselected: function(target, model) {
            this.$emit('item-deselect', target, model);
        },
        onItemOperate(target, level, parent, model, opIdx) {
            this.$emit('item-operate', target, level, parent, model, opIdx);
        },
        onRemoveRequest(model) {
            for (var i=0; i<this.model.children.length; i++) {
                if (this.model.children[i] == model) {
                    this.model.children.splice(i, 1);
                    return;
                }
            }
            this.$emit('remove-node', model);
        },
    }
}
</script>
<style scoped>
    ul, li {
        padding: 0;
        margin: 0;
    }
    ul, ol {
        list-style: none;
        clear: both;
    }
    .ecrw-ready-left-list{height:560px;overflow:auto;overflow-x:hidden;}
    .ecrm-ready-left-title{height:40px;line-height:40px;text-align:center;font-size:16px;color:#fff;background:#0bc2b6;margin-top:10px;}
    .ecrw-ready-left-list li {
        padding-left: 15px;
        clear: both;
    }
    .ecrw-ready-left-list span.ecrw-ready-left-list-toggle {
        background: url('../../../../static/img/ecrm-icon-open-close.png') no-repeat left center !important;
    }
    .ecrw-ready-left-list span.toggle {
        display: inline-block;
        background: url('../../../../static/img/ecrm-icon-open-open.png') no-repeat left center;
        width: 12px;
        height: 12px;
        cursor: pointer;
        float: left;
        margin-top: 10px;
    }
    .ecrw-ready-left-li-selected > .item-content a {
        font-weight: bold;
        color: #01b4a8;
    }
    .ecrw-ready-left-list a.title {
        padding-left: 8px;
        display: inline-block;
        line-height: 34px;
    }
    .ecrw-ready-left-list a.title:hover {
        font-weight: bold;
        color: #01b4a8;
    }
    a, a:link, a:visited, a:hover, a:active {
        text-decoration: none;
        float: left;
    }
    a {
        color: #333;
    }
    .item-content {
      width: 100%;
      display: inline-block;
    }
    .item-content:hover span.ecrm-tab-level-col {
      display: inline-block;
    }
    .ecrm-tab-level-col { 
      float:left;
      display: none;
      line-height: 34px;
      height: 34px;
      padding-left: 10px;
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
    .ecrm-tabl-level-edit{background:url('../../../../static/img/ecrm-tag-edit.png') no-repeat;}
    .ecrm-tabl-level-add{background:url('../../../../static/img/ecrm-tag-add.png') no-repeat;}
    .ecrm-tabl-level-sub{background:url('../../../../static/img/ecrm-tag-sub.png') no-repeat;}
    .ecrm-tabl-level-refresh{background:url('../../../../static/img/ecrm-tag-refresh.png') no-repeat;}
    .ecrm-tabl-level-move{background:url('../../../../static/img/ecrm-tag-move.png') no-repeat;}
    .ecrm-tabl-level-edit:hover{background:url('../../../../static/img/ecrm-tag-edit-sel.png') no-repeat;}
    .ecrm-tabl-level-add:hover{background:url('../../../../static/img/ecrm-tag-add-sel.png') no-repeat;}
    .ecrm-tabl-level-sub:hover{background:url('../../../../static/img/ecrm-tag-sub-sel.png') no-repeat;}
    .ecrm-tabl-level-refresh:hover{background:url('../../../../static/img/ecrm-tag-refresh-sel.png') no-repeat;}
    .ecrm-tabl-level-move:hover{background:url('../../../../static/img/ecrm-tag-move-sel.png') no-repeat;}
    .ecrm-dialog-icon-up{background:url('../../../../static/img/ecrw-icon-up.png') no-repeat;}
    .ecrm-dialog-icon-down{background:url('../../../../static/img/ecrw-icon-down.png') no-repeat;}
    .ecrm-dialog-icon-up:hover{background:url('../../../../static/img/ecrw-icon-up-sel.png') no-repeat;}
    .ecrm-dialog-icon-down:hover{background:url('../../../../static/img/ecrw-icon-down-sel.png') no-repeat;}

    .ecrm-dialog-icon-up{background:url('../../../../static/img/ecrw-icon-up.png') no-repeat;}
    .ecrm-dialog-icon-down{background:url('../../../../static/img/ecrw-icon-down.png') no-repeat;}
    .ecrm-dialog-icon-up:hover{background:url('../../../../static/img/ecrw-icon-up-sel.png') no-repeat;}
    .ecrm-dialog-icon-down:hover{background:url('../../../../static/img/ecrw-icon-down-sel.png') no-repeat;}
    a.highlight:hover {
      border: 1px solid green;
    }
    a.bigtype {
        font-weight: bold
    }
</style>