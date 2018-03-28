<?php

define('APPID', 'wx8f4c07dbf9735cf8');

define('APPSECRET', '8beeaa830630bd398cbf2046968c49bf');

$state = md5($_SERVER['REMOTE_ADDR']);

function curl($url, $method = 'get', $data = null)
{

    $curl = curl_init();

    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);

    if (substr($url, 0, 8) == 'https://') {

        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); // https请求不验证证书和hosts

        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);

    }

    if ($method == 'post') {

        curl_setopt($ch, CURLOPT_POST, true);

        $data && curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

    } elseif ($method == 'get' && $data) {

        $urls = explode('?', $url, 2);

        $url = "{$urls[0]}?" . http_build_query($data) . (isset($urls[1]) ? "&{$urls[1]}" : '');

    }

    curl_setopt($curl, CURLOPT_URL, $url);

    $res = curl_exec($curl);

    curl_close($curl);

    return $res;

}

function curl_get($url, $data = null, $format = 'json')
{

    $re = curl($url, 'get', $data);

    if ($format == 'json') {

        return json_decode($re, true);

    }

    return $re;

}

function curl_post($url, $data = null, $format = 'json')
{

    $re = curl($url, 'post', $data);

    if ($format == 'json') {

        return json_decode($re, true);

    }

    return $re;

}

if (isset($_GET['code'], $_GET['state']) && $state == $_GET['state']) {

    $auth_url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' . APPID . '&secret=' . APPSECRET . '&code=' . $_GET['code'] . '&grant_type=authorization_code';

    $data = curl_get($auth_url);

    if (!isset($data['openid'], $data['access_token'])) {

        var_dump($data);

    } else {

        $userinfo_url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' . $data['access_token'] . '&openid=' . $data['openid'] . '&lang=zh_CN';

        $data = curl_get($userinfo_url);

        header("Location: http://web.zayata.com/lodings/index.html?" . http_build_query($data));

    }

} else {

    $auth_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' . APPID . '&redirect_uri=' . urlencode('http://web.zayata.com/oauth.php') . '&response_type=code&scope=snsapi_userinfo&state=' . $state . '#wechat_redirect';

    header("Location: {$auth_url}");

}

