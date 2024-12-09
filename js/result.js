let affix
let passivesNotable
let stats_name

chrome.storage.local.get('language', ({ language }) => {
    if (!language || language === 'us') return
    chrome.storage.local.get(['cache_us'], ({cache_us}) => {
        passivesNotable= cache_us.passivesNotable
        affix= cache_us.affix
        stats_name = cache_us.itemname//
        if (!affix || !stats_name || !passivesNotable) return
        checkLoaded()
    })
})
const checkLoaded = () => {
    let targetNode = document.querySelector('#app')
    let config = { attributes: true, childList: true, subtree: true, characterData: false }
    let observer = new MutationObserver((mutations, observer) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.className === 'resultset') {
                    observer.disconnect()
                    resultsChange()
                }
            })
        })
    })
    observer.observe(targetNode, config)
}
const resultsChange = () => {
    let targetNode = document.querySelector('.results')
    let observer = new MutationObserver((mutations, observer) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.className === 'row') {
                    translate()
                }
            })
        })
    })
    observer.observe(targetNode, { childList: true, subtree: true })
}
let timer
const translate = () => {
    if (timer) {
        window.clearTimeout(timer)
    }
    timer = window.setTimeout(() => {
        let mods = document.querySelectorAll('[data-field]')//[data-mod],
        Array.prototype.filter
        .call(mods, (elm) => !~elm.className.indexOf('translated'))
        .forEach((elm) => {
            let datel=elm.parentNode.querySelector('.l')
            if (!!datel){datel.innerHTML=datel.innerHTML.replace(/P/g,'前').replace(/S/g,'后')}
            let field = elm.dataset['field'].replace('stat.','')
            let zhString
            //let originalString =   elm.innerText
            let originalString = elm.innerHTML
            //console.log(field)
            if (!!~field.indexOf('delve.')){//化石fix
                let arr=originalString.split('<br>')
                zhString=''
                for (let i in arr){
                    let str=affix.delvestr[arr[i]] || arr[i]
                    str=str.replace('No Life Modifiers','无生命词缀')//fix致密化石
                    zhString=zhString + str + '<br>'
                }
            } else if (field === 'map_tier'){
                zhString = originalString.replace('Map Tier','地图阶级')
            } else if (field === 'indexed'){
                zhString = originalString.replace('a few seconds','几秒钟').replace(' ago','前').replace(/months?/,'个月').replace(/days?/,'天')
                .replace(/hours?/,'小时').replace(/minutes?/,'分钟').replace(/years?/,'年').replace(' a ',' 1 ').replace(' an ',' 1 ')
            } else if (field === 'map_iiq'){
                zhString = originalString.replace('Item Quantity','物品数量')
            } else if (field === 'stack_size'){
                zhString = originalString.replace('Stack Size','堆叠数量')
            } else if (field === 'heist_wings'){
                zhString = originalString.replace('Wings Revealed','发现的侧厅')
            } else if (field === 'heist_reward_rooms'){
                zhString = originalString.replace('Reward Rooms Revealed','破解的奖励室')
            } else if (field === 'heist_escape_routes'){
                zhString = originalString.replace('Escape Routes Revealed','发现逃亡路线')
            } else if (field === 'map_iir'){
                zhString = originalString.replace('Item Rarity','物品稀有度')
            } else if (field === 'map_packsize'){
                zhString = originalString.replace('Monster Pack Size','怪物群大小').replace('Maximum Alive Reinforcements','最大存活援军')
            } else if (field === 'quality'){
                zhString = originalString.replace('Quality','品质').replace(' Modifiers','词缀').replace('Speed','速度').replace('Attribute','属性').replace('Life and Mana','生命和魔力')
                    .replace('Critical','暴击').replace('Resistance','抗性').replace('Defence','防御').replace('Elemental Damage','元素伤害').replace('Caster','施法')
                    .replace('Attack','攻击').replace('Physical and Chaos Damage','物理伤害和混沌伤害')
            } else if (field === 'pdamage'){
                zhString = originalString.replace('Physical Damage','物理伤害')
            } else if (field === 'edamage'){
                zhString = originalString.replace('Elemental Damage','火焰，冰霜，闪电伤害')
            } else if (field === 'crit'){
                zhString = originalString.replace('Critical Strike Chance','攻击暴击率')
            } else if (field === 'aps'){
                zhString = originalString.replace('Attacks per Second','每秒攻击次数')
            } else if (field === 'ar'){
                zhString = originalString.replace('Armour','护甲')
            } else if (field === 'block'){
                zhString = originalString.replace('Chance to Block','格挡几率')
            } else if (field === 'es'){
                zhString = originalString.replace('Energy Shield','能量护盾')
            } else if (field === 'ev'){
                zhString = originalString.replace('Evasion Rating','闪避值')
            } else if (field === 'gem_level'){
                zhString = originalString.replace('Level','等级')
            } else if (field === 'heist_lockpicking'){
                zhString = originalString.replace('Requires','需要').replace('Level','等级').replace('Lockpicking','解密术').replace('in','的')
            } else if (field === 'heist_brute_force'){
                zhString = originalString.replace('Requires','需要').replace('Level','等级').replace('Brute Force','凶蛮之力').replace('in','的')
            } else if (field === 'heist_perception'){
                zhString = originalString.replace('Requires','需要').replace('Level','等级').replace('Perception','洞察').replace('in','的')
            } else if (field === 'heist_demolition'){
                zhString = originalString.replace('Requires','需要').replace('Level','等级').replace('Demolition','爆破').replace('in','的')
            } else if (field === 'heist_counter_thaumaturgy'){
                zhString = originalString.replace('Requires','需要').replace('Level','等级').replace('Counter-Thaumaturgy','逆向奇术').replace('in','的')
            } else if (field === 'heist_trap_disarmament'){
                zhString = originalString.replace('Requires','需要').replace('Level','等级').replace('Trap Disarmament','解除陷阱').replace('in','的')
            } else if (field === 'heist_agility'){
                zhString = originalString.replace('Requires','需要').replace('Level','等级').replace('Agility','灵敏').replace('in','的')
            } else if (field === 'heist_deception'){
                zhString = originalString.replace('Requires','需要').replace('Level','等级').replace('Deception','欺诈').replace('in','的')
            } else if (field === 'heist_engineering'){
                zhString = originalString.replace('Requires','需要').replace('Level','等级').replace('Engineering','工程学').replace('in','的')
            } else if (field === 'heist_objective_value'){
                zhString = originalString.replace('Heist Target','赏金目标').replace('Moderate Value','价值中等').replace('High Value','价值很高')
                    .replace('Precious','珍稀之物1').replace('Precious','无价之宝')
            } else if (field === 'area_level'){
                zhString = originalString.replace('Area Level','区域等级')
            } else if (field === 'pseudo.pseudo_temple_apex') {
                    console.log(field)
                    console.log(originalString)
                    console.log(zhString)
                    // let Small=originalString.split('Reflection of the Chalice (Difficulty ')[1]
                    // if (!!Small) {
                    //     zhString = zhString.replace('#)', ' ' + Small + ' ')
                    // }          
            }else if(!!~field.search('pseudo.pseudo_temple_apex|pseudo.pseudo_temple_poison_room_1|pseudo.pseudo_temple_sacrifice_room_1|pseudo.pseudo_temple_storm_room_1|pseudo.pseudo_temple_trap_room_1|pseudo.pseudo_temple_cartography_room_1|pseudo.pseudo_temple_queens_chambers_1|pseudo.pseudo_temple_chests_1|pseudo.pseudo_temple_corruption_room_1|pseudo.pseudo_temple_explosives_room_1|pseudo.pseudo_temple_armour_room_1|pseudo.pseudo_temple_weapon_room_1|pseudo.pseudo_temple_breeding_room_1|pseudo.pseudo_temple_breach_room_1|pseudo.pseudo_temple_gem_room_1|pseudo.pseudo_temple_currency_vault_1|pseudo.pseudo_temple_trinket_room_1|pseudo.pseudo_temple_workshop_1|pseudo.pseudo_temple_empowering_room_1|pseudo.pseudo_temple_healing_room_1|pseudo.pseudo_temple_boss_minions_1|pseudo.pseudo_temple_boss_fire_1|pseudo.pseudo_temple_boss_lightning_1|pseudo.pseudo_temple_poison_room_2|pseudo.pseudo_temple_sacrifice_room_2|pseudo.pseudo_temple_storm_room_2|pseudo.pseudo_temple_trap_room_2|pseudo.pseudo_temple_cartography_room_2|pseudo.pseudo_temple_queens_chambers_2|pseudo.pseudo_temple_chests_2|pseudo.pseudo_temple_corruption_room_2|pseudo.pseudo_temple_explosives_room_2|pseudo.pseudo_temple_armour_room_2|pseudo.pseudo_temple_weapon_room_2|pseudo.pseudo_temple_breeding_room_2|pseudo.pseudo_temple_breach_room_2|pseudo.pseudo_temple_gem_room_2|pseudo.pseudo_temple_currency_vault_2|pseudo.pseudo_temple_trinket_room_2|pseudo.pseudo_temple_workshop_2|pseudo.pseudo_temple_empowering_room_2|pseudo.pseudo_temple_healing_room_2|pseudo.pseudo_temple_boss_minions_2|pseudo.pseudo_temple_boss_fire_2|pseudo.pseudo_temple_boss_lightning_2|pseudo.pseudo_temple_poison_room_3|pseudo.pseudo_temple_sacrifice_room_3|pseudo.pseudo_temple_storm_room_3|pseudo.pseudo_temple_trap_room_3|pseudo.pseudo_temple_cartography_room_3|pseudo.pseudo_temple_queens_chambers_3|pseudo.pseudo_temple_chests_3|pseudo.pseudo_temple_corruption_room_3|pseudo.pseudo_temple_explosives_room_3|pseudo.pseudo_temple_armour_room_3|pseudo.pseudo_temple_weapon_room_3|pseudo.pseudo_temple_breeding_room_3|pseudo.pseudo_temple_breach_room_3|pseudo.pseudo_temple_gem_room_3|pseudo.pseudo_temple_currency_vault_3|pseudo.pseudo_temple_trinket_room_3|pseudo.pseudo_temple_workshop_3|pseudo.pseudo_temple_empowering_room_3|pseudo.pseudo_temple_healing_room_3|pseudo.pseudo_temple_boss_minions_3|pseudo.pseudo_temple_boss_fire_3|pseudo.pseudo_temple_boss_lightning_3|pseudo.pseudo_temple_chasm_room|pseudo.pseudo_temple_passageways|pseudo.pseudo_temple_halls|pseudo.pseudo_temple_tunnels|pseudo.pseudo_temple_the_pits|pseudo.pseudo_temple_banquet_hall|pseudo.pseudo_temple_tombs|pseudo.pseudo_temple_antechamber|pseudo.pseudo_temple_cellar|pseudo.pseudo_temple_cloister|pseudo.pseudo_temple_torment_1|pseudo.pseudo_temple_torment_2|pseudo.pseudo_temple_torment_3|pseudo.pseudo_temple_strongbox_1|pseudo.pseudo_temple_strongbox_2|pseudo.pseudo_temple_strongbox_3|pseudo.pseudo_temple_legion_1|pseudo.pseudo_temple_legion_2|pseudo.pseudo_temple_legion_3')){
                zhString = originalString.replace("Has Room: Apex of Atzoatl","有房间：阿佐亚特之巅").replace("Has Room: Poison Garden (Tier 1)","内有房间：烈毒花园（1 阶）").replace("Has Room: Sacrificial Chamber (Tier 1)","内有房间：祭仪之厅（1 阶）").replace("Has Room: Tempest Generator (Tier 1)","内有房间：风雷之间（1 阶）").replace("Has Room: Trap Workshop (Tier 1)","内有房间：陷阱工坊（1 阶）").replace("Has Room: Surveyor's Study (Tier 1)","内有房间：勘查员的学习室（1 阶）").replace("Has Room: Royal Meeting Room (Tier 1)","内有房间：皇家会议厅（1 阶）").replace("Has Room: Storage Room (Tier 1)","内有房间：储藏屋（1 阶）").replace("Has Room: Corruption Chamber (Tier 1)","内有房间：腐化之间（1 阶）").replace("Has Room: Explosives Room (Tier 1)","内有房间：爆炸物制造间（1 阶）").replace("Has Room: Armourer's Workshop (Tier 1)","内有房间：铸甲师工坊（1 阶）").replace("Has Room: Sparring Room (Tier 1)","内有房间：练兵房（1 阶）").replace("Has Room: Guardhouse (Tier 1)","内有房间：护卫间（1 阶）").replace("Has Room: Splinter Research Lab (Tier 1)","内有房间：分裂研究实验室（1 阶）").replace("Has Room: Gemcutter's Workshop (Tier 1)","内有房间：宝石匠的工坊（1 阶）").replace("Has Room: Vault (Tier 1)","内有房间：宝库（1 阶）").replace("Has Room: Jeweller's Workshop (Tier 1)","内有房间：珠宝匠的工坊（1 阶）").replace("Has Room: Workshop (Tier 1)","内有房间：工坊（1 阶）").replace("Has Room: Shrine of Empowerment (Tier 1)","内有房间：强能神龛（1 阶）").replace("Has Room: Pools of Restoration (Tier 1)","内有房间：恢复之池（1 阶）").replace("Has Room: Hatchery (Tier 1)","内有房间：孵化场（1 阶）").replace("Has Room: Flame Workshop (Tier 1)","内有房间：火焰工坊（1 阶）").replace("Has Room: Lightning Workshop (Tier 1)","内有房间：闪电工坊（1 阶）").replace("Has Room: Cultivar Chamber (Tier 2)","内有房间：变种植园（2 阶）").replace("Has Room: Hall of Offerings (Tier 2)","内有房间：祭品大厅（2 阶）").replace("Has Room: Hurricane Engine (Tier 2)","内有房间：飓风引擎（2 阶）").replace("Has Room: Temple Defense Workshop (Tier 2)","内有房间：神庙防御工坊（2 阶）").replace("Has Room: Office of Cartography (Tier 2)","内有房间：绘图室（2 阶）").replace("Has Room: Hall of Lords (Tier 2)","内有房间：领主大厅（2 阶）").replace("Has Room: Warehouses (Tier 2)","内有房间：仓库（2 阶）").replace("Has Room: Catalyst of Corruption (Tier 2)","内有房间：腐化演变室（2 阶）").replace("Has Room: Demolition Lab (Tier 2)","内有房间：毁灭实验室（2 阶）").replace("Has Room: Armoury (Tier 2)","内有房间：装备库（2 阶）").replace("Has Room: Arena of Valour (Tier 2)","内有房间：勇猛角斗场（2 阶）").replace("Has Room: Barracks (Tier 2)","内有房间：军营（2 阶）").replace("Has Room: Breach Containment Chamber (Tier 2)","内有房间：裂隙之间（2 阶）").replace("Has Room: Department of Thaumaturgy (Tier 2)","内有房间：奇术科（2 阶）").replace("Has Room: Treasury (Tier 2)","内有房间：藏宝室（2 阶）").replace("Has Room: Jewellery Forge (Tier 2)","内有房间：珠宝熔炉（2 阶）").replace("Has Room: Engineering Department (Tier 2)","内有房间：工程科（2 阶）").replace("Has Room: Sanctum of Unity (Tier 2)","内有房间：团结圣殿（2 阶）").replace("Has Room: Sanctum of Vitality (Tier 2)","内有房间：活力圣殿（2 阶）").replace("Has Room: Automaton Lab (Tier 2)","内有房间：神兵实验室（2 阶）").replace("Has Room: Omnitect Forge (Tier 2)","内有房间：妖塔熔炉（2 阶）").replace("Has Room: Omnitect Reactor Plant (Tier 2)","内有房间：妖塔反应堆（2 阶）").replace("Has Room: Toxic Grove (Tier 3)","内有房间：毒林（3 阶）").replace("Has Room: Apex of Ascension (Tier 3)","内有房间：晋升之巅（3 阶）").replace("Has Room: Storm of Corruption (Tier 3)","内有房间：腐化风暴（3 阶）").replace("Has Room: Defense Research Lab (Tier 3)","内有房间：防御研究实验室（3 阶）").replace("Has Room: Atlas of Worlds (Tier 3)","内有房间：异界图鉴（3 阶）").replace("Has Room: Throne of Atziri (Tier 3)","内有房间：阿兹里的王座（3 阶）").replace("Has Room: Museum of Artefacts (Tier 3)","内有房间：神器博物馆（3 阶）").replace("Has Room: Locus of Corruption (Tier 3)","内有房间：腐化蝗群（3 阶）").replace("Has Room: Shrine of Unmaking (Tier 3)","内有房间：解构神殿（3 阶）").replace("Has Room: Chamber of Iron (Tier 3)","内有房间：钢铁之殿（3 阶）").replace("Has Room: Hall of Champions (Tier 3)","内有房间：勇士大厅（3 阶）").replace("Has Room: Hall of War (Tier 3)","内有房间：战争大厅（3 阶）").replace("Has Room: House of the Others (Tier 3)","内有房间：旁者之屋（3 阶）").replace("Has Room: Doryani's Institute (Tier 3)","内有房间：多里亚尼多里亚尼学会（3 阶）").replace("Has Room: Wealth of the Vaal (Tier 3)","内有房间：瓦尔之宝（3 阶）").replace("Has Room: Glittering Halls (Tier 3)","内有房间：闪光大厅（3 阶）").replace("Has Room: Factory (Tier 3)","内有房间：工厂（3 阶）").replace("Has Room: Temple Nexus (Tier 3)","内有房间：神庙枢纽（3 阶）").replace("Has Room: Sanctum of Immortality (Tier 3)","内有房间：不朽圣殿（3 阶）").replace("Has Room: Hybridisation Chamber (Tier 3)","内有房间：混化之间（3 阶）").replace("Has Room: Crucible of Flame (Tier 3)","内有房间：烈焰坩埚（3 阶）").replace("Has Room: Conduit of Lightning (Tier 3)","内有房间：闪电环廊（3 阶）").replace("Has Room: Chasm","内有房间：裂口").replace("Has Room: Passageways","内有房间：通路").replace("Has Room: Halls","内有房间：大厅").replace("Has Room: Tunnels","内有房间：隧道").replace("Has Room: Pits","内有房间：深坑").replace("Has Room: Banquet Hall","内有房间：宴会厅").replace("Has Room: Tombs","内有房间：墓穴").replace("Has Room: Antechamber","内有房间：接待厅").replace("Has Room: Cellar","内有房间：地窖").replace("Has Room: Cloister","内有房间：隐居回廊").replace("Has Room: Torment Cells (Tier 1)","内有房间：折磨牢狱（1 阶）").replace("Has Room: Torture Cages (Tier 2)","内有房间：酷刑牢笼（2 阶）").replace("Has Room: Sadist's Den (Tier 3)","内有房间：残虐者之穴（3 阶）").replace("Has Room: Strongbox Chamber (Tier 1)","内有房间：密箱储藏室（1 阶）").replace("Has Room: Hall of Locks (Tier 2)","内有房间：沉锁大厅（2 阶）").replace("Has Room: Court of Sealed Death (Tier 3)","内有房间：封印死亡之廷（3 阶）").replace("Has Room: Hall of Mettle (Tier 1)","内有房间：勇毅大厅（1 阶）").replace("Has Room: Hall of Heroes (Tier 2)","内有房间：英雄大厅（2 阶）").replace("Has Room: Hall of Legends (Tier 3)","内有房间：传奇大厅（3 阶）")
            }else {
                let usString = affix[field]?.u?.replace(/\n/g,'<br>')
                zhString = affix[field]?.z
                if (!!usString === false || !!zhString === false) {
                    elm.classList.add('translated')
                    return
                }
                console.log(field+'未翻译字段2')
                //console.log(affix[field].o)
                if (!!affix[field].o){
                    console.log(field+'未翻译字段3')
                    let option=affix[field].o
                    //console.log(field)
                    if (field === 'enchant.stat_3948993189') {
                        let Small=originalString.split('Added Small Passive Skills grant: ')
                        if (Small.length==3){
                            let finstr=originalString.replace('<br>','\n').replace(/Added Small Passive Skills grant: /g,'')
                            if (!!option[finstr]) {
                                let zharr=option[finstr].split('\n')
                                let usarr=finstr.split('\n')
                                zhString=originalString.replace(/Added Small Passive Skills grant: /g,'增加的小天赋获得：').replace(usarr[0],zharr[0]).replace(usarr[1],zharr[1])
                            }
                        }else{
                            if (!!option[Small[1]]) { zhString = zhString.replace('#', ' ' + option[Small[1]] + ' ') }
                        }
                    } else if (field === 'enchant.stat_1829593182') {//区域大师         
                    } else if (field === 'enchant.stat_3522828354') {//区域大师
                        let Small=originalString.split('Strongboxes in your Maps are at least ')[1]
                        zhString = zhString.replace('#', ' ' + option[Small] + ' ')        
                    } else if (field === 'enchant.stat_1542416476') {//区域大师
                        let Small=originalString.split('Breaches in your Maps belong to ')[1]
                        zhString = zhString.replace('#', ' ' + option[Small] + ' ') 
                    } else if (!!~field.search('stat_2954116742|stat_3459808765|stat_1898784841|stat_1422267548') ){
                        let passivesNotableString = originalString.split('Allocates ')[1]
                        let translate = passivesNotable[passivesNotableString]
                        if (!!translate) {
                            zhString = zhString.replace('#', ' 【' + translate.n + '】 ')
                        }
                    } else if (!!~field.search('stat_1190333629|stat_2460506030') ) { //升华珠宝
                        let Small=originalString.replace('Allocates ','').replace(/ if you have.+$/,'')
                        if (!!passivesNotable[Small]) {
                            zhString = zhString.replace('#', '【' + passivesNotable[Small].n + '】')
                        }           
                        //pseudo.lake_29096
                    } else if (field === 'implicit.stat_3624393862') { //占领
                        let Small=originalString.split('Map is occupied by ')[1]
                        if (!!option[Small]) {
                            zhString = zhString.replace('#', ' ' + option[Small] + ' ')
                        }          
                    } else if (field === 'implicit.stat_1792283443') {//影响
                        let Small=originalString.split('Area is influenced by ')[1]
                        if (!!option[Small]) {
                            zhString = zhString.replace('#', ' ' + option[Small] + ' ')
                        }          
                    } else if (field === 'enchant.stat_3187151138') {//区域大师
                        let Small=originalString.split('Your Maps contain ')[1]
                        if (!!option[Small]) {
                            zhString = zhString.replace('#', ' ' + option[Small] + ' ')
                        }       
                    }  else if (field === 'explicit.stat_3642528642') {//天赋环 Only affects Passives in # Ring        Only affects Passives in Small Ring
                        let Small=originalString.split('Only affects Passives in ')[1]
                        Small=Small.replace(' Ring', '')
                        if (!!option[Small]) {
                            zhString = zhString.replace('#', ' ' + option[Small] + ' ')
                        }           
                    } else if (field === 'explicit.stat_1190121450') {//汇流
                        let Small=originalString.split('You have ')[1]
                        Small=Small.replace(' Conflux for 3 seconds every 8 seconds', '')
                        if (!!option[Small]) {
                            zhString = zhString.replace('#', ' ' + option[Small] + ' ')
                        }           
                    } else if (field === 'explicit.stat_2878779644') {//召唤兽
                        let Small=originalString.split('Grants Level 20 Summon Bestial ')[1]
                        Small=Small.replace(' Skill', '')
                        if (!!option[Small]) {
                            zhString = zhString.replace('#', ' ' + option[Small] + ' ')
                        }
                    }else if (field === 'explicit.stat_2422708892') {//范围内配置
                        let Small=originalString.split('Passives in Radius of ')[1]
                        Small=Small.replace(' can be Allocated<br>without being connected to your tree', '')
                        if (!!option[Small]) {
                            zhString = zhString.replace('#', ' ' + option[Small] + ' ')
                            console.log(zhString)
                        }
                    } else if (field === 'implicit.stat_2563183002') {//四守卫影响地图
                        let Small=originalString.replace('Map contains ','').replace(/'s Citadel.+$/,'')
                        if (!!option[Small]) {
                            zhString = zhString.replace('#', ' ' + option[Small] + ' ') + '<br>增加 ' + option[Small] + ' 掉落的奖励数量，等于物品总量的 20%'
                        }
                    } else if (!!~field.search('pseudo_tangled_implicit_tier|pseudo_searing_implicit_tier')) {//灭界焚界
                        let arr=/Implicit Modifier \((\d)\)/.exec(originalString)
                        if (!!arr){
                            arr[1]=["次级","高级","顶级","卓越","极品","完美",][arr[1]]
                            zhString = zhString.replace('#', ' ' + arr[1] + ' ') 
                        }
                    }
                    if(zhString==affix[field].z){
                        elm.innerText=affix[field].u
                        zhString = originalString + '<span style="color:#F00">〔此词缀需要修复,请反馈1〕</span>'
                    }
                }else if (field === 'explicit.stat_3408048164') { //暴击球附加冰霜伤害
                    zhString = originalString.replace('to', '-').replace('Adds', '每个暴击球为法术附加').replace('Cold Damage to Spells per Power Charge', '基础冰霜伤害')
                }else if (field === 'pseudo.pseudo_total_chaos_resistance') {
                    zhString='+#% 最大混沌抗性'
                }else if (field === 'pseudo.lake_1931') {
                    let Small=originalString.split('Reflection of Conflict (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_403') {
                    let Small=originalString.split('Reflection of Legion (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_2745') {
                    let Small=originalString.split('Reflection of the Storm (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_3699') {
                    let Small=originalString.split('Reflection of Metamorph (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }
                }else if (field === 'pseudo.lake_7674') {
                    let Small=originalString.split('Reflection of Phaaryl (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }
                }else if (field === 'pseudo.lake_9662') {
                    let Small=originalString.split('Reflection of the Black Scythe (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_10363') {
                    let Small=originalString.split('Reflection of Imprisonment (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_18737') {
                    let Small=originalString.split('Reflection of Delve (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_22138') {
                    let Small=originalString.split('Reflection of Delirium (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_24232') {
                    let Small=originalString.split('Reflection of the Nightmare (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_24451') {
                    let Small=originalString.split('Reflection of Occultism (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_25049') {
                    let Small=originalString.split('Reflection of Possession (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_25480') {
                    let Small=originalString.split('Reflection of Guilt (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_26813') {
                    let Small=originalString.split('Reflection of Thralldom (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_27117') {
                    let Small=originalString.split('Reflection of the Dream (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_27678') {
                    let Small=originalString.split('Reflection of Perverted Faith (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_28500') {
                    let Small=originalString.split('Reflection of Demonfire (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_29096') {
                    let Small=originalString.split('Reflection of Brutality (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_32968') {
                    let Small=originalString.split('Reflection of Stasis (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_34796') {
                    let Small=originalString.split('Reflection of the Monolith (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    } 
                }else if (field === 'pseudo.lake_35950') {
                    let Small=originalString.split('Reflection of Power (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_36591') {
                    let Small=originalString.split('Reflection of Kalandra (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_37203') {
                    let Small=originalString.split('Reflection of the Harbingers (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_38110') {
                    let Small=originalString.split('Reflection of Frost (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_40031') {
                    let Small=originalString.split('Reflection of Azurite (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    } 
                }else if (field === 'pseudo.lake_42468') {
                    let Small=originalString.split('Reflection of Flame (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    } 
                }else if (field === 'pseudo.lake_43128') {
                    let Small=originalString.split('Reflection of the Broken Circle (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    } 
                }else if (field === 'pseudo.lake_44399') {
                    let Small=originalString.split('Reflection of Entrapment (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    } 
                }else if (field === 'pseudo.lake_45086') {
                    let Small=originalString.split('Reflection of Sulphite (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    } 
                }else if (field === 'pseudo.lake_46772') {
                    let Small=originalString.split('Reflection of the Trove (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    } 
                }else if (field === 'pseudo.lake_48307') {
                    let Small=originalString.split('Reflection of Ambush (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }
                }else if (field === 'pseudo.lake_49488') {
                    let Small=originalString.split('Reflection of Fractured Dimensions (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_49862') {
                    let Small=originalString.split('Reflection of Essence (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_50834') {
                    let Small=originalString.split('Reflection of Chaos (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_50846') {
                    let Small=originalString.split('Reflection of Paradise (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_53950') {
                    let Small=originalString.split('Reflection of Torment (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_55676') {
                    let Small=originalString.split('Reflection of Experimentation (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_57850') {
                    let Small=originalString.split('Reflection of Catalysis (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_60981') {
                    let Small=originalString.split('Reflection of Tyranny (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_62360') {
                    let Small=originalString.split('Reflection of Scourge (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_62572') {
                    let Small=originalString.split('Reflection of Breach (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_62935') {
                    let Small=originalString.split('Reflection of the Breachlord (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_63412') {
                    let Small=originalString.split('Reflection of Domination (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (field === 'pseudo.lake_64561') {
                    let Small=originalString.split('Reflection of the Chalice (Difficulty ')[1]
                    if (!!Small) {
                        zhString = zhString.replace('#)', ' ' + Small + ' ')
                    }          
                }else if (!!~field.indexOf('stat_1923879260')) {
                    let numRange =/\[(.*?)]/gim.exec(elm.parentNode.querySelector('.lc').querySelector('.d').innerHTML)
                    if ((numRange && numRange[1]!='1') || !~field.indexOf('scourge')) {zhString = '攻击有 #% 的几率导致流血'}
                }else if (!!~field.indexOf('stat_286947568') && !!~originalString.indexOf('amount')) { //阻挡压制法术 负值
                    zhString='玩家阻挡被压制的法术伤害量 #%'
                    usString='Players have #% to amount of Suppressed Spell Damage Prevented'
                }else if (!!~field.indexOf('stat_4116705863') && !!~originalString.indexOf('amount')) { //阻挡被压制的法术伤害 负值
                    zhString='阻挡被压制的法术伤害量 #%'
                    usString='#% to amount of Suppressed Spell Damage Prevented'
                } else if (!!~field.indexOf('stat_76458612')) { //仿品 纯才
                    zhString="你在天赋树上连接到一个职业的出发位置时，你获得：<br>野蛮人：每秒生命再生 #%<br>决斗者：近战打击距离 +#<br>游侠：药剂充能获取率提高  #%<br>暗影：攻击和施法速度提高  #%<br>女巫：技能效果持续时间延长  #%<br>圣堂武僧：攻击和法术伤害格挡率 #%<br>贵族：伤害提高  #%"
                    usString="While your Passive Skill Tree connects to a class' starting location, you gain:<br>Marauder: #% of Life Regenerated per second<br>Duelist: +# to Melee Strike Range<br>Ranger: #% increased Flask Charges gained<br>Shadow: #% increased Attack and Cast Speed<br>Witch: #% increased Skill Effect Duration<br>Templar: #% Chance to Block Attack and Spell Damage<br>Scion: #% increased Damage"
                } else if (field === 'enchant.stat_1580810115') {//龙卷附魔
                    zhString = zhString.replace('#', '1')
                    zhString = zhString.replace('an', '1')
                } else if (field === 'enchant.stat_1471796012') {//毒蛇
                    zhString = originalString.replace('Cobra Lash Chains', '【毒蛇鞭击】有额外').replace('additional times', '次连锁弹射')
                } else if (field === 'enchant.stat_1829593182') {
                    let Small=originalString.split('Legion Monsters in your Maps have ')[1]
                    test=Small.split(' more Life')[0]
                    zhString='战乱之殇怪物的生命总增 '+test
                } else if (field === 'enchant.stat_387722020') {
                } else if (field === 'enchant.stat_2681419531') {
                } else if (field === 'enchant.stat_3240183538') {
                    // console.log(originalString)
                    // console.log(zhString)
                    // let Small=originalString.split('Legion Monsters in your Maps have ')[1]
                    // test=Small.split(' more Life')[0]
                    // zhString=zhString
                    // else if(!!~field.search('stat_3522828354') && !!~originalString.indexOf('Rare') && !!~usString.indexOf('Magic') && !!~zhString.indexOf('魔法')){
                    //         zhString=zhString.replace('魔法','稀有')
                    //     }
                } else if (field === 'enchant.stat_3522828354') {
                    // console.log(originalString)
                    // console.log(zhString)
                    // let Small=originalString.split('Legion Monsters in your Maps have ')[1]
                    // test=Small.split(' more Life')[0]
                    // zhString=zhString
                } else if (field === 'enchant.stat_1274634881') {
                } else if (field === 'enchant.stat_4265846487') {
                } else if (field === 'enchant.stat_504023787') {
                } else if (field === 'enchant.stat_696413077') {
                } else if (field === 'enchant.stat_373209496') {
                } else if (field === 'enchant.stat_1463704577') {
                } else if (field === 'explicit.stat_2309305223') {
                    //20221221修复尼米斯戒指翻译错误问题
                    zhString="飞行结束后返回"
                } else if (!!~usString.indexOf('#')) { 
                    if (!!~field.search('stat_2257592286') && !!~originalString.search('\\d+?% reduced Hiring Fee$') ){//赏金猎人招募费用
                        usString='#% increased Hiring Fee'
                    }else if (field === 'explicit.stat_587431675' && !!~originalString.search('increased Critical Strike Chance') ){//赏金猎人装备暴击率
                        usString='#% increased Critical Strike Chance'
                        zhString='暴击率提高 #%'
                    }else if(!!~field.search('stat_762600725') && !!~originalString.search('Lose \\+\\d+? Life when you Block') ){
                        usString='Lose +# Life when you Block'
                        zhString='生命在你格挡时失去 #'
                    }else if(!!~field.search('stat_4008016019') && !!~originalString.search('Beyond Portals in Areas have \\d+?% chance to spawn an additional Beyond Demon') ){
                        usString='Beyond Portals in Areas have #% chance to spawn an additional Beyond Demon'
                        zhString='区域内的超越传送门有 #% 的几率产生一个额外超越恶魔  '
                    }else if (!!~field.search('stat_3417711605') && !!~originalString.search('Your Hits treat Cold Resistance as \\d+?% higher than actual value') ){
                        usString='Your Hits treat Cold Resistance as #% higher than actual value'
                        zhString='你的击中将冰霜抗性视为比实际高 #%'
                    }else if (!!~field.search('stat_4264312960') && !!~originalString.search('Your Hits treat Chaos Resistance as \\d+?% higher than actual value') ){
                        usString='Your Hits treat Chaos Resistance as #% higher than actual value'
                        zhString='你的击中将混沌抗性视为比实际高 #%'
                    }else if (!!~field.search('stat_2653955271') && !!~originalString.search('Your Hits treat Fire Resistance as \\d+?% higher than actual value') ){
                        usString='Your Hits treat Fire Resistance as #% higher than actual value'
                        zhString='你的击中将火焰抗性视为比实际高 #%'
                    }else if (!!~field.search('stat_818778753') && !!~originalString.search('Your Hits treat Lightning Resistance as \\d+?% higher than actual value') ){
                        usString='Your Hits treat Lightning Resistance as #% higher than actual value'
                        zhString='你的击中将闪电抗性视为比实际高 #%'
                    }else if (!!~field.search('stat_2224292784') && !!~originalString.search('Can have \\d+? fewer Traps placed at a time') ){
                        usString='Can have # fewer Traps placed at a time'
                        zhString='同时可以放置的陷阱减少 # 个'
                    }
                    let zhstr=zhString
                    let usstr = usString.split(' (')[0]
                    if (!!~originalString.indexOf('reduced') && !!~usstr.indexOf('increased') && !!~zhstr.search('提高|加快|延长|扩大') ){
                        usstr=usstr.replace('increased','reduced')
                        zhstr=zhstr.replace('提高','降低').replace('延长','缩短').replace('扩大','缩小').replace('加快','减慢')
                    }
                    if (!!~originalString.indexOf('Lose') && !!~usstr.indexOf('Recover') && !!~zhstr.indexOf('恢复')){
                        usstr=usstr.replace('Recover','Lose')
                        zhstr=zhstr.replace('恢复','失去')
                    }
                    if (!!~originalString.indexOf('slower') && !!~usstr.indexOf('faster') && !!~zhstr.indexOf('加快')){
                        usstr=usstr.replace('faster','slower')
                        zhstr=zhstr.replace('加快','减慢')
                    }
                    if (!!~originalString.indexOf('increased') && !!~usstr.indexOf('reduced') && !!~zhstr.indexOf('降低')){
                        usstr=usstr.replace('reduced','increased')
                        zhstr=zhstr.replace('降低','提高')
                    }
                    if (!!~originalString.indexOf('less') && !!~usstr.indexOf('more') && !!~zhstr.search('总增|增加|扩大') ){
                        usstr=usstr.replace('more','less')
                        zhstr=zhstr.replace('总增','总降').replace('增加','减少').replace('扩大','缩小')
                    }
                    if (!!~usstr.search('#\\s+?to\\s+?#') && !!~zhstr.search('#\\s+?[到-]\\s+?#') && !~originalString.search('\\d+?\\s+?to\\s+?\\d+?')) {
                        usstr=usstr.replace('# to #','#')
                        zhstr=zhstr.replace('# 到  #','#')
                    }
                    if (!~usstr.search('#\\s+?to\\s+?#') && !~zhstr.search('#\\s+?[到-]\\s+?#') && !!~originalString.search('\\d+?\\s+?to\\s+?\\d+?')) {
                        usstr=usstr.replace('#','# to #')
                        zhstr=zhstr.replace('#','# - #')
                    }/*
                    */
                    let regExpString = usstr
                    .replace(/\b(\w+?)s?\b/gim, '$1s*?')
                    .replace(/%/gim, '\\%')
                    .replace(/\+([^#])/gim, '\\+$1')  
                    .replace(/[+-]?#/gim, '(\\S+)')     
                    let affixRegExp = new RegExp(regExpString, 'igm')
                    let match = affixRegExp.exec(originalString)
                    if (match && match.length >= 1) {
                        match.shift()
                        zhString = zhstr.replace(/[+-]?#/gim, () => match.shift())  
                    } else if (!!~'explicit.stat_2388347909'.indexOf(field)){
                        let affixRegExp2 = /([+-]?[\d.]+?)%/gim
                        if (!!~'explicit.stat_2388347909'.indexOf(field)){
                            affixRegExp2 = /Leftmost (\d) Magic Utility/gim
                        }
                        let fidarr                 
                        let match2=[]
                        while (fidarr = affixRegExp2.exec(originalString)) {
                            match2.push(fidarr[1])
                        }
                        for (let i in match2){
                            zhString = zhString.replace(/[+-]?#/, match2[i])
                        }
                    }else if (field === 'explicit.stat_687813731') { //100耐力
                        zhString=originalString.replace('Monsters gain an Endurance Charge on Hit','怪物在击中时获得耐力球')
                    }else if (field === 'explicit.stat_1742567045') { //100狂怒
                        zhString=originalString.replace('Monsters gain a Frenzy Charge on Hit','怪物在击中时获得狂怒球')
                    }else if (field === 'explicit.stat_406353061') { //100暴击
                        zhString=originalString.replace('Monsters gain a Power Charge on Hit','怪物在击中时获得暴击球')                     
                    }else if (field === 'implicit.stat_3320868777') { //
                        //Left ring slot: 15% reduced Skill Effect Duration
                        let Small=originalString.split('Left ring slot: ')[1]
                        test=Small.split(' reduced Skill Effect Duration')[0]
                        //zhString=zhstr.replace('#%',test)
                        zhString='左边的戒指栏位：技能效果持续时间减少'+test
                    }else if (field === 'implicit.stat_1916904011') { //
                        
                        let Small=originalString.split('Left ring slot: Minions take ')[1]
                        test=Small.split(' reduced Damage')[0]
                        //zhString=zhstr.replace('#%',test)
                        zhString='左边的戒指栏位：召唤生物受到的伤害减少'+test
                    }else if (field === 'implicit.stat_496053892') { //
                        //Left ring slot: 30% reduced Effect of Curses on you
                        let Small=originalString.split('Left ring slot: ')[1]
                        test=Small.split(' reduced Effect of Curses on you')[0]
                        //zhString=zhstr.replace('#%',test)
                        zhString='左边的戒指栏位：你受到的诅咒效果减少'+test
                    }else if (field === 'implicit.stat_221309863') { //
                        //Left ring slot: 30% reduced Effect of Curses on you
                        let Small=originalString.split('Left ring slot: ')[1]
                        test=Small.split(' reduced Duration of Ailments on You')[0]
                        //zhString=zhstr.replace('#%',test)
                        zhString='左边的戒指栏位：你处于异常状态的时间减少'+test
                    }else if (field === 'explicit.stat_3695891184') { //
                        //Left ring slot: 30% reduced Effect of Curses on you
                        let Small=originalString.split('Lose ')[1]
                        test=Small.split(' Life per Enemy Killed')[0]
                        //zhString=zhstr.replace('#%',test)
                        zhString='每击败一名敌人失去'+test+'点生命'
                    }else {// 是否為固定數值
                        let numRange =/\[(\d+?)]/gim.exec(elm?.parentNode?.querySelector('.lc')?.querySelector('.d')?.innerHTML)
                        //console.log(field)
                        //console.log(numRange)
                        if (numRange && numRange.length >= 1) {
                            numRange.shift()
                            zhString = zhString.replace(/#/gim, () => numRange.shift())
                        }else if(!!~field.search('stat_30642521') && originalString=='You can apply one fewer Curse'){
                            zhString='你能施加的诅咒减少一个'
                        }else if(!!~field.search('stat_1509134228') && originalString=='Left ring slot: Minions take'){
                            zhString='没有物理伤害'
                        }else{
                            //console.log(affix)
                            //console.log(affix[field])
                            //console.log(affix[field].u)
                            elm.innerText=affix[field].u
                            zhString = originalString + '<span style="color:#F00"><此词缀需要修复,请反馈2></span>'
                        }
                    }
                } else if (usString !== originalString) {
                    let affixRegExp = new RegExp(usString.replace(/\b(\w+?)s?\b/gim, '$1s*?'), 'igm')
                    if (!( 
                        (!!~field.search('stat_3481854423')) ||
                        (!!~field.search('veiled\\.')) ||
                        (!!~originalString.search(affixRegExp))
                    )){
                        let numberRegExp = new RegExp('\\d+')
                        let originalNumber = numberRegExp.exec(originalString)
                        let zhNumber = numberRegExp.exec(zhString)
                        if (originalNumber && originalNumber.length > 0) {
                            originalNumber = originalNumber.shift()
                            if (zhNumber && zhNumber.length > 0) {
                                zhNumber = zhNumber.shift()
                                zhString = zhString.replace(zhNumber, () => originalNumber)
                            } else {
                                zhString = zhString.replace(/#/gim, () => originalNumber)
                            }
                        }else if(!!~field.search('stat_3872739249')) {
                            if (originalString=='Grants Summon Greater Harbinger of Time Skill'){zhString='获得【召唤高等时空先驱者】'}
                            else if (originalString=='Grants Summon Harbinger of Time Skill'){zhString='获得【召唤时空先驱者】'}
                            else if (originalString=='Grants Summon Harbinger of Storms Skill'){zhString='获得【召唤冰雷先驱者】'}
                            else if (originalString=='Grants Summon Greater Harbinger of Storms Skill'){zhString='获得【召唤高等冰雷先驱者】'}
                            else if (originalString=='Grants Summon Harbinger of Brutality Skill'){zhString='获得【召唤残暴先驱者】'}
                            else if (originalString=='Grants Summon Harbinger of Directions Skill'){zhString='获得【召唤射术先驱者】'}
                            else if (originalString=='Grants Summon Harbinger of Focus Skill'){zhString='获得【召唤不屈先驱者】'}
                            else if (originalString=='Grants Summon Greater Harbinger of Focus Skill'){zhString='获得【召唤高等不屈先驱者】'}
                        }else if(!!~field.search('stat_570159344') && originalString=='Consumes Frenzy Charges on use' ){
                            zhString='使用时消耗狂怒球'
                        }else if (!!~originalString.indexOf('Unlucky') && !!~usString.indexOf('Lucky') && !!~zhString.indexOf('幸运')){
                            zhString=zhString.replace('幸运','不幸')
                        }else if(!!~field.search('stat_2459443694')) {
                            // console.log(originalString)
                            // console.log(zhString)
                            //if (originalString=='Grants Summon Greater Harbinger of Time Skill'){zhString='获得【召唤高等时空先驱者】'}
                            
                        }else if(!!~field.search('stat_1829593182')) {
                            // console.log(originalString)
                            // console.log(zhString)
                            //if (originalString=='Grants Summon Greater Harbinger of Time Skill'){zhString='获得【召唤高等时空先驱者】'}
                            
                        }else{
                            elm.innerText=affix[field].u
                            zhString = originalString + '<span style="color:#F00">[此词缀需要修复,请反馈33]</span>'
                        }
                    }
                }

            }
            if (!!~field.indexOf('delirium') || !!~field.indexOf('monster')){
                zhString=zhString.replace(/\(.+?\)/,'')
            }else if (field === 'explicit.stat_2304729532' && !!~originalString.search('tripled')){
                zhString='固定基底词缀三倍效果加成'
            }
            if (!!~field.search('veiled\\.')){
                let str=elm.parentNode.querySelector('.r').querySelector('.d').innerHTML
                elm.parentNode.querySelector('.r').querySelector('.d').innerHTML = str.replace(/.*?(\(.*?\))/,zhString + '$1')
            }else{
                elm.setAttribute('title',elm.innerText)
                elm.innerHTML = zhString//.replace(/\n/g,'<br>')
                //elm.innerHTML = `${zhString}<div style="color: #83838d;font-size: 9px;">${elm.innerText}</div>`
            }
            if (!~field.indexOf('.')){elm.parentNode.classList.add('translated')}
            elm.classList.add('translated')
        })
        Array.prototype.filter
        .call(document.querySelectorAll('.notableProperty'), (elm) => !~elm.className.indexOf('translated'))
        .forEach((elm) => {
            let colourAugmented = elm.querySelector('.colourAugmented')
            let translate = passivesNotable[colourAugmented.innerHTML]
            if (!translate) {return}
            elm.setAttribute('title','【' + translate.n + '】\n' + translate.d.replace(/<br>/g,'\n') + '\n' + elm.innerText)
            elm.querySelector('.lc').innerHTML=elm.querySelector('.lc').innerHTML.replace(/span>.*$/,'span>')
            elm.querySelector('.colourAugmented').innerHTML = '【' + translate.n + '】<span style="color: #83838d;font-size: 9px;"><鼠标悬停显示效果></span>'
            // elm.setAttribute('style',"font-size: 11px;")
            // elm.querySelector('.lc').innerHTML=elm.querySelector('.lc').innerHTML.replace(/span>.*$/,'span><br>' + translate.d)
            elm.classList.add('translated')
        })
        Array.prototype.filter
        .call(document.querySelectorAll('.itemHeader,.vaalHeader,.hybridHeader'), (elm) => !~elm.className.indexOf('translated'))
        .forEach((elm) => {
            let itemNames = elm.querySelectorAll('.itemName')
            let name_uf,name_ub
            itemNames.forEach((name) => {
                let regstr=/class="lc">(.+?)<\/span>/gim.exec(name.innerHTML)
                if (regstr && regstr.length >= 1){
                    if (!~name.className.indexOf('typeLine')) {
                        name_uf=regstr[1]
                    } else {
                        name_ub=regstr[1]
                    }
                }
            })
            let name_zb=stats_name[name_ub] ? stats_name[name_ub] + '(' + name_ub + ')' : null
            let name_u_b=name_ub
            if (!name_zb) {
                let name_zu_b=name_ub
                let getzb=(str)=>{
                    name_u_b=name_u_b.replace(str,'')
                    if (!!stats_name[name_u_b]){name_zb=name_zu_b.replace(name_u_b,stats_name[name_u_b] + '(' + name_u_b + ')')}                   
                }
                if(!!~name_ub.indexOf('Scourged ')){
                    name_zu_b=name_zu_b.replace('Scourged','Scourged(天灾)')
                    getzb('Scourged ')
                }else if(!!~name_ub.indexOf('Blighted ')){
                    name_zu_b=name_zu_b.replace('Blighted','Blighted(菌潮)')
                    getzb('Blighted ')
                }else if(!!~name_ub.indexOf('Blight-ravaged ')){
                    name_zu_b=name_zu_b.replace('Blight-ravaged','Blight-ravaged(菌潮灭绝)')
                    getzb('Blight-ravaged ')
                }else if(!!~name_ub.indexOf('Divergent ')){
                    name_zu_b=name_zu_b.replace('Divergent','Divergent(分歧)')
                    getzb('Divergent ')
                }else if(!!~name_ub.indexOf('Anomalous ')){
                    name_zu_b=name_zu_b.replace('Anomalous','Anomalous(异常)')
                    getzb('Anomalous ')
                }else if(!!~name_ub.indexOf('Phantasmal ')){
                    name_zu_b=name_zu_b.replace('Phantasmal','Phantasmal(魅影)')
                    getzb('Phantasmal ')
                }
                if (!name_zb && !!~name_ub.indexOf(' Support')){
                    name_zu_b=name_zu_b.replace('Support','Support[(辅]')
                    getzb(' Support')
                }
                if (!name_zb && !!~name_ub.indexOf('Synthesised ')){
                    name_zu_b=name_zu_b.replace('Synthesised','Synthesised(忆境)')
                    getzb('Synthesised ')
                }
                if (!name_zb && !!~name_ub.indexOf('Superior ')){
                    name_zu_b=name_zu_b.replace('Superior','Superior(精良的)')
                    getzb('Superior ')
                }
                if (!name_zb) {
                    let name_u__b=name_ub.replace(/\s\bof\b.*?$/,'')
                    let Reg = new RegExp(/^[\w']+?\s/)
                    if (!stats_name[name_u__b]){ name_u__b=name_u__b.replace(Reg,'')}
                    if (!stats_name[name_u__b]){ name_u__b=name_u__b.replace(Reg,'')}
                    if (!!stats_name[name_u__b]){name_zb=name_zu_b.replace(name_u__b,stats_name[name_u__b] + '(' + name_u__b + ')')}
                }            
            }
            if (!!name_zb) {
                if (!!name_uf) {
                    //let name_z_b=name_zb.replace(/\([^)(]*?\)$/,'').replace('Synthesised(忆境) ','')
                    let finstr= name_uf + ' ' + name_u_b
                    let name_zuf
                    if (!!stats_name[finstr]){
                        name_zuf=stats_name[finstr].replace(' ' + stats_name[name_u_b],'') +  '(' + name_uf + ')'
                        elm.innerHTML=elm.innerHTML.replace(name_uf,name_zuf)
                    }
                }
                elm.innerHTML=elm.innerHTML.replace('>' + name_ub + '<','>' + name_zb + '<')
                elm.classList.add('translated')
            }
        })
        Array.prototype.filter
        .call(document.querySelectorAll('.requirements'), (elm) => !~elm.className.indexOf('translated'))
        .forEach((elm) => {
             elm.innerHTML=elm.innerHTML.replace('Requires','需求').replace('Level','等级').replace(/Str(ength)?/,'力量').replace(/Dex(terity)?/,'敏捷').replace(/Int(elligence)?/,'智慧').replace('in','的')
             .replace('Any Job','任意任务').replace('Class','职业').replace('Witch','女巫').replace('Scion','贵族').replace('Marauder','野蛮人').replace('Ranger','游侠')
             .replace('Duelist','决斗者').replace('Templar','圣堂武僧').replace('Shadow','暗影刺客')
             elm.classList.add('translated')
        })
        Array.prototype.filter
        .call(document.querySelectorAll('.property'), (elm) => !~elm.className.indexOf('translated'))
        .forEach((elm) => {
            let reg={'Critical Strike Chance':"暴击率",'Effectiveness of Added Damage':"伤害效用",
            Bow:"弓",'Rune ':"符文",Claw:"爪",Dagger:"匕首",Warstaff:"战杖",Staff:"长杖",Axe:"斧",'Two Handed ':"双手",'One Handed ':"单手",Mace:"锤",Sword:"剑",Wand:"法杖",
            'Fishing Rod':"鱼竿",Abyss:"深渊",Client:"客户",'Alert Level Reduction':"警报等级衰减",'Time Before Lockdown':"封锁前的时间",'This item can be equipped by':"该物品可以装备给",
            'Any Heist member can equip this item.':"任何赏金猎人都可以装备该物品。",Sceptre:"短杖",'Weapon Range':"武器范围",Attack:"攻击",Melee:"近战",Strike:"打击",Slam:"猛击",
            Warcry:"战吼",Spell:"法术",Arcane:"奥术",Brand:"烙印",Orb:"法球",Nova:"新星",Channelling:"持续吟唱",Physical:"物理",Fire:"火焰",Cold:"冰霜",Lightning:"闪电",Chaos:"混沌",
            Projectile:"投射物",Chaining:"连锁",Prismatic:"虹光",Minion:"召唤生物",Mine:"地雷",Trap:"陷阱",Golem:"图腾",Aura:"光环",Herald:"捷",Stance:"姿态",Guard:"护卫",Totem:"图腾",
            Movement:"位移",Travel:"旅行",Blink:"闪现",Curse:"诅咒",Hex:"魔蛊",Mark:"咒印",AoE:"效果区域",Duration:"持续时间",Vaal:"瓦尔",Trigger:"触发",Critical:"暴击",Link:"羁绊",
            Mana:"魔力",' Damage':"伤害",' Speed':"速度",'of base':"基础",'Cost &amp; Reservation Multiplier':"消耗及保留加成",Cost:"消耗",Cast:"施放",Reservation:"保留",
            Time:"时间",Cooldown:"冷却",'per ':"每",Seconds:"秒",Second:"秒",second:"秒",sec:"秒",Max:"最高等级",Instant:"瞬发",
            'Alternate Quality':"替换品质",'Cooldown Time':"冷却时间",'Souls Per Use':"每次施放所需灵魂",'Can Store':"可储存",'Soul Gain Prevention':"陷阱持续",
            'Karst, the Lockpick':"解密师卡斯特",'Huck, the Soldier':"军士哈克",'Niles, the Interrogator':"审讯师奈尔斯",'Vinderi, the Dismantler':"爆破师温德利",
            'Gianna, the Master of Disguise':"易容大师吉安娜",'Tibbs, the Giant':"巨汉特卜斯",'Tullina, the Catburglar':"潜行者图林娜",'Nenet, the Scout':"斥候奈尼特",
            'Isla, the Engineer':"工程师伊斯拉",'Atlas Region':"异界地区",'Haewark Hamlet':"海沃克村",'Lira Arthain':"利拉亚森","Valdo's Rest":"瓦尔多之息",
            'Glennach Cairns':"格伦纳赫石冢",'Limited to':"仅限",Radius:"范围",Variable:"变量",Medium:"中",Small:"小", Survival:"幸存",Lasts:"持续",Large:"大",
            Consumes:"每次使用",' of ':"从",' on use':"中消耗",'Currently has':"目前有",Charges:"充能次数",Recovers:"回复",Historic:"史实",
            Life:"生命",' over':"用时",Genus:"属类",Group:"组别",Family:"科目",Uses:"使用",Use:"使用",Requires:"需要",Support:"辅助",
            'Socketed Fossils':"个已镶嵌的化石",'Socketed Fossil':"个已镶嵌的化石",
            }
            let zhString=elm.innerHTML
            for (let i in reg){
                zhString=zhString.replace(String(i),reg[i])
            }
            if (zhString != elm.innerHTML){
                elm.innerHTML=zhString
                elm.classList.add('translated')
            }
        })
        Array.prototype.filter
        .call(document.querySelectorAll('.faction'), (elm) => !~elm.className.indexOf('translated'))
        .forEach((elm) => {
            let zhString=elm.innerHTML.replace('Druids of the Broken Circle','裂环祭司').replace('Order of the Chalice','圣杯教团').replace('Black Scythe Mercenaries','黑镰佣兵')
            if (zhString != elm.innerHTML){
                elm.innerHTML=zhString
                elm.classList.add('translated')
            }   
        })
        Array.prototype.filter
        .call(document.querySelectorAll('.textCurrency'), (elm) => !~elm.className.indexOf('translated'))
        .forEach((elm) => {
            let zhString=elm.innerHTML.replace('~price','一口价').replace('~b/o','询价').replace('scour','重铸石').replace('vaal','瓦尔宝珠').replace('chaos','混沌石').replace('blessed','祝福石').replace('chisel','制图钉')
            .replace('chrome','幻色石').replace('divine','神圣石').replace('exalted','崇高石').replace('gcp','珠宝匠的棱镜').replace('jewellers','工匠石')
            .replace('regret','后悔石').replace('fusing','链结石').replace('chance','机会石').replace('alt','改造石').replace('alch','点金石').replace('regal','富豪石')
            if (zhString != elm.innerHTML){
                elm.innerHTML=zhString
                elm.classList.add('translated')
            }   
        })
        Array.prototype.filter
        .call(document.querySelectorAll('.scourged'), (elm) => !~elm.className.indexOf('translated'))
        .forEach((elm) => {
            let zhString=elm.innerHTML.replace('Scourged','天灾').replace('Tier','T')
            if (zhString != elm.innerHTML){
                elm.innerHTML=zhString
                elm.classList.add('translated')
            }   
        })
    }, 100)
}

