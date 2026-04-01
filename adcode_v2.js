// =========================================================================
// 🚀 [올인원 통합형] 수익화 광고 모듈 (adcode_v2.js) - 5초 체류 검증 완벽 적용
// =========================================================================

(function() {
    console.log("Ad Module Version 2.0 Loaded (5-second validation active)");

    // 1. 광고 HTML 주입
    var adHtml = `
        <div id="reward-overlay" class="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.95); border-radius: 12px; display: none; flex-direction: column; align-items: center; justify-content: center; z-index: 1000; text-align: center; padding: 15px;">
            <h2 id="reward-title" style="margin-top:0; margin-bottom:15px; color: #2c3e50;">스폰서 방문 후 보상받기</h2>
            <p id="reward-desc" style="margin-bottom:20px; font-size: 0.95rem; color: #555; line-height: 1.6;"></p>
            <button id="coupang-btn" style="background-color: #ea1d2c; color:white; border:none; padding:12px; border-radius:8px; width: 80%; font-size: 1.05rem; margin-bottom: 10px; cursor:pointer;">쿠팡 특가상품 보기</button>
            <button id="ali-btn" style="background-color: #ff4747; color:white; border:none; padding:12px; border-radius:8px; width: 80%; font-size: 1.05rem; margin-bottom: 15px; display: none; cursor:pointer;">알리익스프레스 구경하기</button>
            <button id="c-rev-btn" style="width: 80%; padding:10px; border-radius:8px; border:1px solid #ddd; background:white; cursor:pointer; color:#333;">취소</button>
        </div>
        <div id="cooldown-overlay" class="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.95); border-radius: 12px; display: none; flex-direction: column; align-items: center; justify-content: center; z-index: 1000; text-align: center; padding: 15px;">
            <div style="font-size: 3rem; margin-bottom: 10px;">🤖</div>
            <h2 style="margin-top:0; color: #e74c3c; margin-bottom: 10px;">스폰서 쿨다운</h2>
            <p id="cd-desc" style="margin-bottom: 20px; max-width: 85%; color: #2c3e50;">잠시 후에 다시 이용할 수 있습니다.</p>
            <div style="background: #2c3e50; color: #f1c40f; padding: 12px 25px; border-radius: 10px; font-size: 1.1rem; font-weight: bold; margin-bottom: 20px; font-family: monospace;">남은 시간: <span id="cd-time-txt">00:00</span></div>
            <button id="cl-cd-btn" style="padding:10px 20px; cursor:pointer; border:1px solid #ddd; background:white; border-radius:8px; color:#333;">기다릴게</button>
        </div>
        <div id="mock-ad-overlay" class="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: #000; color: white; display: none; flex-direction: column; align-items: center; justify-content: center; z-index: 2000; text-align: center;">
            <h2 style="color:white; margin-top:0;">데이터 분석 중</h2>
            <p style="color:white;">잠시만 기다려주세요: <span id="m-ad-tm">2</span>초</p>
        </div>
    `;
    
    var gc = document.getElementById('game-container');
    if (gc) { gc.insertAdjacentHTML('beforeend', adHtml); }

    var safeGet = function(k) { try { return sessionStorage.getItem(k); } catch(e) { return null; } };
    var safeSet = function(k, v) { try { sessionStorage.setItem(k, v); } catch(e) {} };
    var uS = parseInt(safeGet('u_s'), 10) || 0;
    var uC = parseInt(safeGet('u_c'), 10) || 0;
    var missionInt = null, checkInt = null, affWin = null, cdI = null;

    // 2. 핵심 함수 전역 등록
    window.performAdCheck = function(callback) {
        if (uC > 0) { uC--; safeSet('u_c', uC); callback(); return; }
        
        var isHint = document.getElementById('hint-btn') !== null;
        var actNm = isHint ? "힌트" : "무르기";
        var ov = document.getElementById('reward-overlay'), tl = document.getElementById('reward-title'), ds = document.getElementById('reward-desc');
        var cBtn = document.getElementById('coupang-btn'), aBtn = document.getElementById('ali-btn'), rBtn = document.getElementById('c-rev-btn');
        
        if (uS === 1) {
            tl.innerText = actNm + " 횟수 소진";
            ds.innerHTML = "부여된 " + actNm + " 5회를 모두 사용하셨군요.<br>아래 스폰서를 방문하시면<br><strong>마지막 " + actNm + " 5회권</strong>이 추가로 부여됩니다.";
            cBtn.style.display = 'none'; aBtn.style.display = 'block';
            rBtn.style.display = 'inline-block'; rBtn.innerText = "취소";
        } else if (uS === 2) {
            var l = safeGet('l_t_u');
            if (l && (Date.now() - parseInt(l) < 180000)) {
                showCooldown(); return;
            }
            safeSet('l_t_u', Date.now()); showMockAd(callback); return;
        } else {
            tl.innerText = "스폰서 방문 후 " + actNm;
            ds.innerHTML = "아래 스폰서 링크를 1회 방문하시면<br><strong>즉시 " + actNm + " 5회권</strong>이 부여됩니다.";
            cBtn.style.display = 'block'; aBtn.style.display = 'none';
            rBtn.style.display = 'inline-block'; rBtn.innerText = "취소";
        }
        ov.style.display = 'flex';
        
        cBtn.onclick = function() { handleAff('coupang', callback, actNm); };
        aBtn.onclick = function() { handleAff('ali', callback, actNm); };
        rBtn.onclick = function() { 
            if(missionInt) clearInterval(missionInt); 
            if(checkInt) clearInterval(checkInt); 
            ov.style.display = 'none'; 
        };
    };

    function showMockAd(cb) {
        var ad = document.getElementById('mock-ad-overlay');
        ad.style.display = 'flex';
        var c = 2; document.getElementById('m-ad-tm').innerText = c;
        var iv = setInterval(function() {
            c--; document.getElementById('m-ad-tm').innerText = c;
            if (c <= 0) { clearInterval(iv); ad.style.display = 'none'; cb(); }
        }, 1000);
    }

    function showCooldown() {
        var box = document.getElementById('cooldown-overlay');
        box.style.display = 'flex';
        var msgs = ["상대방의 궤적을 분석 중입니다...", "최적의 수를 탐색 중...", "잠시 후 충전이 완료됩니다."];
        document.getElementById('cd-desc').innerText = msgs[Math.floor(Math.random() * msgs.length)];
        
        clearInterval(cdI);
        cdI = setInterval(function() {
            var l = parseInt(safeGet('l_t_u'));
            var df = (l + 180000) - Date.now();
            if (df <= 0) { clearInterval(cdI); box.style.display = 'none'; return; }
            var s = Math.ceil(df / 1000);
            document.getElementById('cd-time-txt').innerText = Math.floor(s/60).toString().padStart(2,'0') + ":" + (s%60).toString().padStart(2,'0');
        }, 1000);
    }

    // 3. 5초 체류 검증 및 팝업 닫힘 감지 로직
    function handleAff(type, cb, actNm) {
        var url = type === 'coupang' ? "https://link.coupang.com/a/ectYi7" : "https://s.click.aliexpress.com/e/_c4FSCKy9";
        affWin = window.open(url, '_blank');
        
        if (!affWin) { 
            alert("팝업 차단이 감지되었습니다. 팝업 차단을 해제해 주세요."); 
            return; 
        }
        
        var tl = document.getElementById('reward-title'), ds = document.getElementById('reward-desc');
        var cBtn = document.getElementById('coupang-btn'), aBtn = document.getElementById('ali-btn'), rBtn = document.getElementById('c-rev-btn');
        
        tl.innerText = "스폰서 사이트 확인 중";
        ds.innerHTML = "새로 열린 창을 닫지 말고 <strong>5초</strong>만 유지해주세요.<br><span style='font-size:0.85rem;'>(화면을 전환해도 창만 열려있으면 인정됩니다)</span><br><br> 남은 시간: <span id='m-sec' style='color:#e74c3c; font-size:1.5rem; font-weight:bold;'>5</span>초";
        cBtn.style.display = 'none'; aBtn.style.display = 'none';
        rBtn.style.display = 'inline-block'; rBtn.innerText = "진행 취소";
        
        if (missionInt) clearInterval(missionInt);
        if (checkInt) clearInterval(checkInt);
        
        var startTime = Date.now(), c = 5;
        
        // 1초마다 타이머 줄어듦
        missionInt = setInterval(function(){
            c--; 
            var mSecEl = document.getElementById('m-sec');
            if(mSecEl) mSecEl.innerText = c;
            
            if(c <= 0){
                // 5초 무사히 버팀 -> 보상 지급
                clearInterval(missionInt); clearInterval(checkInt);
                tl.innerText = "확인 완료";
                ds.innerHTML = actNm + " 5회권이 충전되었습니다.";
                rBtn.style.display = 'none';
                
                uS = (type === 'coupang') ? 1 : 2; 
                uC = 4; // 방금 1회 썼으므로 4회 남음
                safeSet('u_s', uS); safeSet('u_c', uC);
                
                setTimeout(function() { 
                    document.getElementById('reward-overlay').style.display = 'none'; 
                    showMockAd(cb); 
                }, 1000);
            }
        }, 1000);

        // 0.5초마다 창이 닫혔는지 감시 (핵심 검증 로직)
        checkInt = setInterval(function() {
            if (affWin && affWin.closed) {
                var elapsed = Date.now() - startTime;
                if (elapsed < 4800) { // 5초 전에 닫으면 실패
                    clearInterval(missionInt); clearInterval(checkInt);
                    tl.innerText = "미션 실패";
                    ds.innerHTML = "<span style='color:#e74c3c;'>스폰서 창을 너무 일찍 닫으셨습니다.</span><br>보상을 받으려면 창을 5초간 유지해야 합니다.";
                    
                    if(uS === 1) { cBtn.style.display = 'none'; aBtn.style.display = 'block'; }
                    else { cBtn.style.display = 'block'; aBtn.style.display = 'none'; }
                    
                    rBtn.innerText = "닫기";
                }
            }
        }, 500);
    }

    document.getElementById('cl-cd-btn').onclick = function(){ document.getElementById('cooldown-overlay').style.display='none'; };
})();
