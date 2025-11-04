#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()
const express = require('express') // ✅ 新增
const app = express()              // ✅ 新增

// ✅ 添加这个中间件来自动升级 http 图片为 https
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "upgrade-insecure-requests");
  next();
});

async function start() {
  // 检测是否存在 anonymous_token 文件,没有则生成
  if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
    fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8')
  }
  // 启动时更新anonymous_token
  const generateConfig = require('./generateConfig')
  await generateConfig()
  require('./server').serveNcmApi({
    checkVersion: true,
    app, // ✅ 把上面创建的 express 实例传进去（某些版本需要）
  })
}
start()
