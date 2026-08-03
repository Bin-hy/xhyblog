'use strict'

const fs = require('fs')
const path = require('path')

const IMAGE_EXTENSIONS = new Set([
  '.avif',
  '.bmp',
  '.gif',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.webp'
])

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function encodeImageUrl(relativePath) {
  return `/images/${relativePath
    .split(path.sep)
    .map(segment => encodeURIComponent(segment))
    .join('/')}`
}

function collectImages(directory, baseDirectory, result = []) {
  if (!fs.existsSync(directory)) return result

  const entries = fs.readdirSync(directory, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue

    const absolutePath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      collectImages(absolutePath, baseDirectory, result)
      continue
    }

    if (!entry.isFile()) continue

    const extension = path.extname(entry.name).toLowerCase()
    if (!IMAGE_EXTENSIONS.has(extension)) continue

    result.push(path.relative(baseDirectory, absolutePath))
  }

  return result
}

function compareNames(left, right) {
  return left.localeCompare(right, 'zh-CN', {
    numeric: true,
    sensitivity: 'base'
  })
}

function renderAlbum() {
  const imageRoot = path.join(hexo.source_dir, 'images')
  const imagePaths = collectImages(imageRoot, imageRoot).sort(compareNames)
  const folders = new Map()

  for (const relativePath of imagePaths) {
    const folderPath = path.dirname(relativePath)
    const folderName = folderPath === '.' ? '根目录' : folderPath.split(path.sep).join(' / ')

    if (!folders.has(folderName)) folders.set(folderName, [])
    folders.get(folderName).push(relativePath)
  }

  const folderEntries = [...folders.entries()].sort(([left], [right]) => compareNames(left, right))
  const folderCount = folderEntries.length
  const photoCount = imagePaths.length

  if (photoCount === 0) {
    return `
      <div class="auto-album auto-album-empty-state">
        <i class="far fa-images" aria-hidden="true"></i>
        <p>暂时还没有照片。把图片放进 <code>source/images</code> 后重新构建即可。</p>
      </div>
    `
  }

  const navigation = folderEntries.map(([folderName, images], index) => `
    <button class="album-folder-button" type="button" data-album-target="album-folder-${index}">
      <i class="far fa-folder-open" aria-hidden="true"></i>
      <span>${escapeHtml(folderName)}</span>
      <strong>${images.length}</strong>
    </button>
  `).join('')

  const sections = folderEntries.map(([folderName, images], index) => {
    const cards = images.map(relativePath => {
      const fileName = path.basename(relativePath)
      const displayName = path.basename(fileName, path.extname(fileName))
      const imageUrl = encodeImageUrl(relativePath)
      const searchText = `${folderName} ${fileName}`.toLocaleLowerCase('zh-CN')

      return `
        <figure class="album-photo-card" data-album-card data-album-search="${escapeHtml(searchText)}">
          <img src="${imageUrl}" alt="${escapeHtml(displayName)}" loading="lazy" decoding="async">
          <figcaption title="${escapeHtml(fileName)}">${escapeHtml(displayName)}</figcaption>
        </figure>
      `
    }).join('')

    return `
      <section class="album-folder" id="album-folder-${index}" data-album-folder>
        <div class="album-folder-heading">
          <div>
            <span class="album-folder-kicker">ALBUM ${String(index + 1).padStart(2, '0')}</span>
            <h2>${escapeHtml(folderName)}</h2>
          </div>
          <span class="album-folder-count">${images.length} 张</span>
        </div>
        <div class="album-photo-grid">${cards}</div>
      </section>
    `
  }).join('')

  return `
    <div class="auto-album" data-auto-album data-total-photos="${photoCount}">
      <header class="album-overview">
        <div>
          <span class="album-eyebrow">TRAVEL MEMORIES</span>
          <h2>沿着文件夹，重新走一遍旅途</h2>
          <p>这里会自动收录 <code>source/images</code> 下的图片。新增照片后重新构建博客，相册便会同步更新。</p>
        </div>
        <div class="album-statistics" aria-label="相册统计">
          <div><strong>${folderCount}</strong><span>个文件夹</span></div>
          <div><strong>${photoCount}</strong><span>张照片</span></div>
        </div>
      </header>

      <div class="album-toolbar">
        <label class="album-search">
          <i class="fas fa-search" aria-hidden="true"></i>
          <span class="sr-only">搜索照片</span>
          <input type="search" placeholder="搜索文件夹或照片名称" autocomplete="off" data-album-search-input>
        </label>
        <span class="album-search-summary" data-album-search-summary>显示全部 ${photoCount} 张照片</span>
      </div>

      <nav class="album-folder-navigation" aria-label="相册文件夹">${navigation}</nav>
      <p class="album-no-results" data-album-no-results hidden>没有找到匹配的照片。</p>
      <div class="album-folders">${sections}</div>
    </div>
  `
}

hexo.extend.tag.register('auto_album', renderAlbum)
