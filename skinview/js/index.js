let skinViewer = new skinview3d.SkinViewer({
    canvas: $("#skin_container")[0],
    width: 300,
    height: 400,
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

});

// 清除上传的皮肤
$("#skin_clear_btn").on("click", function () {
    $("#skin_upload").val("");
    skin_url = "../img/" + $("input[name='skin_default']:checked").val() + ".png"
    skinViewer.loadSkin(skin_url, {})
});


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


const skinParts = ["head", "body", "leftArm", "rightArm", "leftLeg", "rightLeg"];
const skinLayers = ["innerLayer", "outerLayer"];

for (const part of skinParts) {
    for (const layer of skinLayers) {
        $(`#layers_table input[type="checkbox"][data-part="${part}"][data-layer="${layer}"]`).on("change", function () {
            skinViewer.playerObject.skin[part][layer].visible = $(this).prop("checked");
        });
    }
}


$("#skin_name").on("input", function () {
    let name = $(this).val()
    if (name === "") {
        skinViewer.nameTag = null;

    } else {
        skinViewer.nameTag = name;
    }
});

let old_skin = ""

const AddDecoration = function (name, cs, model) {
    if (old_skin === "") {
        old_skin = skin_url
    }
    let skinImg = skinViewer.skinCanvas;
    let tempCanvas = $('<canvas>').attr({
        width: skinImg.width,
        height: skinImg.height
    })[0];
    let tempContext = tempCanvas.getContext('2d');
    tempContext.drawImage(skinImg, 0, 0);
    let newImage = new Image();
    if (model === "auto-detect") {
        model = "default"
    }
    newImage.src = `../img/附加/${name}_${cs}_${model}.png`;
    newImage.onload = function () {
        tempContext.drawImage(newImage, 0, 0, tempCanvas.width, tempCanvas.height);
        let mergedImage = new Image();
        mergedImage.src = tempCanvas.toDataURL();

        skin_url = mergedImage.src

        skinViewer.loadSkin(mergedImage.src, {
            model: model
        })

    };
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
