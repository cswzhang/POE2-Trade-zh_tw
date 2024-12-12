const mydate=new Date()
const vararr=[{id:"LocalVersion",link:'./manifest.json'},{id:"OnlineVersion",link:'https://raw.githubusercontent.com/cswzhang/POE2-Trade-zh_tw/refs/heads/master/manifest.json'},]
localStorage.versionoldmin = localStorage.versionoldmin || 0
let min=mydate.getTime()/1000/60
vararr.forEach(async (verojb)=> {
    if (Math.round(min-localStorage.versionoldmin)>5){
        document.getElementById(verojb.id).innerText="正在获取版本..."
        await fetch(verojb.link).then(res=>res.json()).then(data=>{
            localStorage[verojb.id] = data.version
            if (verojb.id=='OnlineVersion'){chrome.storage.local.set({skip:data.skip})}
        })
        localStorage.versionoldmin = min
    }
    document.getElementById(verojb.id).innerText=localStorage[verojb.id] || "获取版本失败"
})

const $ = (selector) => document.querySelector(selector)
const classList = (arrDOM) => {
    return {
        add (className) {
      arrDOM.forEach((element) => !!element && element.classList.add(className))
            return this
        },
        remove (className) {
      arrDOM.forEach((element) => !!element && element.classList.remove(className))
            return this
        }
    }
}

const zhCnBtn = $('#zhCnBtn')
const statusArea = $('#status')
const clearCacheBtn = $('#clearCache')
const langText = $('#langText')
const uiZhUsBtn = $('#uiZhUsBtn')
const uiZhBtn = $('#uiZhBtn')
const uiUsBtn = $('#uiUsBtn')
const localselectText = $('#localselectText')
const inter = $('#inter')
const rest = $('#rest')
const opens = $('#opens')

const setLanguage = (language) => {
    chrome.storage.local.set({'status': 'progress', 'language': language})
}

const setUILanguage = (language) => {
  chrome.storage.local.set({ uiLanguage: language, statusUI: 'progress' })
}
const setlocaldateselect = (select) => {
    chrome.storage.local.set({ localdateselect: select })
}

zhCnBtn.addEventListener('click', () => { setLanguage('zh_tw')})
uiZhUsBtn.addEventListener('click', () => setUILanguage('ZhUs'))
//uiZhBtn.addEventListener('click', () => setUILanguage('Zh'))
//uiUsBtn.addEventListener('click', () => setUILanguage('Us'))

clearCacheBtn.addEventListener('click', () => {
    chrome.storage.local.get('skip',({skip})=>{
        chrome.storage.local.clear()
        location.reload()
        chrome.storage.local.set({select:false,skip:skip})
        rest.style.display="none"
        checkStatus()                                
    })
})

chrome.storage.onChanged.addListener((changes) => {
    for (let key in changes) {
        if (!!~['status', 'language', 'uiLanguage', 'statusUI','localdateselect','skip'].indexOf(key)) {
            checkStatus()
        }
    }
})

let checkStatus = () => {
    classList([zhCnBtn, uiZhUsBtn, uiZhBtn, uiUsBtn]).add('disabled')
    statusArea.classList.add('loading')
    chrome.storage.local.get(['status', 'language', 'uiLanguage', 'statusUI','localdateselect','select','skip'], ({ status, language, uiLanguage, statusUI,localdateselect,select,skip }) => {
        if (!!skip && localdateselect != 'cache'){
            localdateselect='cache'
            chrome.storage.local.set({localdateselect:'cache'})
        }
        if (!!language === false) {
            chrome.storage.local.set({
            	status: 'done',
            	language: 'us',
            	statusUI: 'done',
            	uiLanguage: 'Us',
                select:false,
                localdateselect:localdateselect
            })
        } else if (status === 'done' && statusUI === 'done') {
            statusArea.classList.remove('loading')
            if (language === 'us') {
                langText.innerText = 'us'
                classList([zhCnBtn]).remove('disabled')
            } else if (language === 'zh_tw') {
                if (!!select){
                    langText.innerText = language
                    classList([uiZhUsBtn]).remove('disabled')
                    localselectText.innerText = localdateselect === 'cache' ? '(备用)' : '(原始)'
                }
            }
            if (uiLanguage === 'ZhUs') {
                uiZhUsBtn.classList.add('disabled')
            }
        }
        let Hiddencontrols =(arr,str)=>{
            arr.forEach((v)=>{
                $('#' + v).style.display=str
            })
        } 
        Hiddencontrols(['opens'],!!select ? 'none' : "")
        Hiddencontrols(['inter','rest'],!select ? 'none' : "")
    })
}

checkStatus()













