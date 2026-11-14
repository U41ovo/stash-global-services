// Stash tile: ChatGPT App - shows ONLY the unlocked region code (e.g. US, JP, SG).
// How it works: if ChatGPT App itself is reachable, the region is looked up from the
// current network exit and shown as a bare two-letter code, nothing else.
// If the service is restricted, fails, or the region cannot be determined,
// the tile shows -- instead. Reachability does not guarantee account eligibility.
var TARGET = "https://ios.chat.openai.com";
var finished = false;
function finish(value) { if (!finished) { finished = true; $done(value); } }
var timeout = setTimeout(function() { finish({title: "ChatGPT App", content: '--', backgroundColor: '#777777'}); }, 15000);
function fail(color) { clearTimeout(timeout); finish({title: "ChatGPT App", content: '--', backgroundColor: color, url: TARGET}); }
function showRegion() {
  $httpClient.get({url: 'https://www.cloudflare.com/cdn-cgi/trace', headers: {'User-Agent': 'Mozilla/5.0'}}, function(err, resp, data) {
    var m = (!err && data) ? /(?:^|\n)loc=([A-Z]{2})(?:\n|$)/.exec(data) : null;
    if (m) { clearTimeout(timeout); finish({title: "ChatGPT App", content: m[1], backgroundColor: '#329966', url: TARGET}); return; }
    $httpClient.get({url: 'https://ipapi.co/country/', headers: {'User-Agent': 'Mozilla/5.0'}}, function(err2, resp2, data2) {
      var code = (!err2 && data2) ? String(data2).replace(/\s+/g, '').toUpperCase() : '';
      clearTimeout(timeout);
      if (/^[A-Z]{2}$/.test(code)) finish({title: "ChatGPT App", content: code, backgroundColor: '#329966', url: TARGET});
      else finish({title: "ChatGPT App", content: '--', backgroundColor: '#D99524', url: TARGET});
    });
  });
}
try {
  $httpClient.get({url: TARGET, headers: {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile Safari/604.1', 'Accept': 'text/html,application/json,*/*'}}, function(err, resp, data) {
    if (finished) return;
    var status = resp && (resp.status || resp.statusCode) || 0;
    var code = Number(status);
    if (err || !code) fail('#D9534F');
    else if (code === 401 || code === 403 || code === 451) fail('#D99524');
    else if (code >= 200 && code < 400) showRegion();
    else fail('#D99524');
  });
} catch (e) { fail('#D9534F'); }
