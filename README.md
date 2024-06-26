# molOCR

化学结构式识别工具
![index.png](https://i.loli.net/2020/09/02/UFfpWiqHzKJd8XI.png)

## 使用

向网页右侧拖入图片或者粘贴截图之后，等待几秒后，被识别到的化学结构式会被红色方框标记出来。点击红色方框，左侧的编辑器会显示出根据识别结果绘制的结构式。如果识别有偏差，可以使用编辑器修改结构。
完成之后，点击上方的“复制”按钮，打开chemdraw，使用快捷键`Ctrl`+`Shift`+`Alt`+`P`即可粘贴结构式。参见[演示视频](doc/demo.mp4)

因为识别误差的原因，结构式不会很规整，这时可以在chemdraw使用快捷键`Ctrl`+`Shift`+`K`来格式化，这个快捷键可以多次使用。

输入图片的清晰度越高，识别的准确度也就越高。所以最好上传高清文献的截图，不要识别手写的结构式或者其他奇怪的东西。

## 部署

1. 安装后端： [修改版的chembl_beaker](https://github.com/def-fun/chembl_beaker)
2. 下载这个项目，解压到HTTP服务器目录下。或者使用`python3 -m http.server`运行HTTP服务
3. 视情况修改`js/img2mol.js`中的`OCR_API_URL`。如果chembl_beaker服务器和HTTP服务器在同一个主机上，则不需要做修改。

## Feature

- 识别率还行😂
- 重绘结构与原始结构的排版基本保持一致
- 支持图片文件拖放
- 识别到结构式时有红框标记
- 结构式点击高亮
- 识别有误差时可以使用编辑器修正

## Tips

- 截图快捷键: QQ(Ctrl+Alt+A), 微信(Alt+A)
- 只截取一个结构式时，识别准确率最高
- 识别失败时，尝试放大文献后再截图识别
- ChemDraw中Ctrl+Shift+K快速格式化结构式, 可多次使用

## Todo

- 做个windows桌面端的截图识别工具
- 使canvas画板适应窗口大小
