function oCopy(obj) {
    obj.select();
    console.log(obj);
    document.execCommand("Copy");
    // swal("复制成功！", "在化学结构式编辑软件中粘贴为SMILES", "success");
}

function querySmiles(img_blob) {
    $('#smiles').text('加载中...');
    let data = img_blob, url = 'http://47.97.40.225:17005/image2smiles', xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                var tmp = xhr.responseText.split('\n');
                var smiles = [];
                for (var t = 0; t < tmp.length; t++) {
                    if (tmp[t].length > 1) {
                        if (tmp[t].indexOf('SMILES') === -1) {
                            smiles.push(tmp[t])
                        }
                    }
                }
                console.log('smiles', smiles);
                var list = '';
                if (smiles.length === 0) {
                    $('#smiles').text('未解析出结构式');
                    swal('未解析出结构式', '请确保图片中包含较为清晰的化学结构式', 'error');
                } else {
                    for (var i = 0; i < smiles.length; i++) {
                        list += '<li><input onclick="oCopy(this)" value="' + smiles[i] + '" readonly="readonly" /></li>'
                    }
                    let html = '单击文本框以复制SMILES结构式：<ol>' + list + '</ol>';
                    $('#smiles').html(html);
                    if (smiles.length === 1) {
                        var a = document.getElementsByTagName('input')[0];
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
