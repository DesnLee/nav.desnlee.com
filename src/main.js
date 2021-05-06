let $siteListEnd = $(`.siteList li:last-child`)
const $resetBtn = $(`.reset`)
let $addSiteForm = $(`.addSiteForm`)
let $mask = $(`.mask`)
let $popFailed = $(`.popFailed`)
let $popSuccess = $(`.popSuccess`)
let $addSite = $(`.addSite`)

//localStorage 哈希表
let hashMap = JSON.parse(localStorage.getItem(`siteCache`)) || [
    {
        siteName: `Google`,
        siteIconsType: `link`,
        siteIcon: `src/img/siteicons/google.svg`,
        siteKey: `G`,
        siteLink: `https://google.com/`
    },
    {
        siteName: `Dribbble`,
        siteIconsType: `link`,
        siteIcon: `src/img/siteicons/dribbble.svg`,
        siteKey: `D`,
        siteLink: `https://dribbble.com/`
    },
    {
        siteName: `MDN`,
        siteIconsType: `link`,
        siteIcon: `src/img/siteicons/mdn.svg`,
        siteKey: `M`,
        siteLink: `https://developer.mozilla.org/`
    },
    {
        siteName: `LeetCode`,
        siteIconsType: `link`,
        siteIcon: `src/img/siteicons/leetcode.svg`,
        siteKey: `L`,
        siteLink: `https://leetcode-cn.com/`
    },
]

//补全 flex 布局后的空位函数，防止布局错乱
let completeLi = () => {
    if ($(`span.tag`).css(`display`) === `block`) {
        if ($(`.siteItem`).length % 4 === 0 || $(`.siteItem`).length % 4 === 1) {
            $(`.siteList .complete`).remove()
        } else if ($(`.siteItem`).length % 4 === 2) {
            $(`.siteList .complete`).remove()
            $siteListEnd.after(`<li class="complete"></li><li class="complete"></li>`)
        } else if ($(`.siteItem`).length % 4 === 3) {
            $(`.siteList .complete`).remove()
            $siteListEnd.after(`<li class="complete"></li>`)
        }
    }
}

//给 li 添加点击跳转事件和删除事件，并且阻止删除按钮冒泡
let addEvent = (element, site, index) => {
    element.on(`click`, () => {
        window.open(site.siteLink)
    }).on(`click`, `.deleteSite`, (e) => {
        e.stopPropagation()
        let result = window.confirm(`是否确认删除 ${site.siteName} ？`)
        if (result) {
            hashMap.splice(index, 1)
            render()
        }
    })
}
//渲染收藏列表函数
let render = () => {
    $(`.siteList`).find(`li:not(.addLi)`).remove()

    hashMap.forEach((site, index) => {
        if (site.siteIconsType === `link`) {
            const $li = $(`<li>
            <div class="siteItem">
                <span class="tag">Press <strong>${site.siteKey}</strong> to open</span>
                <div class="deleteSite">
                <img src="src/img/icons/close.svg" alt="">
                </div>
                <div class="siteIcon">
                    <img src = "${site.siteIcon}" alt = "">
                </div>
                <div class="siteLink">${site.siteName}</div>
            </div>
            </li>`).insertBefore($siteListEnd)
            addEvent($li, site, index)
        } else if (site.siteIconsType === `text`) {
            const $li = $(`<li>
            <div class="siteItem">
                <span class="tag">Press <strong>${site.siteKey}</strong> to open</span> 
                <div class="deleteSite">
                <img src="src/img/icons/close.svg" alt="">
                </div>
                <div class="siteIcon">
                    ${site.siteIcon}
                </div>
                <div class="siteLink">${site.siteName}</div>
            </div>
            </li>`).insertBefore($siteListEnd)
            addEvent($li, site, index)
        }
    })
    completeLi()
}

//获取 form 表单中 sitIconType 的值
let siteIconsType = () => {
    let radio = $("input[name = \"siteIconsType\"]")
    for (let i = 0; i < radio.length; i ++) {
        if (radio[i].checked) {
            return radio[i].value
        }
    }
}

//form 表单弹出事件
let openForm = () => {
    $addSiteForm.css(`opacity`, `1`)
    $addSiteForm.css(`transform`, `translateY(10%)`)
    $mask.css(`display`, 'block')
}

//form 表单关闭事件
let closeForm = () => {
    $addSiteForm.css(`opacity`, `0`)
    $addSiteForm.css(`transform`, `translateY(-100%)`)
    $mask.css(`display`, 'none')
    $(`.siteIconLink`).css(`display`, `flex`)
    document.querySelector(`.addSiteForm`).reset()
}

//未填写完整弹窗提示
let popFailed = (message) => {
    $popFailed.html(message)
    $popFailed.css(`opacity`, `1`)
    $popFailed.css(`transform`, `translateY(0)`)
    setTimeout(() => {
        $popFailed.css(`opacity`, `0`)
        $popFailed.css(`transform`, `translateY(-100%)`)
    }, 2000)
}

