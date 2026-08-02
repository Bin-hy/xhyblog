---
title: 用自己的域名搭建“无限邮箱”：Cloudflare Email Routing 实践
date: 2026-08-02 16:00:00
categories:
  - 技术文档
  - Email
tags:
  - Cloudflare
  - Email Routing
  - DNS
  - 域名邮箱
description: 使用自己的域名和 Cloudflare Email Routing，将任意域名邮箱地址免费转发到常用邮箱。
cover: /images/blogbg.jpg
---

# 起因

今天给自己的域名 `binhy.email` 配置了 Cloudflare Email Routing。

我想要的效果很简单：以后注册不同的网站时，可以使用不同的邮箱地址，例如：

```text
github@binhy.email
openai@binhy.email
aws@binhy.email
leetcode@binhy.email
```

这些地址都能正常接收邮件，但我不需要为它们逐个创建账号，也不需要购买企业邮箱或维护邮件服务器。所有来信都会经过 Cloudflare，最终转发到我平时使用的真实邮箱。

```text
发件人
   │
   ▼
github@binhy.email
   │
   ▼
Cloudflare Email Routing
   │
   ▼
我的常用邮箱
```

整个配置并不复杂，但 MX、SPF、邮箱别名和真实邮箱账号之间很容易混淆。这篇文章记录完整过程，也解释每一步到底解决了什么问题。

# 它并不是真的创建了无限个邮箱

Cloudflare Email Routing 提供的是**邮件转发**，而不是一套完整的邮箱服务。

例如，`github@binhy.email` 并没有自己的收件箱、密码和登录页面。Cloudflare 收到寄给它的邮件后，只负责将邮件转发到我已经拥有的邮箱：

```text
github@binhy.email ──转发──> 我的常用邮箱
```

因此，这套方案准确地说是“近似无限的邮箱别名系统”。开启 Catch-all 后，`@binhy.email` 前面可以按需要填写不同名称，而所有邮件仍由同一个真实邮箱接收。

它特别适合个人开发者用来注册网站、区分邮件来源和保护主邮箱，但不能完全替代企业邮箱。

# 配置前需要准备什么

开始之前，需要准备：

- 一个自己拥有的域名；
- 一个 Cloudflare 账号；
- 一个可以正常收信的真实邮箱；
- 域名注册商后台的 DNS 或 Nameserver 修改权限。

我的域名是 `binhy.email`。真实收件地址涉及隐私，本文统一写作 `private@163.com`。

完整链路如下：

```text
购买域名
  ↓
将域名 DNS 接入 Cloudflare
  ↓
开启 Email Routing
  ↓
添加 Cloudflare 要求的 DNS 记录
  ↓
验证真实收件邮箱
  ↓
开启 Catch-all
  ↓
测试收信
```

# 将域名接入 Cloudflare

登录 Cloudflare Dashboard，选择 **Add a domain**，输入域名 `binhy.email`，然后选择 Free Plan 即可。

添加完成后，Cloudflare 会分配两条 Nameserver，格式类似：

```text
xxx.ns.cloudflare.com
yyy.ns.cloudflare.com
```

接下来回到域名注册商后台，将原来的 Nameserver 替换为 Cloudflare 提供的这两条记录。

Nameserver 的变更需要一段时间才能在全球 DNS 中生效。Cloudflare 中域名状态显示为 **Active** 后，说明域名已经成功接入，可以继续配置邮件转发。

> 如果域名原来已经承载网站或其他服务，切换 Nameserver 前应先确认原有 DNS 记录已经完整导入 Cloudflare，避免网站或接口暂时无法访问。

# 开启 Email Routing

在 Cloudflare 中进入：

```text
binhy.email
  → Email
  → Email Routing
  → Get started
```

Cloudflare 会检查当前 DNS，并给出需要添加的记录。通常包括三条 MX 记录和一条 SPF TXT 记录。

# 配置 MX 记录

MX 是 Mail Exchange 的缩写。它告诉互联网上的发信服务器：

> 寄给 `binhy.email` 的邮件，应该交给哪台邮件服务器处理？

