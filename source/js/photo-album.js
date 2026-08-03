(() => {
  const initializeAlbum = () => {
    const album = document.querySelector('[data-auto-album]')
    if (!album || album.dataset.initialized === 'true') return

    album.dataset.initialized = 'true'

    const searchInput = album.querySelector('[data-album-search-input]')
    const searchSummary = album.querySelector('[data-album-search-summary]')
    const noResults = album.querySelector('[data-album-no-results]')
    const folders = [...album.querySelectorAll('[data-album-folder]')]
    const cards = [...album.querySelectorAll('[data-album-card]')]
    const totalPhotos = Number(album.dataset.totalPhotos || cards.length)

    album.querySelectorAll('[data-album-target]').forEach(button => {
      button.addEventListener('click', () => {
        const target = document.getElementById(button.dataset.albumTarget)
        if (!target) return

        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })

    if (!searchInput) return

    const filterPhotos = () => {
      const keyword = searchInput.value.trim().toLocaleLowerCase('zh-CN')
      let visiblePhotos = 0

      cards.forEach(card => {
        const matches = !keyword || card.dataset.albumSearch.includes(keyword)
        card.hidden = !matches
        if (matches) visiblePhotos += 1
      })

      folders.forEach(folder => {
        folder.hidden = !folder.querySelector('[data-album-card]:not([hidden])')
      })

      noResults.hidden = visiblePhotos !== 0
      searchSummary.textContent = keyword
        ? `找到 ${visiblePhotos} 张照片`
        : `显示全部 ${totalPhotos} 张照片`
    }

    searchInput.addEventListener('input', filterPhotos)
  }

  document.addEventListener('DOMContentLoaded', initializeAlbum)
  document.addEventListener('pjax:complete', initializeAlbum)
})()
