# Apple I（1976）装配模拟

复刻 APPLE I 奶油色 NTB 主板：MOS 6502、4K RAM（8 行×3 座插座）、Signetics 2513
字符发生器、RF 调制器、7805 电源，以及 Woz Monitor / BASIC 的绿色 CRT。

## 启动方式

- 本地 HTTP：`python3 tools/serve.py 8080`（禁缓存），访问 http://127.0.0.1:8080
- 双击支持：全部为经典 `<script>`、无 fetch、贴图程序化生成，`file://` 行为一致。

## 交互

拖动旋转 / 滚轮缩放 / 点击零件看标签 / 空格暂停 · D 隐藏/显示仪表盘（录屏可用 URL ?dash=0） / R 重播 / 数字键 1-8 跳阶段
（core → ram → video → pwr → io → power → woz → basic）。

## 验收

1. HTTP 打开 → 零件逐个飞入奶油主板，控制台无错误。
2. 按 7（woz）：CRT 出现 `*E000R`；按 8（basic）：屏幕打出
   `10 PRINT "HELLO, WORLD!"` → `RUN` → 反复输出 HELLO, WORLD!。
3. 双击 index.html 表现一致。

音效：首次点击/按键自动启用（合成音，零素材），右上角 🔊/🔇 可切换；零件落座、阶段切换、打字均配音。

## 界面语言（双语约定）
中文为主、英文为副的双语风格：标题卡/状态卡/阶段胶囊/仪表盘为中文主文案，
英文原文退到小字副位（`.tag .sub`、面板 `.meta`）；型号代号与单位
（6502、MK4096、WOZMON、BASIC、CRUN、MHz、KB、BAUD）保留英文；3D 零件
丝印贴图保持英文（真实硬件即英文标注），CRT 终端里滚出的 Woz Monitor 提示符
与 BASIC 程序输出是「内容」而非 UI，保持英文原样。改动文案时遵循同一约定：
主位中文、副位英文、代号不译。
