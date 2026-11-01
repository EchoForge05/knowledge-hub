# Git 配置与连接记录

> 历史快照：2026-11-01 文档精简前记录。保留当时结论及后续更正，不作为当前状态或新授权；当前入口见[历史库索引](../../README.md).

当前执行边界（D029，2026-11-01）：用户已恢复本轮完整复验、文档同步后一次中文提交及 push，并要求缺失时先创建仓库。公开空仓库已创建，既有历史已正常推送，草稿 PR #1 待用户审核；不强推、不自动合并、不提前部署。

更新日期：2026-11-01（Asia/Shanghai）。本地提交与 GitHub 认证是两件事；本地 Commit 成功不代表远程已连通。

## 已确认与实际配置

| 项目 | 状态 |
| --- | --- |
| 本地目录 | `D:\Project\Codex Project\knowledge-hub` |
| 本地分支 | 基础分支 `main`；P2 为 `dbf620f`，P3 前置计划为 `70c8365`，P3 成果为 `14cc80b`；当前从 P3 成果创建 `feat/pages-ci`，既有历史已推送，本轮新增成果按 D029 一次提交更新 PR |
| 目标远程 | `https://github.com/EchoForge05/knowledge-hub.git`，D027 后已设置本地 origin，读回正确；本轮已验证真实读写 |
| 目标公开性 | 公开，免费方案 |
| 协议 | HTTPS |
| 提交姓名 | `EchoForge05`，用户提供，只写入本仓库配置 |
| 提交邮箱 | `44670012+EchoForge05@users.noreply.github.com`，Agent 采用 GitHub 标准格式，只写入本仓库配置 |
| Git Credential Manager | 已安装 2.8.0；本轮正常 browser 登录 exit 0，账号列表确认为 EchoForge05 |
| GitHub 连接器 | 已验证登录账号 EchoForge05，ID 44670012；这不是本地 Git 凭据 |
| 远程仓库 | 本轮已创建 public 空仓库，ID1441409907，连接器复核正确 |

邮箱根据已核实账号 ID 与 GitHub 官方 `ID+USERNAME@users.noreply.github.com` 格式选择，并非猜测用户私人邮箱。依据：[GitHub 邮箱参考](https://docs.github.com/en/account-and-profile/reference/email-addresses-reference)。未进入账号设置修改邮箱、密码或其他安全选项。

## 历史检查和限制（本轮前）

- 基础提交为 `1a6cb54 chore: initialize knowledge hub and preserve planning decisions`，此前已复核。本轮通过 `git log -3` 与 `git show --format=fuller --no-patch dbf620f` 确认 P2 提交及其作者、中文说明；初始工作区干净。后续文档归档使用独立分支；最新提交凭证查看 `git log -1`，不将基础提交与文档提交混同。
- `git config --local --get user.name` 与 `git config --local --get user.email`：已读回上述身份。
- 历史 `git remote -v` 无远程；D027 后已配置并读回上述 origin。本次 `git ls-remote` 报连接重置，未证明远程读取或写入权限；没有 Push/Pull。
- `git credential-manager github list`：沙箱内返回 Windows 拒绝访问；经正常审批在沙箱外只读复查后，命令成功且未列出已登录账号。没有读取或打印令牌。
- 浏览器尝试被工具停止：Windows 无法可靠识别当前浏览器 URL，未继续 UI 操作，未创建仓库。

## 本轮实际验证（D029）

此前无登录、404、直连超时已处理：正常 GCM 登录后使用本机已有代理 127.0.0.1:7897（仅命令参数，不改全局/系统），官方 API 核对既定账号 ID 后创建 public/auto_init=false 的空仓库。未输出或保存认证凭据；连接器复核 public/admin/push。

main 基线 1a6cb54 与功能分支既有历史 14cc80b 已正常 push，远程 SHA 读回一致；[草稿 PR #1](https://github.com/EchoForge05/knowledge-hub/pull/1)已创建。完整检查与本轮新增成果的提交/push 方法见[验证记录](../project/full-validation.md)，最终提交号由 git log 和 PR 实际记录提供。站点部署尚未验证。

## 后续连接复核方法

1. 先复核已有 EchoForge05 登录，仅凭据失效才使用正常 GitHub/GCM 登录；不在聊天索取密码或令牌。
2. 查明远程 knowledge-hub 是否已经存在；若需要创建，使用公开空仓库，避免自动 README/许可证初始提交产生独立历史。没有实际确认前，不写成“远程已创建”。
3. 在本仓库设置 origin 为上表目标 URL，并用 `git ls-remote origin` 验证可访问。公开仓库的读取成功本身不能证明写权限。
4. 推送需有用户授权；常规交付使用真实变更，不强推。P4-02 按原计划在隔离分支保留可控故障/恢复提交作为远程 CI 验收证据，不合并故障内容。未实际推送前不宣称写入已验证。
5. 首次推送后才算 GitHub 备份可用；站点发布仍属于后续开发阶段。

D019 的一次文档提交已完成：`a102ca7 docs: review and preserve knowledge site development plan`，未推送；本轮通过 `git log -3` 复核。该次授权已使用；D020 本身不包含提交授权，D023 现允许新增开发验证成功后做一次本地提交，每次用中文说明更新内容，不包含推送。P2 已按 D023 提交为 `dbf620f`；本轮用户另行授权更新文档后提交一次（D024），不包含推送。后续应从本文件的事实状态继续，不能把历史“先调通 Git”的目标当作已经完成。

## D031 合并与发布回执

2026-11-01，PR #1 的 head=3bb3e2e、成功 CI 核对后，按用户明确授权以 merge 合并为 ec1d977afda87250cd33f0fdcad9dda793b04d5e。origin/main 已 fetch，当前 docs/pages-delivery 基于该提交保存发布证据与同步文档；前次失败邮件核查的未提交记录已保留。Pages 已实际发布，详见[验收](../project/pages-validation.md)。后续 PR 仍待用户审核，不由本次合并授权推定可自动合并。
