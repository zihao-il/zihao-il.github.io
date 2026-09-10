// ==================== 配置常量 ====================
const CONFIG = {
    BASE_SKIN: "../img/Steve.png",
    DEFAULT_HEIGHT: 350,
    HEADER_GAP: 15,
    SELECTOR: {
        skinContainer: "#skin_container",
        header: "header",
        body: "body"
    }
};

const IMG_PATH = {
    skin: (name) => `../img/${name}.png`,
    cape: (name) => `../img/cape/${name}.png`,
    decoration: (name, cs, model) => `../img/附加/${name}_${cs}_${model}.png`
};

// 全局状态
const $body = $("body");

let skin_url = CONFIG.BASE_SKIN;
let old_skin = "";
let back_Width = 0;
let back_Height = 0;

// 初始化
const skinViewer = new skinview3d.SkinViewer({
    canvas: $(CONFIG.SELECTOR.skinContainer)[0],
    width: $body.width(),
    height: CONFIG.DEFAULT_HEIGHT,
    skin: CONFIG.BASE_SKIN,
    enableControls: true
});

skinViewer.controls.enableRotate = true;
skinViewer.controls.enableZoom = true;
skinViewer.controls.enablePan = true;

// 通用工具函数
const getCurrentModel = () => $("#skin_model").val();

const downloadBlob = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
};

/** 重置外套/披肩状态 */
const initCoatShawl = () => {
    $('#coat').val('');
    $('#shawl').val('');
    old_skin = "";
};
// 皮肤操作封装
/** 加载指定皮肤的默认样式（重置模型为自动检测并清空装饰） */
const loadDefaultSkin = (name) => {
    skin_url = IMG_PATH.skin(name);
    skinViewer.loadSkin(skin_url, {});
    $("input[name='skin_model'][value='auto-detect']").prop("checked", true);
    initCoatShawl();
};

/** 加载披风/鞘翅 */
const loadBackEquipment = () => {
    const capeName = $("#cape").val();
    skinViewer.loadCape(IMG_PATH.cape(capeName), {
        backEquipment: $("input[name='back_items']:checked").val()
    });
};

// 保存按钮功能
$("#save_btn").on("click", function () {
    downloadBlob(skinViewer.skinCanvas.toDataURL('image/png'), `${Date.now()}.png`);
});

// 重置按钮功能
$("#reset_btn").on("click", function () {
    // skinViewer.dispose();
    location.reload();
});

// 切换默认皮肤功能
$("input[name='skin_default']").on("change", function () {
    $("#skin_upload").val("");
    loadDefaultSkin($(this).val());
});

// 切换披风/鞘翅
$("input[name='back_items']").on("change", function () {
    if ($("#cape").val() === "") {
        $("#cape option:eq(1)").prop("selected", true);
    }
    loadBackEquipment();
});

// 自定义皮肤功能
$("#skin_upload").on("change", function () {
    const file = this.files[0];
    if (!file) return;
    skin_url = URL.createObjectURL(file);
    skinViewer.loadSkin(skin_url, {});
    $("input[name='skin_model'][value='auto-detect']").prop("checked", true);
    initCoatShawl();
});

// 清除上传的皮肤
$("#skin_clear_btn").on("click", function () {
    $("#skin_upload").val("");
    loadDefaultSkin($("input[name='skin_default']:checked").val());
});

// API 请求
const API_BASE = 'https://bbk.endyun.ltd/api';

const postApi = (endpoint, data) => $.ajax({
    url: `${API_BASE}/${endpoint}`,
    type: 'POST',
    data: data,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    dataType: 'json'
});

const showModalMessage = (message, timeout = 2000) => {
    $(".alert-text").text(message);
    $('#skin_modal').modal('show');
    setTimeout(() => $('#skin_modal').modal('hide'), timeout);
};

