<template>
  <div class="ecrw-ready-left-list">
    <!-- // Author : GOD
    // Date Start : 2019-1-31 3 PM
    // Reason : 系统管理 专题管理 Page Loading Speed, Select First Theme as Default-->
    <ul v-if="data!=null && data.length>0">
      <theme-treeitem
        v-for="(item, idx) in data"
        :key="idx"
        :data="item"
        :selectable="selectable"
        :single="single"
        :openlevel="openlevel"
        :openstep="openstep"
        :model="item"
        :tools="tools"
        :tool-min-level="toolMinLevel"
        :highlight="isHighlight"
        :themeid="themeid"
        @item-click="onItemClick"
        @item-dblclick="onItemDblClick"
        @item-select="onItemSelect"
        @item-deselect="onItemDeselect"
        @item-operate="onItemOperate"
      ></theme-treeitem>
    </ul>
    <!-- // Author : GOD
    // Date End : 2019-2-1 6 PM
    // Reason : 系统管理 专题管理 Page Loading Speed, Select First Theme as Default-->
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: [],
      required: true
    },
    selectable: {
      type: Boolean,
      default: true,
      required: false
    },
    single: {
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
    tools: {
      type: Array,
      default: [],
      required: false
    },
    toolMinLevel: {
      type: Number,
      default: 0,
      required: false
    },
    // Author : GOD
    // Date Start : 2019-1-31 3 PM
    // Reason : 系统管理 专题管理 Page Loading Speed, Select First Theme as Default
    themeid: {
      type: String,
      default: "",
      required: false
    }
    // Author : GOD
    // Date End : 2019-2-1 6 PM
    // Reason : 系统管理 专题管理 Page Loading Speed, Select First Theme as Default
  },
  data: function() {
    return {
      selectedItems: [],
      lastSelectedTarget: null,
      highLight: false
    };
  },
  computed: {
    isHighlight() {
      return this.highLight;
    }
  },
  watch: {},
  methods: {
    remove() {
      this.data = [];
    },
    highlight(isHighlight) {
      this.highLight = isHighlight;
    },
    onItemSelect: function(target, item) {
      this.selectedItems.push(item);
      this.$emit("item-select", target, item, this.selectedItems);

      if (this.single && this.lastSelectedTarget != null) {
        this.lastSelectedTarget.doChange();
      }
      this.lastSelectedTarget = target;
    },
    onItemDeselect: function(target, item) {
      if (
        this.single &&
        this.lastSelectedTarget != null &&
        this.lastSelectedTarget == target
      ) {
        this.lastSelectedTarget = null;
      }
      var index = this.selectedItems.indexOf(item);
      this.selectedItems.splice(index, 1);
      this.$emit("item-deselect", target, item, this.selectedItems);
    },
    onItemClick: function(target, item) {
      this.$emit("item-click", target, item, this.selectedItems);
    },
    onItemDblClick(target, model) {
      this.$emit("item-dblclick", target, model);
    },
    onItemOperate(target, level, parent, model, opIdx) {
      this.$emit("item-operate", target, level, parent, model, opIdx);
    }
  }
};
</script>

<style scoped>
ul {
  padding-left: 0px;
}
ul,
ol,
li {
  list-style: none;
  clear: both;
}
el-button {
  padding-right: 0px;
  padding-bottom: 5px;
}
.ecrw-ready-left-list {
  height: 560px;
  overflow: auto;
  overflow-x: hidden;
  border: 1px solid lightgray;
}
.ecrw-ready-left-list li {
  padding-left: 15px;
}
.ecrw-ready-left-list span.ecrw-ready-left-list-toggle {
  background: url("../../../../static/img/ecrm-icon-open-close.png") no-repeat
    left center !important;
}
.ecrw-ready-left-list span.toggle {
  display: inline-block;
  background: url("../../../../static/img/ecrm-icon-open-open.png") no-repeat
    left center;
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
a,
a:link,
a:visited,
a:hover,
a:active {
  text-decoration: none;
  float: left;
}
a {
  color: #333;
}
</style>