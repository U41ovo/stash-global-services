// Stash tile: Claude - reachability only, not a regional unlock test.
// Change TARGET if your service uses another official endpoint.
var TARGET = "https://claude.ai";
var finished = false;
function finish(value) { if (!finished) { finished = true; $done(value); } }
var timeout = setTimeout(function() { finish({title: "Claude", content: 'Timeout', backgroundColor: '#777777'}); }, 9000);
try {
  $httpClient.get({url: TARGET, headers: {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile Safari/604.1', 'Accept': 'text/html,application/json,*/*'}}, function(err, resp, data) {
    if (finished) return;
    clearTimeout(timeout);
    var status = resp && (resp.status || resp.statusCode) || 0;
    var code = Number(status);
    var content, color;
    if (err || !code) { content = 'Connection failed'; color = '#D9534F'; }
    else if (code === 401 || code === 403 || code === 451) { content = 'Restricted (HTTP ' + code + ')'; color = '#D99524'; }
    else if (code >= 200 && code < 400) { content = 'Reachable (HTTP ' + code + ')'; color = '#329966'; }
    else { content = 'HTTP ' + code; color = '#D99524'; }
    finish({title: "Claude", content: content, backgroundColor: color, url: "https://claude.ai"});
  });
} catch (e) { clearTimeout(timeout); finish({title: "Claude", content: 'Script error', backgroundColor: '#D9534F'}); }
