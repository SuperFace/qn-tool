# xtqiniu

## 使用帮助
```
xtqiniu --help
```

## Build Setup

``` bash
# install dependencies
npm install

```
如果出现：Unhandled rejection RangeError: Maximum call stack size exceededill install loadIdealTree，
是Node和npm版本不兼容,查看版本关联：https://nodejs.org/zh-cn/download/releases/
```
`请用淘宝镜像：cnpm ,npm本地慢`
```
# npm link to global node_modules/
cd xtqiniu
cnpm link

# link to project /node_modules/
cd project
cnpm link xtqiniu

# unlink from project /node_modules/
cd project
cnpm unlink xtqiniu

# unlink from global node_modules/
cd xtqiniu
cnpm unlink
```