// 窃取皮肤功能
$("#skin_get_btn").on("click", function () {
    postApi('je-skin', {name: $("#skin_name").val()})
        .done((result) => {
            if (result.status === 201) {
                showModalMessage(result.message);
                return;
            }
            skinViewer.loadSkin(result.skin, {});
            if (result.cape) {
                skinViewer.loadCape(result.cape, {});
            }
            skin_url = result.skin;
        })
        .fail(() => showModalMessage('API请求失败'));
});

$("#skin_be_get_btn").on("click", function () {
    const $img = $('#be-skin-img');
    const gamerTag = $("#skin_name").val().trim();
    $img.attr({src: '', alt: '查询中...'});
    if (!gamerTag) {
        showModalMessage("请输入玩家名称！");
        return;
    }
    $('#beSkinModal').modal('show');
    postApi('xbox_avatar', {gt: gamerTag})
        .done((result) => {
            if (result.status === 201) {
                $img.attr('alt', '查询不到此用户的皮肤');
                showModalMessage(result.message);
                return;
            }
            $img.attr({
                src: `https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid/${result.profileUsers[0].id}/image/avatar`,
                alt: `${gamerTag} 的立体皮肤`
            });
        })
        .fail(() => {
            $img.attr('alt', '查询失败');
            showModalMessage('API请求失败');
        });
});
// 选择披风功能
$("#cape").on("change", function () {
    const capeName = $(this).val();

    if (capeName === "") {
        skinViewer.loadCape(IMG_PATH.cape($("#cape option:eq(1)").val()), {
            backEquipment: ""
        });
        return $("input[name='back_items'][value='']").prop("checked", true);
    }

    if ($("input[name='back_items']:checked").val() === "") {
        $("input[name='back_items'][value='cape']").prop("checked", true);
    }
    loadBackEquipment();
});

// 旋转开关
$("#auto_rotate").on("click", function () {
    skinViewer.autoRotate = $(this).is(":checked");
});

// 旋转速度
$("#auto_rotate_speed").on("input", function () {
    skinViewer.autoRotateSpeed = $(this).val();

});


// 动画控制
const availableAnimations = {
    idle: new skinview3d.IdleAnimation(),
    walk: new skinview3d.WalkingAnimation(),
    run: new skinview3d.RunningAnimation(),
    fly: new skinview3d.FlyingAnimation()
};

$("input[name='skin_animation']").on("change", function () {
    const key = $(this).val();
    skinViewer.animation = key ? availableAnimations[key] : null;
});

// 设置动画速度
$("#animation_speed").on("input", function () {
    if (skinViewer.animation) {
        skinViewer.animation.speed = $(this).val();
    }
});

$("#animation_speed_btn").on("click", function () {
    const $btn = $(this);
    if (!$("input[name='skin_animation']:checked").val()) {
        return;
    }
    const isPaused = $btn.text() === "暂停";
    $btn.text(isPaused ? "开始" : "暂停");
    skinViewer.animation.paused = isPaused;
});

// 切换皮肤模型
$("#skin_model").on("change", function () {
    skinViewer.loadSkin(skin_url, {
        model: $(this).val()
    });
});

// 皮肤层功能
const skinParts = ["head", "body", "leftArm", "rightArm", "leftLeg", "rightLeg"];
const skinLayers = ["innerLayer", "outerLayer"];

for (const part of skinParts) {
    for (const layer of skinLayers) {
        $(`#layers_table input[type="checkbox"][data-part="${part}"][data-layer="${layer}"]`).on("change", function () {
            skinViewer.playerObject.skin[part][layer].visible = $(this).prop("checked");
        });
    }
}

// 设置皮肤名字
$("#skin_name").on("input", function () {
    const name = $(this).val();
    skinViewer.nameTag = name === "" ? null : name;
});


