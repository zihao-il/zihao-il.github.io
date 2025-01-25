let skinViewer = new skinview3d.SkinViewer({
    canvas: $("#skin_container")[0],
    width: $("body").width(),
    height: 350,
    skin: "../img/Steve.png",
    enableControls: true
});

skinViewer.controls.enableRotate = true;
skinViewer.controls.enableZoom = true;
skinViewer.controls.enablePan = true;

let skin_url = "../img/Steve.png"
// 保存按钮功能
$("#save_btn").on("click", function () {
    const dataURL = skinViewer.skinCanvas.toDataURL('image/png');
    $("<a>")
        .attr("download", `${new Date().getTime()}.png`)
        .attr("href", dataURL)
        .get(0)
        .click();
});

// 重置按钮功能
$("#reset_btn").on("click", function () {
    // skinViewer.dispose();
    location.reload();
});

// 切换默认皮肤功能
$("input[name='skin_default']").on("change", function () {
    $("#skin_upload").val("");
    skin_url = "../img/" + $(this).val() + ".png"
    skinViewer.loadSkin(skin_url, {})
    $("input[name='skin_model'][value='auto-detect']").prop("checked", true)
    initCoatShawl()

});

// 切换披风/鞘翅
$("input[name='back_items']").on("change", function () {
    if ($("#cape").val() === "") {
        $("#cape option:eq(1)").prop("selected", true);
    }

    skinViewer.loadCape("../img/cape/" + $("#cape").val() + ".png", {
        backEquipment: $(this).val()
    })


});

// 自定义皮肤功能
$("#skin_upload").on("change", function () {
    const file = this.files[0];
    skin_url = URL.createObjectURL(file)
    skinViewer.loadSkin(skin_url, {})
    $("input[name='skin_model'][value='auto-detect']").prop("checked", true)
    initCoatShawl()
});

// 清除上传的皮肤
$("#skin_clear_btn").on("click", function () {
    $("#skin_upload").val("");
    skin_url = "../img/" + $("input[name='skin_default']:checked").val() + ".png"
    skinViewer.loadSkin(skin_url, {})
    initCoatShawl()
});

// 窃取皮肤功能
$("#skin_get_btn").on("click", function () {
    $.ajax({
        url: 'https://bbk.endyun.ltd/api/je-skin',
        type: 'POST',
        data: {name: $("#skin_name").val()},
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        success: function (result) {
            if (result.status === 201) {
                showModalMessage(result.message);
            } else {
                skinViewer.loadSkin(result.skin, {})
                if (result.hasOwnProperty('cape')) {
                    skinViewer.loadCape(result.cape, {})
                }
                skin_url = result.skin
            }
        },
        error: function (xhr, status, error) {
            $(".alert-text").text("API请求失败！")
            $('#skin_modal').modal('show');
            setTimeout(function () {
                $('#skin_modal').modal('hide');
            }, 2000);
        }
    });
});

$("#skin_be_get_btn").on("click", function () {
    $.ajax({
        url: 'https://bbk.endyun.ltd/api/xbox_avatar',
        type: 'POST',
        data: {gt: $("#skin_name").val()},
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        success: function (result) {

            if (result.status === 201) {
                showModalMessage(result.message);
            } else {
                $('#be-skin-img').attr('src', `https://persona-secondary.franchise.minecraft-services.net/api/v1.0/profile/xuid/${result.profileUsers[0].id}/image/avatar`);
            }
        },
        error: function (xhr, status, error) {
            $(".alert-text").text("API请求失败！")
            $('#skin_modal').modal('show');
            setTimeout(function () {
                $('#skin_modal').modal('hide');
            }, 2000);
        }
    });
});
const showModalMessage = (message, timeout = 2000) => {
    $(".alert-text").text(message);
    $('#skin_modal').modal('show');
    setTimeout(() => {
        $('#skin_modal').modal('hide');
    }, timeout);
}
// 选择披风功能
$("#cape").on("change", function () {
    if ($("#cape").val() === "") {
        skinViewer.loadCape("../img/cape/" + $("#cape option:eq(1)").val() + ".png", {
            backEquipment: ""
        })
        return $("input[name='back_items'][value='']").prop("checked", true)
    }
    if ($("input[name='back_items']:checked").val() !== "") {
        skinViewer.loadCape("../img/cape/" + $(this).val() + ".png", {
            backEquipment: $("input[name='back_items']:checked").val()
        })
    } else {
        $("input[name='back_items'][value='cape']").prop("checked", true)
        skinViewer.loadCape("../img/cape/" + $(this).val() + ".png", {
            backEquipment: $("input[name='back_items']:checked").val()
        })
    }

});

