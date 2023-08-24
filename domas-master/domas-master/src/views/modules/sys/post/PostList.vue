<template>
  <div class="page"><div class="bg-white">
    <el-form size="mini" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="name">
        <el-input size="mini" v-model="searchForm.name" placeholder="岗位名称" clearable></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input size="mini" v-model="searchForm.code" placeholder="岗位编码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="mini" icon="el-icon-search">查询</el-button>
        <el-button @click="resetSearch()" size="mini" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 导入导出-->
    <el-dialog  title="导入Excel" :visible.sync="isImportCollapse">
      <el-form size="mini" :inline="true"  class="query-form" ref="importForm">
        <el-form-item>
          <el-button type="default" @click="downloadTpl()" size="mini">下载模板</el-button>
        </el-form-item>
        <el-form-item prop="loginName">
          <el-upload
            class="upload-demo"
            :action="`${this.$http.BASE_URL}/sys/post/import`"
            :on-success="uploadSuccess"
            :show-file-list="true">
            <el-button size="mini" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-row>
      <el-button v-if="hasPermission('sys:post:add')" type="primary" size="mini" icon="el-icon-plus" @click="add()">新建</el-button>
      <el-button v-if="hasPermission('sys:post:edit')" type="warning" size="mini" icon="el-icon-edit-outline" @click="edit()"
                 :disabled="dataListSelections.length != 1" plain>修改</el-button>
      <el-button v-if="hasPermission('sys:post:del')" type="danger"   size="mini" icon="el-icon-delete" @click="del()"
                 :disabled="dataListSelections.length <= 0" plain>删除
      </el-button>
      <el-button-group class="pull-right">
        <el-button v-if="hasPermission('sys:post:import')" type="default" size="mini" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>
        <el-button v-if="hasPermission('sys:post:export')" type="default" size="mini" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
        <el-button
          type="default"
          size="mini"
          icon="el-icon-refresh"
          @click="refreshList">
        </el-button>
      </el-button-group>
    </el-row>
    <el-table
      :data="dataList"
      size="mini"
      border
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      @render-header ="elTableHeadFunction"
      v-loading="loading"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        type="index"  :index="indexMethod" label="#">
      </el-table-column>
      <el-table-column
        prop="name"
        show-overflow-tooltip
        sortable="custom"
        label="岗位名称">
        <template slot-scope="scope">
          <el-link  type="primary" :underline="false" v-if="hasPermission('sys:post:edit')" @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
          <el-link  type="primary" :underline="false" v-else-if="hasPermission('sys:post:view')"  @click="view(scope.row.id)">{{scope.row.name}}</el-link>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        show-overflow-tooltip
        sortable="custom"
        label="岗位编码">
      </el-table-column>
      <el-table-column
        prop="type"
        show-overflow-tooltip
        sortable="custom"
        label="岗位类型">
        <template slot-scope="scope">
          {{ $dictUtils.getDictLabel("sys_post_type", scope.row.type, '-') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        show-overflow-tooltip
        sortable="custom"
        label="是否可用">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==='1'" type="success">
            {{ $dictUtils.getDictLabel("yes_no", scope.row.status, '-') }}
          </el-tag>
          <el-tag v-else type="danger">
            {{ $dictUtils.getDictLabel("yes_no", scope.row.status, '-') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        show-overflow-tooltip
        sortable="custom"
        label="岗位排序">
      </el-table-column>
      <el-table-column
        prop="remarks"
        show-overflow-tooltip
        sortable="custom"
        label="备注信息">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('sys:post:view')" type="text" icon="el-icon-view" size="mini" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('sys:post:edit')" type="text" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('sys:post:del')" type="text"  icon="el-icon-delete" size="mini" @click="del(scope.row.id)">删除</el-button>
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
    <PostForm  ref="postForm" @refreshDataList="refreshList"></PostForm>
  </div>
</template>

<script>
import PostForm from './PostForm'
export default {
  data () {
    return {
      searchForm: {
        name: '',
        code: ''
      },
      dataList: [],
      pageNo: 1,
      pageSize: 15,
      total: 0,
      orderBy: '',
      dataListSelections: [],
      isImportCollapse: false,
      loading: false
    }
  },
  components: {
    PostForm
  },
  activated () {
    this.refreshList()
  },

  methods: {
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/sys/post/list',
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
      this.$refs.postForm.init('add', '')
    },
    // 修改
    edit (id) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.postForm.init('edit', id)
    },
    // 查看
    view (id) {
      this.$refs.postForm.init('view', id)
    },
    indexMethod (index) {
      return (this.pageNo - 1) * this.pageSize + index + 1
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
        this.loading = true
        this.$http({
          url: '/sys/post/delete',
          method: 'delete',
          params: {'ids': ids}
        }).then(({data}) => {
          if (data && data.success) {
            this.$message.success(data.msg)
            this.refreshList()
          }
          this.loading = false
        })
      })
    },
    // 导入成功
    uploadSuccess (res, file) {
      if (res.success) {
        this.$message.success({dangerouslyUseHTMLString: true,
          message: res.msg})
      } else {
        this.$message.error(res.msg)
      }
    },
    // 下载模板
    downloadTpl () {
      this.$utils.download('/sys/post/import/template')
    },
    exportExcel () {
      this.$utils.download('/sys/post/export')
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    }
  }
}
</script>
