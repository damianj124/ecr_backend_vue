<template>
    <section>
        <div class="ecrw-ready-left-title">课程目录</div>
        <div class="ecrw-ready-left-list">
            <my-tree
                :data="items"
                @item-select="onItemSelect"
                @item-deselect="onItemDeselect">
            </my-tree>
        </div>
    </section>
</template>

<script>
    import { getCourseTree } from '../../../api/api';

    export default {
        data() {
            return {
                items:[],
                selectedItem:null
            }
        },
        methods: {
            onItemSelect(target, item, items) {
                this.selectedItem = item;
            },
            onItemDeselect(target, item, items) {
                if (this.selectedItem == item) {
                    this.selectedItem = null;
                }
            }
        },
        created: function() {
            getCourseTree().then((res) => {
                this.items = res.course;
            });
        }
    }
</script>
<style scoped lang="scss">
    .ecrw-ready-left-title{height:40px;line-height:40px;text-align:center;font-size:16px;color:#fff;background:#0bc2b6;margin-top:10px;}
    .ecrw-ready-left-list li{padding-left:15px;}
</style>