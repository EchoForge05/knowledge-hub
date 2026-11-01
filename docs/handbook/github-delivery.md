# GitHub 检查与 Pages 交付

更新日期：2026-11-01（Asia/Shanghai）。D027 已授权推进 P4，当前仓库读写和草稿 PR 已完成，本地配置与复验通过；真实 PR 成功及隔离分支 CI 失败/修复已验收，Pages 尚未验收。D012 的用户审核 PR 并合并约定仍有效。P5 等用户确认 AI 服务后再开工。

D029 已解除 D028 暂缓，授权本轮完整复验、同步文档后一次中文提交及 push；用户补充缺失时先创建仓库。现已创建公开仓库并完成首次正常推送，草稿 PR #1 已建立。本轮验证与边界见[汇总](../project/full-validation.md)，不自动合并或提前部署。

本地续接结果：文件名搜索已修复并通过 14 组浏览器回归，依赖修复兼容路径已核查（当前稳定依赖范围内没有已发布修复候选，风险未消除），P2/P3 历史快照隔离构建通过，见[本地遗留验证](../project/local-followup-validation.md)。实际 revert/线上回退和 Pages 仍未完成；CI 证据见下文。

## 已准备的配置

- [检查工作流](../../.github/workflows/check.yml)：面向 main 的 PR、短期分支 push 和手动运行；contents:read，禁用 checkout 凭据持久化和自动缓存，单任务超时 10 分钟。不使用 pull_request_target，不调用模型。
- [发布工作流](../../.github/workflows/pages.yml)：只处理 main 的 push/手动运行。构建任务依次安装锁定依赖、检查 Markdown、构建并检查产物，成功后上传 knowledge/.vitepress/dist；部署任务依赖构建成功，单独授予 pages:write/id-token:write。部署前通过 GitHub API 比较 main 当前 SHA，拒绝过时提交；并发组取消旧运行。真实并发效果尚未验证。
- Node 24.22.1、npm 11.19.1，安装使用 npm ci --ignore-scripts；本机 Windows 重装后已验证构建。Ubuntu runner 已通过真实检查，成功与失败/修复记录见下文；Pages 平台行为仍须部署验收。
- 工作流引用已核查的官方 actions/checkout@v7、setup-node@v7、configure-pages@v5、upload-pages-artifact@v3、deploy-pages@v4；目前按主版本标签引用，未锁定提交 SHA。

## 本地验证与限制

1. 首次离线 ci 因当前沙箱缓存缺 zwitch 包失败；改为按锁文件联网 ci --ignore-scripts，126 个包安装成功，项目依赖与锁文件未改。
2. 文档检查通过（28 份 Markdown/105 处链接，交付文档新增前）；构建 2.39 秒，11 个 HTML/275 处资源、页面和锚点引用检查通过。
3. 临时工具目录安装 yaml 2.8.1，两个工作流 YAML 解析及无重复键检查通过；触发事件、分支门槛、权限、构建依赖和命令检查通过。不等于 actionlint、完整 GitHub schema 或真实 runner 验证。
4. 在忽略的隔离夹具中运行真实文档检查脚本，坏链接 exit 1；补齐目标后 exit 0。没有在正式知识库留下故障输入。这是本地失败路径证据，远程分支失败路径现已执行，见下文；未制造 PR 事件的故障运行。
5. npm audit 实际报告 3 项（2 moderate、1 high），来自现有 VitePress/Vite/esbuild 开发工具链；未运行 audit fix 或强制升级。官方公告及报告保存于验收证据；补丁兼容性评估留路线图。生产上传目录只含静态产物，不包含 node_modules 或开发服务器。不能把构建通过描述为依赖安全审计通过。

实际本地证据见[验证记录](../project/evidence/p4/local-checks.json)。

## 远程推进顺序

1. 已完成：正常 GCM 登录，官方 API 核对 EchoForge05/ID44670012 后创建 public 空仓库；连接器复核 public 和写权限。此前失败保留在讨论历史，不再作为当前阻塞。
2. 目标 origin 已在本地配置为 https://github.com/EchoForge05/knowledge-hub.git 。网络和登录就绪后只读验证 refs，再确认远程 main 历史；若远程已有提交，先比较，不覆盖、不强推。若需创建仓库，使用既定公开空仓库方向，不初始化额外 README/许可证提交。
3. main=1a6cb54 与功能分支既有历史=14cc80b 已正常推送且 refs 一致，[草稿 PR #1](https://github.com/EchoForge05/knowledge-hub/pull/1)已建立。42bdcd6 已推送且真实 PR CI 成功；本次按续开发要求在独立 codex/ci-validation 分支保留两次必要验证提交，坏链接失败、移除后成功，文件树完全恢复且不合并该分支。
4. 在仓库 Pages 设置选择 GitHub Actions，确保 github-pages 环境只允许 main。设置操作需正常账号权限；不得新建令牌或扩大权限来绕过登录缺失。
5. 用户审核并合并 PR 后，检查发布工作流运行与实际 URL；逐项验证首页、深层链接、图片、中文/英文/代码搜索、结果跳转及手机视口。预期地址为 https://EchoForge05.github.io/knowledge-hub/ ，当前尚不存在已验证的站点，不能当作可访问结果提供。

## 故障与回退

- 安装、文档或构建失败：停止上传/部署，先修复失败步骤。真实“失败不发布”与新旧并发运行的效果需用运行证据确认。
- Pages 构建源或权限错误：检查 Pages 来源、environment 限制和部署任务权限，按官方错误定位，不输出令牌。
- 发布内容错误：记录出问题的提交/运行，选择已验证的历史提交，在本地验证后通过 revert PR 恢复；用户审核合并后由新 main 构建发布。不强推、不清除历史；真实线上回退当前未执行。
- 需要重新部署时，手动运行发布工作流只选 main；旧提交重跑会被部署前的 SHA 检查拒绝。回退应创建 main 上的新恢复提交。

## 官方依据

核查日期：2026-11-01。VitePress 部署依据使用本项目稳定版文档，不将 2.0 alpha 配置直接照搬。

- [VitePress 1.6.4 部署说明](https://vuejs.github.io/vitepress/v1/guide/deploy)
- [checkout v7 定义](https://raw.githubusercontent.com/actions/checkout/v7/action.yml)、[setup-node v7 定义](https://raw.githubusercontent.com/actions/setup-node/v7/action.yml)
- [configure-pages v5](https://raw.githubusercontent.com/actions/configure-pages/v5/action.yml)、[upload-pages-artifact v3](https://raw.githubusercontent.com/actions/upload-pages-artifact/v3/action.yml)、[deploy-pages v4](https://raw.githubusercontent.com/actions/deploy-pages/v4/action.yml)

## 真实 CI 验收（P4-02）

2026-11-01：42bdcd6 的 [PR 运行成功](https://github.com/EchoForge05/knowledge-hub/actions/runs/41264722214)；隔离分支 c353df9 的 [坏链接运行失败](https://github.com/EchoForge05/knowledge-hub/actions/runs/41265093401)，确认 check exit 1 且 build/check:site 跳过；6e06b24 移除夹具后 [恢复运行成功](https://github.com/EchoForge05/knowledge-hub/actions/runs/41265169454)。验证分支文件树与 42bdcd6 一致，未合并夹具。故障/恢复事件是 push，成功 PR 事件独立保留；原始摘要见 [CI 证据](../project/evidence/p4/remote-ci.json)。

P4-02 已归档。下一步由用户审核合并 PR #1，再配置/核验 Pages 来源和环境限制、观察 main 发布，并验证公开站点。当前未提前部署或验证线上回退。