这里最容易犯的错误，是把 MX 的目标写成自己的真实邮箱地址：

```text
MX  @  private@163.com  # 错误
```

邮箱地址不是邮件服务器，不能作为 MX 记录的目标。正确的目标应该是 Cloudflare 提供的邮件服务器：

```text
Type  Name  Target                     Priority
MX    @     route1.mx.cloudflare.net    30
MX    @     route2.mx.cloudflare.net    40
MX    @     route3.mx.cloudflare.net    88
```

上面是我配置时看到的值。实际操作时，应直接使用 Email Routing 页面生成的记录，尤其不要自行猜测或修改优先级。数字越小表示优先级越高，但三条记录都应保留，用于提高邮件接收的可靠性。

如果域名之前使用过其他邮件服务，还需要检查是否存在旧的 MX 记录。多套互相冲突的 MX 记录可能让邮件被送到错误的服务器。

# 配置 SPF

Cloudflare 还会要求添加一条 TXT 记录：

```text
Type: TXT
Name: @
Content: v=spf1 include:_spf.mx.cloudflare.net ~all
```

SPF 是一种邮件身份验证机制，用于声明哪些服务器被允许代表域名处理发信相关操作。对于 Email Routing，直接采用 Cloudflare 控制台给出的 SPF 内容即可。

同一个域名不应该存在多条彼此独立的 SPF 记录。如果域名已经配置过其他邮件发送服务，需要把规则合并成一条，而不是再添加第二条 `v=spf1` 记录。

# 关于 DKIM

DKIM 使用数字签名帮助收件服务器验证邮件来源和内容是否被篡改。它主要与**发信身份验证**有关，并不是开启基础收信转发时都需要手动填写的一条固定记录。

如果 Cloudflare 或之后使用的发信服务要求配置 DKIM，应复制控制台为当前域名生成的主机名和公钥，例如：

```text
Type: TXT
Name: <服务商生成的 selector>._domainkey
Content: v=DKIM1; k=rsa; p=<服务商生成的公钥>
```

这里的 selector 和公钥都不能照抄别人的示例。若 Email Routing 页面没有要求添加 DKIM，则不必为了转发收信而自行编造一条记录。

# 验证真实收件邮箱

进入 Email Routing 的 **Destination addresses** 页面，添加真正用于接收邮件的邮箱，例如：

```text
private@163.com
```

Cloudflare 会向这个地址发送验证邮件。打开邮件并点击验证链接后，它才可以被选作转发目标。

这一步很重要。Cloudflare 不允许未经验证就把邮件转发到任意地址，否则这套功能很容易被滥用。

# 开启 Catch-all

如果只想使用几个固定别名，可以在 **Routing rules** 中分别创建：

```text
github@binhy.email  → private@163.com
openai@binhy.email  → private@163.com
```

但我希望临时写下任何地址都能收信，所以开启了 **Catch-all**，并将目标设置为已经验证的真实邮箱。

配置完成后，下面这些地址无需提前创建：

```text
github@binhy.email
openai@binhy.email
aws@binhy.email
test123@binhy.email
anything@binhy.email
```

只要邮件的域名部分是 `binhy.email`，就会命中 Catch-all 并被转发到我的常用邮箱。这就是“无限邮箱”体验的核心。

# 配置完成后如何测试

不要只看控制台显示为绿色，最好从另一个邮箱实际发送一封测试邮件。

我通常会这样检查：

1. 给一个从未配置过的地址发送邮件，例如 `routing-test@binhy.email`；
2. 等待常用邮箱收到转发邮件；
3. 检查发件人、主题、正文和附件是否完整；
4. 再测试一个固定 Routing Rule，确认它是否按预期覆盖 Catch-all；
5. 查看垃圾邮件目录，避免第一次转发被邮箱服务商误判。

DNS 刚修改时可能存在缓存，短时间内收不到不一定代表配置错误。可以先在 Cloudflare 中确认 Email Routing 状态，再检查 MX、目标邮箱验证状态和 Catch-all 是否都已启用。

# 我准备怎样使用这些地址

最简单的规划方式，是让地址名称直接对应网站或用途：

