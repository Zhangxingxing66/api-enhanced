#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()
const express = require('express') // ✅ 新增
const app = express()              // ✅ 新增

// ✅ 添加中间件：让浏览器自动把 http 图片升级为 https
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 'upgrade-insecure-requests');
  next();
});

async function start() {
  if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
    fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8')
  }
  const generateConfig = require('./generateConfig')
  await generateConfig()
  require('./server').serveNcmApi({
    checkVersion: true,
    app, // ✅ 将我们创建的 express 实例传给 server.js
  })
}
start()
