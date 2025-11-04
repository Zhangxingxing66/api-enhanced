#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()
const express = require('express')
const cors = require('cors') // ✅ 新增
const app = express()

// ✅ 开启跨域（允许 Vue 前端访问）
app.use(cors())

// ✅ 自动升级 http 图片为 https（防止浏览器安全警告）
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 'upgrade-insecure-requests')
  next()
})

async function start() {
  // 检测是否存在 anonymous_token 文件,没有则生成
  if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
    fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8')
  }

  // 启动时更新 anonymous_token
  const generateConfig = require('./generateConfig')
  await generateConfig()

  // 启动网易云 API 服务
  require('./server').serveNcmApi({
    checkVersion: true,
    app, // ✅ 将 express 实例传递给 server.js
  })
}

// ✅ 监听端口（Vercel 自动注入 PORT）
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`✅ API Server running on port ${port}`)
})

start()