// 旋转开关
$("#auto_rotate").on("click", function () {
    skinViewer.autoRotate = $(this).is(":checked");

});

// 旋转速度
$("#auto_rotate_speed").on("input", function () {
    skinViewer.autoRotateSpeed = $(this).val();

});


const availableAnimations = {
    idle: new skinview3d.IdleAnimation(),
    walk: new skinview3d.WalkingAnimation(),
    run: new skinview3d.RunningAnimation(),
    fly: new skinview3d.FlyingAnimation(),

};

$("input[name='skin_animation']").on("change", function () {
    if ($(this).val() === "") {
        skinViewer.animation = null;
    } else {
        skinViewer.animation = availableAnimations[$(this).val()];

    }

});

// 设置动画速度
$("#animation_speed").on("input", function () {
    skinViewer.animation.speed = $(this).val();

});


$("#animation_speed_btn").on("click", function () {
    if ($("input[name='skin_animation']:checked").val() === "") {
        return
    }
    let isPaused = $(this).text() === "暂停";
    $(this).text(isPaused ? "开始" : "暂停");
    skinViewer.animation.paused = isPaused;

});

// 切换皮肤模型
$("#skin_model").on("change", function () {
    skinViewer.loadSkin(skin_url, {
        model: $(this).val(),
    })

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
    let name = $(this).val()
    if (name === "") {
        skinViewer.nameTag = null;

    } else {
        skinViewer.nameTag = name;
    }
});


// 外套披肩功能
let old_skin = ""

const AddDecoration = async function (name, cs, model) {
    if (old_skin === "") {
        old_skin = skin_url;
    }


    const skinImg = await loadImageAsync(old_skin);
    let tempCanvas = $('<canvas>').attr({
        width: skinImg.width,
        height: skinImg.height
    })[0];


    let tempContext = tempCanvas.getContext('2d', {willReadFrequently: true});
    tempContext.drawImage(skinImg, 0, 0);


    let newImage = new Image();
    const isClassic = checkClassicSkin(tempContext);
    if (isClassic) {
        model = "default"
    } else {
        model = "slim"

    }

    newImage.src = `../img/附加/${name}_${cs}_${model}.png`;
    newImage.onload = function () {
        tempContext.drawImage(newImage, 0, 0, tempCanvas.width, tempCanvas.height);
        let mergedImage = new Image();
        mergedImage.src = tempCanvas.toDataURL();
        skin_url = mergedImage.src;
        skinViewer.loadSkin(mergedImage.src, {
            model: model
        });
    };

};

// 判断皮肤手臂粗细
function checkClassicSkin(ctx) {
    const classicArmWidth = 4;
    const slimArmWidth = 3;

    const armX = 44;
    const armY = 52;

    const classicPixels = ctx.getImageData(armX, armY, classicArmWidth, 12).data;
    const slimPixels = ctx.getImageData(armX, armY, slimArmWidth, 12).data;

    let classicOpaque = 0, slimOpaque = 0;
    for (let i = 3; i < classicPixels.length; i += 4) {
        if (classicPixels[i] === 255) classicOpaque++;
    }
    for (let i = 3; i < slimPixels.length; i += 4) {
        if (slimPixels[i] === 255) slimOpaque++;
    }

    return slimOpaque < classicOpaque;
}

