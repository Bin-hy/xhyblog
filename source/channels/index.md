---
title: 频道
date: 2025-11-03 10:00:00
keywords:
  - 频道
  - 专栏
top_img: /images/blogbg.jpg
cover:
---

<div class="channels">
  <div class="channel-card">
    <a href="/categories/旅游/">
      <div class="card-cover" style="background-image: url('/images/ganzhou/1.png')"></div>
      <h3>旅行</h3>
      <p>记录和小叶的旅途与城市印象</p>
    </a>
  </div>
  <div class="channel-card">
    <a href="/categories/技术文档/">
      <div class="card-cover" style="background-image: url('/images/chongqing/1.jpg')"></div>
      <h3>技术文档</h3>
      <p>Git/SSH 等开发笔记与实用技巧</p>
    </a>
  </div>
  <div class="channel-card">
    <a href="/categories/个人生活/">
      <div class="card-cover" style="background-image: url('/images/blogbg.jpg')"></div>
      <h3>个人生活</h3>
      <p>生活随记与感悟</p>
    </a>
  </div>
</div>

<style>
.channels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.channel-card {
  border-radius: 12px;
  overflow: hidden;
  background: var(--card-bg, rgba(255,255,255,0.75));
  backdrop-filter: saturate(180%) blur(8px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
}
.channel-card .card-cover {
  width: 100%;
  aspect-ratio: 16/9;
  background-size: cover;
  background-position: center;
}
.channel-card h3 { 
  margin: 12px 14px 6px; 
  font-weight: 600; 
}
.channel-card p { 
  margin: 0 14px 14px; 
  color: var(--text-secondary, #666); 
}
.channel-card a { display: block; color: inherit; }
.channel-card:hover { transform: translateY(-2px); transition: transform .2s ease; }

@media (max-width: 900px) {
  .channels { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .channels { grid-template-columns: 1fr; }
}
</style>