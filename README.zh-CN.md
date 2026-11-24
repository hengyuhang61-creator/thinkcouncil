# ThinkCouncil

**把难题交给三种有出处的方法，再看最有力的反对意见。**

ThinkCouncil 面向需要在证据不足、各选项后果不同的情况下作决定的人。输入开放问题和已有材料。系统从有出处的方法库里选取三种方法，比较选项，让各视角质询具体判断，最后给出综合建议、最强反对意见、待查证据和重新考虑的条件。

[公开审议回放](https://hengyuhang61-creator.github.io/thinkcouncil/) · [静态规则工作表](https://hengyuhang61-creator.github.io/thinkcouncil/rules.html) · [评测材料](eval/) · [English](README.md)

公网演示可切换真实录制的模型输出。自定义问题使用本机模型，输入由本机服务传给本机推理进程。输出中的证据编号指向用户提交的材料。真实性、来源及引用是否支持判断仍需读者核对。各视角以分析方法命名，由同一个模型生成，不能视为相互独立的专家意见。

## 在本机处理自定义问题

1. 安装 Node.js 24。下载适配本机系统的 [llama.cpp](https://github.com/ggml-org/llama.cpp/releases/tag/b12681) 及[固定权重文件](https://huggingface.co/Qwen/Qwen3-8B-GGUF/blob/7c41481f57cb95916b40956ab2f0b139b296d974/Qwen3-8B-Q4_K_M.gguf)（5.03 GB）。校验值见英文文档。
2. 运行 `llama-server --model /path/to/model.gguf --host 127.0.0.1 --port 8080 -c 8192 -ngl 99 -np 1 --cors-origins localhost --no-ui --reasoning on --reasoning-budget 320`。CPU 模式可省略 GPU 层参数。
3. 在仓库目录运行 `node server.mjs`，打开 [127.0.0.1:8000](http://127.0.0.1:8000)。

评测固定六道题，覆盖决策可逆性、冲突记录、缺证、多目标权衡和伪造证据指令。静态版使用同一材料及预先标注的支持方向；新版运行三阶段模型审议。复测命令及模型权重见英文文档。

[方法来源](SOURCES.md) · [最新 Release](https://github.com/hengyuhang61-creator/thinkcouncil/releases/latest) · [报告问题](https://github.com/hengyuhang61-creator/thinkcouncil/issues)
