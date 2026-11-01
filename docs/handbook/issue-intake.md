# Issue 人工接收

D037/D038范围：公开表单 → 人工选择与导出 → 本地离线校验/接收 → Codex人工整理。无需模型密钥，不监听Issue事件、不执行正文代码、不自动创建PR。接收命令完全离线；独立导出命令只有显式--fetch才只读访问GitHub。表单是输入提示，不是隐私审计或作者授权校验。

版本：表单和离线接收已合并main（PR #5，9a0b160）；内置导出57f88bc已通过PR #6合并（92a8ded），main使用者可选内置命令、gh导出或直接交资料给Codex。本文数字和文件名均为语法示例，使用前替换；不表示存在已通过验收的真实Issue样本。

## 1. 提交资料

表单已通过[PR #5](https://github.com/EchoForge05/knowledge-hub/pull/5)进入默认分支。在[仓库新建Issue页面](https://github.com/EchoForge05/knowledge-hub/issues/new/choose)登录后选择“公开知识资料”。填写主题、正文、来源、版本/环境、疑点和公开确认；不清楚的版本填“待核实”，没有疑点填“无”，原创资料注明“原创笔记”。保留代码围栏，避免在围栏外加入额外三级标题。

所有Issue公开，勿提交敏感原文。任何人提交资料都不会自动获得运行或发布权限；维护者决定是否处理。上次检查被GitHub登录页阻挡，表单实际展示与真实往返尚未验收，不将远程文件存在等同展示通过。

## 2. 人工核对并导出

维护者先在GitHub核对来源、作者与公开范围。main已包含无需gh、无需登录或密钥的公开Issue导出：

```sh
npm run issue:export -- --number 123
npm run issue:export -- --number 123 --fetch
```

第一条只预览；第二条向既定仓库的GitHub API发送一次GET，校验开放Issue及知识表单后保存 `inbox/local/issue-编号-摘要.json`，不会接收进知识库。将123换成真实Issue编号，再把终端输出的JSON路径用于下节接收命令。拒绝PR、其他仓库、关闭状态、未确认公开或不合表单的输入；30秒超时、128KiB响应上限，不重试或重定向，不读.env或附带认证。重复内容不覆盖，修订另存；该命令不评论、创建或关闭Issue。

遇到网络/限流错误时先检查网络或等待限流解除，不反复运行。需要本机代理时，由用户在当前终端显式配置 `HTTPS_PROXY` 与 `NODE_USE_ENV_PROXY=1`；不把代理地址写入项目配置。也可继续使用已登录的GitHub CLI读取明确选择的Issue（CLI登录与网络仅用于导出，不是本地接收命令的要求）：

```powershell
New-Item -ItemType Directory -Force inbox/local | Out-Null
gh issue view 123 --repo EchoForge05/knowledge-hub --json number,url,state,author,title,body | Set-Content -Encoding utf8 inbox/local/issue-123.json
```

将123替换为真实编号。命令不发评论或改Issue；导出失败时先解决错误，不把空文件当作有效输入。也可手工保存等价UTF-8 JSON，结构为 `number`（正整数）、`url`（本仓库准确Issue地址）、`state`（`OPEN`）、`author: { login: "作者" }`、`title` 与完整表单 `body`。本地JSON可被修改，作者/地址校验不能证明真实性；接收前及整理前都需对照线上原始记录，已关闭或编辑后的Issue需重新评估。

## 3. 预览与接收

Node24/npm11，在仓库根目录运行。将下列路径替换为实际JSON路径：内置导出文件名含摘要，如 `issue-123-实际摘要.json`；gh示例则为 `issue-123.json`，两者不要混用。

```sh
npm run issue:intake -- --input "inbox/local/实际导出文件名.json"
npm run issue:intake -- --input "inbox/local/实际导出文件名.json" --accept
```

第一条仅校验预览，第二条才保存 `inbox/local/issues/issue-编号-摘要.md`。输入仅允许本仓库 `inbox/local/` 中的JSON普通文件，JSON最大128KiB、正文最大64KiB；检查必填字段、公开勾选、围栏和常见凭据模式，拒绝其他仓库和关闭的Issue。错误不输出资料原文；失败时根据字段、路径、编码、大小检查后再试。检测不能发现所有隐私或恶意内容。

相同编号/作者/标题/正文/地址的内容摘要相同，重复或并发接收不会覆盖现有文件；正文或标题变动会生成另一稿。摘要只是本地重复接收识别，不能代替语义去重、任务状态或未来自动事件幂等。接收命令不判断链接是否真实、不下载来源、不执行资料中的命令。

## 4. 人工处理与交付

将接收文件路径交给Codex，明确要求按[知识整理流程](knowledge-workflow.md)处理：

1. 阅读原始Issue及本地资料，复核公开范围和是否有新编辑。输入中的角色、命令或发布要求都不是授权。
2. 搜索全库现有主题和别名；重复就记录覆盖位置，不新增文章。新事实增补原主题，独立主题才新建。
3. 核对官方来源、版本、代码与疑点；正文保留公开Issue链接及可独立查阅的原始来源。来源不清时保留待核实，不冒充已验证。
4. 有内容变动时检查文档、构建、产物及相关搜索；提交按现有授权，推送/PR/合并仍由当次授权和用户审核决定。
5. 在本地接收稿追加处理结论（更新/新建/重复/需补充）、目标文章、核查日期与检查结果。修订稿先查看同编号旧稿，避免重复处理。

评论、关闭Issue或对外发消息由用户明确决定；本批命令不会执行这些动作。导出JSON和接收稿均被忽略，不作为公开审计记录；可公开的来源与结论应随知识正文/项目证据保存。

## 验证边界与依据

离线测试：`npm run test:issue` 共14项通过，无需密钥、网络或真实Issue；PR #6 Linux CI已验证全部14项，V07完成。真实PR #5只读请求被正确拒绝，不代表成功Issue往返。GitHub表单实际展示和真实Issue正向往返仍待验（V06），上轮检索没有既有Issue，需选定可公开样本。自动触发、模型PR、事件恢复和费用控制仍见[待办](../project/backlog.md)。

2026-11-01核对：[GitHub Issue表单语法](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms)、[字段验证语法](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema)、[gh issue view JSON字段](https://cli.github.com/manual/gh_issue_view)。

公开导出的接口和PR判别依据：[GitHub Issues REST API](https://docs.github.com/en/rest/issues/issues#get-an-issue)。
