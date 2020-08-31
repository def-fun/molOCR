# molOCR

v0.0.0.0.3
使用SDF作为交互文件：
+ 可以保持重绘结构与图片中的结构基本一致
+ 识别到结构式时，根据SDF中包含的坐标标记出图片中的结构式(需要[修改版的chembl_beaker](https://github.com/def-fun/chembl_beaker/tree/v1.1)支持)

## 部署
1. 安装后端： [修改版的chembl_beaker](https://github.com/def-fun/chembl_beaker/tree/v1.1)
2. 下载repo到网站目录下
3. 视情况修改`js/img2mol_mark.js`第29行的url

## Feature
- 识别率还行😂
- 重绘结构与原始结构的排版基本保持一致
- 支持图片文件拖放
- 识别到结构式时有红框标记

## Tips
- 截图快捷键: QQ(Ctrl+Alt+A), 微信(Alt+A)
- 只截取一个结构式时，识别准确率最高
- 识别失败时，尝试放大文献后再截图识别
- 单击文本框即自动复制
- 会自动复制第一个MOL到剪切板
- ChemDraw中Ctrl+Shift+K快速格式化结构式, 可多次使用

## Todo
- 加个网页版的结构式编辑器
- 使用[chemdoodle](https://web.chemdoodle.com/tutorial/loading-data#customise-template)实现分子编辑
