// ==UserScript==
// @title          pgcafe_atnd
// @description    ATNDに、「三鷹プログラマーズカフェ」イベント情報を簡単に登録できるGreasemonkeyスクリプト
// @namespace      http://mitaka.pgcafe.net
// @include        http://atnd.org/events/new
// ==/UserScript==

// Version 20091102

document.getElementById('event_title').value = '[第○回]三鷹プログラマーズカフェβ[○/○]';
document.getElementById('event_description').value = 'ＬＴ、ワークショップ、フリー(雑談)、もくもく会 入退出自由ですが人数把握のため参加申し込みをお願いします。 ';
document.getElementById('event_started_at_4i').value = '15'
document.getElementById('event_ended_at_4i').value = '18'
document.getElementById('event_started_at_5i').value = '00'
document.getElementById('event_ended_at_5i').value = '00'
document.getElementById('event_place').value =　'三鷹産業プラザ　（1Fロビーで部屋の確認ができます）';
document.getElementById('event_address').value = '東京都三鷹市下連雀3－38－4';
document.getElementById('event_url').value = 'http://mitaka.pgcafe.net/'

GM_xmlhttpRequest({
  method:"GET",
  url: 'http://kuippa.s188.xrea.com/pgcafeatnd/',
  onload:function(res){
    try {
      var htmldoc = parseHTML(res.responseText);
    } catch(e) {
      return;
    }
    var elms = $X('//a[starts-with(@href, "http://atnd.org")]', htmldoc);      
    if (elms.length > 0) {
      var latestEvent = elms[0].text;
    }
    
    var match = latestEvent.match(/^\[第(\d+)回\].+\[(\d+)\/(\d+)\]/);
    var num = match[1];
    var month = match[2];
    var day = match[3];
        
    var d = new Date()
    var year = d.getFullYear();
    d.setTime(new Date(year, parseInt(month) - 1, parseInt(day)).getTime() + 3600 * 24 * 7 * 1000);
    
    document.getElementById('event_title').value = '[第' + (parseInt(num) + 1) + '回]三鷹プログラマーズカフェβ[' + (d.getMonth() + 1) + '/' + d.getDate() + ']';
    
    document.getElementById('event_started_at_1i').value = year;
    document.getElementById('event_started_at_2i').value = (d.getMonth() + 1);
    document.getElementById('event_started_at_3i').value = d.getDate();
    
    document.getElementById('event_ended_at_1i').value = year;
    document.getElementById('event_ended_at_2i').value = (d.getMonth() + 1);
    document.getElementById('event_ended_at_3i').value = d.getDate();
  }
});

function parseHTML(str) {
  str = str.replace(parseHTML.reg, '');
  var res = document.implementation.createDocument(null, 'html', null);
  var range = document.createRange();
  range.setStartAfter(document.body);
  var fragment = range.createContextualFragment(str);
  try {
    fragment = res.adoptNode(fragment); //for Firefox3 beta4
  } catch (e) {
    fragment = res.importNode(fragment, true);
  }
  res.documentElement.appendChild(fragment);
  return res;
}
parseHTML.reg = /^[\s\S]*?<html(?:\s[^>]+?)?>|<\/html\s*>[\S\s]*$/ig;

function $X (exp, context) {
	context || (context = document);
	var expr = (context.ownerDocument || context).createExpression(exp, function (prefix) {
		return document.createNSResolver(context.documentElement || context).lookupNamespaceURI(prefix) ||
			context.namespaceURI || document.documentElement.namespaceURI || "";
	});

	var result = expr.evaluate(context, XPathResult.ANY_TYPE, null);
		switch (result.resultType) {
			case XPathResult.STRING_TYPE : return result.stringValue;
			case XPathResult.NUMBER_TYPE : return result.numberValue;
			case XPathResult.BOOLEAN_TYPE: return result.booleanValue;
			case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
				// not ensure the order.
				var ret = [], i = null;
				while (i = result.iterateNext()) ret.push(i);
				return ret;
		}
	return null;
}
