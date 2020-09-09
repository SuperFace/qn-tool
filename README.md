# qntool

## 使用帮助
```
qntool --help
```
```
 由于七牛对批量上传，不稳定，建议本地在使用
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
cd qntool
cnpm link

# link to project /node_modules/
cd project
cnpm link qntool

# unlink from project /node_modules/
cd project
cnpm unlink qntool

# unlink from global node_modules/
cd qntool
cnpm unlink
```
