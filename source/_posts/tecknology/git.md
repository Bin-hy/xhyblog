---
title: git 常用命令
categories:
  - 技术文档
  - git
  - git 常用命令
date: 2025-03-18 09:54:03
tags:
  - git
  - github
keywords:
  - git
  - 基础命令
top_img:
cover:
---

# 我的常用git命令
近期在频繁使用git很多命令不熟练，记录和学习一下
## 分支操作
1. 创建与切换分支
```bash
git branch                   # 查看本地所有分支
git branch <branch-name>     # 创建新分支（不切换）
git checkout <branch-name>   # 切换到已有分支
git checkout -b <branch-name>  # 创建并切换到新分支（常用！）
```
2. 分支合并
```bash
git merge <branch-name>      # 将指定分支合并到当前分支
git merge --no-ff <branch-name>  # 强制生成合并提交（保留分支历史）
git rebase <branch-name>     # 变基（将当前分支的提交“移植”到目标分支）
```
3. 删除分支
```bash
git branch -d <branch-name>  # 删除本地分支（已合并的分支）
git branch -D <branch-name>  # 强制删除本地分支（未合并的分支）
git push origin --delete <branch-name>  # 删除远程分支
```
4. 查看分支关系
```bash
git log --oneline --graph    # 图形化查看提交历史
git branch -v                # 查看分支最后提交信息
git remote show origin       # 查看远程分支跟踪关系
```
## 远程仓库同步
1. 推送（Push）
```bash
git push origin <branch-name>    # 推送本地分支到远程
git push -u origin <branch-name> # 推送并设置远程跟踪（首次推送常用）
git push --force origin <branch-name>  # 强制推送（覆盖远程分支，慎用！）
```
2. ​拉取（Pull）​
```bash
git pull origin <branch-name>    # 拉取远程分支并合并到当前分支
git fetch origin                 # 仅拉取远程更新（不自动合并）
git fetch origin <branch-name>:<local-branch>  # 拉取远程分支到本地新分支
```
3. 跟踪远程分支
```bash
git checkout -t origin/<branch-name>  # 创建本地分支并跟踪远程分支
git branch -u origin/<branch-name>    # 设置当前分支跟踪远程分支
```

## 高频衍生操作
1. ​暂存与恢复工作区
```bash
git stash               # 临时保存未提交的修改
git stash pop           # 恢复最近一次暂存的修改
git stash list          # 查看所有暂存记录
```
2. ​撤销与重置
```bash
git reset --hard HEAD^  # 回退到上一个提交（丢弃工作区修改）
git revert <commit-id>  # 撤销指定提交（生成新提交保留历史）
git checkout -- <file>  # 丢弃某个文件的未提交修改
```
3. ​冲突解决
```bash
git diff                # 查看冲突文件差异
git mergetool           # 使用图形化工具解决冲突（需提前配置）
git add <file>          # 标记冲突已解决
```