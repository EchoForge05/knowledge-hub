# Git 配置与连接记录

更新日期：2026-11-01（Asia/Shanghai）。本地提交与 GitHub 认证是两件事；本地 Commit 成功不代表远程已连通。

## 已确认与实际配置

| 项目 | 状态 |
| --- | --- |
| 本地目录 | `D:\Project\Codex Project\knowledge-hub` |
| 本地分支 | 基础分支 `main`；P2 在 `feat/site-mvp` 提交为 `dbf620f`，P3 前置计划为 `70c8365`；当前从该计划提交创建 `feat/knowledge-pilot`，本批成果按 D023 本地提交，未推送 |
| 目标远程 | `https://github.com/EchoForge05/knowledge-hub.git`，目标已确认，尚未设置 origin |
| 目标公开性 | 公开，免费方案 |
| 协议 | HTTPS |
| 提交姓名 | `EchoForge05`，用户提供，只写入本仓库配置 |
| 提交邮箱 | `44670012+EchoForge05@users.noreply.github.com`，Agent 采用 GitHub 标准格式，只写入本仓库配置 |
| Git Credential Manager | 历史检查已安装 2.8.0、当时未列出已登录账号；本轮未复查登录状态 |
| GitHub 连接器 | 已验证登录账号 EchoForge05，ID 44670012；这不是本地 Git 凭据 |
| 远程仓库 | 历史连接器列表未发现 knowledge-hub，Agent 未创建；本轮未重新查询，远程是否存在仍未验证 |

邮箱根据已核实账号 ID 与 GitHub 官方 `ID+USERNAME@users.noreply.github.com` 格式选择，并非猜测用户私人邮箱。依据：[GitHub 邮箱参考](https://docs.github.com/en/account-and-profile/reference/email-addresses-reference)。未进入账号设置修改邮箱、密码或其他安全选项。

## 已执行检查和限制

- 基础提交为 `1a6cb54 chore: initialize knowledge hub and preserve planning decisions`，此前已复核。本轮通过 `git log -3` 与 `git show --format=fuller --no-patch dbf620f` 确认 P2 提交及其作者、中文说明；初始工作区干净。后续文档归档使用独立分支；最新提交凭证查看 `git log -1`，不将基础提交与文档提交混同。
- `git config --local --get user.name` 与 `git config --local --get user.email`：已读回上述身份。
- `git remote -v`：无远程。没有 Push、Pull 或远程读写权限验证。
- `git credential-manager github list`：沙箱内返回 Windows 拒绝访问；经正常审批在沙箱外只读复查后，命令成功且未列出已登录账号。没有读取或打印令牌。
- 浏览器尝试被工具停止：Windows 无法可靠识别当前浏览器 URL，未继续 UI 操作，未创建仓库。

## 新会话继续调通 Git

1. 使用用户确认的账号 EchoForge05，在正常 GitHub/GCM 登录流程中由用户完成登录与授权；不在聊天中索取密码或令牌。
2. 查明远程 knowledge-hub 是否已经存在；若需要创建，使用公开空仓库，避免自动 README/许可证初始提交产生独立历史。没有实际确认前，不写成“远程已创建”。
3. 在本仓库设置 origin 为上表目标 URL，并用 `git ls-remote origin` 验证可访问。公开仓库的读取成功本身不能证明写权限。
4. 推送需有用户授权；届时使用真实变更推送，不制造测试提交，不强推。未实际推送前不宣称写入已验证。
5. 首次推送后才算 GitHub 备份可用；站点发布仍属于后续开发阶段。

D019 的一次文档提交已完成：`a102ca7 docs: review and preserve knowledge site development plan`，未推送；本轮通过 `git log -3` 复核。该次授权已使用；D020 本身不包含提交授权，D023 现允许新增开发验证成功后做一次本地提交，每次用中文说明更新内容，不包含推送。P2 已按 D023 提交为 `dbf620f`；本轮用户另行授权更新文档后提交一次（D024），不包含推送。后续应从本文件的事实状态继续，不能把历史“先调通 Git”的目标当作已经完成。
