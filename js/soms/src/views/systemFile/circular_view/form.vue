<template>
  <el-dialog
    :visible.sync="dialog"
    :close-on-click-modal="false"
    :before-close="resetForm"
    :append-to-body="true"
    width="720px"
  >
    <!-- 上传预览对话框-->
    <el-dialog :visible.sync="innerDialogVisible" :append-to-body="true" width="720px">
      <img v-if="dialogImageUrl !== ''" :src="dialogImageUrl" width="100%" alt />
      <div>
        <!-- <v-pdf  pdfUrl="../../static/test.pdf" ></v-pdf> -->
        <v-pdf v-if="dialogPdfUrl !== ''" ref="pdf" :pdf-url="dialogPdfUrl" />
      </div>
    </el-dialog>
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-form-item label="基本参数类型">
        <el-cascader
          v-model="form.circularType"
          clearable
          :show-all-levels="false"
          :options="circularTypes"
          placeholder="基本参数类型"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item label="接收方">
        <el-tree :props="shipOrganizations" :load="loadNode" lazy show-checkbox></el-tree>
      </el-form-item>
      <el-form-item label="发布主题">
        <el-input v-model="form.title" style="width: 370px;" />
      </el-form-item>
      <el-upload
        ref="upload"
        :http-request="uploadCircularContent"
        :auto-upload="false"
        :multiple="false"
        :headers="headers"
        :on-preview="handlePictureCardPreview"
        :before-upload="onBeforeUpload"
        class="upload-demo"
        action
        show-file-list
        with-credentials
        accept="image/jpeg, image/jpg, image/gif, image/png, application/pdf"
        list-type="picture-card"
      >
        <el-button slot="trigger" type="info">选取文件</el-button>
        <el-button
          v-permission="['ADMIN','PARTY_ALL','PARTY_CREATE']"
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
        >上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpeg/jpg/png/pdf文件，且单个文件不超过10MB</div>
      </el-upload>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pdf from "@/components/pdf";
import { add, edit } from "@/api/circular";
import { uploadCircularContents } from "@/api/content";
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      circularTypes: [],
      shipOrganizations: [],
      dialogPdfUrl: "",
      innerDialogVisible: "",
      dialogPdfUrl: "",
      dialogVisible: false,
      form: {
        circularId: "",
        circularType: "",
        status: "",
        createdDate: "",
        createdBy: "",
        lastModifiedDate: "",
        lastModifiedBy: "",
        senderPartyId: "",
        title: "",
        selectedOrganizations: []
      },
      rules: {}
    };
  },
  methods: {
    handlePictureCardPreview(file) {
      var extName = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      if (extName === ".pdf") {
        this.dialogPdfUrl = file.url;
        this.dialogImageUrl = "";
        this.$refs.pdf.loadFile(file.url);
      } else {
        this.dialogPdfUrl = "";
        this.dialogImageUrl = file.url;
      }
      // this.dialogImageUrl = file.url
      this.innerDialogVisible = true;
    },
    onBeforeUpload(file) {
      const isIMAGE =
        file.type === "image/jpeg" ||
        "image/gif" ||
        "image/png" ||
        "application/pdf";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片或者PDF格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      return isIMAGE && isLt10M;
    },
    uploadCircularContent(param) {
      const formData = new FormData();
      formData.append("file", param.file);
      formData.append("circularType", this.form.circularType);
      formData.append("title", this.form.title);
      formData.append("selectedOrganizations", this.form.selectedOrganizations);
      uploadPartyContents(formData)
        .then(response => {
          this.$message.info("上传成功");
          // 上传成功的图片会显示绿色的对勾
          param.onSuccess();
          this.reloadForm();
          // 但是我们上传成功了图片， fileList 里面的值却没有改变，还好有on-change指令可以使用
        })
        .catch(err => {
          this.$message.error("上传失败");
          param.onError();
          console.log(err);
        });
    },
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.loading = true;
      if (this.isAdd) {
        this.doAdd();
      } else this.doEdit();
    },
    doAdd() {
      add(this.form)
        .then(res => {
          this.resetForm();
          this.$notify({
            title: "添加成功",
            type: "success",
            duration: 2500
          });
          this.loading = false;
          this.$parent.init();
        })
        .catch(err => {
          this.loading = false;
          console.log(err.response.data.message);
        });
    },
    doEdit() {
      edit(this.form)
        .then(res => {
          this.resetForm();
          this.$notify({
            title: "修改成功",
            type: "success",
            duration: 2500
          });
          this.loading = false;
          this.$parent.init();
        })
        .catch(err => {
          this.loading = false;
          console.log(err.response.data.message);
        });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
      this.form = {
        circularId: "",
        circularType: "",
        status: "",
        createdDate: "",
        createdBy: "",
        lastModifiedDate: "",
        lastModifiedBy: "",
        senderPartyId: "",
        title: ""
      };
    }
  }
};
</script>

<style scoped>
</style>
