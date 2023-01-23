const express = require("express");
const app = express();
// const port = process.env.PORT || 3000;
const port = 3000;
var exec = require("child_process").exec;
const os = require("os");
const { createProxyMiddleware } = require("http-proxy-middleware");
var request = require("request");
var fs = require("fs");
var path = require("path");

app.get("/", (req, res) => {
  res.send("AFOSNE PROXY,项目方法 VMESS+WS+TLS+CDN");
  
});

//获取系统进程表
app.get("/status", (req, res) => {
  let cmdStr = "ps -ef";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.type("html").send("<pre>命令行执行错误：\n" + err + "</pre>");
    } else {
      res.type("html").send("<pre>命令行执行结果：\n" + stdout + "</pre>");
    }
  });
});

//启动web
app.get("/start", (req, res) => {
  let cmdStr =
    "chmod +x ./afosne.js && ./afosne.js -c ./config.json >/dev/null 2>&1 &";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.send("命令行执行错误：" + err);
    } else {
      res.send("命令行执行结果：" + "启动成功!");
    }
  });
});

//获取系统版本、内存信息
app.get("/info", (req, res) => {
  let cmdStr = "cat /etc/*release | grep -E ^NAME";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.send("命令行执行错误：" + err);
    } else {
      res.send(
        "命令行执行结果：\n" +
        "Linux System:" +
        stdout +
        "\nRAM:" +
        os.totalmem() / 1000 / 1000 +
        "MB"
      );
    }
  });
});

//下载web可执行文件
app.get("/download", (req, res) => {
  download_web((err) => {
    if (err) res.send("下载文件失败");
    else res.send("下载文件成功");
  });
});

//nezha监控
/*
app.get("/nezha", (req, res) => {
  let cmdStr = "/bin/bash nezha.sh server.abc.tk 5555 dfzPfEOagGDCAVhM4s >/dev/null 2>&1 &";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.type("html").send("<pre>命令行执行错误：\n" + err + "</pre>");
    } else {
      res.type("html").send("<pre>命令行执行结果：\n" + stdout + "</pre>");
    }
  });
});
 */

//cloudflare 内网穿透
/*app.get("/cloudflare", (req, res) => {
  let cmdStr = "/bin/bash cloudflare.sh eyJhIjoiOTk3NjBmZWUyZjQ1ZGIxZDY2MjA5MmI4ZTM1NmRlNWUiLCJ0IjoiNGE0NjI0ZTAtNjY0Ni00NGI1LWE2NjEtNzA3NTcyOWM0NGY0IiwicyI6Ik1HRXpPV0pqWXprdE1XRTJaQzAwWmpZeExUZ3haREl0WkRGbU9EVmtPV1UxWkRNNCJ9 >/dev/null 2>&1 &";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.type("html").send("<pre>命令行执行错误：\n" + err + "</pre>");
    } else {
      res.type("html").send("<pre>命令行执行结果：\n" + stdout + "</pre>");
    }
  });
});
*/
app.use(
  "/afosne",
  createProxyMiddleware({
    target: "http://127.0.0.1:8080/", // 需要跨域处理的请求地址
    changeOrigin: true, // 默认false，是否需要改变原始主机头为目标URL
    ws: true, // 是否代理websockets
    pathRewrite: {
      // 请求中去除/api
      "^/afosne": "/qwe",
    },
    onProxyReq: function onProxyReq(proxyReq, req, res) { },
  })
);

/* keepalive  begin 
function keepalive() {
  // 1.请求主页，保持唤醒
  let app_url = "https://spotless-glossy-aftermath.glitch.me";
  exec("curl " + app_url, function (err, stdout, stderr) {
    if (err) {
      console.log("保活-请求主页-命令行执行错误：" + err);
    } else {
      console.log("保活-请求主页-命令行执行成功，响应报文:" + stdout);
    }
  });

  // 2.请求服务器进程状态列表，若web没在运行，则调起
  exec("curl " + app_url + "/status", function (err, stdout, stderr) {
    if (!err) {
      if (stdout.indexOf("./afosne.js -c ./config.json") != -1) {
        console.log("web正在运行");
      } else {
        //web未运行，命令行调起
        exec(
          "chmod +x ./afosne.js && ./afosne.js -c ./afosne.json >/dev/null 2>&1 &",
          function (err, stdout, stderr) {
            if (err) {
              console.log("保活-调起afosne-命令行执行错误：" + err);
            } else {
              console.log("保活-调起afosne-命令行执行成功!");
            }
          }
        );
      }
    } else console.log("保活-请求服务器进程表-命令行执行错误: " + err);
  });
}
setInterval(keepalive, 9 * 1000);
/* keepalive  end */

// 初始化，下载web
function download_web(callback) {
  let fileName = "afosne.js";
  let url = "https://cdn.glitch.me/53b1a4c6-ff7f-4b62-99b4-444ceaa6c0cd/web?v=1673588495643";
  let stream = fs.createWriteStream(path.join("./", fileName));
  request(url)
    .pipe(stream)
    .on("close", function (err) {
      if (err) callback("下载文件失败");
      else callback(null);
    });
}
download_web((err) => {
  if (err) console.log("初始化-下载afosne文件失败");
  else console.log("初始化-下载afosne文件成功");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); &>/dev/null &
