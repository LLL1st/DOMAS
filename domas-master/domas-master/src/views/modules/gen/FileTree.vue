<template>
  <el-dialog
    title="选择路径"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">

      <el-input
  placeholder="输入关键字进行过滤"
  v-model="filterText">
</el-input>

<el-tree
  class="filter-tree"
  :data="data"
  :props="props"
  :load="loadNode"
  lazy
  @node-click="handleNodeClick"
  :filter-node-method="filterNode"
  ref="tree">
</el-tree>
  
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="visible = false">关闭</el-button>
      <el-button size="mini" type="primary" @click="doSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        filterText: '',
        selectValue: '',
        props: {
          label: 'text',
          isLeaf: 'isLeaf'
        },
        visible: false,
        data: []
      }
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val)
      }
    },

    methods: {
      init (id) {
        this.visible = true
      },
      loadNode (node, resolve) {
        let path = node.data.id ? encodeURIComponent(node.data.id) : '#'
        this.$http.get(`/code/codeParam/getFileTree?parentNode=${path}`).then(({data}) => {
          resolve(data.treeData)
        })
      },
      filterNode (value, data) {
        if (!value) return true
        return data.text.indexOf(value) !== -1
      },
      handleNodeClick (data) {
        this.selectValue = data.id
      },
       // 表单提交
      doSubmit () {
        this.visible = false
        this.$emit('getValue', this.selectValue)
      }
    }
  }
</script>