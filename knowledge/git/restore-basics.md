# Git 恢复：工作区与暂存区

**恢复工作区可能丢弃对应路径的未提交改动。** 先检查状态及工作区、暂存区差异，确认需要保留的内容已经妥善保存，再决定是否恢复。不要把恢复命令作为只读检查命令使用。

## 恢复目标与默认来源

恢复前先区分工作区、暂存区（index）和 HEAD。目标与来源是两个不同问题；下面的默认来源均以没有显式指定 `--source` 为前提。

| 命令模式 | 恢复目标 | 默认来源 |
| --- | --- | --- |
| `git restore -- <路径>` | 工作区 | 暂存区 |
| `git restore --staged -- <路径>` | 暂存区 | HEAD |
| `git restore --staged --worktree -- <路径>` | 暂存区和工作区 | HEAD |

只指定 `--staged` 时，工作区内容不变，常用于取消暂存；它与同时恢复工作区不同。以上模式改变文件内容或暂存状态，不创建新的提交。

## 显式指定来源

`--source=HEAD` 可明确选择 HEAD；来源也可指定提交、分支或标签。它与 `--staged`、`--worktree` 配合决定从哪里取内容、写到哪里。

以下路径为虚构示例：

```sh
git restore --source=HEAD --worktree -- restore_note_example.md
git restore --source=HEAD --staged --worktree -- restore_note_example.md
```

第一条从 HEAD 恢复工作区，第二条同时恢复暂存区和工作区。示例路径不代表仓库中存在这个文件。

## 相关知识

操作前可用[工作区与暂存区差异检查](diff-basics.md)确认比较范围。

<details>
<summary>适用范围与官方来源</summary>

适用环境：Git 2.55.0 官方 git-restore 手册中的基本模式；核查日期：2026-11-01。本文为官方公开资料摘要，命令示例未执行，不涉及合并冲突或子模块恢复。

[Git 官方：git-restore 2.55.0](https://git-scm.com/docs/git-restore/2.55.0)，重点为 DESCRIPTION、`--source`、`--staged` 与 `--worktree` 说明。

</details>
