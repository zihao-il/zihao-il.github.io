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

const $decorationInputs = $('select[data-decoration]');
let decorationRequest = 0;

const resetDecorations = () => {
    $decorationInputs.val('');
    decorationRequest++;
    old_skin = "";
};
// 皮肤操作封装
/** 加载指定皮肤的默认样式（重置模型为自动检测并清空装饰） */
const loadDefaultSkin = (name) => {
    skin_url = IMG_PATH.skin(name);
    skinViewer.loadSkin(skin_url, {});
    $("input[name='skin_model'][value='auto-detect']").prop("checked", true);
    resetDecorations();
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
    resetDecorations();
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
            resetDecorations();
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
    if (old_skin) {
        refreshDecorations();
    } else {
        skinViewer.loadSkin(skin_url, {model: this.value});
    }
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

// 每次从原始皮肤合成，帽子最后绘制。
const refreshDecorations = async () => {
    const request = ++decorationRequest;
    const model = getCurrentModel();
    const selected = $decorationInputs.get().filter(input => input.value);
    if (!old_skin && !selected.length) return;
    const base = old_skin ||= skin_url;

    try {
        if (!selected.length) {
            const image = await loadImageAsync(base);
            if (request !== decorationRequest) return;
            skinViewer.loadSkin(image, {model});
            skin_url = base;
            old_skin = '';
            return;
        }
        const {canvas, ctx} = await loadSkinToCanvas(base);
        const fit = model === 'auto-detect' ? (checkClassicSkin(ctx) ? 'default' : 'slim') : model;
        if (request !== decorationRequest) return;
        const layers = await Promise.allSettled(selected.map(input =>
            loadImageAsync(IMG_PATH.decoration(input.value, input.dataset.decoration, fit))
        ));
        if (request !== decorationRequest) return;

        let failed = false;
        for (const [index, layer] of layers.entries()) {
            if (layer.status === 'fulfilled') {
                ctx.drawImage(layer.value, 0, 0, canvas.width, canvas.height);
            } else {
                selected[index].value = '';
                failed = true;
            }
        }
        const hasDecoration = selected.some(input => input.value);
        const texture = hasDecoration ? canvas.toDataURL() : base;
        skinViewer.loadSkin(canvas, {model: fit});
        skin_url = texture;
        if (!hasDecoration) old_skin = '';
        if (failed) showModalMessage('无法加载部分装饰贴图');
    } catch {
        if (request === decorationRequest) showModalMessage('无法加载装饰预览');
    }
};

$decorationInputs.on('change', function () {
    if (this.id !== 'hat' && this.value) $decorationInputs.not('#hat').not(this).val('');
    return refreshDecorations();
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
const parsePackLang = (text) => {
    const labels = new Map();
    for (const line of text.split(/\r?\n/)) {
        const entry = line.replace(/\t+#.*$/, '').trim();
        const equals = entry.indexOf('=');
        if (entry.startsWith('#') || equals < 1) continue;
        labels.set(entry.slice(0, equals).trim(), entry.slice(equals + 1).trim());
    }
    return labels;
};

const readPackLanguages = async (zip) => new Map(await Promise.all(
    zip.file(/^texts\/[^/]+\.lang$/i).map(async (file) => [
        file.name.slice(6, -5), parsePackLang(await file.async('string'))
    ])
));

const packFileName = (name, fallback) =>
    name.replace(/[^\S ]|[<>:"/\\|?*\x00-\x1f]/g, '_').slice(0, 100).replace(/^[. ]+|[. ]+$/g, '') || fallback;

const downloadPackBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    try {
        downloadBlob(url, filename);
    } finally {
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
};

const buildSkinTextureZip = async (entries) => {
    const zip = new JSZip();
    for (const {file, filename} of entries) {
        zip.file(filename, await file.async('uint8array'));
    }
    return zip;
};

const renderPackSkins = ($modal, zip, manifest, data, languages) => {
    const $body = $modal.find('.modal-body').html(`
        <fieldset class="mb-3" data-pack-languages hidden>
            <legend class="fs-6 mb-1">皮肤包语言</legend>
            <div class="d-flex flex-wrap gap-3" data-pack-language-options></div>
        </fieldset>
        <div class="mb-3 text-center" data-pack-preview hidden>
            <p class="mb-1 text-break" data-pack-preview-name translate="no"></p>
            <canvas class="mx-auto mw-100" aria-label="皮肤 3D 预览" hidden></canvas>
            <p class="mb-0 text-body-secondary" data-pack-preview-status role="status"></p>
        </div>
        <div class="d-flex align-items-center flex-wrap gap-2 mb-2">
            <label class="me-auto"><input class="form-check-input me-1" type="checkbox" data-pack-all>全选</label>
            <button class="btn btn-outline-primary btn-sm" type="button" data-pack-download>下载所选 (0)</button>
        </div>
        <p class="text-body-secondary small mb-2" data-pack-status role="status"></p>
        <ul class="list-group" data-pack-skins></ul>
    `);
    const $title = $modal.find('.modal-title').attr('translate', 'no');
    const $status = $body.find('[data-pack-status]');
    const $all = $body.find('[data-pack-all]');
    const $download = $body.find('[data-pack-download]');
    const $list = $body.find('[data-pack-skins]');
    const $preview = $body.find('[data-pack-preview]');
    const $previewName = $body.find('[data-pack-preview-name]');
    const $previewStatus = $body.find('[data-pack-preview-status]');
    const $canvas = $preview.find('canvas');
    const packKey = data.localization_name || data.serialize_name || '';
    const fallbackLanguage = languages.has('zh_CN') ? 'zh_CN' : languages.has('en_US') ? 'en_US' : languages.keys().next().value;
    const fallbackLabels = languages.get(fallbackLanguage);
    let labels = fallbackLabels;
    let viewer;
    let active;
    let previewRequest = 0;
    let downloading = false;

    const translate = (key, fallback) => labels?.get(key) || fallbackLabels?.get(key) || fallback;
    const packName = () => translate(`skinpack.${packKey}`, packKey || manifest.header?.name || '皮肤包');
    const skinName = ({key, fallback}) => translate(key, fallback);
    const textureName = (entry) => `${entry.index + 1}-${packFileName(skinName(entry), 'skin')}.png`;

    const previewSkin = async (entry) => {
        active?.$previewBtn.removeClass('active').attr('aria-pressed', 'false');
        active = entry;
        entry.$previewBtn.addClass('active').attr('aria-pressed', 'true');
        const request = ++previewRequest;
        $preview.prop('hidden', false);
        $previewName.text(skinName(entry));
        $previewStatus.text('正在加载预览…');
        $canvas.prop('hidden', true);
        let url;
        try {
            url = URL.createObjectURL(await entry.file.async('blob'));
            if (request !== previewRequest) return;
            const image = await loadImageAsync(url);
            if (request !== previewRequest) return;
            viewer ??= new skinview3d.SkinViewer({canvas: $canvas[0], height: 220, enableControls: true});
            viewer.width = Math.min($preview.width(), 400);
            viewer.loadSkin(image, {model: entry.model});
            $canvas.prop('hidden', false);
            $previewStatus.empty();
        } catch {
            if (request === previewRequest) $previewStatus.text('无法预览此贴图');
        } finally {
            if (url) URL.revokeObjectURL(url);
        }
    };

    const entries = data.skins.map((skin, index) => {
        const texture = typeof skin?.texture === 'string' ? skin.texture : '';
        const name = typeof skin?.localization_name === 'string' ? skin.localization_name : '';
        const file = /\.png$/i.test(texture) ? zip.file(texture) : null;
        const entry = {
            index, file, key: `skin.${packKey}.${name}`,
            fallback: name || texture.split('/').pop() || `皮肤 ${index + 1}`,
            model: skin?.geometry === 'geometry.humanoid.customSlim' ? 'slim'
                : skin?.geometry === 'geometry.humanoid.custom' ? 'default' : 'auto-detect',
            $name: $('<span class="text-break me-auto" translate="no"></span>'),
            $check: $('<input class="form-check-input flex-shrink-0" type="checkbox">').prop('disabled', !file),
            $previewBtn: $('<button class="btn btn-outline-secondary btn-sm" type="button" aria-pressed="false">预览</button>')
                .on('click', () => previewSkin(entry))
        };
        const $row = $('<li class="list-group-item d-flex align-items-center flex-wrap gap-2"></li>')
            .append(entry.$check, entry.$name).appendTo($list);
        if (file) {
            $row.append(entry.$previewBtn,
                $('<button class="btn btn-outline-primary btn-sm" type="button">PNG</button>')
                    .on('click', async function () {
                        const filename = textureName(entry);
                        this.disabled = true;
                        $status.empty();
                        try {
                            downloadPackBlob(await file.async('blob'), filename);
                        } catch {
                            $status.text('无法下载此贴图');
                        } finally {
                            this.disabled = false;
                        }
                    }));
        } else {
            $row.append($('<span class="small text-body-secondary"></span>').text('缺少 PNG 贴图'));
        }
        return entry;
    });

    const updateNames = () => {
        $title.text(packName());
        for (const entry of entries) {
            const name = skinName(entry);
            entry.$name.text(name);
            entry.$check.attr('aria-label', `选择 ${name}`);
            entry.$previewBtn.attr('aria-label', `预览 ${name}`);
            entry.$name.siblings('button').last().attr('aria-label', `下载 ${name} 的 PNG`);
        }
        if (active) $previewName.text(skinName(active));
    };

    const $options = $body.find('[data-pack-language-options]');
    for (const [code, translations] of languages) {
        const $radio = $('<input class="form-check-input me-1" name="pack_language" type="radio">')
            .prop('checked', code === fallbackLanguage)
            .on('change', function () {
                if (!this.checked) return;
                labels = translations;
                updateNames();
            });
        $('<label translate="no"></label>').text(code).prepend($radio).appendTo($options);
    }
    $body.find('[data-pack-languages]').prop('hidden', !languages.size);
    updateNames();

    const available = entries.filter(({file}) => file);
    const selected = () => available.filter(({ $check }) => $check.prop('checked'));
    const updateSelection = () => {
        const count = selected().length;
        $all.prop('checked', count > 0 && count === available.length)
            .prop('indeterminate', count > 0 && count < available.length);
        $download.prop('disabled', downloading || !count).text(downloading ? '正在打包…' : `下载所选 (${count})`);
    };
    $all.prop('disabled', !available.length).on('change', function () {
        available.forEach(({ $check }) => $check.prop('checked', this.checked));
        updateSelection();
    });
    $list.on('change', 'input[type="checkbox"]', updateSelection);
    $download.on('click', async () => {
        const files = selected().map((entry) => ({file: entry.file, filename: textureName(entry)}));
        if (!files.length || downloading) return;
        const filename = `${packFileName(packName(), 'skin-pack')}-skins.zip`;
        downloading = true;
        updateSelection();
        $status.empty();
        try {
            const archive = await buildSkinTextureZip(files);
            downloadPackBlob(await archive.generateAsync({type: 'blob'}), filename);
        } catch {
            $status.text('打包下载失败');
        } finally {
            downloading = false;
            updateSelection();
        }
    });
    updateSelection();

    if (available.length) $modal.one('shown.bs.modal', () => previewSkin(available[0]));
    else $status.text(entries.length ? '此皮肤包没有可用的 PNG 贴图' : '此皮肤包没有皮肤');
    $modal.one('hide.bs.modal', () => {
        previewRequest++;
        $modal.off('shown.bs.modal');
        viewer?.dispose();
    });
};

$('#mcpack_input').on('change', async function () {
    const file = this.files[0];
    if (!file) return;

    const $input = $(this).prop('disabled', true);
    const reset = () => $input.val('').prop('disabled', false);
    const $modal = $('#mcpackModal');
    $modal.find('.modal-dialog').addClass('modal-dialog-scrollable');
    try {
        const zip = await JSZip.loadAsync(file);
        const manifestFile = zip.file('manifest.json');
        if (!manifestFile) throw new Error('缺少 manifest.json');
        const manifest = JSON.parse(await manifestFile.async('string'));
        if (!Array.isArray(manifest?.modules) || !manifest.modules.some((module) => module?.type === 'skin_pack')) {
            showModalMessage('不是皮肤包类型文件');
            reset();
            return;
        }
        const skinsFile = zip.file('skins.json');
        if (!skinsFile) throw new Error('缺少 skins.json');
        const data = JSON.parse(await skinsFile.async('string'));
        if (!Array.isArray(data?.skins)) throw new Error('无效的 skins.json');
        renderPackSkins($modal, zip, manifest, data, await readPackLanguages(zip));
        $input.prop('disabled', false);
        $modal.one('hidden.bs.modal', () => {
            $modal.find('.modal-body').empty();
            reset();
        }).modal('show');
    } catch {
        reset();
        showModalMessage('无法读取皮肤包，请检查 .mcpack 文件是否完整');
    }
});