// 外套/披肩装饰
/** 判断皮肤手臂粗细 */
const checkClassicSkin = (ctx) => {
    const {width} = ctx.canvas;
    const scale = width / 64;
    const armX = 44 * scale;
    const armY = 52 * scale;
    const armHeight = 12 * scale;

    const countOpaque = (data) => {
        let opaque = 0;
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] === 255) opaque++;
        }
        return opaque;
    };

    const classicOpaque = countOpaque(ctx.getImageData(armX, armY, 4 * scale, armHeight).data);
    const slimOpaque = countOpaque(ctx.getImageData(armX, armY, 3 * scale, armHeight).data);

    return slimOpaque < classicOpaque;
};

/** 读取图片到 canvas 上下文 */
const loadSkinToCanvas = async (src) => {
    const skinImg = await loadImageAsync(src);
    const canvas = document.createElement('canvas');
    canvas.width = skinImg.width;
    canvas.height = skinImg.height;
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    ctx.drawImage(skinImg, 0, 0);
    return {canvas, ctx};
};

/** 添加外套/披肩装饰并合并到当前皮肤 */
const AddDecoration = async (name, cs) => {
    if (old_skin === "") {
        old_skin = skin_url;
    }

    const {canvas, ctx} = await loadSkinToCanvas(old_skin);
    const model = checkClassicSkin(ctx) ? "default" : "slim";

    const decorationImg = await loadImageAsync(IMG_PATH.decoration(name, cs, model));
    ctx.drawImage(decorationImg, 0, 0, canvas.width, canvas.height);

    skin_url = canvas.toDataURL();
    skinViewer.loadSkin(skin_url, {model});
};

/** 恢复原始皮肤并清空装饰状态 */
const resetDecoration = () => {
    skinViewer.loadSkin(old_skin, {model: getCurrentModel()});
    skin_url = old_skin;
    old_skin = "";
};

/** 处理外套/披肩互斥切换 */
const handleDecorationChange = (value, cs, otherSelector) => {
    if ($(otherSelector).val() !== "") {
        $(otherSelector).val('');
        resetDecoration();
    }
    if (value !== "") {
        AddDecoration(value, cs);
    } else {
        resetDecoration();
    }
};

$("#coat").on("change", function () {
    handleDecorationChange($(this).val(), 'coat', '#shawl');
});

$("#shawl").on("change", function () {
    handleDecorationChange($(this).val(), 'shawl', '#coat');
});

// 视图尺寸控制
/** 应用预览尺寸，同时同步 header 高度 */
const applyViewSize = (width, height) => {
    skinViewer.width = width;
    skinViewer.height = height;
    $("header").css("height", (parseInt(height) + CONFIG.HEADER_GAP) + "px");
};

const getBodyWidth = () => $body.width();

// 其他设置
$("#light_global").on("input", function () {
    skinViewer.globalLight.intensity = $(this).val();
});

$("#light_camera").on("input", function () {
    skinViewer.cameraLight.intensity = $(this).val();
});

$("input[name='ears']").on("change", function () {
    if ($(this).val() !== "") {
        skinViewer.loadSkin(skin_url, {
            model: getCurrentModel(),
            ears: true
        });
    } else {
        skinViewer.loadEars(null);
    }
});

// 背景颜色
$("#back_color").on("input", function () {
    $("#back_img").val("");
    const color = $(this).val();
    skinViewer.background = color === "" ? null : color;
});

// 背景图片
$("#back_img").on("change", function () {
    $("#back_color").val("");
    const file = this.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = function () {
        back_Width = img.width;
        back_Height = img.height;
    };
    img.src = URL.createObjectURL(file);
    skinViewer.loadBackground(img.src);
    $("#auto_weight").prop("checked", false);
});

$("#back_img_btn").on("click", function () {
    $("#back_img").val("");
    skinViewer.background = null;
});

// 背景宽度
$("#back_width").on("input", function () {
    const val = $(this).val();
    skinViewer.width = val === "" ? getBodyWidth() : val;
});

