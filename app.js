#!/usr/bin/env node
/**
 * 网易云音乐 API Enhanced - Vercel Serverless 兼容版
 * 作者: Zhangxingxing66
 */

const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()
const express = require('express')
const cors = require('cors')

const app = express()

// ✅ 启用 CORS（前端 Vue3-Music 可以直接请求）
app.use(cors())

// ✅ 自动升级 http 图片为 https，避免浏览器安全错误
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 'upgrade-insecure-requests')
  next()
})

// ✅ 异步启动函数
async function start() {
  // 检查 anonymous_token 文件
  const tokenPath = path.resolve(tmpPath, 'anonymous_token')
  if (!fs.existsSync(tokenPath)) {
    fs.writeFileSync(tokenPath, '', 'utf-8')
  }

  // 生成配置文件
  const generateConfig = require('./generateConfig')
  await generateConfig()

  // 启动网易云 API 服务（传入 express app 实例）
  require('./server').serveNcmApi({
    checkVersion: true,
    app,
  })
}

// ✅ 启动
start()

// ⚠️ 不要使用 app.listen()
// 在 Vercel 上需要导出 app 实例以供 Serverless 调用
module.exports = app
