window.onload = function () {

    let imgsword = [
        "url(/img/cursor/wood_sword.ico), auto",
        "url(/img/cursor/stone_sword.ico), auto",
        "url(/img/cursor/iron_sword.ico), auto",
        "url(/img/cursor/gold_sword.ico), auto",
        "url(/img/cursor/diamond_sword.ico), auto",
        "url(/img/cursor/netherite_sword.ico), auto"
    ];
    let imgpickaxe = [
        "url(/img/cursor/wood_pickaxe.ico), auto",
        "url(/img/cursor/stone_pickaxe.ico), auto",
        "url(/img/cursor/iron_pickaxe.ico), auto",
        "url(/img/cursor/gold_pickaxe.ico), auto",
        "url(/img/cursor/diamond_pickaxe.ico), auto",
        "url(/img/cursor/netherite_pickaxe.ico), auto"
    ];
    let randomsword = Math.floor((Math.random() * imgsword.length));
    let randompickaxe = Math.floor((Math.random() * imgpickaxe.length));

    $("body").css("cursor", imgsword[randomsword]);
    $('a,summary,button').hover(
        function () {
            this.style.cursor = imgpickaxe[randompickaxe];
        }
    );


}