// 背景高度
$("#back_height").on("input", function () {
    const val = $(this).val();
    const height = val === "" ? CONFIG.DEFAULT_HEIGHT : val;
    skinViewer.height = height;
    $("header").css("height", (parseInt(height) + CONFIG.HEADER_GAP) + "px");
});

// 自适应背景图
$("#auto_weight").on("change", function () {
    if ($(this).prop("checked") && $("#back_img").val() !== "") {
        const bodyWidth = getBodyWidth();
        const scale = bodyWidth / back_Width;
        const newHeight = Math.round(back_Height * scale);

        $("#back_width").val(parseInt(bodyWidth));
        $("#back_height").val(newHeight);
        applyViewSize(bodyWidth, newHeight);
    } else {
        $("#back_width").val("");
        $("#back_height").val("");
        applyViewSize(getBodyWidth(), CONFIG.DEFAULT_HEIGHT);
    }
});

// 禁止模型跟随屏幕
$("#disable_follow").on("change", function () {
    $(CONFIG.SELECTOR.skinContainer).css("position", $(this).prop("checked") ? "relative" : "fixed");
});

// 隐藏监视器
$("#hidden_stats").on("change", function () {
    stats.dom.style.display = $(this).prop("checked") ? "none" : "block";
});

$("#fov").on("input", function () {
    skinViewer.fov = $(this).val();
});

$("#zoom").on("input", function () {
    skinViewer.zoom = $(this).val();
});

// 窗口尺寸变化时同步视图宽度
let resizeTimer = null;
$(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        skinViewer.width = getBodyWidth();
    }, 100);
});

// 皮肤包生成
/** 生成随机 UUID v4 */
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

const generateManifest = (name) => JSON.stringify({
    format_version: 2,
    header: {
        name,
        description: "皮肤包制作网站：skin.endyun.ltd",
        uuid: uuid(),
        version: [1, 0, 0]
    },
    modules: [
        {
            type: "skin_pack",
            uuid: uuid(),
            version: [1, 0, 0]
        }
    ]
}, null, 4);

const generateSkins = (name, model, armor) => {
    const skin = {
        localization_name: "skin",
        geometry: model === "default"
            ? "geometry.humanoid.custom"
            : "geometry.humanoid.customSlim",
        texture: "skin.png",
        type: "free"
    };
    if (armor) {
        skin.enable_attachables = false;
    }

    return JSON.stringify({
        skins: [skin],
        serialize_name: name,
        localization_name: name
    }, null, 4);
};

const generateLang = (name, nickName) =>
    `skinpack.${name}=${name}\nskin.${name}.skin=${nickName}`;

const loadImageAsync = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
});

/** 将 dataURL 转换为二进制数组 */
const dataURLToBinary = (dataURL) => {
    const binary = atob(dataURL.split(',')[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};

// 皮肤包导出
/** 解析当前皮肤对应的模型类型 */
const resolveSkinModel = async () => {
    const selected = getCurrentModel();
    if (selected !== "auto-detect") {
        return selected;
    }
    const {ctx} = await loadSkinToCanvas(skin_url);
    return checkClassicSkin(ctx) ? "default" : "slim";
};

$("#zip_btn").on("click", async function () {
    const form = $(".pack_name-form")[0];
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const model = await resolveSkinModel();
    const name = $("#pack_name").val() || "我的皮肤包";
    const nickName = $("#pack_skin_name").val() || "史蒂夫";
    const hiddenArmor = $("#hidden_armor").is(":checked");

    const zip = new JSZip();
    zip.file("manifest.json", generateManifest(name));
    zip.file("skins.json", generateSkins(name, model, hiddenArmor));
    zip.file("texts/zh_CN.lang", generateLang(name, nickName));
    zip.file("skin.png", dataURLToBinary(skinViewer.skinCanvas.toDataURL('image/png')));

    const mcpackURL = URL.createObjectURL(await zip.generateAsync({type: 'blob'}));
    downloadBlob(mcpackURL, `skin_${Date.now()}.mcpack`);
    URL.revokeObjectURL(mcpackURL);

    bootstrap.Modal.getInstance($("#packModal")).hide();
});

// ==================== 主题 ====================
const THEME_KEY = "skin-color-scheme";
const THEME_COLORS = {dark: '#212529', light: '#FFFFFF'};

const updateThemeColor = (theme) => {
    $('#themeColor').attr('content', THEME_COLORS[theme] || THEME_COLORS.light);
};

const applyTheme = (theme) => {
    let resolved = theme;
    if (theme === 'auto') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    $('html').attr('data-bs-theme', resolved);
    updateThemeColor(resolved);
};

$("#themeMode").on("change", function () {
    const theme = $(this).val();
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
});

// 初始化主题
$(function () {
    const storedTheme = localStorage.getItem(THEME_KEY) || 'auto';
    localStorage.setItem(THEME_KEY, storedTheme);
    $("#themeMode").val(storedTheme);
    applyTheme(storedTheme);
});

// 多语言
function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'zh-CN'}, 'google_translate_element');
}

