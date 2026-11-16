# APPLE I · 1976 — 装配模拟

复刻 APPLE I 主板的 3D 装配演示：MOS 6502 @1.023 MHz、4KB RAM、Signetics 2513
字符发生器、RF 调制器、7805 电源，最后在绿色 CRT 上跑 Woz Monitor 和 BASIC，
`10 PRINT "HELLO, WORLD!"`。约 35 秒自动循环。

零依赖零构建：three.js UMD 内置，贴图全部 Canvas 程序化生成，双击 index.html
即可运行（file:// 与 HTTP 一致）。

```bash
python3 tools/serve.py 8080   # http://127.0.0.1:8080
```

交互：拖动旋转 / 滚轮缩放 / 点击零件 / 空格暂停 / R 重播 / 1-8 跳阶段。
