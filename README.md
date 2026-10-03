## 本仓库的 Pages 部署与修正

- 在 Cloudflare 创建新的 Pages 项目，连接本仓库的 main 分支。
- 框架选 None，构建命令留空，构建输出目录填 /（仓库根目录）。根目录的 _worker.js 使用 Pages Advanced Mode。
- 后续 main 提交自动部署；上游更新合并前请保留本仓库的修正。
- Clash 由本站直接生成，支持 Trojan/VLESS/VMess、IPv6 和自定义 WS 路径；小火箭使用本站 Base64 订阅。其他转换按钮仍使用原项目的第三方转换服务。
- GitHub/IP API 候选遵循协议选择及“仅 TLS”选项。
- 填入的域名、密码及 WS 路径必须与自己的代理后端一致。Trojan 密码不要求 UUID 格式。
- 本工具只生成候选订阅，不会在客户端实测或保证速度。它不提供代理后端，也不改变出口国家。
- 不要把真实节点密码或订阅链接提交到公开仓库。订阅 URL 包含节点凭据，请勿公开。

---

# 服务器优选工具

一个简化版的Cloudflare Workers优选工具，用来生成订阅链接。

GitHub: https://github.com/byJoey/yx-auto

## 主要功能

- 优选域名：内置了一些常用的优选域名
- 优选IP：从wetest.vip获取动态IP，支持IPv4/IPv6
- GitHub优选：可以从GitHub仓库拉取IP列表
- 多协议支持：VLESS、Trojan、VMess
- 多客户端格式：Clash、Surge、Quantumult X等
- 运营商筛选：可以按移动/联通/电信筛选

## 部署

1. 去Cloudflare Dashboard，找到Workers & Pages
2. 创建个新Worker
3. 把`_worker.js`的代码复制进去
4. 保存部署就完事了

## 使用

打开你的Worker地址，会看到一个界面：

1. 填域名和UUID
2. 选协议（VLESS/Trojan/VMess）
3. 选客户端类型
4. 点按钮生成订阅链接

就这么简单。

## 订阅链接格式

生成的链接大概长这样：
```
https://your-worker.workers.dev/{UUID}/sub?domain=your-domain.com&epd=yes&epi=yes&egi=yes
```

可以通过`&target=`参数指定输出格式：
- `base64` - 默认格式
- `clash` - Clash配置
- `surge` - Surge配置  
- `quantumult` - Quantumult配置

## URL参数

所有配置都通过URL参数控制，不需要环境变量。

主要参数：
- `domain` - 你的域名（必填）
- `epd` - 启用优选域名（默认yes）
- `epi` - 启用优选IP（默认yes）
- `egi` - 启用GitHub优选（默认yes）
- `piu` - 自定义IP来源URL（可选）
- `ev` - 启用VLESS（默认yes）
- `et` - 启用Trojan（默认no）
- `mess` - 启用VMess（默认no，注意不是vm，会被屏蔽）
- `ipv4/ipv6` - IP版本选择（默认都开启）
- `ispMobile/ispUnicom/ispTelecom` - 运营商筛选（默认都开启）
- `target` - 输出格式（base64/clash/surge/quantumult）

## 注意事项

- 这只是一个订阅生成工具，不提供代理服务
- 生成的节点需要配合你自己的服务器使用
- UUID必须是标准格式（xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx）
- VMess参数用的是`mess`不是`vm`，因为`vm`会被某些地方屏蔽
