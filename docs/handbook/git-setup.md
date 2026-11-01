# Git 连接与交付

- 远程：公开仓库 https://github.com/EchoForge05/knowledge-hub.git ，HTTPS。
- 身份：EchoForge05；仓库局部邮箱 44670012+EchoForge05@users.noreply.github.com，基于已核实账号 ID；不改全局配置。
- main已合并PR #1/#2/#3、[PR #5](https://github.com/EchoForge05/knowledge-hub/pull/5)及PR #6；PR #5合并点9a0b160包含无密钥Issue表单和离线接收，main跟踪关系保留，后续交付见下一项。
- D039已正常推送feat/issue-export，PR #6锁定head=83e91b1，CI成功后合并为92a8ded，Pages成功；导出57f88bc及Spring知识均已进入main，本地main已同步。收尾回执通过docs/d039-delivery交付后切回main，最终SHA以Git实查为准，旧分支保留。
- codex/ci-validation保留坏链接拦截及恢复的两次实验提交，未合并；相对分叉点净差异为空，不作为待交付功能。
- 正常 GCM 登录，凭据不输出或保存。网络按命令复用本机已有代理，不改系统设置；失败先查原因，不强推。

提交后核对作者、中文消息、工作区；获准推送后用 ls-remote 与 PR 核对 SHA。读取成功不等于写权限，未运行不写成通过。既有登录与权限每次按实际状态核对，不把历史回执当作永久有效。

首次配置、授权、认证及远程读写过程见[历史记录](../history/2026-11-01/handbook/git-setup.md)，日常操作见[发布与回退](github-delivery.md)。
