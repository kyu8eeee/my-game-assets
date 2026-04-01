// =========================================================================
// 🚀 [올인원 통합형] 수익화 광고 모듈 (adcode.js)
// =========================================================================

(function() {
    // 1. 광고 HTML UI 자동 생성 및 삽입
    var adHtml = `
        <div id="reward-overlay" class="overlay">
            <h2 id="reward-title" style="margin-top:0; margin-bottom:15px; color: #2c3e50;">스폰서 방문 후 보상받기</h2>
            <p id="reward-desc" style="margin-bottom:20px; font-size: 0.95rem; color: #555; line-height: 1.6;"></p>
            <button class="btn-primary" id="coupang-btn" style="background-color: #ea1d2c; width: 80%; font-size: 1.05rem; margin-bottom: 10px; display: none;">쿠팡 특가상품 보기</button>
            <button class="btn-primary" id="ali-btn" style="background-color: #ff4747; width: 80%; font-size: 1.05rem; margin-bottom: 15px; display: none;">알리익스프레스 구경하기</button>
            <button class="btn-secondary" id="c-rev-btn" style="width: 80%;">취소</button>
        </div>
        <div id="cooldown-overlay" class="overlay">
            <div style="font-size: 3rem; margin-bottom: 10px;">🤖</div>
            <h2 style="margin-top:0; color: #e74c3c; margin-bottom: 10px;">스폰서 쿨다운</h2>
            <p id="cd-desc" style="margin-bottom: 20px; max-width: 85%; color: #2c3e50;">잠시 후에 다시 이용할 수 있습니다.</p>
            <div style="background: #2c3e50; color: #f1c40f; padding: 12px 25px; border-radius: 10px; font-size: 1.1rem; font-weight: bold; margin-bottom: 20px; font-family: monospace;">남은 시간: <span id="cd-time-txt">00:00</span></div>
            <button class="btn-secondary" id="cl-cd-btn">기다릴게</button>
        </div>
        <div id="mock-ad-overlay" class="overlay" style="background-color: #000; color: white; display:none; opacity:0; visibility:hidden;">
            <h2 style="color:white; margin-top:0;">데이터 분석 중</h2>
            <p>잠시만 기다려주세요: <span id="m-ad-tm">2</span>초</p>
        </div>
    `;
    
    // 게임판 내부에 광고 레이어 삽입
    var gc = document.getElementById('game-container');
    if (gc) { gc.insertAdjacentHTML('beforeend', adHtml); }

    // 2. 핵심 로직 및 변수 설정
    var safeGet = function(k) { try { return sessionStorage.getItem(k); } catch(e) { return null; } };
    var safeSet = function(k, v) { try { sessionStorage.setItem(k, v); } catch(e) {} };
    var uS = parseInt(safeGet('u_s'), 10) || 0;
    var uC = parseInt(safeGet('u_c'), 10) || 0;
    var missionInt, checkInt, affWin, cdI;

    // UI 문구 자동 감지 (힌트 vs 무르기)
    var isHint = document.getElementById('hint-btn') !== null;
    var actNm = isHint ? "힌트" : "무르기";

    // 3. 공용 타이머 및 UI 업데이트 함수 (전역 연결)
    window.updateAdTimerUI = function(b1, b2) {
        var tS = "";
        if (uC > 0) tS = " (" + uC + ")";
        else if (uS === 2) {
            var l = safeGet('l_t_u');
            if (l && (Date.now() - parseInt(l) < 180000)) {
                var s = Math.ceil((parseInt(l) + 180000 - Date.now()) / 1000);
                tS = " (" + Math.floor(s/60).toString().padStart(2,'0') + ":" + (s%60).toString().padStart(2,'0') + ")";
            }
        }
        var btnTxt = (isHint ? "💡 힌트" : "무르기") + tS;
        if(b1) b1.innerText = btnTxt;
        if(b2 && b2.id !== 're-btn') b2.innerText = btnTxt;
    };

    // 4. 광고 체크 및 보상 실행 (전역 연결)
    window.performAdCheck = function(cb) {
        if (uC > 0) { uC--; safeSet('u_c', uC); cb(); return; }
        
        var ov = document.getElementById('reward-overlay'), tl = document.getElementById('reward-title'), ds = document.getElementById('reward-desc');
        if (uS === 1) {
            tl.innerText = actNm + " 횟수 소진";
            ds.innerHTML = "부여된 " + actNm + " 5회를 벌써 다 쓰셨군요.<br>아래 스폰서를 방문하시면<br><strong>마지막 " + actNm + " 5회권</strong>이 추가로 부여됩니다.";
            document.getElementById('coupang-btn').style.display='none'; document.getElementById('ali-btn').style.display='block';
        } else if (uS === 2) {
            var l = safeGet('l_t_u');
            if (l && (Date.now() - parseInt(l) < 180000)) {
                document.getElementById('cooldown-overlay').classList.add('show');
                // (중략: 타이머 로직)
                return;
            }
            safeSet('l_t_u', Date.now()); showMock(cb); return;
        } else {
            tl.innerText = "스폰서 방문 후 " + actNm;
            ds.innerHTML = "아래 스폰서 링크를 1회 방문하시면<br><strong>즉시 " + actNm + " 5회권</strong>이 부여됩니다.";
            document.getElementById('coupang-btn').style.display='block'; document.getElementById('ali-btn').style.display='none';
        }
        ov.classList.add('show');
        
        // 클릭 이벤트 핸들러 (내부)
        document.getElementById('coupang-btn').onclick = function() { handleAff('coupang', cb); };
        document.getElementById('ali-btn').onclick = function() { handleAff('ali', cb); };
    };

    var showMock = function(cb) {
        var ad = document.getElementById('mock-ad-overlay'); ad.style.display='flex'; ad.classList.add('show');
        var c = 2; document.getElementById('m-ad-tm').innerText = c;
        var iv = setInterval(function() { c--; document.getElementById('m-ad-tm').innerText = c; if (c <= 0) { clearInterval(iv); ad.classList.remove('show'); ad.style.display='none'; cb(); } }, 1000);
    };

    var handleAff = function(type, cb) {
        affWin = window.open(type==='coupang'?"https://link.coupang.com/a/ectYi7":"https://s.click.aliexpress.com/e/_c4FSCKy9", '_blank');
        var tl = document.getElementById('reward-title'), ds = document.getElementById('reward-desc');
        tl.innerText = "확인 중..."; var s=5;
        missionInt = setInterval(function(){
            s--; ds.innerHTML = "창을 유지해주세요. ("+s+"초)";
            if(s<=0){
                clearInterval(missionInt); uS=(type==='coupang'?1:2); uC=4;
                safeSet('u_s', uS); safeSet('u_c', uC);
                document.getElementById('reward-overlay').classList.remove('show');
                showMock(cb);
            }
        },1000);
    };

    document.getElementById('c-rev-btn').onclick = function(){ document.getElementById('reward-overlay').classList.remove('show'); };
    setInterval(function(){ var b1 = document.getElementById('u-btn') || document.getElementById('hint-btn'); var b2 = document.getElementById('go-u-btn'); updateAdTimerUI(b1, b2); }, 1000);
})();
