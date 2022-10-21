(function() {
  // Hungarian notation
  // (http://en.wikipedia.org/wiki/Hungarian_notation)
  // n - HTML-Node
  // o - object
  // s - string
  // i - integer
  // a - array
  // b - boolean
  // f - float
  // p - Particle
  // fn - function
  // ctx - 2D Context

  // General Functions
  var app, fnAddEventListener, fnRequestAnimationFrame;

  fnRequestAnimationFrame = function(fnCallback) {
    var fnAnimFrame;
    fnAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(fnCallback) {
      window.setTimeOut(fnCallback, 1000 / 60);
    };
    fnAnimFrame(fnCallback);
  };

  // Add Event Listener
  fnAddEventListener = function(o, sEvent, fn) {
    if (o.addEventListener) {
      o.addEventListener(sEvent, fn, false);
    } else {
      o['on' + sEvent] = fn;
    }
  };

  app = function() {
    var Particle, ctxRender, fPI, fnCos, fnNextFrame, fnRender, fnRnd, fnSetSize, fnSin, fnSwapList, fnTextFadeOut, h, nBody, oBuffer, oDoc, oRender, w;
    // General Elements
    oDoc = document;
    nBody = oDoc.body;
    fPI = Math.PI;
    fnRnd = Math.random;
    fnCos = Math.cos;
    fnSin = Math.sin;
    fnTextFadeOut = function() {
      nValentinesText.setAttribute('class', 'happy-valentines');
    };
    setTimeout(fnTextFadeOut, 3000);
    ctxRender = nCanvasRender.getContext('2d');
    oRender = {
      pFirst: null
    };
    oBuffer = {
      pFirst: null
    };
    w = h = 0;
    // gets/sets size
    fnSetSize = function() {
      nCanvasRender.width = w = window.innerWidth;
      nCanvasRender.height = h = 400; // window.innerHeight
      return {
        w: w,
        h: h
      };
    };
    fnSetSize();
    
    // window.onresize
    fnAddEventListener(window, 'resize', fnSetSize);
    fnSwapList = function(p, oSrc, oDst) {
      if (p != null) {
        // remove p from oSrc
        if (oSrc.pFirst === p) {
          oSrc.pFirst = p.pNext;
          if (p.pNext != null) {
            p.pNext.pPrev = null;
          }
        } else {
          p.pPrev.pNext = p.pNext;
          if (p.pNext != null) {
            p.pNext.pPrev = p.pPrev;
          }
        }
      } else {
        // create new p
        p = new Particle();
      }
      p.pNext = oDst.pFirst;
      if (oDst.pFirst != null) {
        oDst.pFirst.pPrev = p;
      }
      oDst.pFirst = p;
      p.pPrev = null;
      return p;
    };
    Particle = (function() {
      var bIsDead;

      
        // Particle
      class Particle {
        fnInit() {
          var fAngle, fForce, iRndColor, p;
          p = this;
          iRndColor = ~~(fnRnd() * 128);
          p.aColor = [128 + iRndColor, 0 + iRndColor, 0 + iRndColor, 1];
          fAngle = fnRnd() * fPI * 2;
          fForce = 1 + 0.5 * fnRnd();
          p.bIsDead = false;
          p.iPosition = fnRnd() < 0.5 ? 1 : -1;
          p.iFramesAlive = 0;
          p.fX = (w / 2) + 150 * p.iPosition;
          p.fY = 0;
          p.fVX = fForce * fnCos(fAngle);
          p.fVY = Math.sqrt(Math.abs(fForce * fnSin(fAngle)));
          if (p.iPosition === 1 && p.fVX > 0.4) {
            p.fVX -= 0.6;
          }
          if (p.iPosition === -1 && p.fVX < 0.4) {
            p.fVX += 0.6;
          }
          p.fGrowDuration = 80 + (2 * fnRnd() - 1) * 4;
          p.fWaitDuration = 60 + (2 * fnRnd() - 1) * 10;
          p.fShrinkDuration = 80 + (2 * fnRnd() - 1) * 10;
          p.fRadiusStart = 0.5;
          p.fRadiusMax = 0.5 + 4 * fnRnd();
          p.fRadiusEnd = 0;
          p.fRadiusCurrent = 0.5;
          p.fAX = 0;
          p.fAY = 0;
          p.iDirection = fnRnd() < 0.5 ? 1 : -1;
          p.iDirection = p.fVX > 0 ? 1 : -1;
          if ((p.iPosition === -1 && p.fVX < 0) || (p.iPosition === 1 && p.fVX > 0)) {
            p.fRadiusMax *= 2;
            p.fWaitDuration *= 3;
          }
        }

        fnUpdate() {
          var fForce, p;
          p = this;
          fForce = 0.0003 * fnRnd() * p.iDirection;
          if (p.iFramesAlive < p.fGrowDuration) {
            p.fAX += -fForce * p.fVY;
            p.fAY += fForce * p.fVX;
          }
          if (p.iFramesAlive > p.fGrowDuration + p.fWaitDuration) {
            p.fAX -= -fForce * p.fVY;
            p.fAY -= fForce * p.fVX;
          }
          p.fVX += p.fAX;
          p.fVY += p.fAY;
          p.fX += p.fVX;
          p.fY += p.fVY;
          p.iFramesAlive += 1;
          if (p.iFramesAlive < p.fGrowDuration) {
            p.fRadiusCurrent = (p.fRadiusMax - p.fRadiusStart) / p.fGrowDuration * p.iFramesAlive + p.fRadiusStart;
          } else if (p.iFramesAlive < p.fGrowDuration + p.fWaitDuration) {
            p.fRadiusCurrent = p.fRadiusMax;
          } else if (p.iFramesAlive < p.fGrowDuration + p.fWaitDuration + p.fShrinkDuration) {
            p.fRadiusCurrent = (p.fRadiusEnd - p.fRadiusMax) / p.fShrinkDuration * (p.iFramesAlive - p.fGrowDuration - p.fWaitDuration) + p.fRadiusMax;
          } else {
            p.bIsDead = true;
          }
          p.aColor[3] = 100 / (255 - p.iFramesAlive / 2);
          if ((p.fX + p.fRadiusCurrent < 0) || (p.fY + p.fRadiusCurrent < 0) || (p.fX > w - p.fRadiusCurrent) || (p.fY > h - p.fRadiusCurrent)) {
            p.bIsDead = true;
          }
          if (p.bIsDead === true) {
            fnSwapList(p, oRender, oBuffer);
          }
        }

      };

      // Current Position
      Particle.prototype.fX = 0;

      Particle.prototype.fY = 0;

      // Current Velocity
      Particle.prototype.fVX = 0;

      Particle.prototype.fVY = 0;

      // color
      Particle.prototype.aColor = [128, 0, 0, 1];

      // double linked list
      Particle.prototype.pPrev = null;

      Particle.prototype.pNext = null;

      Particle.prototype.fGrowDuration = 100;

      Particle.prototype.fWaitDuration = 50;

      Particle.prototype.fShrinkDuration = 50;

      Particle.prototype.fRadiusCurrent = 0;

      Particle.prototype.fRadiusStart = 0;

      Particle.prototype.fRadiusMax = 10;

      Particle.prototype.fRadiusEnd = 0;

      Particle.prototype.iFramesAlive = 0;

      bIsDead = false;

      Particle.prototype.fAX = 0;

      Particle.prototype.fAY = 0;

      Particle.prototype.iDirection = 1;

      Particle.prototype.iPosition = 1;

      return Particle;

    }).call(this);
    fnRender = function() {
      var aData, iCount, iIndex, oImageData, p;
      oImageData = ctxRender.getImageData(0, 0, w, h);
      aData = oImageData.data;
      iIndex = 3;
      while (iIndex < aData.length) {
        aData[iIndex] -= 2;
        iIndex += 4;
      }
      // oImageData.data = aData
      ctxRender.putImageData(oImageData, 0, 0);
      p = oRender.pFirst;
      iCount = 0;
      while (p != null) {
        ctxRender.fillStyle = "rgba(" + p.aColor.join(',') + ")";
        ctxRender.beginPath();
        ctxRender.arc(p.fX, p.fY, Math.max(p.fRadiusCurrent, 0.01), 0, 2 * fPI, false);
        ctxRender.closePath();
        ctxRender.fill();
        p = p.pNext;
        iCount += 1;
      }
    };
    fnNextFrame = function() {
      var iAddParticle, iCount, p, pNext;
      iAddParticle = 0;
      iCount = 0;
      while (iAddParticle++ < 2) {
        p = fnSwapList(oBuffer.pFirst, oBuffer, oRender);
        p.fnInit();
      }
      p = oRender.pFirst;
      while (p != null) {
        pNext = p.pNext;
        p.fnUpdate();
        p = pNext;
        iCount++;
      }
      fnRender();
      return fnRequestAnimationFrame(function() {
        return fnNextFrame();
      });
    };
    fnNextFrame();
  };

  fnAddEventListener(window, 'load', app);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBYW1CO0VBQUE7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFBQSxHQUFBLEVBQUEsa0JBQUEsRUFBQTs7RUFDbkIsdUJBQUEsR0FBMEIsUUFBQSxDQUFDLFVBQUQsQ0FBQTtBQUMxQixRQUFBO0lBQUUsV0FBQSxHQUNFLE1BQU0sQ0FBQyxxQkFBUCxJQUNBLE1BQU0sQ0FBQywyQkFEUCxJQUVBLE1BQU0sQ0FBQyx3QkFGUCxJQUdBLE1BQU0sQ0FBQyxzQkFIUCxJQUlBLE1BQU0sQ0FBQyx1QkFKUCxJQUtBLFFBQUEsQ0FBQyxVQUFELENBQUE7TUFDRSxNQUFNLENBQUMsVUFBUCxDQUFrQixVQUFsQixFQUE4QixJQUFBLEdBQU8sRUFBckM7SUFERjtJQUdGLFdBQUEsQ0FBWSxVQUFaO0VBVndCLEVBRFA7OztFQWVuQixrQkFBQSxHQUFxQixRQUFBLENBQUMsQ0FBRCxFQUFJLE1BQUosRUFBWSxFQUFaLENBQUE7SUFDbkIsSUFBRyxDQUFDLENBQUMsZ0JBQUw7TUFDRSxDQUFDLENBQUMsZ0JBQUYsQ0FBbUIsTUFBbkIsRUFBMkIsRUFBM0IsRUFBK0IsS0FBL0IsRUFERjtLQUFBLE1BQUE7TUFHRSxDQUFDLENBQUMsSUFBQSxHQUFPLE1BQVIsQ0FBRCxHQUFtQixHQUhyQjs7RUFEbUI7O0VBT3JCLEdBQUEsR0FBTSxRQUFBLENBQUEsQ0FBQTtBQUNOLFFBQUEsUUFBQSxFQUFBLFNBQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLFdBQUEsRUFBQSxRQUFBLEVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxLQUFBLEVBQUEsVUFBQSxFQUFBLGFBQUEsRUFBQSxDQUFBLEVBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLENBQUE7O0lBQ0UsSUFBQSxHQUFPO0lBQ1AsS0FBQSxHQUFRLElBQUksQ0FBQztJQUNiLEdBQUEsR0FBTSxJ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biBub3RhdGlvblxuIyAoaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9IdW5nYXJpYW5fbm90YXRpb24pXG4jIG4gLSBIVE1MLU5vZGVcbiMgbyAtIG9iamVjdFxuIyBzIC0gc3RyaW5nXG4jIGkgLSBpbnRlZ2VyXG4jIGEgLSBhcnJheVxuIyBiIC0gYm9vbGVhblxuIyBmIC0gZmxvYXRcbiMgcCAtIFBhcnRpY2xlXG4jIGZuIC0gZnVuY3Rpb25cbiMgY3R4IC0gMkQgQ29udGV4dFxuXG4jIEdlbmVyYWwgRnVuY3Rpb25zXG5mblJlcXVlc3RBbmltYXRpb25GcmFtZSA9IChmbkNhbGxiYWNrKSAtPlxuICBmbkFuaW1GcmFtZSA9XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSBvclxuICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgb3JcbiAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIG9yXG4gICAgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgb3JcbiAgICB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgb3JcbiAgICAoZm5DYWxsYmFjaykgLT5cbiAgICAgIHdpbmRvdy5zZXRUaW1lT3V0KGZuQ2FsbGJhY2ssIDEwMDAgLyA2MClcbiAgICAgIHJldHVyblxuICBmbkFuaW1GcmFtZSBmbkNhbGxiYWNrXG4gIHJldHVyblxuXG4jIEFkZCBFdmVudCBMaXN0ZW5lclxuZm5BZGRFdmVudExpc3RlbmVyID0gKG8sIHNFdmVudCwgZm4pIC0+XG4gIGlmIG8uYWRkRXZlbnRMaXN0ZW5lclxuICAgIG8uYWRkRXZlbnRMaXN0ZW5lcihzRXZlbnQsIGZuLCBmYWxzZSlcbiAgZWxzZVxuICAgIG9bJ29uJyArIHNFdmVudF0gPSBmblxuICByZXR1cm5cblxuYXBwID0gKCkgLT5cbiAgIyBHZW5lcmFsIEVsZW1lbnRzXG4gIG9Eb2MgPSBkb2N1bWVudFxuICBuQm9keSA9IG9Eb2MuYm9keVxuICBmUEkgPSBNYXRoLlBJXG4gIGZuUm5kID0gTWF0aC5yYW5kb21cbiAgZm5Db3MgPSBNYXRoLmNvc1xuICBmblNpbiA9IE1hdGguc2luXG4gIFxuICBmblRleHRGYWRlT3V0ID0gKCkgLT5cbiAgICBuVmFsZW50aW5lc1RleHQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdoYXBweS12YWxlbnRpbmVzJylcbiAgICByZXR1cm5cblxuICBzZXRUaW1lb3V0KGZuVGV4dEZhZGVPdXQsIDMwMDApXG4gIGN0eFJlbmRlciA9IG5DYW52YXNSZW5kZXIuZ2V0Q29udGV4dCAnMmQnXG5cbiAgb1JlbmRlciA9IHtwRmlyc3Q6IG51bGx9XG4gIG9CdWZmZXIgPSB7cEZpcnN0OiBudWxsfVxuICBcbiAgdyA9IGggPSAwXG5cbiAgIyBnZXRzL3NldHMgc2l6ZVxuICBmblNldFNpemUgPSAoKSAtPlxuICAgIG5DYW52YXNSZW5kZXIud2lkdGggPSB3ID0gd2luZG93LmlubmVyV2lkdGhcbiAgICBuQ2FudmFzUmVuZGVyLmhlaWdodCA9IGggPSA0MDAgIyB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICB7dzogdywgaDogaH1cblxuICBmblNldFNpemUoKVxuICBcbiAgIyB3aW5kb3cub25yZXNpemVcbiAgZm5BZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ3Jlc2l6ZScsIGZuU2V0U2l6ZSlcblxuICBmblN3YXBMaXN0ID0gKHAsIG9TcmMsIG9Ec3QpIC0+XG4gICAgaWYgcD9cbiAgICAgICMgcmVtb3ZlIHAgZnJvbSBvU3JjXG4gICAgICBpZiBvU3JjLnBGaXJzdCBpcyBwXG4gICAgICAgIG9TcmMucEZpcnN0ID0gcC5wTmV4dFxuICAgICAgICBwLnBOZXh0LnBQcmV2ID0gbnVsbCBpZiBwLnBOZXh0P1xuICAgICAgZWxzZVxuICAgICAgICBwLnBQcmV2LnBOZXh0ID0gcC5wTmV4dFxuICAgICAgICBwLnBOZXh0LnBQcmV2ID0gcC5wUHJldiBpZiBwLnBOZXh0P1xuICAgIGVsc2VcbiAgICAgICMgY3JlYXRlIG5ldyBwXG4gICAgICBwID0gbmV3IFBhcnRpY2xlKClcbiAgXG4gICAgcC5wTmV4dCA9IG9Ec3QucEZpcnN0XG4gICAgb0RzdC5wRmlyc3QucFByZXYgPSBwIGlmIG9Ec3QucEZpcnN0P1xuICAgIG9Ec3QucEZpcnN0ID0gcFxuICAgIHAucFByZXYgPSBudWxsXG4gICAgcFxuICBcbiAgIyBQYXJ0aWNsZVxuICBjbGFzcyBQYXJ0aWNsZVxuICAgICMgQ3VycmVudCBQb3NpdGlvblxuICAgIGZYOiAwXG4gICAgZlk6IDBcbiAgICAjIEN1cnJlbnQgVmVsb2NpdHlcbiAgICBmVlg6IDBcbiAgICBmVlk6IDBcbiAgICAjIGNvbG9yXG4gICAgYUNvbG9yOiBbMTI4LCAwLCAwLCAxXVxuICAgICMgZG91YmxlIGxpbmtlZCBsaXN0XG4gICAgcFByZXY6IG51bGxcbiAgICBwTmV4dDogbnVsbFxuICAgIFxuICAgIGZHcm93RHVyYXRpb246IDEwMFxuICAgIGZXYWl0RHVyYXRpb246IDUwXG4gICAgZlNocmlua0R1cmF0aW9uOiA1MFxuICAgIGZSYWRpdXNDdXJyZW50OiAwXG4gICAgZlJhZGl1c1N0YXJ0OiAwXG4gICAgZlJhZGl1c01heDogMTBcbiAgICBmUmFkaXVzRW5kOiAwXG4gICAgaUZyYW1lc0FsaXZlOiAwXG4gICAgYklzRGVhZCA9IGZhbHNlXG4gICAgZkFYOiAwXG4gICAgZkFZOiAwXG4gICAgaURpcmVjdGlvbjogMVxuICAgIGlQb3NpdGlvbjogMVxuICAgIFxuICAgIGZuSW5pdDogKCkgLT5cbiAgICAgIHAgPSB0aGlzXG4gICAgICBpUm5kQ29sb3IgPSB+fihmblJuZCgpICogMTI4KVxuICAgICAgcC5hQ29sb3IgPSBbMTI4ICsgaVJuZENvbG9yLCAwICsgaVJuZENvbG9yLCAwICsgaVJuZENvbG9yLCAxXVxuICAgICAgZkFuZ2xlID0gZm5SbmQoKSAqIGZQSSAqIDJcbiAgICAgIGZGb3JjZSA9IDEgKyAwLjUgKiBmblJuZCgpXG4gICAgICBwLmJJc0RlYWQgPSBmYWxzZTtcbiAgICAgIHAuaVBvc2l0aW9uID0gaWYgZm5SbmQoKSA8IDAuNSB0aGVuIDEgZWxzZSAtMVxuICAgICAgcC5pRnJhbWVzQWxpdmUgPSAwO1xuICAgICAgcC5mWCA9ICh3IC8gMikgKyAxNTAgKiBwLmlQb3NpdGlvblxuICAgICAgcC5mWSA9IDBcbiAgICAgIHAuZlZYID0gZkZvcmNlICogZm5Db3MoZkFuZ2xlKVxuICAgICAgcC5mVlkgPSBNYXRoLnNxcnQoIE1hdGguYWJzKGZGb3JjZSAqIGZuU2luKGZBbmdsZSkpKVxuICAgICAgaWYgKHAuaVBvc2l0aW9uIGlzIDEgYW5kIHAuZlZYID4gMC40KVxuICAgICAgICBwLmZWWCAtPSAwLjZcbiAgICAgIGlmIChwLmlQb3NpdGlvbiBpcyAtMSBhbmQgcC5mVlggPCAwLjQpXG4gICAgICAgIHAuZlZYICs9IDAuNlxuICAgICAgcC5mR3Jvd0R1cmF0aW9uID0gODAgKyAoMiAqIGZuUm5kKCkgLSAxKSAqIDRcbiAgICAgIHAuZldhaXREdXJhdGlvbiA9IDYwICsgKDIgKiBmblJuZCgpIC0gMSkgKiAxMFxuICAgICAgcC5mU2hyaW5rRHVyYXRpb24gPSA4MCArICgyICogZm5SbmQoKSAtIDEpICogMTBcbiAgICAgIHAuZlJhZGl1c1N0YXJ0ID0gMC41XG4gICAgICBwLmZSYWRpdXNNYXggPSAwLjUgKyA0ICogZm5SbmQoKVxuICAgICAgcC5mUmFkaXVzRW5kID0gMFxuICAgICAgcC5mUmFkaXVzQ3VycmVudCA9IDAuNVxuICAgICAgcC5mQVggPSAwXG4gICAgICBwLmZBWSA9IDBcbiAgICAgIHAuaURpcmVjdGlvbiA9IGlmIGZuUm5kKCkgPCAwLjUgdGhlbiAxIGVsc2UgLTFcbiAgICAgIHAuaURpcmVjdGlvbiA9IGlmIHAuZlZYID4gMCB0aGVuIDEgZWxzZSAtMVxuICAgICAgaWYgKHAuaVBvc2l0aW9uIGlzIC0xIGFuZCBwLmZWWCA8IDApIG9yIChwLmlQb3NpdGlvbiBpcyAxIGFuZCBwLmZWWCA+IDApXG4gICAgICAgIHAuZlJhZGl1c01heCAqPSAyXG4gICAgICAgIHAuZldhaXREdXJhdGlvbiAqPSAzXG4gICAgICByZXR1cm5cbiAgXG4gICAgZm5VcGRhdGU6ICgpIC0+XG4gICAgICBwID0gdGhpc1xuICAgICAgZkZvcmNlID0gMC4wMDAzICogZm5SbmQoKSAqIHAuaURpcmVjdGlvblxuXG4gICAgICBpZiBwLmlGcmFtZXNBbGl2ZSA8IHAuZkdyb3dEdXJhdGlvblxuICAgICAgICBwLmZBWCArPSAtZkZvcmNlICogcC5mVllcbiAgICAgICAgcC5mQVkgKz0gZkZvcmNlICogcC5mVlhcblxuICAgICAgaWYgcC5pRnJhbWVzQWxpdmUgPiBwLmZHcm93RHVyYXRpb24gKyBwLmZXYWl0RHVyYXRpb25cbiAgICAgICAgcC5mQVggLT0gLWZGb3JjZSAqIHAuZlZZXG4gICAgICAgIHAuZkFZIC09IGZGb3JjZSAqIHAuZlZYXG5cbiAgICAgIHAuZlZYICs9IHAuZkFYXG4gICAgICBwLmZWWSArPSBwLmZBWVxuICAgIFxuICAgICAgcC5mWCArPSBwLmZWWFxuICAgICAgcC5mWSArPSBwLmZWWVxuICAgICAgXG4gICAgICBwLmlGcmFtZXNBbGl2ZSArPSAxXG5cbiAgICAgIGlmIHAuaUZyYW1lc0FsaXZlIDwgcC5mR3Jvd0R1cmF0aW9uXG4gICAgICAgIHAuZlJhZGl1c0N1cnJlbnQgPSAocC5mUmFkaXVzTWF4IC0gcC5mUmFkaXVzU3RhcnQpIC8gcC5mR3Jvd0R1cmF0aW9uICogcC5pRnJhbWVzQWxpdmUgKyBwLmZSYWRpdXNTdGFydFxuICAgICAgZWxzZSBpZiBwLmlGcmFtZXNBbGl2ZSA8IHAuZkdyb3dEdXJhdGlvbiArIHAuZldhaXREdXJhdGlvblxuICAgICAgICBwLmZSYWRpdXNDdXJyZW50ID0gcC5mUmFkaXVzTWF4XG4gICAgICBlbHNlIGlmIHAuaUZyYW1lc0FsaXZlIDwgcC5mR3Jvd0R1cmF0aW9uICsgcC5mV2FpdER1cmF0aW9uICsgcC5mU2hyaW5rRHVyYXRpb25cbiAgICAgICAgcC5mUmFkaXVzQ3VycmVudCA9IChwLmZSYWRpdXNFbmQgLSBwLmZSYWRpdXNNYXgpIC8gcC5mU2hyaW5rRHVyYXRpb24gKiAocC5pRnJhbWVzQWxpdmUgLSBwLmZHcm93RHVyYXRpb24gLSBwLmZXYWl0RHVyYXRpb24pICsgcC5mUmFkaXVzTWF4XG4gICAgICBlbHNlXG4gICAgICAgIHAuYklzRGVhZCA9IHRydWVcbiAgICAgIHAuYUNvbG9yWzNdID0gMTAwIC8gKDI1NSAtIHAuaUZyYW1lc0FsaXZlIC8gMilcbiAgICAgIHAuYklzRGVhZCA9IHRydWUgaWYgKHAuZlggKyBwLmZSYWRpdXNDdXJyZW50IDwgMCkgb3IgKHAuZlkgKyBwLmZSYWRpdXNDdXJyZW50IDwgMCkgb3IgKHAuZlggPiB3IC0gcC5mUmFkaXVzQ3VycmVudCkgb3IgKHAuZlkgPiBoIC0gcC5mUmFkaXVzQ3VycmVudClcbiAgICAgIGZuU3dhcExpc3QocCwgb1JlbmRlciwgb0J1ZmZlcikgaWYgcC5iSXNEZWFkIGlzIHRydWVcbiAgICAgIHJldHVyblxuICAgICAgXG4gIGZuUmVuZGVyID0gKCkgLT5cbiAgICBvSW1hZ2VEYXRhID0gY3R4UmVuZGVyLmdldEltYWdlRGF0YSgwLCAwLCB3LCBoKVxuICAgIGFEYXRhID0gb0ltYWdlRGF0YS5kYXRhXG4gICAgaUluZGV4ID0gM1xuICAgIHdoaWxlIGlJbmRleCA8IGFEYXRhLmxlbmd0aFxuICAgICAgYURhdGFbaUluZGV4XSAtPSAyXG4gICAgICBpSW5kZXggKz0gNFxuICAgICMgb0ltYWdlRGF0YS5kYXRhID0gYURhdGFcbiAgICBjdHhSZW5kZXIucHV0SW1hZ2VEYXRhKG9JbWFnZURhdGEsIDAsIDApXG4gICAgcCA9IG9SZW5kZXIucEZpcnN0XG4gICAgaUNvdW50ID0gMFxuICAgIHdoaWxlIHA/XG4gICAgICBjdHhSZW5kZXIuZmlsbFN0eWxlID0gXCJyZ2JhKFwiICsgcC5hQ29sb3Iuam9pbignLCcpICsgXCIpXCJcbiAgICAgIGN0eFJlbmRlci5iZWdpblBhdGgoKVxuICAgICAgY3R4UmVuZGVyLmFyYyhwLmZYLCBwLmZZLCBNYXRoLm1heChwLmZSYWRpdXNDdXJyZW50LDAuMDEpLCAwLCAyICogZlBJLCBmYWxzZSlcbiAgICAgIGN0eFJlbmRlci5jbG9zZVBhdGgoKVxuICAgICAgY3R4UmVuZGVyLmZpbGwoKVxuICAgICAgcCA9IHAucE5leHRcbiAgICAgIGlDb3VudCArPSAxXG4gICAgcmV0dXJuXG4gIFxuICBmbk5leHRGcmFtZSA9ICgpIC0+XG4gICAgaUFkZFBhcnRpY2xlID0gMFxuICAgIGlDb3VudCA9IDBcbiAgICB3aGlsZSBpQWRkUGFydGljbGUrKyA8IDJcbiAgICAgIHAgPSBmblN3YXBMaXN0KG9CdWZmZXIucEZpcnN0LCBvQnVmZmVyLCBvUmVuZGVyKVxuICAgICAgcC5mbkluaXQoKVxuICBcbiAgICBwID0gb1JlbmRlci5wRmlyc3RcbiAgICB3aGlsZSBwP1xuICAgICAgcE5leHQgPSBwLnBOZXh0XG4gICAgICBwLmZuVXBkYXRlKClcbiAgICAgIHAgPSBwTmV4dFxuICAgICAgaUNvdW50KytcbiAgICBmblJlbmRlcigpXG4gICAgXG4gICAgZm5SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgKCkgLT4gZm5OZXh0RnJhbWUoKSBcbiAgICBcbiAgZm5OZXh0RnJhbWUoKSAgXG4gIHJldHVyblxuICBcbmZuQWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdsb2FkJywgYXBwKSJdfQ==
//# sourceURL=coffeescript