$("#language").on("change", function () {
    const combo = document.querySelector(".goog-te-combo");
    if (combo) {
        combo.value = $(this).val();
        combo.dispatchEvent(new Event("change"));
    }
});


// ==================== 皮肤包预览 ====================
/** 渲染皮肤包中每个皮肤的 3D 预览 */
const renderPackSkins = async (zip, skinsData) => {
    const $modalBody = $("#mcpackModal .modal-body");
    const modalBodyWidth = $modalBody.width() || 400;

    for (const [index, skin] of skinsData.skins.entries()) {
        const skinFile = zip.file(skin.texture);
        if (!skinFile) continue;

        const blob = await skinFile.async("blob");
        const skinURL = URL.createObjectURL(blob);
        const skinModel = skin.geometry === "geometry.humanoid.customSlim" ? "slim" : "default";
        const canvasId = `skin_container_${index}`;

        $modalBody.append(
            `<div style="width: 85%;margin: 0 auto;"><p>${skin.localization_name}：</p><canvas id="${canvasId}"></canvas></div>`
        );

        new skinview3d.SkinViewer({
            canvas: document.getElementById(canvasId),
            width: modalBodyWidth * 0.85,
            height: 250,
            skin: skinURL,
            enableControls: true,
            model: skinModel
        });
    }
};

/** 重置皮肤包上传状态 */
const resetPackInput = () => $("#mcpack_input").val("");

$("#mcpack_input").on("change", async function () {
    const file = this.files[0];
    if (!file) return;

    try {
        const zip = await JSZip.loadAsync(file);

        const manifestFile = zip.file("manifest.json");
        if (!manifestFile) {
            showModalMessage("请上传正确的mcpack文件");
            return;
        }
        const manifestData = JSON.parse(await manifestFile.async("string"));
        if (!manifestData.modules?.some((m) => m.type === "skin_pack")) {
            showModalMessage("不是皮肤包类型文件");
            return;
        }

        const skinsJsonFile = zip.file("skins.json");
        if (!skinsJsonFile) {
            showModalMessage("未找到 skins.json文件");
            return;
        }
        const skinsData = JSON.parse(await skinsJsonFile.async("string"));

        $("#mcpackModal .modal-title").text(skinsData.localization_name || "皮肤包");
        $("#mcpackModal .modal-body").empty();
        $('#mcpackModal').modal('show');

        $('#mcpackModal')
            .off('shown.bs.modal')
            .one('shown.bs.modal', () => renderPackSkins(zip, skinsData));
    } catch (err) {
        showModalMessage("文件解析失败");
    }

    // 多语言单选切换,单个皮肤管理或者统一管理
});

$("#mcpackModalClose").on("click", resetPackInput);
$('#mcpackModal').on('hide.bs.modal', resetPackInput);