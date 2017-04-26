"use strict";
exports.__esModule = true;
var fs = require("fs");
var iconv = require("iconv-lite");
var Util = (function () {
    function Util() {
    }
    Util.space = function (d) {
        var DOT_1 = String.fromCharCode(0x200A), DOT_2 = String.fromCharCode(0x2009), DOT_3 = String.fromCharCode(0x2006), DOT_4 = String.fromCharCode(0x2005), DOT_5 = ' ', DOT_8 = String.fromCharCode(0x2002), DOT_10 = String.fromCharCode(0x2007), DOT_11 = String.fromCharCode(0x3000), DOT_sp = ' ';
        /**
         * @param{number} d - 数値のドット数。0<d<=11
         */
        switch (d) {
            case 1:
                return DOT_1;
            case 2:
                return DOT_2;
            case 3:
                return DOT_3;
            case 4:
                return DOT_4;
            case 5:
                return DOT_5;
            case 6:
                return DOT_1 + DOT_5;
            case 7:
                return DOT_2 + DOT_5;
            case 8:
                return DOT_8;
            case 9:
                return DOT_4 + DOT_5;
            case 10:
                return DOT_10;
            case 11:
                return DOT_11;
            default:
                return null;
        }
    };
    Util.spaceRegExp = function () {
        return new RegExp('[' +
            Util.space(1) +
            Util.space(2) +
            Util.space(3) +
            Util.space(4) +
            Util.space(5) +
            Util.space(8) +
            Util.space(10) +
            Util.space(11) +
            ']', 'g');
    };
    Util.strWidth = function (str) {
        if (str === '') {
            return 0;
        }
        var e = $("<span id=\"ruler\" class=\"aa\" style=\"\n\t\t\t\tfont:normal 16px/18px Stmr,sans-serif !important; \n\t\t\t\tword-break:break-all; \n\t\t\t\tdisplay:block;\n\t\t\t\t-webkit-font-smoothing:antialiased;\n\t\t\t\t-webkit-text-size-adjust:100%;\n\t\t\t\ttext-size-adjust:100%;\n\t\t\t\twhite-space:pre;\n\t\t\t\ttext-wrap:none;\n\t\t\t\">i" + str + "i</span>");
        $('body').append(e);
        var width = $('#ruler').get(0).offsetWidth - 6;
        $('#ruler').remove();
        return width;
    };
    Util.strChangeChar = function (str, ch, n) {
        return str.slice(0, n) + ch + str.slice(n + ch.length);
    };
    Util.strInit = function (n) {
        var s = '';
        for (var i = 0; i < n; i++) {
            s += 'a';
        }
        return s;
    };
    Util.isSpace = function (ch) {
        if (ch === ' ' || ch === '　') {
            return true;
        }
        else {
            var i = 0;
            for (i = 0; i <= 11; i++) {
                if (ch === Util.space(i)) {
                    return true;
                }
            }
            return false;
        }
    };
    Util.getHighlight = function (text) {
        text = text.replace(/./g, function (match) {
            var classes = ['syntax'];
            if (Util.isSpace(match)) {
                classes.push('space');
            }
            if (match == ' ') {
                classes.push('h-space');
            }
            if (match == '　') {
                classes.push('z-space');
            }
            if (Util.isUtf8(match)) {
                classes.push('utf-8');
            }
            return '<mark class="' + classes.join(' ') + '">' + match + '</mark>';
        });
        return text;
    };
    Util.isUtf8 = function (c) {
        var buf = iconv.encode(c, 'Shift_JIS');
        return (buf[0] == 63 && c != '?');
    };
    /**
     * 必要な全角半角SP数から文字列を制作
     * @param{number} zen - 全画スペース数。
     * @param{number} han - 半角スペース数。
     * @return{string} str - 全角半角合わせて完成したやつ。
     */
    Util.generateStrZenHan = function (zen, han) {
        var chSize = zen + han, str = '', i, iZen = zen, iHan = han;
        str = Util.strInit(chSize);
        for (i = chSize; 0 < i;) {
            if (iHan > 0) {
                i--;
                iHan--;
                str = Util.strChangeChar(str, ' ', i);
                if (0 > i)
                    break;
            }
            if (iZen > 0) {
                i--;
                iZen--;
                str = Util.strChangeChar(str, '　', i);
                if (0 > i)
                    break;
            }
        }
        return str;
    };
    Util.generateSpaceNoUni = function (d) {
        var zen = Math.ceil(d / 11), zenhan = 0, han;
        while (zen * 11 + zenhan * 16 > d) {
            zen = zen - 3;
            zenhan = zenhan + 2;
        }
        zen += zenhan;
        han = zenhan;
        return Util.generateStrZenHan(zen, han);
    };
    /**
     * ピリオド使ったドット合わせはできません。
     * ごめんちゃーい☆
     * @param{number} d - ドット数。
     * @return{string} str - 全角半角合わせてなんとかやったスペース。
     */
    Util.generateSpace = function (d) {
        var zen, han, mod;
        if (d <= 0 || d % 1 != 0) {
            return '';
        }
        else if (d == 10) {
            return Util.space(10);
        }
        else if (d >= 320) {
            return Util.generateSpaceNoUni(d);
        }
        else {
            mod = d % 11;
            switch (mod) {
                case 10:
                case 0:
                    return Util.generateSpaceNoUni(d);
                default:
                    return Util.generateSpaceNoUni(d - mod) + Util.space(mod);
            }
        }
    };
    Util.convertUtf8ToSjis = function (str) {
        return str.replace(/./g, function (match) {
            return Util.convertCharUtf8ToSjis(match);
        });
    };
    Util.convertCharUtf8ToSjis = function (c) {
        if (Util.isUtf8(c)) {
            return '&#x' + c.charCodeAt(0).toString(16) + ';';
        }
        return c;
    };
    Util.outputSjisAllWidth = function () {
        var a = {};
        for (var i = 1; i < 0xffff; i++) {
            var c = String.fromCharCode(i);
            var buf = iconv.encode(c, 'Shift_JIS');
            if (buf[0] != 63 || c == '?') {
                a[c] = Util.strWidth(c);
                console.log(c, Util.strWidth(c), i.toString(16));
            }
        }
        fs.writeFile('./src/test/sjis.json', JSON.stringify(a));
    };
    return Util;
}());
exports["default"] = Util;
