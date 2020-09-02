let molTexts = []; // MOL TEXT的列表
let molArr = []; // 也是MOL TEXT的列表，但是包含id和坐标信息 {'text': '...', id: 1, x1: 1, x2: 2, y1: 3, y2: 4}
let ctx;  // canvas 2D对象
let rawImgData; // 带红框标记的图片，每次单击选中高亮的时候用这个数据初始化canvas
// let OCR_API_URL = 'http://' + window.location.hostname + ':5000/image2ctab';
let OCR_API_URL = 'http://47.97.40.225:17005/image2ctab';

function playWithThisMolFile(obj) {
    // 显示并复制结构式
    obj.select();
    document.execCommand("Copy");
    // swal("复制成功！", "在化学结构式编辑软件中粘贴为SMILES", "success");
    // console.log(obj);
    Sketcher.loadMOL(obj.textContent);
}

function mark(ctx, num, sdfText) {
    // 使用矩形标记出识别到的结构式
    let reg = /(\d+)x(\d+)-(\d+)x(\d+)/;
    let [a00, x1, y1, x2, y2, a01] = reg.exec(sdfText);
    x1 = parseInt(x1);
    y1 = parseInt(y1);
    x2 = parseInt(x2);
    y2 = parseInt(y2);
    ctx.strokeStyle = 'red';
    // ctx.strokeRect(x1 - 2, y1 - 2, (x2 - x1 + 4), (y2 - y1 + 4));
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    ctx.font = '18px Arial';
    ctx.fillStyle = 'red';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'start';
    ctx.fillText(num, x1 + 2, y1 + 2);
    molArr.push({'text': sdfText, id: num, x1: x1, x2: x2, y1: y1, y2: y2})
}

function onDown(e) {
    // 判断点击在哪个结构式上
    const mx = e.layerX;
    const my = e.layerY;
    for (let i = 0; i < molArr.length; i++) {
        if (mx > molArr[i].x1 && mx < molArr[i].x2 && my > molArr[i].y1 && my < molArr[i].y2) {
            let ele = molArr[i];
            console.log('click on', ele.id);
            highlight_molecule(ele.id);
        } else {
            // sketcher.clear();
        }
    }
}

function highlight_molecule(molecule_id) {
    // 使用加粗的矩形标记出结构式
    let ele = molArr[molecule_id - 1];
    Sketcher.loadMOL(ele.text);
    ctx.putImageData(rawImgData, 0, 0);
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = 'red';
    let n = 2;
    ctx.strokeRect(ele.x1 - n, ele.y1 - n, ele.x2 - ele.x1 + n * 2, ele.y2 - ele.y1 + n * 2);
    ctx.setLineDash([]);
    $("#molecule-text").html('<textarea style="width: 100%" rows="10" readonly>' + ele.text + '</textarea>');
}


function sendMolImage(img_blob) {
    // 把图片数据提交给后端，并执行一系列事件
    $('#molText').text('加载中...');
    let xhr = new XMLHttpRequest();
    xhr.open('POST', OCR_API_URL);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(img_blob);
    xhr.onreadystatechange = function () {
        molTexts = [];
        molArr = [];
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const blob = window.URL.createObjectURL(img_blob);
                const img = new Image();
                img.src = blob;
                img.onload = function () {
                    const imgW = img.width;
                    const imgH = img.height;
                    const cW = Math.max(imgW, 600);
                    const cH = Math.max(imgH, 300);
                    $('.box').html('<canvas width="' + cW + '" height="' + cH + '" id="cvs"></canvas>');

                    ctx = document.getElementById('cvs').getContext('2d');
                    ctx.drawImage(this, 0, 0, imgW, imgH);
                    const canv = document.getElementById('cvs');
                    canv.addEventListener("mousedown", onDown);
                    // console.log(xhr.responseText);
                    const tmp = xhr.responseText.split('$$$$');
                    const reg = new RegExp(/^\s+/);
                    for (let t = 0; t < tmp.length; t++) {
                        if (tmp[t].length > 1) {
                            molTexts.push(tmp[t].replace(reg, 'MOL TEXT\n') + '$$$$');
                        }
                    }
                    if (molTexts.length === 0) {
                        $('#molText').text('未解析出结构式');
                        swal('未解析出结构式', '请确保图片中包含较为清晰的化学结构式', 'error');
                    } else {
                        for (let i = 0; i < molTexts.length; i++) {
                            // list += '<li><textarea onclick="playWithThisMolFile(this)" rows="1" cols="30" readonly>' + molTexts[i] + '</textarea></li>';
                            mark(ctx, i + 1, molTexts[i]);

                        }
                        rawImgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
                        let html = '识别到结构式个数：<strong>' + molArr.length + '</strong>';
                        $('#molText').html(html);
                        if (molTexts.length >= 1) { // 默认复制第一个mol
                            highlight_molecule(1);
                        }
                    }

                };


            } else {
                $('#molText').text('上传失败');
                swal('上传失败', '可能是图片过大、网络故障或服务器离线', 'error');
            }
        }
    }
}

function copyMolecule() {
    // 修改textarea中的内容，选中，复制，提示复制成功
    let obj = $("#molecule-text");
    obj.html('<textarea style="width: 100%" rows="10" readonly>' + Sketcher.getMOL().replace('MolView', 'MOL TEXT\nMolView') + '</textarea>');
    obj.context.getElementsByTagName("textarea")[0].select();
    document.execCommand("Copy");

    // https://codeseven.github.io/toastr/demo.html
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "500",
        "timeOut": "800",
        "extendedTimeOut": "500",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    toastr.success("复制成功");
}