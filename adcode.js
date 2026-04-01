// =========================================================================
// 🚀 [올인원 통합형] 수익화 광고 모듈 (adcode.js) - 최종 안정화 버전
// =========================================================================

(function() {
    console.log("Ad Module Loaded Successfully"); // 로드 확인용

    // 1. 광고 HTML UI 자동 생성 및 삽입
    var adHtml = `
        <div id="reward-overlay" class="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.95); border-radius: 12px; display: none; flex-direction: column; align-items: center; justify-content: center; z-index: 1000; text-align: center; padding: 15px;">
            <h2 id="reward-title" style="margin-top:0; margin-bottom:15px; color: #2c3e50;">스폰서 방문 후 보상받기</h2>
            <p id="reward-desc" style="margin-bottom:20px; font-size: 0.95rem; color: #555; line-height: 1.6;"></p>
            <button class="btn-primary" id="coupang-btn" style="background-color: #ea1d2c; color:white; border:none; padding:12px; border-radius:8px; width: 80%; font-size: 1.05rem; margin-bottom: 10px; display: none; cursor:pointer;">쿠팡 특가상품 보기</button>
            <button class="btn-primary" id="ali-btn" style="background-color: #ff4747; color:white; border:none; padding:12px; border-radius:8px; width: 80%; font-size: 1.05rem; margin-bottom: 15px; display: none; cursor:pointer;">알리익스프레스 구경하기</button>
            <button class="btn-secondary" id="c-rev-btn" style="width: 80%; padding:10px; border-radius:8px; border:1px solid #ddd; background:white; cursor:pointer;">취소</button>
        </div>
        <div id="cooldown-overlay" class="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.95); border-radius: 12px; display: none; flex-direction: column; align-items: center; justify-content: center; z-index: 1000; text-align: center; padding: 15px;">
            <div style="font-size: 3rem; margin-bottom: 10px;">🤖</div>
            <h2 style="margin-top:0; color: #e74c3c; margin-bottom: 10px;">스폰서 쿨다운</h2>
            <p id="cd-desc" style="margin-bottom: 20px; max-width: 85%; color: #2c3e50;">잠시 후에 다시 이용할 수 있습니다.</p>
            <div style="background: #2c3e50; color: #f1c40f; padding: 12px 25px; border-radius: 10px; font-size: 1.1rem; font-weight: bold; margin-bottom: 20px; font-family: monospace;">남은 시간: <span id="cd-time-txt">00:00</span></div>
            <button class="btn-secondary" id="cl-cd-btn" style="padding:10px 20px; cursor:pointer;">기다릴게</button>
        </div>
        <div id="mock-ad-overlay" class="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: #000; color: white; display: none; flex-direction: column; align-items: center; justify-content: center; z-index: 2000; text-align: center;">
            <h2 style="color:white; margin-top:0;">데이터 분석 중</h2>
            <p>잠시만 기다려주세요: <span id="m-ad-tm">2</span>초</p>
        </div>
    `;
    
    var gc = document.getElementById('game-container');
    if (gc) { gc.insertAdjacentHTML('beforeend', adHtml); }

    var safeGet = function(k) { try { return sessionStorage.getItem(k); } catch(e) { return null; } };
    var safeSet = function(k, v) { try { sessionStorage.setItem(k, v); } catch(e) {} };
    var uS = parseInt(safeGet('u_s'), 10) || 0;
    var uC = parseInt(safeGet('u_c'), 10) || 0;
    var missionInt, checkInt, affWin, cdI;

    // 윈도우 전역 함수로 노출하여 모든 게임에서 호출 가능하게 함
    window.performAdCheck = function(cb) {
        if (uC > 0) { uC--; safeSet('u_c', uC); cb(); return; }
        
        var isHint = document.getElementById('hint-btn') !== null;
        var actNm = isHint ? "힌트" : "무르기";
        var ov = document.getElementById('reward-overlay'), tl = document.getElementById('reward-title'), ds = document.getElementById('reward-desc');
        
        if (uS === 1) {
            tl.innerText = actNm + " 횟수 소진";
            ds.innerHTML = "부여된 " + actNm + " 5회를 모두 사용하셨군요.<br>아아래 스폰서를 방문하시면<br><strong>마지막 " + actNm + " 5회권</strong>이 추가로 부여됩니다.";
            document.getElementById('coupang-btn').style.display='none'; document.getElementById('ali-btn').style.display='block';
        } else if (uS === 2) {
            var l = safeGet('l_t_u');
            if (l && (Date.now() - parseInt(l) < 180000)) {
                showCooldown(); return;
            }
            safeSet('l_t_u', Date.now()); showMock(cb); return;
        } else {
            tl.innerText = "스폰서 방문 후 " + actNm;
            ds.innerHTML = "아래 스폰서 링크를 1회 방문하시면<br><strong>즉시 " + actNm + " 5회권</strong>이 부여됩니다.";
            document.getElementById('coupang-btn').style.display='block'; document.getElementById('ali-btn').style.display='none';
        }
        ov.style.display = 'flex';
        
        document.getElementById('coupang-btn').onclick = function() { handleAff('coupang', cb); };
        document.getElementById('ali-btn').onclick = function() { handleAff('ali', cb); };
    };

    var showMock = function(cb) {
        var ad = document.getElementById('mock-ad-overlay'); ad.style.display='flex';
        var c = 2; document.getElementById('m-ad-tm').innerText = c;
        var iv = setInterval(function() { c--; document.getElementById('m-ad-tm').innerText = c; if (c <= 0) { clearInterval(iv); ad.style.display='none'; cb(); } }, 1000);
    };

    var handleAff = function(type, cb) {
        var url = type==='coupang'?"https://link.coupang.com/a/ectYi7":"https://s.click.aliexpress.com/e/_c4FSCKy9";
        affWin = window.open(url, '_blank');
        var tl = document.getElementById('reward-title'), ds = document.getElementById('reward-desc');
        tl.innerText = "확인 중..."; var s=5;
        missionInt = setInterval(function(){
            s--; ds.innerHTML = "창을 유지해주세요. ("+s+"초)";
            if(s<=0){
                clearInterval(missionInt); uS=(type==='coupang'?1:2); uC=4;
                safeSet('u_s', uS); safeSet('u_c', uC);
                document.getElementById('reward-overlay').style.display='none';
                showMock(cb);
            }
        },1000);
    };

    var showCooldown = function() {
        var box = document.getElementById('cooldown-overlay');
        box.style.display = 'flex';
        clearInterval(cdI);
        cdI = setInterval(function() {
            var l = parseInt(safeGet('l_t_u'));
            var df = (l + 180000) - Date.now();
            if (df <= 0) { clearInterval(cdI); box.style.display = 'none'; return; }
            var s = Math.ceil(df / 1000);
            document.getElementById('cd-time-txt').innerText = Math.floor(s/60).toString().padStart(2,'0') + ":" + (s%60).toString().padStart(2,'0');
        }, 1000);
    };

    document.getElementById('c-rev-btn').onclick = function(){ document.getElementById('reward-overlay').style.display='none'; };
    document.getElementById('cl-cd-btn').onclick = function(){ document.getElementById('cooldown-overlay').style.display='none'; };
})();
