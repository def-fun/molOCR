var eleArr = []; // item = {'file': '...', id: 1, x1: 1, x2: 2, y1: 3, y2: 4}
var mols = [];
var ctx;
var raw_img_data;

function playWithThisMolFile(obj) {
    obj.select();
    document.execCommand("Copy");
    // swal("复制成功！", "在化学结构式编辑软件中粘贴为SMILES", "success");
    console.log(obj);
    Sketcher.loadMOL(obj.textContent);
}

function mark(ctx, num, sdfText) {
    // console.log(ctx, num, sdfText);
    let reg = /(\d+)x(\d+)-(\d+)x(\d+)/;
    var [a00, x1, y1, x2, y2, a01] = reg.exec(sdfText);
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
    eleArr.push({'file': sdfText, id: num, x1: x1, x2: x2, y1: y1, y2: y2})
}

function onDown(e) {
    console.log(e);
    var mx = e.layerX;
    var my = e.layerY;
    for (var i = 0; i < eleArr.length; i++) {
        if (mx > eleArr[i].x1 && mx < eleArr[i].x2 && my > eleArr[i].y1 && my < eleArr[i].y2) {
            let ele = eleArr[i];
            console.log('click on', ele.id);
            highlight_molecule(ele.id);
        } else {
            // sketcher.clear();
        }
    }
}

function highlight_molecule(molecule_id) {
    let ele = eleArr[molecule_id - 1];
    Sketcher.loadMOL(ele.file);
    ctx.putImageData(raw_img_data, 0, 0);
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = 'red';
    let n = 2;
    ctx.strokeRect(ele.x1 - n, ele.y1 - n, ele.x2 - ele.x1 + n * 2, ele.y2 - ele.y1 + n * 2);
    ctx.setLineDash([]);
    $("#molecule-text").html('<textarea style="width: 100%" rows="10" readonly>' + ele.file + '</textarea>');
}


function querySmiles(img_blob) {
    $('#smiles').text('加载中...');
    // let url = 'http://' + window.location.hostname + ':5000/image2ctab';
    let url = 'http://47.97.40.225:17005/image2ctab';
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(img_blob);
    xhr.onreadystatechange = function () {
        mols = [];
        eleArr = [];
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var blob = window.URL.createObjectURL(img_blob);
                var img = new Image();
                img.src = blob;
                img.onload = function () {
                    var imgW = img.width;
                    var imgH = img.height;
                    var cW = Math.max(imgW, 600);
                    var cH = Math.max(imgH, 300);
                    $('.box').html('<canvas width="' + cW + '" height="' + cH + '" id="cvs"></canvas>');

                    ctx = document.getElementById('cvs').getContext('2d');
                    ctx.drawImage(this, 0, 0, imgW, imgH);
                    var canv = document.getElementById('cvs');
                    canv.addEventListener("mousedown", onDown);
                    // console.log(xhr.responseText);
                    var tmp = xhr.responseText.split('$$$$');
                    var reg = new RegExp(/^\s+/);
                    for (var t = 0; t < tmp.length; t++) {
                        if (tmp[t].length > 1) {
                            mols.push(tmp[t].replace(reg, 'MOL TEXT\n') + '$$$$');
                        }
                    }
                    var list = '';
                    if (mols.length === 0) {
                        $('#smiles').text('未解析出结构式');
                        swal('未解析出结构式', '请确保图片中包含较为清晰的化学结构式', 'error');
                    } else {
                        for (var i = 0; i < mols.length; i++) {
                            // list += '<li><textarea onclick="playWithThisMolFile(this)" rows="1" cols="30" readonly>' + mols[i] + '</textarea></li>';
                            mark(ctx, i + 1, mols[i]);

                        }
                        raw_img_data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
                        let html = '识别到结构式个数：<strong>' + eleArr.length + '</strong>';
                        $('#smiles').html(html);
                        if (mols.length >= 1) { // 默认复制第一个mol
                            highlight_molecule(1);
                        }
                    }

                };


            } else {
                $('#smiles').text('上传失败');
                swal('上传失败', '可能是图片过大、网络故障或服务器离线', 'error');
            }
        }
    }
}

function copyMolecule() {
    let obj = $("#molecule-text");
    obj.html('<textarea style="width: 100%" rows="10" readonly>' + Sketcher.getMOL().replace('MolView', 'MOL TEXT\nMolView') + '</textarea>');
    obj.context.getElementsByTagName("textarea")[0].select();
    document.execCommand("Copy");
}