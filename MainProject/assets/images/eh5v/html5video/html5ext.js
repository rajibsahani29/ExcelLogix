/**
 *	EasyHTML5Video JavaScript Extension API version 1.2
 *	Created by EasyHTML5Video.com
 *	Modified 14:07 04.02.2015
 *	This file content fullscreen api
 */
! function() {
    function e(e, n, t) {
        e.addEventListener ? e.addEventListener(n, t, !1) : e.attachEvent("on" + n, t)
    }

    function n(e, n, t) {
        e.removeEventListener ? e.removeEventListener(n, t) : e.detachEvent("on" + n, t)
    }

    function t(e, n) {
        e.length || (e = [e]);
        for (var t in n)
            for (var o = 0; o < e.length; o++) e[o].style[t] = n[t]
    }

    function o(e, n) {
        if (n = n || document, document.getElementsByClassName) return n.getElementsByClassName(e);
        for (var t = n.getElementsByTagName("*"), o = [], i = 0; i < t.length; i++)
            if (new RegExp("(^|\\s+)" + e + "(\\s+|$)", "g").test(t[i].className)) {
                o.push(t[i]);
                break
            }
        return o
    }

    function i(e) {
        if (!d) return !!e.eh5v;
        switch (s) {
            case "":
                return document.fullScreen;
            case "webkit":
                return document.webkitIsFullScreen;
            default:
                return document[s + "FullScreen"]
        }
    }

    function r(e) {
        for (var n = "", t = 0; t < e.length; t++) n += String.fromCharCode(e.charCodeAt(t) ^ 1 + (e.length - t) % 7);
        return n
    }

    function a(n) {
        if (d) return "" === s ? n.requestFullScreen() : n[s + "RequestFullScreen"]();
        if (n) {
            h && l(h);
            var t = {
                position: "fixed",
                left: 0,
                top: 0,
                right: "auto",
                bottom: "auto",
                width: window.innerWidth + "px",
                height: window.innerHeight + "px",
                backgroundColor: "rgba(0,0,0,0.9)",
                border: "none",
                zIndex: 9999999
            };
            n.eh5v = {};
            for (var o in t) n.eh5v[o] = n.style[o];
            for (var o in t) n.style[o] = t[o];
            e(document.body, "keydown", u), h = n
        }
    }

    function l(e) {
        if (d) return "" === s ? document.cancelFullScreen() : document[s + "CancelFullScreen"]();
        if (e) {
            for (var t in e.eh5v) e.style[t] = e.eh5v[t];
            e.eh5v = 0, n(document.body, "keydown", u), h = 0
        }
    }

    function u(e) {
        27 == e.keyCode && l(h)
    }

    function c(n, o) {
        function u() {
            b.style.display = "none"
        }

        function c() {
            E.style.display = "none"
        }

        function d() {
            for (var e in S) S[e] && S[e].item && S[e].show && (S[e].item.style.display = S[e].show() ? "block" : "none")
        }
        var s = n,
            p = "@ep{Iski1Ukebi+glo";
        if (p && (p = r(p))) {
            var f = n.getElementsByTagName("video")[0];
            if (f && !f.eh5v) {
                var m = r("'p!8!%g'(# iucc&9\"#orqt9-.bgv}kvlk3smggn)eji!.");
                m += r('#wivmwkni$?$!pdkgqmug#+&\'`jqqkg|&9"#ejjgh -%`jjw/rn|`&9"#63u|!.');
                var h = s || document.body;
                if (p.length < 4 && (p = p.replace(/^\s+|\s+$/g, "")), s = p ? document.createElement("div") : 0, s && (t(s, {
                        position: "absolute",
                        padding: "0 0 0 0"
                    }), h.appendChild(s)), s && document.all) {
                    var v = document.createElement("iframe");
                    t(v, {
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        filter: "alpha(opacity=0)",
                        opacity: .01
                    }), v.src = "javascript:false", v.scrolling = "no", v.framespacing = 0, v.border = 0, v.frameBorder = "no", s.appendChild(v)
                }
                if (s && (t(s, {
                        zIndex: 56,
                        right: "5px",
                        top: "5px"
                    }), h.appendChild(s)), m += r("%ql`wj#=&'evvn%*'lfkfor'># `rrj&/ ghhq)eclnj|&9\"#Ftleo "), s) {
                    (function() {
                        var e = m.split(",");
                        for (var n in e) e[n].replace(/\"(.*?)\":.*?\"(.*?)\"/g, function(e, t, o) {
                            0 == n ? m = document.createElement(o) : 1 == n ? m[t] = o : m.style[t] = o
                        })
                    })()
                } else m = s;
                if (m && (t(m, {
                        display: "none",
                        opacity: 0,
                        visibility: "visible",
                        "font-weight": "normal",
                        "font-style": "normal",
                        padding: "1px 5px",
                        margin: "0 0 0 0",
                        "border-radius": "10px",
                        "-moz-border-radius": "10px",
                        outline: "none"
                    }), m.innerHTML = p, m.target = "_blank", e(m, "contextmenu", function() {
                        return !1
                    }), s ? s.appendChild(m) : document.body.appendChild(m)), f.eh5v = {
                        fullScreen: function(e) {
                            return e ? a(f) : i(f) && l(f), i(f)
                        }
                    }, /(iPad|iPhone|iPod)/gi.test(navigator.userAgent)) {
                    var y = new Image;
                    y.style.visibility = "hidden", y.src = f.poster, n.appendChild(y), f.style.position = "absolute", f.style.height = "100%"
                }
                var b;
                if (!o.noFS && f.getAttribute("controls") && (window.opera || /MSIE/.test(navigator.userAgent) || navigator.mozVibrate) && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    var x = /(.*\/)[^\/]+/.exec(f.poster)[1] + "fullscreen.png";
                    g || (g = new Image, g.src = x), b = document.createElement("div"), t(b, {
                        position: "absolute",
                        zIndex: 10,
                        display: "none",
                        right: "0px",
                        top: "0px",
                        width: "28px",
                        height: "28px",
                        background: 'rgba(0,0,0,0.50) url("' + x + '") 50% 50% no-repeat',
                        border: "none"
                    }), f.parentNode.appendChild(b), e(f, "mouseover", function() {
                        b.style.display = "block"
                    }), e(f, "mouseout", function() {
                        u()
                    }), e(b, "mouseover", function() {
                        b.style.display = "block"
                    }), e(b, "click", function() {
                        a(f), u()
                    })
                }
                if (e(f, "dblclick", function() {
                        i(f) ? l(f) : a(f), b && setTimeout(u, 100)
                    }), null == f.getAttribute("loop") && e(f, "ended", function() {
                        setTimeout(function() {
                            f.load(), f.pause()
                        }, 400)
                    }), /Android/.test(navigator.userAgent))
                    for (var k, w = f.getElementsByTagName("source"), C = w.length - 1; C >= 0; C--) w[C].type ? k && /mp4/.test(w[C].type) && (w[C].src = k, f.load()) : k = w[C].src;
                if (null == f.getAttribute("controls") && e(f, "click", function(e) {
                        e.preventDefault(), f.paused || f.ended ? f.play() : f.pause()
                    }), o.preventCopy) {
                    var E = document.createElement("ul"),
                        S = [{
                            label: "Pause",
                            click: function() {
                                f.pause()
                            },
                            show: function() {
                                return !f.paused
                            }
                        }, {
                            label: "Play",
                            click: function() {
                                f.play()
                            },
                            show: function() {
                                return f.paused
                            }
                        }, {
                            label: "Mute",
                            click: function() {
                                f.muted = !0
                            },
                            show: function() {
                                return !f.muted
                            }
                        }, {
                            label: "Unmute",
                            click: function() {
                                f.muted = !1
                            },
                            show: function() {
                                return f.muted
                            }
                        }];
                    t(E, {
                        position: "absolute",
                        display: "none",
                        listStyleType: "none",
                        margin: "0px",
                        padding: "0px",
                        background: "#fff",
                        cursor: "pointer",
                        zIndex: 2147483647,
                        WebkitBoxShadow: "2px 2px 10px #313131",
                        MozBoxShadow: "2px 2px 10px #313131",
                        boxShadow: "2px 2px 10px #313131"
                    }), e(E, "contextmenu", function(e) {
                        e.preventDefault()
                    }), e(E, "click", c), e(window, "resize", c), e(document, "click", c), e(document, "contextmenu", c);
                    for (var F in S) {
                        var j = document.createElement("li");
                        t(j, {
                            margin: "0px",
                            padding: "3px 20px"
                        }), j.innerHTML = S[F].label, E.appendChild(j), e(j, "click", S[F].click), e(j, "mouseover", function() {
                            t(this, {
                                backgroundColor: "#4281F4",
                                color: "#fff"
                            })
                        }), e(j, "mouseleave", function() {
                            t(this, {
                                backgroundColor: "transparent",
                                color: "#000"
                            })
                        }), S[F].item = j
                    }
                    n.appendChild(E), e(f, "contextmenu", function(e) {
                        t(E, {
                            left: e.pageX - (i(f) ? 0 : n.offsetLeft) + "px",
                            top: e.pageY - (i(f) ? 0 : n.offsetTop) + "px",
                            display: "block"
                        }), e.preventDefault(), e.stopPropagation()
                    }), d(), e(window, "load", d), e(f, "pause", d), e(f, "play", d), e(f, "volumechange", d)
                }
            }
        }
    }
    var d = 0,
        s = "";
    if ("undefined" != typeof document.cancelFullScreen) d = !0;
    else
        for (var p = "webkit moz o ms khtml".split(" "), f = 0, m = p.length; m > f; f++)
            if (s = p[f], "undefined" != typeof document[s + "CancelFullScreen"]) {
                d = !0;
                break
            } for (var g, h = 0, v = o("easyhtml5video"), f = 0; f < v.length; f++) c(v[f], {
        noFS: 0,
        preventCopy: 1
    })
}();