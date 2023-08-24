<template>
  <div class="page">
    <div class="jp-common-layout"  v-if="code ===0 || code === 200">
      <div class="jp-common-layout-left">
        <div class="jp-common-title">
          <el-input
          placeholder="数据库:请输入关键字过滤"
          size="mini"
          clearable
          v-model="filterText">
        </el-input>
        </div>
      <div class="jp-common-el-tree-scrollbar el-scrollbar">
      <div class="el-scrollbar__wrap">
        <div class="el-scrollbar__view">
      <el-tree
        class="filter-tree"
        :data="databaseTreeData"
        :props="{
              value: 'id',             // ID字段名
              label: 'label',         // 显示名称
              children: 'children'    // 子级字段名
            }"
        node-key="id"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
         highlight-current
        @node-click="handleNodeClick"
        ref="databaseTree">
      </el-tree>
      </div>
      </div>
      </div>
      </div>
      <div class="jp-common-layout-center jp-flex-main">
        <div class="bg-white top">
          <el-form size="mini" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
         <el-form-item prop="nameLike">
           <el-input size="mini" v-model="searchForm.nameLike" placeholder="表名" clearable></el-input>
        </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="refreshList()" size="mini">查询</el-button>
        <el-button @click="resetSearch()" size="mini">重置</el-button>
      </el-form-item>
      </el-form>
      <el-row>
        <el-button type="primary"  size="mini" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button type="default"  size="mini" icon="el-icon-upload2" @click="importFromDB()">导入数据库表</el-button>
        <el-button type="default" size="mini" icon="el-icon-edit-outline" @click="genCode()"
         :disabled="dataListSelections.length != 1">生成代码</el-button>
        <el-button type="default" size="mini" icon="el-icon-edit-outline" @click="createMenu()"
         :disabled="dataListSelections.length != 1">创建菜单</el-button>
        <el-button-group class="pull-right">
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button
              type="default"
              size="mini"
              icon="el-icon-refresh"
              @click="refreshList">
            </el-button>
          </el-tooltip>
        </el-button-group>
    </el-row>
    <el-table
      border
      :data="dataList"
      v-loading="loading"
      size = "mini"
      height="calc(100% - 105px)"
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>>
      <el-table-column
        prop="tableType"
        show-overflow-tooltip
        sortable="custom"
        label="表类型">
         <template slot-scope="scope">
          {{$dictUtils.getDictLabel("table_type", scope.row.tableType, "")}}
         </template>
      </el-table-column>
      <el-table-column
        prop="name"
        sortable="custom"
        min-width="180"
        show-overflow-tooltip
        label="表名">
       <template slot-scope="scope">
          <el-link  type="primary" :underline="false"  @click="edit(scope.row.id)" >{{scope.row.name}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="dataSource.name"
        sortable="custom"
        show-overflow-tooltip
        min-width="120"
        label="来自数据库">
      </el-table-column>
      <el-table-column
        prop="comments"
        sortable="custom"
        show-overflow-tooltip
        label="说明">
      </el-table-column>
      <el-table-column
        prop="className"
        sortable="custom"
        show-overflow-tooltip
        label="类名">
      </el-table-column>
      <el-table-column
        prop="parentTable"
        show-overflow-tooltip
         min-width="100"
        label="主表">
      </el-table-column>
      <el-table-column
        prop="isSync"
         min-width="120"
        label="同步数据库">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isSync === '1'" size="mini" type="success">已同步</el-tag>
          <el-tag v-else size="mini" type="danger">未同步</el-tag>
        </template>
      </el-table-column>
      <el-table-column

        :key="Math.random()"
        header-align="center"
        align="center"
        width="220"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini"
                     @click="edit(scope.row.id)">修改
          </el-button>
           <el-divider direction="vertical"></el-divider>
          <el-button  type="text" size="mini"
                     @click="remove(scope.row.id)">移除
          </el-button>
           <el-divider direction="vertical"></el-divider>
          <el-button  type="text" size="mini"
                     @click="del(scope.row.id)">删除
          </el-button>
           <el-divider direction="vertical"></el-divider>
          <el-button type="text" size="mini" @click="sync(scope.row.id)">
            同步数据库
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 15, 20, 50, 100]"
      :page-size="pageSize"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
      </div>
    </div>
        </div>
        <gen-table-form ref="codeTableForm" @refreshDataList="refreshList"></gen-table-form>
        <gen-sync-form ref="genSyncForm" @refreshDataList="refreshList"></gen-sync-form>
        <gen-code-form ref="genCodeForm"></gen-code-form>
        <gen-menu-form ref="genMenuForm"></gen-menu-form>
        <import-table ref="importTable" @refreshDataList="refreshList"></import-table>
    </div>

  </div>
</template>