//添加成功弹窗提示
let popSuccess = () => {
    $popSuccess.css(`opacity`, `1`)
    $popSuccess.css(`transform`, `translateY(0)`)
    setTimeout(() => {
        $popSuccess.css(`opacity`, `0`)
        $popSuccess.css(`transform`, `translateY(-100%)`)
    }, 3000)
}

//判断当前 siteKey 是否已存在
let ifExist = (siteKey) => {
    let siteKeys = []
    for (let i = 0; i< hashMap.length;i++){
        siteKeys.push(hashMap[i].siteKey.toLowerCase())
    }
    return siteKeys.includes(siteKey.toLowerCase())
}

//提交表单事件
let submitForm = () => {
    let siteName = $("input[name = \"siteName\"]").val()
    let siteLink = $("input[name = \"siteLink\"]").val()
    let siteKey = $("input[name = \"siteKey\"]").val()
    let siteIcon = $("input[name = \"siteIcon\"]").val()

    if (siteIconsType() === `text`) {
        if (!siteName || !siteLink || !siteKey) {
            popFailed(`填写完整才能创建收藏哦～`)
        } else if (siteName && siteLink && siteKey) {
            if (siteLink.indexOf(`http`) !== 0) {
                siteLink = `https://` + siteLink
            }

            if (siteKey.length > 1) {
                popFailed(`快捷键目前仅支持单个按键哦～`)
            } else if (siteKey.length === 1) {
                if (ifExist(siteKey)){
                    popFailed(`快捷键已被占用～`)
                }else{
                    hashMap.push({
                        siteName: siteName,
                        siteIconsType: `text`,
                        siteIcon: siteLink.replace(`https://`, ``).replace(`http://`, ``).replace(`www.`, ``)[0],
                        siteKey: siteKey,
                        siteLink: siteLink
                    })
                    render()
                    closeForm()
                    popSuccess()
                }
            }
        }
    }else if (siteIconsType() === `link`) {
        if (!siteName || !siteLink || !siteIcon || !siteKey) {
            popFailed(`填写完整才能创建收藏哦～`)
        } else if (siteName && siteLink && siteIcon && siteKey) {
            if (siteLink.indexOf(`http`) !== 0) {
                siteLink = `https://` + siteLink
            }

            if (siteKey.length > 1) {
                popFailed(`快捷键目前仅支持单个按键哦～`)
            } else if (siteKey.length === 1) {
                if (ifExist(siteKey)){
                    popFailed(`快捷键已被占用～`)
                }else{
                    hashMap.push({
                        siteName: siteName,
                        siteIconsType: `link`,
                        siteIcon: siteIcon,
                        siteKey: siteKey,
                        siteLink: siteLink
                    })
                    render()
                    closeForm()
                    popSuccess()
                }
            }
        }
    }
}

//进入页面时渲染列表并补全布局
render()

//监听键盘事件打开对应页面
$(document).on(`keypress`, (e) => {
    const {key} = e
    for (let i = 0; i<hashMap.length;i++){
        if (hashMap[i].siteKey.toLowerCase() === key){
            window.open(hashMap[i].siteLink)
        }
    }
}).on(`keypress`, `input:focus`, (e) => {
    e.stopPropagation()
})

//点击新增打开表单
$addSite
    .on(`click`, openForm)

//根据 siteIconType 的值改变 表单中 siteIcon 链接项的可见性
$("input[name = \"siteIconsType\"]")
    .change(() => {
        if (siteIconsType() === `link`) {
            $(`.siteIconLink`).css(`display`, `flex`)
        } else {
            $(`.siteIconLink`).css(`display`, `none`)
        }
    })

//页面退出前保存数据至 localStorage
window.onbeforeunload = () => {
    let siteCache = JSON.stringify(hashMap)
    localStorage.setItem(`siteCache`, siteCache)
}

//重置列表数据事件
$resetBtn.on(`click`, () => {
    const confirm = window.confirm("确定重置网页收藏吗？")
    if (confirm) {
        localStorage.clear()
        hashMap = [
            {
                siteName: `Google`,
                siteIconsType: `link`,
                siteIcon: `src/img/siteicons/google.svg`,
                siteKey: `G`,
                siteLink: `https://google.com/`
            },
            {
                siteName: `Dribbble`,
                siteIconsType: `link`,
                siteIcon: `src/img/siteicons/dribbble.svg`,
                siteKey: `D`,
                siteLink: `https://dribbble.com/`
            },
            {
                siteName: `MDN`,
                siteIconsType: `link`,
                siteIcon: `src/img/siteicons/mdn.svg`,
                siteKey: `M`,
                siteLink: `https://developer.mozilla.org/`
            },
            {
                siteName: `LeetCode`,
                siteIconsType: `link`,
                siteIcon: `src/img/siteicons/leetcode.svg`,
                siteKey: `L`,
                siteLink: `https://leetcode-cn.com/`
            },
        ]
        render()
        completeLi()
    }
})