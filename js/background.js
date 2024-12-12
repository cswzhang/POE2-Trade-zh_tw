// chrome.runtime.onInstalled.addListener((details) => {
//   const currentVersion = chrome.runtime.getManifest().version
//   const previousVersion = details.previousVersion
//   const reason = details.reason
//   console.log(`Previous Version: ${previousVersion}`)
//   console.log(`Current Version: ${currentVersion}`)
//   switch (reason) {
//     case 'install':
//       console.log('New User installed the extension.')
//       break
//     case 'update':
//       console.log('User has updated their extension.')
//       //   if (currentVersion !== previousVersion) {
//       //     chrome.tabs.create({ url: 'https://baconrad.dev/' })
//       //   }
//       break
//     case 'chrome_update':
//     case 'shared_module_update':
//     default:
//       console.log('Other install events within the browser')
//       break
//   }
// })
let localdateselect_str
let skip_str

chrome.storage.onChanged.addListener((changes) => {
    for (let key in changes) {
        let value = changes[key].newValue
        if (key === 'language') {changeLanguage(value)}
        if (key === 'uiLanguage') {changeUILanguage(value)}
        if (key === 'localdateselect') {changelocaldateselect(value)}
    }
})
let changelocaldateselect = async (select) => {
    chrome.storage.local.set({localdateselect:select})
}    
let changeLanguage = async (language) => {
    if (language === 'zh_tw') {
        let data=await fetchData['us']()
        if(!data){
            window.alert('加载国际服数据失败,请检查是否能正常打开国际服市集!!!')
            chrome.storage.local.set({language: 'us',status: 'done',statusUI: 'done',updated: +new Date()})
            return
        }
        let { items, stats, static,itemname,filters }=await data
        items.result.forEach((category) => {
            let labelarr=itemname[category.id]
            // window.alert(labelarr+'(' + category.label + ')')
            if (!!labelarr){category.label=labelarr + '(' + category.label + ')'}
            category.entries.forEach((item) => {
                if (!!item.text){
					if (!!itemname[item.text])
						item.text = itemname[item.text] + '(' + item.text + ')'
					else{
						item.text='★★★' + item.text
					}
				}else{
					if (!!itemname[item.type])
						item.text = itemname[item.type] + '(' + item.type + ')'
					else{
						item.text='★★★' + item.type
					}
				}
            })
        })
        const passivesNotableFile = chrome.runtime.getURL('json/passivesNotable.json')
        let passivesNotable = await fetch(passivesNotableFile).then((res) => res.json())
        chrome.storage.local.get(['localdateselect','skip'],async ({localdateselect,skip})=>{
            localdateselect_str=localdateselect
            skip_str=skip
            data=await fetchData[language]()
            if(!data){
                window.alert('加载国服数据失败!!!'+localdateselect)
                chrome.storage.local.set({language: 'us',status: 'done',statusUI: 'done',updated: +new Date()})
                return
            }
            let { stats: zh_stats, static: zh_static,filters:zh_filters }=data
            if (!!zh_stats?.result?.entries) {
                let translate_stat = {}
                let affix = {}
                zh_stats.result.forEach((category) => {
                    category.entries.forEach((item) => {
                        translate_stat[item.id] = item.text
                        if (!!item.option){
                            item.option.options.forEach((optionobj) => {
                                translate_stat[item.id + "option" + optionobj.id] = optionobj.text
                            })
                        }
                    })
                    translate_stat['label' + category.entries[0].type]=passivesNotable[category.entries[0].type] || category.label
                })
                affix.delvestr={}
                stats.result.forEach((category) => {
                    category.entries.forEach((item) => {
                        affix[item.id]={u: item.text}
                        let haveTranslate = passivesNotable[item.id]?.n || passivesNotable[item.id] || translate_stat[item.id] || null
                        let str=''
                        if (!!~item.id.search('stat_2954116742|stat_3459808765|stat_1898784841|stat_1422267548')){
                            str='涂油:'
                            //haveTranslate=haveTranslate.replace('(秒)', '（第二）').replace(/ /g, '')
                        }else if(!!~item.id.search('stat_1190333629|stat_2460506030')){str='升华珠宝:'}
                        else if(!!~item.id.search('stat_3948993189|stat_3086156145')){str='星团珠宝:'}
                        affix[item.id].z = haveTranslate
                        if (!!item.option){
                            affix[item.id].o={}
                            item.option.options.forEach((optionobj) => {
                                let k=item.id + "option" + optionobj.id
                                let str
                                if (!!passivesNotable[optionobj.text]){
                                    str=passivesNotable[optionobj.text]?.n || passivesNotable[optionobj.text]
                                }
                                if (!!str || !!translate_stat[k]){
                                    affix[item.id].o[optionobj.text]= str ||  translate_stat[k]
                                    optionobj.text = (str || translate_stat[k]) + '(' + optionobj.text +')'
                                }
                            })
                        }   
                        if (category.label=='Delve'){//化石fix
                            if(!!affix[item.id]?.z){affix.delvestr[item.text]=affix[item.id].z}
                        }   
                        if(!!haveTranslate) { item.text = str + haveTranslate + '(' + item.text + ')' }                            
                    })
                    category.label=translate_stat['label' + category.entries[0].type] || category.label
                })
                chrome.storage.local.set({ cache_us: {itemname,affix,passivesNotable}})
                stats.localdateselect=zh_stats.localdateselect
            }
            if (!!zh_static?.result?.entries){
                let translate_static = {}
                zh_static.result.forEach((category) => {
                    category.entries.forEach((item) => {translate_static[item.id] = item.text})
                    translate_static[category.id] = category.label
                })
                static.result.forEach((category) => {
                    category.entries.forEach((item) => {
                        let haveTranslate = translate_static[item.id]
                        if (!!haveTranslate) { item.text = haveTranslate}
                    })
                    category.label=passivesNotable[category.id] || translate_static[category.id] || category.label
                })
            }
            // finish
            chrome.storage.local.set({
              translation: { items, stats, static,filters,zh_stats,zh_filters},
              status: 'done',
              updated: +new Date(),
              statusUI: 'progress',
            })
            chrome.storage.local.get('translation', ({translation}) => {
                //console.log(translation)
                //console.log(translation.stats)
                //console.log(translation.stats.localdateselect)
                if (!!translation.stats.localdateselect){
                    chrome.storage.local.set({ uiLanguage: 'Zh',select:true})
                    window.alert(translation.stats.localdateselect)
                }else{
                    window.alert('保存国服数据失败!!!')
                    chrome.storage.local.set({language: 'us',statusUI: 'done',updated: +new Date()})
                }
            })
        })
    }
}
let changeUILanguage = async (UILanguage) => {
    let UILanguageJSON = {}
    chrome.storage.local.get('language', ({ language }) => {
        if (language === 'zh_tw') {
            (async ()=>{
                let translateFile = chrome.runtime.getURL('json/interface2.json')
                let translateText = await fetch(translateFile).then((res) => res.json())
                setUILanguage(UILanguage, translateText)
            })()
        }
        if (language === 'us') { setUILanguage(UILanguage, UILanguageJSON)}
    })
}
let setUILanguage = (UILanguage, UILanguageJSON) => {
    if (UILanguage === 'ZhUs') {
        Object.keys(UILanguageJSON).forEach((objectKey) => {
            UILanguageJSON[objectKey] = UILanguageJSON[objectKey] + ' (' + objectKey + ') '
        })
    }
    if(UILanguage != 'Us'){
        UILanguageJSON.UILanguagestr=true
        chrome.storage.local.set({
            UILanguage: UILanguageJSON,
        })
        chrome.storage.local.get('UILanguage', ({ UILanguage }) => {
            if(!UILanguage.UILanguagestr){
                window.alert('保存界面数据失败!!!')
            }
            chrome.storage.local.set({statusUI: 'done',updated: +new Date()})
        })
    }else{
        chrome.storage.local.set({
            UILanguage: {},
            statusUI: 'done',
            updated: +new Date(),
        })  
    }
}
let fetchData = {
	async us() {
        let us_url = 'https://www.pathofexile.com/api/trade2/data/'
		let items = await fetch(`${us_url}items`).then((res) => res.json())
		let stats = await fetch(`${us_url}stats`).then((res) => res.json())
		let static = await fetch(`${us_url}static`).then((res) => res.json())
		let filters = await fetch(`${us_url}filters`).then((res) => res.json())
        const translateFile = chrome.runtime.getURL('json/items2.json')
        let itemname = await fetch(translateFile).then((res) => res.json()) 
		return { items, stats, static,itemname,filters }
	},  
	async zh_tw() {
        let zh_url
        let stats
        let static
        let items
		let filters
        let str=''
        //localdateselect_str='cache'
        
		zh_url = 'https://pathofexile.tw/api/trade2/data/'
		stats = await fetch(`${zh_url}stats`).then((res) => res.json())
		static = await fetch(`${zh_url}static`).then((res) => res.json())
		items = await fetch(`${zh_url}items`).then((res) => res.json())
		filters = await fetch(`${zh_url}filters`).then((res) => res.json())
		stats.localdateselect='保存国服数据成功 => (原始)'
        /*if (localdateselect_str==='cache'){
            zh_url = 'https://gitee.com/a643226422/poe/raw/master/'
            stats = await fetch(`${zh_url}stats`).then((res) => res.json())
            static = await fetch(`${zh_url}static`).then((res) => res.json())
            items = await fetch(`${zh_url}items`).then((res) => res.json())
            //if (!!skip_str)(str='数据选择受【程序员】在线fix !!!!\n\n')
            stats.localdateselect=str + '保存 国服 数据成功 => (备用),同步日期:' + stats.update
        }*/
        if (!!stats?.result && !!static?.result){
            return { stats, static,items,filters }
        }else{
            return null
        }
	},
}