<script>
  import GenTableForm from './GenTableForm'
  import GenSyncForm from './GenSyncForm'
  import GenCodeForm from './GenCodeForm'
  import GenMenuForm from './GenMenuForm'
  import ImportTable from './ImportTable'
  export default {
    name: 'codeTableList',
    data () {
      return {
        searchForm: {
          nameLike: '',
          dataSource: {
            id: ''
          }
        },
        code: 0,
        msg: '',
        serial: '',
        filterText: '',
        dataList: [],
        databaseTreeData: [],
        pageNo: 1,
        pageSize: 15,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        loading: false
      }
    },
    components: {
      GenTableForm,
      GenSyncForm,
      GenCodeForm,
      GenMenuForm,
      ImportTable
    },
    activated () {
      this.refreshTree()
      this.refreshList()
    },
    watch: {
      filterText (val) {
        this.$refs.databaseTree.filter(val)
      }
    },
    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/code/codeTable/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList = data.page.list
            this.total = data.page.count
            this.loading = false
          }
          this.msg = data.msg
          this.code = data.code
          this.serial = data.serial
        })
      },
      refreshTree () {
        this.$http({
          url: `/database/datalink/dataSource/treeData2`,
          method: 'get'
        }).then(({data}) => {
          this.databaseTreeData = data.treeData
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.refreshList()
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
      // 新增
      add () {
        this.$refs.codeTableForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.codeTableForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.codeTableForm.init('view', id)
      },
      // 删除
      del (id) {
        this.$confirm(`确认要删除该条记录并删除对应的数据库物理表吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: '/code/codeTable/deleteDb',
            method: 'delete',
            params: {'id': id}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success({dangerouslyUseHTMLString: true,
                message: data.msg})
              this.refreshList()
            }
          })
        })
      },
      remove (id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确认要移除选中记录吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: '/code/codeTable/deleteAll',
            method: 'delete',
            params: {'ids': ids}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success({dangerouslyUseHTMLString: true,
                message: data.msg})
              this.refreshList()
            }
          })
        })
      },
      handleNodeClick (data) {
        if (data.type === 'db') {
          this.searchForm.dataSource.id = data.id
        } else {
          this.searchForm.dataSource.id = ''
        }
        this.refreshList()
      },
      sync (id) {
        this.$refs.genSyncForm.init(id)
      },
      genCode () {
        let id = this.dataListSelections[0].id
        var tableType = this.dataListSelections[0].tableType
        if (tableType === '2') {
          this.$message.error('不能选择附表生成代码，请选择主表!')
          return
        }
        if (tableType === '5') {
          this.$message.error('不能选择右表生成代码，请选择左树!')
          return
        }
        var isSync = this.dataListSelections[0].isSync
        if (isSync === '0') {
          this.$message.error('请先同步数据库!')
          return
        }
        this.$refs.genCodeForm.init(id)
      },
      createMenu () {
        let id = this.dataListSelections[0].id
        var tableType = this.dataListSelections[0].tableType
        if (tableType === '2' || tableType === '5') {
          this.$message.error('不能选择附表创建菜单，请选择主表!')
          return
        }
        var isSync = this.dataListSelections[0].isSync
        if (isSync === '0') {
          this.$message.error('请先同步数据库!')
          return
        }
        this.$refs.genMenuForm.init(id, tableType)
      },
      importFromDB () {
        this.$refs.importTable.init()
      },
      resetSearch () {
        this.searchForm.dataSource.id = ''
        this.filterText = ''
        this.$refs.databaseTree.setCurrentKey(null)
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
<style scoped>
.demo p:first-child {
    text-align: center;
    font-family: cursive;
    font-size: 100px;
    font-weight: bold;
    line-height: 100px;
    letter-spacing: 5px;
    color: #fff;
    margin-top: 100px;
}

.demo p:first-child span {
    color: red;
    cursor: pointer;
    text-shadow: 0px 0px 2px #686868,
    0px 1px 1px #ddd,
    0px 2px 1px #d6d6d6,
    0px 3px 1px #ccc,
    0px 4px 1px #c5c5c5,
    0px 5px 1px #c1c1c1,
    0px 6px 1px #bbb,
    0px 7px 1px #777,
    0px 8px 3px rgba(100, 100, 100, 0.4),
    0px 9px 5px rgba(100, 100, 100, 0.1),
    0px 10px 7px rgba(100, 100, 100, 0.15),
    0px 11px 9px rgba(100, 100, 100, 0.2),
    0px 12px 11px rgba(100, 100, 100, 0.25),
    0px 13px 15px rgba(100, 100, 100, 0.3);
    -webkit-transition: all .1s linear;
    transition: all .1s linear;
}

.demo p:first-child span:hover {
    text-shadow: 0px 0px 2px #686868,
    0px 1px 1px #fff,
    0px 2px 1px #fff,
    0px 3px 1px #fff,
    0px 4px 1px #fff,
    0px 5px 1px #fff,
    0px 6px 1px #fff,
    0px 7px 1px #777,
    0px 8px 3px #fff,
    0px 9px 5px #fff,
    0px 10px 7px #fff,
    0px 11px 9px #fff,
    0px 12px 11px #fff,
    0px 13px 15px #fff;
    -webkit-transition: all .1s linear;
    transition: all .1s linear;
}

.demo p:not(:first-child) {
    text-align: center;
    color: #666;
    font-family: cursive;
    font-size: 20px;
    text-shadow: 0 1px 0 #fff;
    letter-spacing: 1px;
    line-height: 2em;
    margin-top: 50px;
}
</style>