function initCoatShawl() {
    $("input[name='shawl']#shawl_none").prop("checked", true);
    $("input[name='coat']#coat_none").prop("checked", true);
    old_skin = ""
}

$("input[name='coat']").on("change", function () {
    if ($("input[name='shawl']:checked").val() !== "") {
        $("input[name='shawl']#shawl_none").prop("checked", true);
        skinViewer.loadSkin(old_skin, {
            model: $("#skin_model").val()
        })
    }
    if ($(this).val() !== "") {
        AddDecoration($(this).val(), 'coat', $("#skin_model").val())
    } else {
        skinViewer.loadSkin(old_skin, {
            model: $("#skin_model").val()
        })
        skin_url = old_skin
        old_skin = ""

    }

});

$("input[name='shawl']").on("change", function () {
    if ($("input[name='coat']:checked").val() !== "") {
        $("input[name='coat']#coat_none").prop("checked", true);
        skinViewer.loadSkin(old_skin, {
            model: $("#skin_model").val()
        })

    }
    if ($(this).val() !== "") {
        AddDecoration($(this).val(), 'shawl', $("#skin_model").val())
    } else {
        skinViewer.loadSkin(old_skin, {
            model: $("#skin_model").val()
        })
        skin_url = old_skin
        old_skin = ""
    }

});

// 其他设置功能
$("#light_global").on("input", function () {
    skinViewer.globalLight.intensity = $(this).val();

});

$("#light_camera").on("input", function () {
    skinViewer.cameraLight.intensity = $(this).val();

});

$("input[name='ears']").on("change", function () {
    if ($(this).val() !== "") {
        skinViewer.loadSkin(skin_url, {
            model: $("#skin_model").val(),
            ears: true
        })
    } else {
        skinViewer.loadEars(null)
    }


});

$("#back_color").on("input", function () {
    $("#back_img").val("");
    if ($(this).val() === "") {
        skinViewer.background = null;
    } else {
        skinViewer.background = $(this).val();
    }
})

let back_Width = 0
let back_Height = 0

$("#back_img").on("change", function () {
    $("#back_color").val("")
    const file = this.files[0];
    if (file) {
        const img = new Image();
        img.onload = function () {
            back_Width = img.width;
            back_Height = img.height;
        };
        img.src = URL.createObjectURL(file);
        skinViewer.loadBackground(img.src);
        $("#auto_weight").prop("checked", false);
    }
})

$("#back_img_btn").on("click", function () {
    $("#back_img").val("");
    skinViewer.background = null;

})


$("#back_width").on("input", function () {
    if ($(this).val() === "") {
        skinViewer.width = $("body").width();
    } else {
        skinViewer.width = $(this).val();

    }
})


$("#back_height").on("input", function () {
    let height = 350;
    if ($(this).val() !== "") {
        height = $(this).val();
    }
    skinViewer.height = height;
    $("header").css("height", (parseInt(height) + 15) + "px");
})

$("#auto_weight").on("change", function () {
    if ($(this).prop("checked") === true) {
        if ($("#back_img").val() !== "") {
            const scale = $("body").width() / back_Width;
            $("#back_width").val(parseInt($("body").width()));
            const new_Height = back_Height * scale;
            $("#back_height").val(parseInt(new_Height));
            skinViewer.width = $("body").width();
            skinViewer.height = new_Height;
            $("header").css("height", (new_Height + 15) + "px");
        }
    } else {
        skinViewer.width = $("body").width();
        skinViewer.height = 350;
        $("header").css("height", 365 + "px");
    }
})

$("#disable_follow").on("change", function () {
    if ($(this).prop("checked") === true) {
        $("#skin_container").css("position", "relative");
    } else {
        $("#skin_container").css("position", "fixed");

    }
})

