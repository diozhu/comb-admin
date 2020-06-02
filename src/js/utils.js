export function thumb(url, { width = 750, height = 0 } = {}) {
    let str = url;
    // console.log('utils.thumb: ', url, width, height);
    // return url + '!/fw/100';
    if (/upaiyun.com/.test(url) || /upyun-img/.test(url)) {
        // 又拍云缩略图
        if (width && height) str += '!/both/' + width + 'x' + height;
        else if (width) str += '!/fw/' + width;
        else if (height) str += '!/fh/' + height;
    } else if (/static.91wuliu.com|aliyuncs.com/.test(url)) {
        // 阿里云缩略图
        if (width && height) str += '?x-oss-process=image/resize,m_fill,h_' + height + ',w_' + width;
        else if (width) str += '?x-oss-process=image/resize,w_' + width;
        else if (height) str += '?x-oss-process=image/resize,h_' + height;
    } else if (/static.91wuliu.com|aliyuncs.com/.test(url)) {
        if (width && height) str += '?x-oss-process=image/resize,m_fill,h_' + height + ',w_' + width;
        else if (width) str += '?x-oss-process=image/resize,w_' + width;
        else if (height) str += '?x-oss-process=image/resize,h_' + height;
    }
    return str;
}
