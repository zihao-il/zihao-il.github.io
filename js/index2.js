// var url="";

window.onload = function() {
	if ((navigator.userAgent.match(
			/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i))) {
		url =
			"https://minecraft.onelink.me/1010960778?pid=minecraftnet&is_retargeting=true&af_dp=minecraft://openStore/?showStoreOffer=";
		// console.log(url);
	} else {
		url = "minecraft://openStore/?showStoreOffer=";
		// console.log(url);
	}

	var imgsword = [
		"url(img/cursor/wood_sword.ico), auto",
		"url(img/cursor/stone_sword.ico), auto",
		"url(img/cursor/iron_sword.ico), auto",
		"url(img/cursor/gold_sword.ico), auto",
		"url(img/cursor/diamond_sword.ico), auto",
		"url(img/cursor/netherite_sword.ico), auto"
	];
	var imgpickaxe = [
		"url(img/cursor/wood_pickaxe.ico), auto",
		"url(img/cursor/stone_pickaxe.ico), auto",
		"url(img/cursor/iron_pickaxe.ico), auto",
		"url(img/cursor/gold_pickaxe.ico), auto",
		"url(img/cursor/diamond_pickaxe.ico), auto",
		"url(img/cursor/netherite_pickaxe.ico), auto"
	];
	randomsword = Math.floor((Math.random() * imgsword.length));
	randompickaxe = Math.floor((Math.random() * imgpickaxe.length));
	$("body").css("cursor", imgsword[randomsword]);
	$('a,summary').hover(
		function() {
			this.style.cursor = imgpickaxe[randompickaxe];
		}
	);


}


const myskin = [
	"8e78a44d-0c1f-4ce2-826b-8bbc555012de", //一周内生日皮肤包
	"02b54955-9b4d-40cb-9b73-360d23cf1b9e", //二周内生日皮肤包
	"603d6be1-7745-4ad8-8af3-908ad017500f", //三周内生日皮肤包
	"a2a7ad5c-f55e-44ff-9f70-a5ae1db821b4", //四周内生日皮肤包
	"cc1e1b86-1863-4c1c-9103-b82b2b70a74b", //五周内生日皮肤包
	"7dae6bfe-e92b-403e-842e-d8d75e329644", //Minecon2015皮肤包
	"20b4d681-df67-420c-aff3-07673bb44d07", //Minecon2016皮肤包
	"d0f9abcb-4915-4008-9837-ff7946f4a115", //MineconEarth2017皮肤包
	"b89ef5de-78ad-4a48-b8a5-f12065286e7d", //旧版皮肤包
	"b3b50166-5612-4ff1-8f03-9af0b01cb4da", //Founders披风包
	"0c77040a-abb6-4938-963d-5a8e9872c85c", //地球皮肤
	// "530f1451-92dd-4924-9265-a96f536271ad"  //音乐
]

function OnclickSound(){
    var OnclickAudio = new Audio("audio/OnclickSound.ogg");
    OnclickAudio.play();

};

var urljump = $(".btn")
for (let i = 0; i < urljump.length; i++) {
	urljump[i].onclick = function() {
		OnclickSound();		
		// console.log(i)
		var juurl = url + myskin[i];
		// console.log(juurl);
		this.href = juurl;
	}
}