$("#hidden_stats").on("change", function () {
    if ($(this).prop("checked") === true) {
        stats.dom.style.display = "none";
    } else {
        stats.dom.style.display = "block";
    }
})

$("#fov").on("input", function () {
    skinViewer.fov = $(this).val();

});

$("#zoom").on("input", function () {
    skinViewer.zoom = $(this).val();

});

$(window).resize(function () {
    skinViewer.width = $("body").width();

});

const generateManifest = (name) => {
    const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    return JSON.stringify({
        format_version: 2,
        header: {
            name: `${name}`,
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
}

const generateSkins = (name, skinData) => {

    return JSON.stringify({
        "skins": [
            {
                "localization_name": "skin",
                "geometry": skinData === "default"
                    ? "geometry.humanoid.custom"
                    : "geometry.humanoid.customSlim",
                "texture": "skin.png",
                "type": "free"
            },
        ],
        "serialize_name": `${name}`,
        "localization_name": `${name}`
    }, null, 4);
}

const generateLang = (name, nickName) => {
    return `skinpack.${name}=${name}\nskin.${name}.skin=${nickName}`

}


const loadImageAsync = (src) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => resolve(img);
    });
}

$("#zip_btn").on("click", async function () {
    if (!$(".pack_name-form")[0].checkValidity()) {
        $(".pack_name-form")[0].reportValidity();
        return;
    }


    let model
    const skinImg = await loadImageAsync(skin_url);
    let tempCanvas = $('<canvas>').attr({
        width: skinImg.width,
        height: skinImg.height
    })[0];
    let tempContext = tempCanvas.getContext('2d', {willReadFrequently: true});
    tempContext.drawImage(skinImg, 0, 0);

    const isClassic = checkClassicSkin(tempContext);
    model = isClassic ? "default" : "slim";

    let name = $("#pack_name").val() || "我的皮肤包";
    let nickName = $("#pack_skin_name").val() || "史蒂夫";

    const zip = new JSZip();

    zip.file("manifest.json", generateManifest(name));
    zip.file("skins.json", generateSkins(name, model));
    zip.file("texts/zh_CN.lang", generateLang(name, nickName));


    const dataURL = skinViewer.skinCanvas.toDataURL('image/png');

    const skinData = atob(dataURL.split(',')[1]);
    const binaryData = new Uint8Array(skinData.length);
    for (let i = 0; i < skinData.length; i++) {
        binaryData[i] = skinData.charCodeAt(i);
    }

    zip.file("skin.png", binaryData);


    const mcpackBlob = await zip.generateAsync({type: 'blob'});
    const mcpackURL = URL.createObjectURL(mcpackBlob);

    const a = document.createElement('a');
    a.href = mcpackURL;
    a.download = `skin_${new Date().getTime()}.mcpack`;
    a.click();


    URL.revokeObjectURL(mcpackURL);


    const modal = bootstrap.Modal.getInstance($("#packModal"));
    modal.hide();

})


$("#themeMode").on("change", function () {
    localStorage.setItem("skin-color-scheme", $(this).val());
    applyTheme($(this).val());

});

const updateThemeColor = (theme) => {
    if (theme === 'dark') {
        $('#themeColor').attr('content', '#212529');
    } else {
        $('#themeColor').attr('content', '#FFFFFF');
    }
}

const applyTheme = (theme) => {
    if (theme === 'light' || theme === 'dark') {
        $('html').attr('data-bs-theme', theme);
        updateThemeColor(theme);
    } else if (theme === 'auto') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        $('html').attr('data-bs-theme', systemTheme);
        updateThemeColor(systemTheme);
    }
}


$(document).ready(function () {

    const storedTheme = localStorage.getItem('skin-color-scheme');
    applyTheme(storedTheme);
    $("#themeMode").val(storedTheme);
    if (storedTheme) {
        applyTheme(storedTheme);
    } else {
        localStorage.setItem('skin-color-scheme', 'auto');
        applyTheme('auto');
    }

});

