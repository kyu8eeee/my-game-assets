// =========================================================================
// 🚀 [최종 독립형] 수익화 광고 모듈 (adcode_final.js) - 5초 검증 & 쿠팡 문구 자동 삽입
// =========================================================================

(function() {
    console.log("Ad Module FINAL Loaded (Isolated DOM, 5s Validation, Auto Disclosure)");

    // 1. 광고 HTML 주입 (기존 찌꺼기와 겹치지 않는 완전 고유 ID 사용)
    var adHtml = `
        <div id="ad2-reward-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.95); display: none; flex-direction: column; align-items: center; justify-content: center; z-index: 99999; text-align: center; padding: 15px;">
            <h2 id="ad2-reward-title" style="margin-top:0; margin-bottom:15px; color: #2c3e50;">스폰서 방문 후 보상받기</h2>
            <p id="ad2-reward-desc" style="margin-bottom:20px; font-size: 0.95rem; color: #555; line-height: 1.6;"></p>
            <button id="ad2-coupang-btn" style="background-color: #ea1d2c; color:white; border:none; padding:12px; border-radius:8px; width: 80%; max-width: 300px; font-size: 1.05rem; margin-bottom: 10px; cursor:pointer;">쿠팡 특가상품 보기</button>
            <button id="ad2-ali-btn" style="background-color: #ff4747; color:white; border:none; padding:12px; border-radius:8px; width: 80%; max-width: 300px; font-size: 1.05rem; margin-bottom: 15px; display: none; cursor:pointer;">알리익스프레스 구경하기</button>
            <button id="ad2-c-rev-btn" style="width: 80%; max-width: 300px; padding:10px; border-radius:8px; border:1px solid #ddd; background:white; cursor:pointer; color:#333;">취소</button>
        </div>
        <div id="ad2-cooldown-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.95); display: none; flex-direction: column; align-items: center; justify-content: center; z-index: 99999; text-align: center; padding: 15px;">
            <div style="font-size: 3rem; margin-bottom: 10px;">🤖</div>
            <h2 style="margin-top:0; color: #e74c3c; margin-bottom: 10px;">스폰서 쿨다운</h2>
            <p id="ad2-cd-desc" style="margin-bottom: 20px; max-width: 85%; color: #2c3e50;">잠시 후에 다시 이용할 수 있습니다.</p>
            <div style="background: #2c3e50; color: #f1c40f; padding: 12px 25px; border-radius: 10px; font-size: 1.1rem; font-weight: bold; margin-bottom: 20px; font-family: monospace;">남은 시간: <span id="ad2-cd-time-txt">00:00</span></div>
            <button id="ad2-cl-cd-btn" style="padding:10px 20px; cursor:pointer; border:1px solid #ddd; background:white; border-radius:8px; color:#333;">기다릴게</button>
        </div>
        <div id="ad2-mock-ad-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.85); color: white; display: none; flex-direction: column; align-items: center; justify-content: center; z-index: 100000; text-align: center;">
            <h2 style="color:white; margin-top:0;">데이터 분석 중</h2>
            <p style="color:white;">잠시만 기다려주세요: <span id="ad2-m-ad-tm">2</span>초</p>
        </div>
    `;
    var wrapper = document.createElement('div');
    wrapper.innerHTML = adHtml;
    document.body.appendChild(wrapper);

    // 💡 [추가됨] 2. 쿠팡 파트너스 대가성 문구 자동 삽입 (모든 페이지 하단)
    function injectCoupangDisclosure() {
        if (document.getElementById('cp-disclosure')) return; // 중복 생성 방지
        
        var cpDiv = document.createElement('div');
        cpDiv.id = 'cp-disclosure';
        // 이미지에 적힌 문구 그대로 반영 (영문은 색상을 약간 더 연하게 처리하여 디자인 최적화)
        cpDiv.innerHTML = "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.<br><span style='font-size:0.85em; color:#bdc3c7;'>This post is part of Coupang Partners' activities, and a certain amount of commission is provided accordingly.</span>";
        // 디자인 스타일링: 화면 맨 밑에 튀지 않게 중앙 정렬
        cpDiv.style.cssText = "width: 100%; max-width: 640px; margin: 30px auto 10px auto; text-align: center; font-size: 0.75rem; color: #95a5a6; line-height: 1.6; padding: 0 10px; word-break: keep-all;";
        
        // 게임 컨테이너 제일 밑에 붙임
        var appWrapper = document.getElementById('app-wrapper');
        if (appWrapper) {
            appWrapper.appendChild(cpDiv);
        } else {
            document.body.appendChild(cpDiv);
        }
    }

    // 문서가 준비되면 문구 삽입
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectCoupangDisclosure);
    } else {
        injectCoupangDisclosure();
    }

    var safeGet = function(k) { try { return sessionStorage.getItem(k); } catch(e) { return null; } };
    var safeSet = function(k, v) { try { sessionStorage.setItem(k, v); } catch(e) {} };
    var uS = parseInt(safeGet('u_s'), 10) || 0;
    var uC = parseInt(safeGet('u_c'), 10) || 0;
    var missionInt = null, checkInt = null, affWin = null, cdI = null;

    // 3. 핵심 함수 전역 등록
    window.performAdCheck = function(callback) {
        if (uC > 0) { uC--; safeSet('u_c', uC); callback(); return; }
        
        var isHint = document.getElementById('hint-btn') !== null;
        var actNm = isHint ? "힌트" : "무르기";
        var ov = document.getElementById('ad2-reward-overlay'), tl = document.getElementById('ad2-reward-title'), ds = document.getElementById('ad2-reward-desc');
        var cBtn = document.getElementById('ad2-coupang-btn'), aBtn = document.getElementById('ad2-ali-btn'), rBtn = document.getElementById('ad2-c-rev-btn');
        
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
        var ad = document.getElementById('ad2-mock-ad-overlay');
        ad.style.display = 'flex';
        var c = 2; document.getElementById('ad2-m-ad-tm').innerText = c;
        var iv = setInterval(function() {
            c--; document.getElementById('ad2-m-ad-tm').innerText = c;
            if (c <= 0) { clearInterval(iv); ad.style.display = 'none'; cb(); }
        }, 1000);
    }

    function showCooldown() {
        var box = document.getElementById('ad2-cooldown-overlay');
        box.style.display = 'flex';
        var msgs = ["상대방의 궤적을 분석 중입니다...", "최적의 수를 탐색 중...", "잠시 후 충전이 완료됩니다."];
        document.getElementById('ad2-cd-desc').innerText = msgs[Math.floor(Math.random() * msgs.length)];
        
        clearInterval(cdI);
        cdI = setInterval(function() {
            var l = parseInt(safeGet('l_t_u'));
            var df = (l + 180000) - Date.now();
            if (df <= 0) { clearInterval(cdI); box.style.display = 'none'; return; }
            var s = Math.ceil(df / 1000);
            document.getElementById('ad2-cd-time-txt').innerText = Math.floor(s/60).toString().padStart(2,'0') + ":" + (s%60).toString().padStart(2,'0');
        }, 1000);
        
        document.getElementById('ad2-cl-cd-btn').onclick = function(){ box.style.display='none'; };
    }

    // 4. 5초 체류 검증 및 팝업 닫힘 감지 로직
    function handleAff(type, cb, actNm) {
        var url = type === 'coupang' ? "https://link.coupang.com/a/ectYi7" : "https://s.click.aliexpress.com/e/_c4FSCKy9";
        var affWin = window.open(url, '_blank');
        
        if (!affWin) { alert("팝업 차단이 감지되었습니다. 팝업 차단을 해제해 주세요."); return; }
        
        var tl = document.getElementById('ad2-reward-title'), ds = document.getElementById('ad2-reward-desc');
        var cBtn = document.getElementById('ad2-coupang-btn'), aBtn = document.getElementById('ad2-ali-btn'), rBtn = document.getElementById('ad2-c-rev-btn');
        
        tl.innerText = "스폰서 사이트 확인 중";
        ds.innerHTML = "새로 열린 창을 닫지 말고 <strong>5초</strong>만 유지해주세요.<br><span style='font-size:0.85rem;'>(화면을 전환해도 창만 열려있으면 인정됩니다)</span><br><br> 남은 시간: <span id='ad2-m-sec' style='color:#e74c3c; font-size:1.5rem; font-weight:bold;'>5</span>초";
        cBtn.style.display = 'none'; aBtn.style.display = 'none';
        rBtn.style.display = 'inline-block'; rBtn.innerText = "진행 취소";
        
        if (missionInt) clearInterval(missionInt);
        if (checkInt) clearInterval(checkInt);
        
        var startTime = Date.now(), c = 5;
        
        missionInt = setInterval(function(){
            c--; 
            var mSecEl = document.getElementById('ad2-m-sec');
            if(mSecEl) mSecEl.innerText = c;
            
            if(c <= 0){
                clearInterval(missionInt); clearInterval(checkInt);
                tl.innerText = "확인 완료";
                ds.innerHTML = actNm + " 5회권이 충전되었습니다.";
                rBtn.style.display = 'none';
                
                uS = (type === 'coupang') ? 1 : 2; uC = 4;
                safeSet('u_s', uS); safeSet('u_c', uC);
                
                setTimeout(function() { 
                    document.getElementById('ad2-reward-overlay').style.display = 'none'; 
                    showMockAd(cb); 
                }, 1000);
            }
        }, 1000);

        checkInt = setInterval(function() {
            if (affWin && affWin.closed) {
                var elapsed = Date.now() - startTime;
                if (elapsed < 4800) {
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

    // 5. 남은 횟수 / 타이머 버튼 실시간 업데이트
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
        var btnTxt = (document.getElementById('hint-btn') !== null ? "💡 힌트" : "무르기") + tS;
        if(b1) b1.innerText = btnTxt;
        if(b2 && b2.id !== 're-btn') b2.innerText = btnTxt;
    };
    setInterval(function(){ 
        window.updateAdTimerUI(document.getElementById('hint-btn') || document.getElementById('u-btn'), document.getElementById('go-u-btn')); 
    }, 1000);

})();
