window.addEventListener('load', function () {
    let body = document.body;
    let content = ["❤要致富❤", "❤先撸树❤", "❤要撸树❤", "❤先种树❤", "❤要种树❤"]
    body.addEventListener('click', function (e) {
        let x = e.pageX;
        let y = e.pageY;
        let randContent = Math.ceil(Math.random() * content.length);
        let text = new Text(x, y, randContent);
        let span = document.createElement('span')
        span.style.color = text.getRandom();
        text.create(span);
        setTimeout(function () {
            text.out(span)
        }, 1900)
    })

    function Text(x, y, rand) {
        this.x = x;
        this.y = y;
        this.rand = rand;
    }

    Text.prototype.create = function (_this) {
        let body = document.body;
        _this.innerHTML = content[this.rand - 1];
        _this.className = 'text'
        _this.style.top = this.y - 20 + 'px'
        _this.style.left = this.x - 50 + 'px'
        _this.style.animation = 'remove 2s'
        body.appendChild(_this);
        let i = 0
        setInterval(() => {
            _this.style.top = this.y - 20 - i + 'px'
            i++
        }, 10);
    }
    Text.prototype.out = function (_this) {
        _this.remove()
    }
    Text.prototype.getRandom = function () {
        let allType = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f';
        let allTypeArr = allType.split(',');
        let color = '#';
        for (var i = 0; i < 6; i++) {
            var random = parseInt(Math.random() * allTypeArr.length);
            color += allTypeArr[random];
        }
        return color;
    }
})