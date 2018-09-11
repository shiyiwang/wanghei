import { config } from '../config/index';
import { md5 } from './md5';

const signature = time => {
  return md5(time + config.app_secret);
}

const selfRequest = (params, method, cb, error) => {
  const self = this;
  const requestTime = Math.floor(new Date().getTime() / 1000);
  const options = Object.assign({
    url: 'test',
    data: {},
    method: method || 'GET',
    header: {
      'x-request-time': requestTime,
      'x-app-key': config.app_key,
      'x-signature': signature(requestTime),
      'x-session-id': wx.getStorageSync('WX-SESSION-ID') || '',
      'content-type': method === 'POST' ? 'application/x-www-form-urlencoded' : 'application/json'
    }
  }, params);

  options.url = config.server + '/' + options.url;

  wx.request({
    url: options.url,
    data: options.data,
    method: options.method,
    header: options.header,
    success: function (res) {
      if (res.statusCode === 200 && res.header['x-session-id']) {
        wx.setStorageSync('WX-SESSION-ID', res.header['x-session-id']);
      }

      cb && cb(res);
    },
    fail: function (e) {
      error && error(e);
      wx.showToast({
        title: '网络出错',
        duration: 2000,
        icon: 'none'
      });
    }
  })
}

const get = (params, cb, error) => {
  selfRequest(params, 'GET', cb, error);
}

const post = (params, cb, error) => {
  selfRequest(params, 'POST', cb, error);
}

const requireLogin = (cb) => {
  wx.login({
    success: result => {
      if (result && result.errMsg === 'login:ok') {
        const code = result.code;
        wx.getUserInfo({
          success: function (res) {
            var data = {
              code: code,
              encryptedData: res.encryptedData,
              iv: res.iv,
              signature: res.signature,
              rawData: res.rawData
            }
            
            post({
              url: 'mini/login',
              data: data
            }, function (res2) {
              if (res2 && res2.data && res2.data.status === 200) {
                cb && cb(res);
              }
            }, function(e) {
              wx.showToast({ title: '请求登录失败', icon: 'loading', duration: 2000 });
            });
          },
          fail: function (res) {
            //用户拒绝授权
            if (res.errMsg == "getUserInfo:cancel" || res.errMsg == "getUserInfo:fail auth deny") {
              wx.showToast({ title: '用户拒绝授权', icon: 'loading', duration: 2000 });
              wx.navigateBack();
            }
          }
        });
      }else {
        wx.showToast({ title: '微信登陆失败！', icon: 'loading', duration: 2000 });
      }
    },
    fail: function (res) {
      wx.showToast({ title: '微信登陆失败！', icon: 'loading', duration: 2000 });
    }
  })
}

module.exports = {
  get: get,
  post: post,
  requireLogin: requireLogin
}