/* sdk_shim.js - FIXED FULL VERSION */
(function () {
  "use strict";

  function noop() {}

  function resolveSoon(cb) {
    return new Promise(function (res) {
      setTimeout(function () {
        try { if (cb) cb(); } catch (e) {}
        res(true);
      }, 50);
    });
  }

  // localStorage helpers
  var PREFIX = "fruitninja_save_v1:";

  function k(key) {
    return PREFIX + key;
  }

  function setItem(key, value) {
    try {
      localStorage.setItem(k(key), String(value));
    } catch (e) {}
  }

  function getItem(key) {
    try {
      return localStorage.getItem(k(key));
    } catch (e) {
      return null;
    }
  }

  function setData(key, value) {
    try {
      localStorage.setItem(k("data:" + key), JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getData(key, fallback) {
    try {
      var raw = localStorage.getItem(k("data:" + key));
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  // generate stable user id
  function getUserId() {
    var id = getItem("uid");
    if (!id) {
      id = "user_" + Math.random().toString(16).slice(2) + "_" + Date.now();
      setItem("uid", id);
    }
    return id;
  }

  // fake ads (call callback so game continues)
  function showInterstitialAd(cb) {
    console.log("Fake interstitial ad");
    return resolveSoon(cb);
  }

  function showRewardedAd(cb) {
    console.log("Fake rewarded ad");
    return resolveSoon(function () {
      try { if (cb) cb(true); } catch (e) {}
    });
  }

  // SDK object
  var sdk = {
    init: noop,

    showInterstitialAd: showInterstitialAd,
    showRewardedAd: showRewardedAd,
    showBannerAd: noop,
    hideBannerAd: noop,
    preloadAd: noop,

    addEventListener: noop,
    removeEventListener: noop,

    setItem: setItem,
    getItem: getItem,
    setData: setData,
    getData: getData,

    getUserId: getUserId,
    getUID: getUserId,
    getLanguage: function () {
      return (navigator.language || "en").split("-")[0];
    }
  };

  // expose under common names
  window.AzerionSDK = sdk;
  window.azSDK = sdk;
  window.azsdk = sdk;
  window.GameDistribution = sdk;
  window.gdsdk = sdk;
  window.adSDK = sdk;
  window.sdk = sdk;

  // flags used by builds
  window.AzerionISADPLAYING = false;
  window.azHasFocus = true;

})();
