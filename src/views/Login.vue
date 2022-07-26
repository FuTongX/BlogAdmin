<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">博客管理后台</h1>
      <div class="form">
        <!-- 登录表单 -->
        <el-form
          ref="loginForm"
          status-icon
          :rules="formRules"
          :model="form"
          label-width="0px"
        >
          <!-- 用户名 -->
          <el-form-item prop="userName">
            <el-input
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
              v-model="form.userName"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              prefix-icon="el-icon-lock"
              type="password"
              v-model="form.password"
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="form-btns">
            <el-button @click="loginFunc" type="primary">登录</el-button>
            <el-button @click="resetFunc" type="info">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { Login } from "../api";
import jwt_decode from "jwt-decode";
export default {
  name: "BlogAdminLogin",
  data() {
    //自定义密码验证规则
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        let reg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/);
        if (!reg.test(this.form.password)) {
          callback(new Error("密码必须包含数字和字母,且在6-18位之间"));
        } else {
          callback();
        }
      }
    };

    return {
      //绑定数据对象
      form: {
        userName: "",
        password: "",
      },
      //验证规则对象
      formRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度3到8个字符", trigger: "blur" },
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  methods: {
    resetFunc() {
      this.$refs.loginForm.resetFields();
    },
    loginFunc() {
      //登录再预验证
      this.$refs.loginForm.validate(async (pass) => {
        if (pass) {
          let res = await Login(this.form);
          if (res.meta.status === 200) {
            let decoded = jwt_decode(res.data.token);
            window.sessionStorage.setItem(
              "userinfo",
              JSON.stringify(decoded.userinfo)
            );
            window.sessionStorage.setItem("token", res.data.token);
            this.$router.push("/home");
          }
        } else {
          //弹出提示
          this.$message.error("用户名或密码格式有问题");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  background-color: #356185;
  background: url("../assets/login/RE4wtcs.jfif") no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 15px;
    position: relative;
    padding: 40px;
    box-sizing: border-box;
    .title {
      font-size: 23px;
      font-weight: bold;
      color: #acacac;
      text-align: center;
    }
    .form {
      margin-top: 40px;
      .form-btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>