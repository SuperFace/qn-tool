# qn-tool

## gitlab：http://git.sys.xuetangx.info/new-xuetangx/xtqiniu

## 支持本地单文件上传、文件夹上传（深层递归遍历上传，并上传后保持目录结构）
## 注：由于七牛对批量上传，不稳定，建议clone源码到本地使用，并本地配置上七牛账号（此工具由于关联七牛账号，不发布到npm）

## Build Setup

``` bash
# clone git
git clone http://git.sys.xuetangx.info/new-xuetangx/xtqiniu
# install dependencies
npm install

# 配置七牛账号
qn-tool/config.js
```
```
`请用淘宝镜像：cnpm ,npm本地慢`
```
# npm link to global node_modules/
```
cd qn-tool
cnpm link
```

# link to project /node_modules/
```
cd project
cnpm link qn-tool
```

# unlink from project /node_modules/
```
cd project
cnpm unlink qn-tool
```

# unlink from global node_modules/
```
cd qn-tool
cnpm unlink
```
如果出现：Unhandled rejection RangeError: Maximum call stack size exceededill install loadIdealTree，
是Node和npm版本不兼容,查看版本关联：https://nodejs.org/zh-cn/download/releases/

## 使用帮助
```
qn-tool --help
```
格式：qn-tool upload 要上传的文件夹/  上传到七牛的路径
例如：qn-tool upload MathJax@3/ xtassets/MathJax@3/
![图片描述](/tfl/captures/2020-09/tapd_23552461_base64_1599821687_57.png)