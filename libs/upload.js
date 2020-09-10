const util = require('../util');
const path = require('path');
const fs = require('fs-extra');
const nfs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const qiniu = require('qiniu');
const config = require('../config');
const args = util.args();

// 上传文件到七牛云
class QiniuUpload {
    constructor(qiniuConfig) {
        if (
            !qiniuConfig ||
            !qiniuConfig.publicPath ||
            !qiniuConfig.accessKey ||
            !qiniuConfig.secretKey ||
            !qiniuConfig.bucket ||
            !qiniuConfig.zone
        ) {
            throw new Error('参数没有传递完全！');
        }
        this.entries = [];//要上传的文件列表
        // 保存用户传参
        this.qiniuConfig = qiniuConfig;
        // 创建的七牛认证信息
        this.qiniuAuthenticationConfig = {};
        // 鉴权
        this.qiniuAuthenticationConfig.mac = new qiniu.auth.digest.Mac(
            qiniuConfig.accessKey,
            qiniuConfig.secretKey
        );
        // 设置存储空间名称
        const options = {
            scope: qiniuConfig.bucket
        };
        // 创建上传token
        const putPolicy = new qiniu.rs.PutPolicy(options);
        this.qiniuAuthenticationConfig.uploadToken = putPolicy.uploadToken(
            this.qiniuAuthenticationConfig.mac
        );
        let config = new qiniu.conf.Config();
        // 存储空间对应的机房
        config.zone = qiniu.zone[qiniuConfig.zone];
        config.useHttpsDomain = true;
        config.useCdnDomain = true;
        this.qiniuAuthenticationConfig.formUploader = new qiniu.form_up.FormUploader(
            config
        );
    }
    run() {
        if (args.param.length && fs.existsSync(args.param[0])) {
            let rootPath = args.param[0];
            let distPath = args.param[1];//制定了上传目录
            let isFile = false;
            if(/.\/$/ig.test(distPath)){
                distPath = distPath.substr(0,distPath.length -1);
            }
            nfs.stat(rootPath, (err, stats)=> {
                if (err) {
                  console.log(chalk.bgRed.black(' ERROR ') + chalk.red(err))
                  return
                }
                if (stats.isDirectory()) {//上传整个目录
                    if(/.\/$/ig.test(rootPath)){
                        rootPath = rootPath.substr(0,rootPath.length -1);
                    }
                    this.iteratorDir(rootPath, '');
                }
                if (stats.isFile()) {//上传单个文件
                    isFile = true;
                    let onlyFileSplitArr = rootPath.indexOf("/") != -1 ? rootPath.split("/") : [rootPath];
                    let _filename = onlyFileSplitArr[onlyFileSplitArr.length-1];
                    this.entries.push(_filename);
                }
                console.log(`${this.entries.length} files ready!`);
                const spinner = ora('开始上传七牛云...').start();
                let assetsPromise = [];
                if(this.entries.length > 50){//分批次上传
                    let order = 0;
                    let uploadHandler = ()=>{
                        let end = order+50;
                        let newEntries = [];
                        if(end >=this.entries.length){
                            newEntries = this.entries.slice(order);
                            order = this.entries.length;
                        }else{
                            newEntries = this.entries.slice(order, end);
                            order = end;
                        }
                        if(newEntries.length >= 0){
                            assetsPromise = [];
                            newEntries.forEach((file, index) => {
                                if(distPath){//制定了上传目录
                                    let _file = isFile ? rootPath : rootPath + "/" + file;
                                    let _filename = this.qiniuConfig.bucket + "/" + distPath + "/" + file;
                                    assetsPromise.push(this.uploadFile(_file, _filename));
                                }else{//没有制定上传目录
                                    let _file = isFile ? rootPath : rootPath + "/" + file;
                                    let _filename = this.qiniuConfig.bucket + "/" + file;
                                    assetsPromise.push(this.uploadFile(_file, _filename));
                                }
                            });

                            Promise.all(assetsPromise)
                            .then(res => {
                                if(order >=this.entries.length){
                                    spinner.succeed(`${order}/${this.entries.length}-七牛云上传完毕!`);
                                }else{
                                    spinner.succeed(`${order}/${this.entries.length}-上传完毕!`);
                                    setTimeout(()=>{
                                        uploadHandler();
                                    }, 0);
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            });
                        }else{
                            spinner.succeed('七牛云上传完毕!');
                        }
                    };
                    uploadHandler();
                }else{
                    this.entries.forEach((file, index) => {
                        if(distPath){//制定了上传目录
                            let _file = isFile ? rootPath : rootPath + "/" + file;
                            let _filename = this.qiniuConfig.bucket + "/" + distPath + "/" + file;
                            assetsPromise.push(this.uploadFile(_file, _filename));
                        }else{//没有制定上传目录
                            let _file = isFile ? rootPath : rootPath + "/" + file;
                            let _filename = this.qiniuConfig.bucket + "/" + file;
                            assetsPromise.push(this.uploadFile(_file, _filename));
                        }
                    });
                    Promise.all(assetsPromise)
                    .then(res => {
                        spinner.succeed('七牛云上传完毕!');
                    })
                    .catch(err => {
                        console.log(err);
                    });
                }
            });
        } else {
            console.log(chalk.bgRed.black(' ERROR ') + chalk.red('缺少参数或文件不存在'))
        }
    }
    iteratorDir(rootPath, distPath){//遍历出所有文件
         let files = fs.readdirSync(rootPath);
         files.forEach((file, index) =>{
             let filePath = rootPath + "/" + file;
             if (fs.statSync(filePath).isDirectory()) {
                this.iteratorDir(filePath, distPath ? distPath + "/" + file : file);
             }else{
                if(!/^\..*/ig.test(file)){//过滤掉：.xxxx
                    this.entries.push(distPath ? distPath + "/" + file : file);
                }
             }
         });
    }
    uploadFile(filename, key, coverUploadToken, order) {
        const localFile = path.join('', filename);
        return new Promise((resolve, reject) => {
            // 文件上传
            const spinner = ora(`上传文件${key}...`).start();
            const uploadToken = coverUploadToken ? coverUploadToken : this.qiniuAuthenticationConfig.uploadToken;
            const putExtra = new qiniu.form_up.PutExtra()
            this.qiniuAuthenticationConfig.formUploader.putFile(
                uploadToken,
                key,
                localFile,
                putExtra,
                (respErr, respBody, respInfo) => {
                    if (respErr) {
                        throw respErr;
                    }
                    if (respInfo.statusCode == 200) {
                        resolve(respInfo);
                        spinner.succeed(`文件：${this.qiniuConfig.publicPath}${key}，上传成功！`);
                    } else {
                        if (
                            this.qiniuConfig.cover &&
                            (respInfo.status === 614 || respInfo.statusCode === 614)
                        ) {
                            spinner.fail(`文件：${key}，已存在，尝试覆盖上传！`);
                            resolve(
                            this.uploadFile(filename, key, this.coverUploadFile(key))
                            );
                        } else {
                            if(order && +order>=1){//失败重新上传1次
                                spinner.fail(`文件：${key}，上传失败！`);
                                reject(respInfo);
                            }else{
                                spinner.fail(`文件：${key}，上传失败！重新上传...`);
                                resolve(
                                    this.uploadFile(filename, key, uploadToken, 1)
                                );
                            }
                        }
                    }
                }
            );
        });
    }
    coverUploadFile(filename) {
        var options = {
            scope: this.qiniuConfig.bucket + ':' + filename
        };
        var putPolicy = new qiniu.rs.PutPolicy(options);
        return putPolicy.uploadToken(this.qiniuAuthenticationConfig.mac);
    }
}

module.exports = new QiniuUpload(config);
