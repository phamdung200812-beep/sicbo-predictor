const http = require("http");
const PORT = process.env.PORT || 3000;

function analyze(results) {
  const total = results.length;
  const tai = results.filter(x => x === "Tài").length;
  const xiu = total - tai;

  let streak = 0;
  let last = results[total - 1];

  if (last) {
    for (let i = total - 1; i >= 0; i--) {
      if (results[i] === last) streak++;
      else break;
    }
  }

  return {
    total,
    tai,
    xiu,
    taiPercent: total ? +(tai / total * 100).toFixed(2) : 0,
    xiuPercent: total ? +(xiu / total * 100).toFixed(2) : 0,
    last,
    streak
  };
}

const html = `
<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Phân tích Tài Xỉu</title>
<style>
body{font-family:Arial;margin:0;background:#111;color:#fff;padding:20px}
.box{max-width:600px;margin:auto}
textarea{width:100%;height:160px;padding:12px;box-sizing:border-box}
button{margin-top:12px;padding:12px 18px;font-size:16px}
.card{background:#222;padding:15px;margin-top:15px;border-radius:12px}
</style>
</head>
<body>
<div class="box">
<h1>Phân tích Tài / Xỉu</h1>
<p>Nhập lịch sử, mỗi kết quả cách nhau bằng dấu cách.</p>

<textarea id="input"
placeholder="Tài Xỉu Tài Tài Xỉu Xỉu Tài"></textarea>

<button onclick="run()">Phân tích</button>

<div id="out"></div>
</div>

<script>
function run(){
  const text = document.getElementById("input").value;

  const results = text
    .trim()
    .split(/\\s+/)
    .filter(x => x === "Tài" || x === "Xỉu");

  const total = results.length;
  const tai = results.filter(x => x === "Tài").length;
  const xiu = total - tai;

  let last = results[total - 1] || "Chưa có";
  let streak = 0;

  if(total){
    for(let i=total-1;i>=0;i--){
      if(results[i] === last) streak++;
      else break;
    }
  }

  document.getElementById("out").innerHTML = \`
    <div class="card">
      <b>Tổng ván:</b> \${total}<br>
      <b>Tài:</b> \${tai}
      (\${total ? (tai/total*100).toFixed(2) : 0}%)<br>
      <b>Xỉu:</b> \${xiu}
      (\${total ? (xiu/total*100).toFixed(2) : 0}%)<br>
      <b>Kết quả gần nhất:</b> \${last}<br>
      <b>Chuỗi hiện tại:</b> \${streak}
    </div>
  \`;
}
</script>
</body>
</html>
`;

http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
  res.end(html);
}).listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
