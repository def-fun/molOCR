function oCopy(obj) {
    obj.select();
    document.execCommand("Copy");
    // swal("复制成功！", "在化学结构式编辑软件中粘贴为SMILES", "success");
}


function querySmiles(img_blob) {
    $('#smiles').text('加载中...');
    let data = img_blob, url = 'http://47.97.40.225:17005/image2ctab', xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var mols = [];
                // console.log(xhr.responseText);
                var tmp = xhr.responseText.split('$$$$');
                var reg = new RegExp(/^\s+/);
                for (var t = 0; t < tmp.length; t++) {
                    if (tmp[t].length > 1) {
                        mols.push(tmp[t].replace(reg, 'MOL TEXT\n'))
                    }
                }
                // console.log('mols', mols);
                var list = '';
                if (mols.length === 0) {
                    $('#smiles').text('未解析出结构式');
                    swal('未解析出结构式', '请确保图片中包含较为清晰的化学结构式', 'error');
                } else {
                    for (var i = 0; i < mols.length; i++) {
                        list += '<li><textarea onclick="oCopy(this)" rows="1" cols="30" readonly>' + mols[i] + '</textarea></li>'
                    }
                    let html = '单击文本框以复制mol结构式：<ol>' + list + '</ol>';
                    $('#smiles').html(html);
                    if (mols.length >= 1) { // 默认复制第一个mol
                        var a = document.getElementsByTagName('textarea')[0];
                        a.click();
                    }
                }
            } else {
                $('#smiles').text('上传失败');
                swal('上传失败', '可能是图片过大，也可能是服务器故障', 'error');
            }
        }
    }
}
