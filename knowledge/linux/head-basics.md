# Linux 文本查看：head

本文针对 Linux 上的 GNU Coreutils `head`，不覆盖 BSD 扩展选项。

## 查看文件开头

`head` 默认输出文件的前 10 行；`-n` 指定行数。未指定文件时可从标准输入读取。

```sh
head -n 20 notes.txt
```

示例要求当前目录已有 `notes.txt`。

## 行数与字节数

`-n` 按行选择，`-c` 按字节选择。处理 UTF-8 文本时，字节边界不一定是完整字符边界；阅读普通文本通常先按行查看。

<details>
<summary>适用范围与官方来源</summary>

适用环境：Linux 上的 GNU Coreutils `head`；依据官方当前手册源码核查，日期：2026-10-31。不同实现的扩展选项可能不同，本文不覆盖 BSD 版本。

[GNU Coreutils 官方手册源码：head invocation](https://github.com/coreutils/coreutils/blob/master/doc/coreutils.texi)。官网 HTML 页面在本次核查中超时，改读官方仓库手册源码；未锁定 Coreutils 发布版本，使用扩展选项前应核对本机手册。

</details>
