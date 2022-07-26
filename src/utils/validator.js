import isURL from "validator/es/lib/isURL";

export function validateUrl(rule, value, callback) {
  if (value === "") {
    callback("请输入封面图片连接");
  } else if (!isURL(value)) {
    callback("连接格式不正确");
  } else {
    callback();
  }
}
