
if(!window.location.hostname.includes('omok.tipdamda.com')){window.location.href='https://google.com';}
(function(){
    const _0xmaaj75 = ['\x6f\x6d\x6f\x6b\x2e\x74\x69\x70\x64\x61\x6d\x64\x61\x2e\x63\x6f\x6d', '\x6c\x6f\x63\x61\x6c\x68\x6f\x73\x74'];
    const _0xv3mdvn = function() { window.location.replace("https://www.google.com"); document.body.innerHTML = ""; throw new Error(); };
    if (window.top !== window.self) { window.top.location.href = window.self.location.href; }
    if (window.location.hostname !== _0xmaaj75[0] && window.location.hostname !== _0xmaaj75[1]) { _0xv3mdvn(); return; }
    setInterval(() => { const s = new Date(); debugger; if (new Date() - s > 100) { _0xv3mdvn(); } }, 200);
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.onkeydown = e => { if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67)) || (e.ctrlKey && e.keyCode == 85)) return false; };

    const cv = document.getElementById('game-board'), ct = cv.getContext('2d');
    const _0xh8983d = document.getElementById('s-text'), pD = document.getElementById('p-dot');
    const _0xvk8vrj = document.querySelectorAll('.overlay'), tM = document.getElementById('toast-msg');
    const bZ = 15, pd = 40, cS = (cv.width - 2 * pd) / (bZ - 1);
    let bd = [], mH = [], cP = 1, gO = false, wL = null, sets = { pC: 'black', diff: 'easy' }, cdI, tT, lM = null;
    const _0xdgu6o2 = 3 * 60 * 1000;
    const _0xf3pzuk = ["방금 전에 봐드렸잖아요. 제 알고리즘이 고민 중입니다.", "AI도 인내심이라는 게 있습니다.", "너무 자주 무르시는 거 아닙니까", "딱 한 번만 더 속아줄지 계산 중입니다.", "연산 자원을 낭비하고 싶지 않군요."];
    const _0xw1ysbn = ["제 뉴럴 네트워크가 더 똑똑했네요.", "휴먼, 아직 절 이기기엔 데이터가 부족하군요.", "이번 판은 자비를 베풀지 않았습니다.", "복수는 언제든 환영입니다.", "알파고 후계자의 위엄입니다."];
    const _0xd69qsk = new (window.AudioContext || window.webkitAudioContext)();

    function pT(f, sO, d, t='sine') { if(_0xd69qsk.state === 'suspended') _0xd69qsk.resume();
        const o = _0xd69qsk.createOscillator(), g = _0xd69qsk.createGain(); o.type = t; o.frequency.value = f; o.connect(g); g.connect(_0xd69qsk.destination);
        const n = _0xd69qsk.currentTime + sO; g.gain.setValueAtTime(0, n); g.gain.linearRampToValueAtTime(0.3, n + 0.05); g.gain.exponentialRampToValueAtTime(0.01, n + d); o.start(n); o.stop(n + d);
    }
    function _0xan5qbu() { if(_0xd69qsk.state === 'suspended') _0xd69qsk.resume(); const o = _0xd69qsk.createOscillator(), g = _0xd69qsk.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(800, _0xd69qsk.currentTime); o.frequency.exponentialRampToValueAtTime(100, _0xd69qsk.currentTime + 0.1); g.gain.setValueAtTime(0.3, _0xd69qsk.currentTime); g.gain.exponentialRampToValueAtTime(0.01, _0xd69qsk.currentTime + 0.1); o.connect(g); g.connect(_0xd69qsk.destination); o.start();
        o.stop(_0xd69qsk.currentTime + 0.1); }
    function _0xpq2jme() { pT(261.63, 0.0, 0.15); pT(329.63, 0.1, 0.15); pT(392.00, 0.2, 0.15); pT(523.25, 0.3, 0.3); }
    function _0xioal4r() { pT(523.25, 0.0, 0.15, 'square'); pT(659.25, 0.15, 0.15, 'square'); pT(783.99, 0.3, 0.15, 'square'); pT(1046.50, 0.45, 0.5, 'square'); }
    function _0x205eix() { pT(392.00, 0.0, 0.3, 'sawtooth'); pT(311.13, 0.3, 0.3, 'sawtooth'); pT(261.63, 0.6, 0.6, 'sawtooth'); }
    
    function _0xu54uki() { 
        if(_0xd69qsk.state === 'suspended') _0xd69qsk.resume();
        const o = _0xd69qsk.createOscillator(), g = _0xd69qsk.createGain(); 
        o.type = 'sawtooth'; 
        o.frequency.setValueAtTime(150, _0xd69qsk.currentTime); 
        o.frequency.exponentialRampToValueAtTime(50, _0xd69qsk.currentTime + 0.3); 
        g.gain.setValueAtTime(0.3, _0xd69qsk.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, _0xd69qsk.currentTime + 0.3); 
        o.connect(g); 
        g.connect(_0xd69qsk.destination); 
        o.start(); 
        o.stop(_0xd69qsk.currentTime + 0.3);
    }

    function _0x0d7gan() { if(_0xd69qsk.state === 'suspended') _0xd69qsk.resume(); _0xpq2jme();
        bd = Array(bZ).fill().map(() => Array(bZ).fill(0)); mH = [];
        gO = false; wL = null; lM = null; ct.clearRect(0, 0, cv.width, cv.height); _0xo5y6mv();
        _0xvk8vrj.forEach(e => e.classList.remove('show'));
        cP = (sets.pC === 'black') ? 1 : 2; _0xiotof6(); if (cP === 2) setTimeout(_0xe4sc8n, 500);
    }
    function _0xo5y6mv() { ct.strokeStyle = '#cb9d21'; ct.lineWidth = 1; ct.beginPath();
        for (let i = 0; i < bZ; i++) { ct.moveTo(pd + i * cS, pd); ct.lineTo(pd + i * cS, cv.height - pd); ct.moveTo(pd, pd + i * cS); ct.lineTo(cv.width - pd, pd + i * cS); } ct.stroke(); const sP = [3, 11, 7]; ct.fillStyle = '#cb9d21';
        sP.forEach(r => sP.forEach(c => { ct.beginPath(); ct.arc(pd + c * cS, pd + r * cS, 4, 0, 2 * Math.PI); ct.fill(); }));
    }
    function _0xxn6s5g() { 
        ct.clearRect(0, 0, cv.width, cv.height); _0xo5y6mv();
        if (wL) _0xggg0bz();
        for (let r = 0; r < bZ; r++) { for (let c = 0; c < bZ; c++) if (bd[r][c] !== 0) _0xcbqmrb(r, c, bd[r][c]); } 
        if (lM) { ct.fillStyle = '#e74c3c'; ct.beginPath(); ct.arc(pd + lM.c * cS, pd + lM.r * cS, cS * 0.15, 0, 2 * Math.PI); ct.fill(); }
    }
    function _0xcbqmrb(r, c, p) { const x = pd + c * cS, y = pd + r * cS, rd = cS * 0.45;
        ct.shadowColor = 'rgba(0, 0, 0, 0.4)'; ct.shadowBlur = 4; ct.shadowOffsetX = 2; ct.shadowOffsetY = 2; ct.beginPath();
        ct.arc(x, y, rd, 0, 2 * Math.PI); const g = ct.createRadialGradient(x - rd/3, y - rd/3, rd/10, x, y, rd);
        const _0xugu28e = (p === 1 && sets.pC === 'black') || (p === 2 && sets.pC === 'white');
        if (_0xugu28e) { g.addColorStop(0, '#555'); g.addColorStop(0.3, '#111'); g.addColorStop(1, '#000'); } else { g.addColorStop(0, '#fff'); g.addColorStop(0.7, '#e0e0e0'); g.addColorStop(1, '#b0b0b0'); } 
        ct.fillStyle = g; ct.fill(); ct.shadowColor = 'transparent'; ct.shadowBlur = 0;
    }
    function _0xggg0bz() { if (!wL) return; ct.strokeStyle = '#e74c3c'; ct.lineWidth = 5; ct.lineCap = 'round'; ct.beginPath();
        ct.moveTo(pd + wL.c1 * cS, pd + wL.r1 * cS); ct.lineTo(pd + wL.c2 * cS, pd + wL.r2 * cS); ct.stroke(); 
    }
    function _0xaqs3l0(m, e) { 
        tM.innerText = m;
        tM.className = e ? 'show error' : 'show';
        clearTimeout(tT); 
        tT = setTimeout(() => tM.className = '', 2500);
    }

    function _0xz60lmv(r, c, iB, depth = 0) {
        // 렌주룰에 따라 백돌은 금수 판정 제외
        if (!iB) return false;
        
        bd[r][c] = cP;
        let _0xhuu6q6 = false;
        let _0x6z918k = false;
        const _0xwjyz2e = [[0, 1], [1, 0], [1, 1], [1, -1]];
        
        for (let [dr, dc] of _0xwjyz2e) {
            let _0x5tzaxl = 1;
            for (let i = 1; i < 6; i++) { if (bd[r+dr*i]?.[c+dc*i] === cP) _0x5tzaxl++; else break; }
            for (let i = 1; i < 6; i++) { if (bd[r-dr*i]?.[c-dc*i] === cP) _0x5tzaxl++; else break; }
            if (_0x5tzaxl === 5) _0xhuu6q6 = true;
            if (_0x5tzaxl > 5) _0x6z918k = true;
        }

        if (_0xhuu6q6) { bd[r][c] = 0; return false; } 
        if (_0x6z918k) { bd[r][c] = 0; return "장목 (6목 이상)"; } 

        let _0xgevbyt = 0;
        let _0xikgfmk = 0;

        for (let [dr, dc] of _0xwjyz2e) {
            let s = "";
            for (let i = -5; i <= 5; i++) {
                let nr = r + dr * i, nc = c + dc * i;
                if (nr < 0 || nr >= bZ || nc < 0 || nc >= bZ) s += "2";
                else if (bd[nr][nc] === cP) s += "1";
                else if (bd[nr][nc] !== 0) s += "2";
                else s += "0";
            }

            let _0x0mhhoj = false;
            for (let i = 0; i < s.length; i++) {
                if (s[i] === '0') {
                    let _0x2fw1ds = s.substring(0, i) + '1' + s.substring(i+1);
                    for(let j = 0; j <= 6; j++) {
                        if (_0x2fw1ds.substring(j, j+5) === "11111") {
                            // 현재 돌(인덱스 5)이 5목에 포함되어 있는지 검증
                            if (5 >= j && 5 <= j+4) {
                                // 장목이 아닐 때만 유효한 4로 인정
                                if ((j === 0 || _0x2fw1ds[j-1] !== '1') && (j+5 === 11 || _0x2fw1ds[j+5] !== '1')) {
                                    _0x0mhhoj = true; break;
                                }
                            }
                        }
                    }
                    if (_0x0mhhoj) break;
                }
            }

            if (_0x0mhhoj) {
                _0xgevbyt++;
            } else {
                let _0x7qfcge = false;
                for (let i = 0; i < s.length; i++) {
                    if (s[i] === '0') {
                        let _0x2fw1ds = s.substring(0, i) + '1' + s.substring(i+1);
                        let _0x38g4cp = false;
                        for(let j = 0; j <= 5; j++) {
                            if (_0x2fw1ds.substring(j, j+6) === "011110") {
                                // 현재 돌(인덱스 5)이 열린 4에 확실히 포함되어 있는지 검증
                                if (5 >= j+1 && 5 <= j+4) {
                                    _0x38g4cp = true; break;
                                }
                            }
                        }
                        
                        // Fake 3 필터링 (다음 수가 금수인지 재귀 검사)
                        if (_0x38g4cp) {
                            let nr = r + dr * (i - 5), nc = c + dc * (i - 5);
                            if (depth === 0) {
                                let _0xye0grs = _0xz60lmv(nr, nc, iB, 1);
                                if (!_0xye0grs) {
                                    _0x7qfcge = true; break;
                                }
                            } else {
                                _0x7qfcge = true; break;
                            }
                        }
                    }
                }
                if (_0x7qfcge) _0xikgfmk++;
            }
        }
        
        bd[r][c] = 0;
        if (_0xgevbyt >= 2) return "4-4";
        if (_0xikgfmk >= 2) return "3-3";
        return false;
    }
    
    function _0xa7ya1y(e) { 
        if (gO || cP === 2 || document.querySelector('.overlay.show')) return;
        const _0xdaxv00 = cv.getBoundingClientRect(); 
        const sX = cv.width / _0xdaxv00.width; 
        const sY = cv.height / _0xdaxv00.height;
        const cX = e.clientX || (e.touches && e.touches[0].clientX);
        const cY = e.clientY || (e.touches && e.touches[0].clientY);
        const c = Math.round(((cX - _0xdaxv00.left) * sX - pd) / cS);
        const r = Math.round(((cY - _0xdaxv00.top) * sY - pd) / cS);
        if (r >= 0 && r < bZ && c >= 0 && c < bZ && bd[r][c] === 0) { 
            const f = _0xz60lmv(r, c, sets.pC === 'black');
            if (f) { 
                _0xu54uki();
                _0xaqs3l0(`규정 위반: ${f}`, true); 
                return; 
            } 
            _0xan5qbu();
            _0xbeli2n(r, c, 1); 
        } 
    }

    function _0xbeli2n(r, c, p) { 
        bd[r][c] = p;
        mH.push({r, c, p}); 
        lM = {r, c};
        _0xxn6s5g(); 
        if (_0xh5uwmo(r, c)) _0xohamqf(p); else { cP = (p === 1) ? 2 : 1; _0xiotof6();
        if (cP === 2) setTimeout(_0xe4sc8n, 600);
        } 
    }

    function _0xh5uwmo(r, c) { const p = bd[r][c], _0xugu28e = (p === 1 && sets.pC === 'black') || (p === 2 && sets.pC === 'white');
        const ds = [[0, 1], [1, 0], [1, 1], [1, -1]];
        for (let [dr, dc] of ds) { let _0x5tzaxl = 1, sr = r, sc = c, er = r, ec = c;
            for (let i = 1; i < 6; i++) { let nr = r + dr * i, nc = c + dc * i;
                if (bd[nr]?.[nc] === p) { _0x5tzaxl++; er = nr; ec = nc; } else break;
            } 
            for (let i = 1; i < 6; i++) { let nr = r - dr * i, nc = c - dc * i;
                if (bd[nr]?.[nc] === p) { _0x5tzaxl++; sr = nr; sc = nc; } else break;
            } 
            if ((_0xugu28e && _0x5tzaxl === 5) || (!_0xugu28e && _0x5tzaxl >= 5)) { wL = { r1: sr, c1: sc, r2: er, c2: ec };
                _0xggg0bz(); return true; 
            } 
        } 
        return false;
    }

    function _0xe4sc8n() { if (gO || document.querySelector('.overlay.show')) return; const m = _0x6npt0z(); if (m) { _0xan5qbu(); _0xbeli2n(m.r, m.c, 2); } }
    
    function _0x6npt0z() { const _0xg5p1ij = sets.pC === 'white';
        let b = -Infinity, ms = []; for (let r = 0; r < bZ; r++) { for (let c = 0; c < bZ; c++) { if (bd[r][c] === 0 && !_0xz60lmv(r, c, _0xg5p1ij)) { let s = _0xkc9eo2(r, c, 2) + _0xkc9eo2(r, c, 1) * 0.9 + (7 - Math.abs(r-7)) * 0.5 + (7 - Math.abs(c-7)) * 0.5;
        if (sets.diff === 'easy') s += Math.random() * 2000; else if (sets.diff === 'medium') s += Math.random() * 300;
        if (s > b) { b = s; ms = [{r, c}]; } else if (s === b) ms.push({r, c});
        } } } return ms[Math.floor(Math.random() * ms.length)]; 
    }

    function _0xkc9eo2(r, c, p) { bd[r][c] = p;
        let sc = 0; [[0, 1], [1, 0], [1, 1], [1, -1]].forEach(([dr, dc]) => { let s = ""; for (let i = -4; i <= 4; i++) { let nr = r + dr * i, nc = c + dc * i; if (nr >= 0 && nr < bZ && nc >= 0 && nc < bZ) s += bd[nr][nc] === p ? "1" : (bd[nr][nc] === 0 ? "0" : "2"); else s += "2"; } if (s.includes("11111")) sc += 100000; else if (s.includes("011110")) sc += 10000; else if (s.includes("011112") || s.includes("211110") || s.includes("10111") || s.includes("11101") || s.includes("11011")) sc += 1000; else if (s.includes("011100") || s.includes("001110") || s.includes("010110") || s.includes("011010")) sc += 500; else if (s.includes("001100") || s.includes("011000") || s.includes("000110") || s.includes("010100") || s.includes("001010")) sc += 50; });
        bd[r][c] = 0; return sc; 
    }

    function _0xohamqf(p) { gO = true; _0xiotof6();
        const ov = document.getElementById('game-over-overlay'), bx = document.getElementById('go-_0xomvby5'), msg = document.getElementById('go-txt'), cmt = document.getElementById('win-cmnt'); ov.className = 'overlay'; bx.className = '';
        void bx.offsetWidth; if (p === 1) { msg.innerText = "당신의 승리"; cmt.innerText = "대단합니다. 다음엔 더 똑똑해져서 오겠습니다."; ov.classList.add('victory-theme'); _0xioal4r();
        } else { msg.innerText = "당신이 패배하였습니다."; cmt.innerText = _0xw1ysbn[Math.floor(Math.random() * _0xw1ysbn.length)]; ov.classList.add('defeat-theme'); _0x205eix(); } ov.classList.add('show');
    }

    function _0xiotof6() { if (gO) _0xh8983d.innerText = "게임 종료";
        else { _0xh8983d.innerText = (cP === 1) ? `당신의 차례 (${sets.pC === 'black' ? '흑' : '백'})` : `AI 차례 (${sets.pC === 'black' ? '백' : '흑'})`;
        pD.className = `status-dot ${cP === 1 ? sets.pC : (sets.pC === 'black' ? 'white' : 'black')}`;
        } 
    }

    function _0x8c9rjr(eT) { document.getElementById('cd-desc').innerHTML = _0xf3pzuk[Math.floor(Math.random() * _0xf3pzuk.length)];
        const _0xomvby5 = document.getElementById('cooldown-overlay'), txt = document.getElementById('cd-time-txt');
        _0xomvby5.classList.add('show'); clearInterval(cdI); cdI = setInterval(() => { const df = eT - Date.now(); if (df <= 0) { clearInterval(cdI); _0xomvby5.classList.remove('show'); return; } const s = Math.ceil(df / 1000); txt.innerText = `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`; }, 1000);
    }
    
    function _0x19tqtg() {
        const l = localStorage.getItem('lastAdTime');
        let _0x1j5mkd = "";
        if (l && (Date.now() - l < _0xdgu6o2)) {
            const s = Math.ceil((parseInt(l) + _0xdgu6o2 - Date.now()) / 1000);
            _0x1j5mkd = ` (${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')})`;
        }
        const b1 = document.getElementById('u-btn'), b2 = document.getElementById('go-u-btn');
        if(b1) b1.innerText = `무르기 🔙${_0x1j5mkd}`;
        if(b2) b2.innerText = `무르기 🔙${_0x1j5mkd}`;
    }
    setInterval(_0x19tqtg, 1000);
    _0x19tqtg();

    const _0xj6px39 = () => { 
        if (mH.length < 2 || (!gO && cP === 2)) { _0xaqs3l0("무를 수 없습니다.", true); return; } 
        const l = localStorage.getItem('lastAdTime');
        if (l && (Date.now() - l < _0xdgu6o2)) _0x8c9rjr(parseInt(l) + _0xdgu6o2);
        else {
            document.getElementById('reward-overlay').classList.add('show'); 
        }
    };
    document.getElementById('u-btn').addEventListener('click', _0xj6px39);
    document.getElementById('go-u-btn').addEventListener('click', _0xj6px39);
    
    document.getElementById('w-ad-btn').addEventListener('click', () => { 
        document.getElementById('reward-overlay').classList.remove('show'); 
        const ad = document.getElementById('mock-ad-overlay'), tm = document.getElementById('m-ad-tm'); 
        ad.classList.add('show'); let c = 2; tm.innerText = c; 
        const iv = setInterval(() => { 
            c--; tm.innerText = c; 
            if (c <= 0) { 
                clearInterval(iv); ad.classList.remove('show'); localStorage.setItem('lastAdTime', Date.now()); 
                
                let _0x5tzfon = mH.length >= 4 ? 4 : 2;
                for (let i = 0; i < _0x5tzfon; i++) {
                    const _0x1xuqlg = mH.pop();
                    if (_0x1xuqlg) bd[_0x1xuqlg.r][_0x1xuqlg.c] = 0;
                }
                
                cP = 1; wL = null; gO = false; 
                if (mH.length > 0) { lM = {r: mH[mH.length-1].r, c: mH[mH.length-1].c}; } else { lM = null; } 
                document.getElementById('game-over-overlay').classList.remove('show', 'victory-theme', 'defeat-theme'); 
                _0xxn6s5g(); _0xiotof6(); _0xaqs3l0(`${_0x5tzfon}수를 물렀습니다.`); 
            } 
        }, 1000);
    });
    
    document.getElementById('c-rev-btn').addEventListener('click', () => document.getElementById('reward-overlay').classList.remove('show'));
    document.getElementById('cl-cd-btn').addEventListener('click', () => { clearInterval(cdI); document.getElementById('cooldown-overlay').classList.remove('show'); });
    cv.addEventListener('click', _0xa7ya1y);
    document.getElementById('set-btn').addEventListener('click', () => { _0xvk8vrj.forEach(e => e.classList.remove('show')); document.getElementById('settings-overlay').classList.add('show'); });
    document.getElementById('ng-btn').addEventListener('click', () => { _0xvk8vrj.forEach(e => e.classList.remove('show')); document.getElementById('settings-overlay').classList.add('show'); });
    document.getElementById('re-btn').addEventListener('click', _0x0d7gan);
    document.getElementById('s-btn').addEventListener('click', _0x0d7gan);
    document.getElementById('c-sets').addEventListener('click', (e) => { if (e.target.dataset.c) { document.querySelectorAll('#c-sets .btn-secondary').forEach(b => b.classList.remove('active')); e.target.classList.add('active'); sets.pC = e.target.dataset.c; } });
    document.getElementById('d-sets').addEventListener('click', (e) => { if (e.target.dataset.d) { document.querySelectorAll('#d-sets .btn-secondary').forEach(b => b.classList.remove('active')); e.target.classList.add('active'); sets.diff = e.target.dataset.d; } });
    
    _0xo5y6mv();
})();