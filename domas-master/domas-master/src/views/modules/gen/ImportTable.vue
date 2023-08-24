<template>
  <div>
  <el-dialog
    title="导入数据库"
    :append-to-body="true"
    :close-on-click-modal="false"
    width="1200px"
     v-dialogDrag
    :visible.sync="visible">
    <el-row :gutter="15">
    <el-col :span="5">
     
     {{selectDbName}}
     
      <el-input
        placeholder="输入关键字进行过滤"
        size="mini"
        v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :highlight-current="true"
        :data="databaseTreeData"
        :props="{
              value: 'id',             // ID字段名
              label: 'label',         // 显示名称
              children: 'children'    // 子级字段名
            }"
        default-expand-all
        node-key="id"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        ref="databaseTree">
      </el-tree>
    </el-col>
    <el-col :span="19">
     <el-form size="mini" :inline="true"  ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
         <el-form-item prop="name">
           <el-input size="mini" v-model="searchForm.name" placeholder="表名" clearable></el-input>
        </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="refreshList()" size="mini">查询</el-button>
        <el-button @click="resetSearch()" size="mini">重置</el-button>
      </el-form-item>
      </el-form>
    <el-table
      :data="dataList"
      v-loading="loading"
      :height="600"
      size = "mini"
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>>
      <el-table-column
        prop="name"
        sortable="custom"
        label="表名">
      </el-table-column>
      <el-table-column
        prop="comments"
        sortable="custom"
        label="说明">
      </el-table-column>
    </el-table>
    </el-col>
    </el-row>
     <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="visible = false">关闭</el-button>
      <el-button size="mini" type="primary"  :disabled="dataListSelections.length === 0" @click="doSubmit()">确定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchForm: {
          name: '',
          dataSource: {
            enName: ''
          }
        },
        visible: false,
        filterText: '',
        dataList: [],
        databaseTreeData: [],
        orderBy: '',
        dataListSelections: [],
        loading: false,
        selectDbName: '',
        dataSourceId: ''
      }
    },
    watch: {
      filterText (val) {
        this.$refs.databaseTree.filter(val)
      }
    },
    methods: {
      init () {
        this.visible = true
        this.refreshTree()
        this.searchForm.dataSource.enName = 'master'
        this.dataSourceId = 'master'
        this.selectDbName = '已选数据库: 本地数据库'
        if (this.searchForm.dataSource.enName !== '') {
          this.refreshList()
        }
      },
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/code/codeTable/importTableData',
          method: 'get',
          params: {
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList = data.rows
          }
          this.loading = false
        }).catch(({data}) => {
          this.dataList = []
          this.loading = false
        })
      },
      refreshTree () {
        this.$http({
          url: `/database/datalink/dataSource/treeData2`,
          method: 'get'
        }).then(({data}) => {
          this.databaseTreeData = data.treeData
          this.$nextTick(() => {
            this.$refs.databaseTree.setCurrentKey('master')
          })
        })
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
       // 排序
      sortChangeHandle (obj) {
        if (obj.prop === 'tableType') {
          obj.prop = 'table_type'
        }
        if (obj.prop === 'dataSource.name') {
          obj.prop = 'dataSource_id'
        }
        if (obj.prop === 'className') {
          obj.prop = 'class_name'
        }
        if (obj.order === 'ascending') {
          this.orderBy = obj.prop + ' asc'
        } else if (obj.order === 'descending') {
          this.orderBy = obj.prop + ' desc'
        } else {
          this.orderBy = ''
        }
        this.refreshList()
      },
      handleNodeClick (data) {
        if (data.type === 'db') {
          this.searchForm.dataSource.enName = data.enName
          this.selectDbName = '已选数据库: ' + data.label
          this.dataSourceId = data.id
          this.refreshList()
        }
      },
      resetSearch () {
        this.searchForm.name = ''
        this.refreshList()
      },
      doSubmit () {
        let names = this.dataListSelections.map((item) => {
          return item.name
        }).join(',')
        this.$http({
          url: '/code/codeTable/saveTableFromDB',
          method: 'post',
          data: {
            name: names,
            'dataSource.id': this.dataSourceId
          },
          loading: true,
          loadingText: '正在导入数据库...'
        }).then(({data}) => {
          if (data.success) {
            this.$message.success({
              message: data.msg,
              dangerouslyUseHTMLString: true
            })
            this.$emit('refreshDataList')
            this.visible = false
          }
        })
      }
    }
  }
</script>