| 场景 | 示例地址 |
| --- | --- |
| 代码托管 | `github@binhy.email`、`gitlab@binhy.email` |
| AI 服务 | `openai@binhy.email`、`claude@binhy.email` |
| 云服务 | `aws@binhy.email`、`cloudflare@binhy.email` |
| 社交网站 | `twitter@binhy.email`、`reddit@binhy.email` |
| 临时测试 | `test-项目名@binhy.email` |

这样做不只是看起来整齐。如果某个专用地址突然开始收到与对应网站无关的广告邮件，我就能大致判断地址从哪里泄露，并单独为它设置丢弃规则，而不必更换自己的主邮箱。

# `+` 子地址要不要用

邮箱中还有一种常见写法：

```text
github+2026@binhy.email
openai+account1@binhy.email
```

`+` 后面的内容可以作为分类标记，适合区分同一个服务的不同账号或注册批次。不过，一些网站会拒绝包含 `+` 的邮箱地址，还有些网站会在存储时自动去掉 `+` 后缀。

既然自己的域名已经开启 Catch-all，直接使用 `github@binhy.email`、`openai@binhy.email` 这样的独立别名通常更直观，也更稳定。

# 这套方案的优点

## 不需要维护邮件服务器

自建邮件服务器不仅要处理 SMTP、队列、证书和反垃圾邮件，还要维护 IP 信誉。这里只使用 Cloudflare 的收信入口和转发能力，维护成本低得多。

## 可以为每个网站使用不同地址

不需要创建几十个真实邮箱账号。开启 Catch-all 后，需要时现场写一个新地址即可。

## 更容易发现和处理地址泄露

每个网站使用不同别名，垃圾邮件的来源会更加清晰。发现某个地址被滥用后，也可以为它添加规则，不再转发。

## 更有个人辨识度

使用自己的域名，比一串随机字符组成的公共邮箱更容易记忆，也更适合长期经营个人身份。

# 必须知道的限制

Cloudflare Email Routing 支持：

- 接收发给自有域名的邮件；
- 创建自定义邮箱别名；
- 使用 Catch-all 接收任意前缀；
- 将邮件转发到已经验证的真实邮箱。

但它本身不提供：

- 独立邮箱账号和网页版收件箱；
- IMAP 或 POP3；
- 供普通邮箱客户端使用的 SMTP 发信服务；
- 每个别名彼此隔离的邮箱空间。

还有一个很实际的问题：**收到邮件后，直接在真实邮箱中回复，通常不能自动以 `xxx@binhy.email` 的身份发出。** 如果希望对方看到的发件地址也是自己的域名，需要另外配置支持自定义域名的 SMTP 发信服务，并正确设置 SPF、DKIM 和 DMARC。

如果需要完整的域名邮箱，可以考虑 Google Workspace、Zoho Mail 等托管服务，或者自行部署 Mailcow、Mailu。但自建邮件系统的维护成本和送达率问题都明显更高，不适合只想做邮件转发的场景。

# 最终结果

完成配置后，我的邮件链路变成了：

```text
github@binhy.email ─┐
openai@binhy.email ─┼─> Cloudflare Email Routing ─> 我的常用邮箱
aws@binhy.email    ─┤
任意名称@binhy.email ─┘
```

最终需要确认的配置包括：

```text
域名：binhy.email

DNS：
- Cloudflare 提供的 3 条 MX 记录
- Cloudflare 要求的 SPF TXT 记录
- 控制台明确要求时再添加对应的 DKIM 记录

Email Routing：
- 真实收件邮箱已验证
- Catch-all 已开启
- Catch-all 指向真实收件邮箱
```

现在，无论是注册开发平台、AI 服务还是临时测试，我都可以为它单独使用一个 `@binhy.email` 地址，而所有邮件仍集中在原来的邮箱中管理。

这不是一套真正拥有无限独立账户的邮件系统，但对于个人开发者而言，它用很低的成本解决了邮箱分类、隐私保护和个人域名展示三个问题。只要记住它负责的是“收信转发”，而不是完整的“邮箱托管”，这套方案就非常实用。
