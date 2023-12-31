<template>
  <div class="page">
    <div class="bg-white">
      <el-form size="mini" :inline="true"  class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
         <el-form-item prop="type">
          <el-input size="mini" v-model="searchForm.type" placeholder="类型" clearable></el-input>
        </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="refreshList()" size="mini" icon="el-icon-search">查询</el-button>
        <el-button @click="resetSearch()" size="mini" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
      </el-form>
      <el-row>
        <el-button v-if="hasPermission('sys:dict:add')" type="primary" size="mini" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('sys:dict:edit')" type="warning" size="mini" icon="el-icon-edit-outline" @click="edit()"
        :disabled="dataListSelections.length !== 1" plain>修改</el-button>
        <el-button v-if="hasPermission('sys:dict:del')" type="danger"   size="mini" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
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
          :data="dataList"
          v-loading="loading"
          size="mini"
          border
          @selection-change="selectionChangeHandle"
          @sort-change="sortChangeHandle"
          class="table">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
          <el-table-column
            type="index" label="#">
          </el-table-column>
          <el-table-column
          prop="type"
          sortable="custom"
          label="类型">
         <template slot-scope="scope">
          <el-link  type="primary" :underline="false" v-if="hasPermission('sys:dict:edit')" @click="edit(scope.row.id)">{{scope.row.type}}</el-link>
          <el-link  type="primary" :underline="false" v-else-if="hasPermission('sys:dict:view')"  @click="view(scope.row.id)">{{scope.row.type}}</el-link>
          <span v-else>{{scope.row.type}}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          :key="Math.random()"
          header-align="center"
          align="center"
          width="250"
          label="操作">
          <template slot-scope="scope">
             <el-button v-if="hasPermission('sys:dict:view')" type="text" size="mini"
                      @click="view(scope.row.id)">查看
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button v-if="hasPermission('sys:dict:edit')" type="text" size="mini"
                      @click="edit(scope.row.id)">修改
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button v-if="hasPermission('sys:dict:del')" type="text" size="mini" @click="del(scope.row.id)">
              删除
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button v-if="hasPermission('sys:dict:edit')" type="text" size="mini" @click="showRight(scope.row)">
              管理键值
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
    <!-- 弹窗, 新增 / 修改 -->
    <dict-type-form  ref="dictTypeForm" @refreshDataList="refreshList"></dict-type-form>
    <el-drawer
      size = "700px"
      :title="`数据字典值列表，所属类型: ${this.dictTypeTitle}`"
      :visible.sync="rightVisible"
      direction="rtl">
      <dict-value-list  :dict-type-title="dictTypeTitle" ref="dictValueList" @closeRight="closeRight"></dict-value-list>
    </el-drawer>

  </div>
</template>

<script>
  import DictTypeForm from './DictTypeForm'
  import DictValueList from './DictValueList'

export default {
    data () {
      return {
        searchForm: {
          type: ''
        },
        dataList: [],
        pageNo: 1,
        pageSize: 15,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        dictTypeTitle: '',
        rightVisible: false,
        loading: false
      }
    },
    components: {
      DictTypeForm,
      DictValueList
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/sys/dict/type/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'type': this.searchForm.type,
            'orderBy': this.orderBy
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList = data.page.list
            this.total = data.page.count
            this.loading = false
          }
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
        this.$refs.dictTypeForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.dictTypeForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.dictTypeForm.init('view', id)
      },
      // 删除
      del (id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: '/sys/dict/delete',
            method: 'delete',
            params: {'ids': ids}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
              this.$dictUtils.refreshDictList()
            }
          })
        })
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      showRight (row) {
        this.rightVisible = true
        this.$nextTick(() => {
          this.$refs.dictValueList.refreshList(row.id)
          this.dictTypeTitle = row.type
        })
      },
      closeRight () {
        this.rightVisible = false
      }
    }
  }
</script>
