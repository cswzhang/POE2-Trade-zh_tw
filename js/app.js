chrome.storage.local.get(['updated', 'UILanguage'], ({ updated, UILanguage }) => {
    addScript('var __ = ' + JSON.stringify(UILanguage))
    
    let localUpdated = localStorage['local-updated'] || 0
    if (+updated > +localUpdated) {
        chrome.storage.local.get(['translation'], ({ translation }) => {
            localStorage['lscache-trade2items'] = JSON.stringify(translation.items.result)
            localStorage['lscache-trade2stats'] = JSON.stringify(translation.stats.result)
            localStorage['lscache-trade2data'] = JSON.stringify(translation.static.result)
			localStorage['lscache-trade2filters'] = JSON.stringify(translation.zh_filters.result)
        })
        localStorage.removeItem('lscache-trade2items-cacheexpiration')
        localStorage.removeItem('lscache-trade2stats-cacheexpiration')
        localStorage.removeItem('lscache-trade2data-cacheexpiration')
		localStorage.removeItem('lscache-trade2filters-cacheexpiration')
        localStorage['local-updated'] = +new Date()
        translation = null
    }
})

let addScript = (scriptString) => {
    let script = document.createElement('script')
    script.innerText = scriptString
    document.head.appendChild(script);
}