class CommonUtils {
  static wait(ms) {
    return new Promise(function(resolve) {
      setTimeout(resolve, ms);
    });
  }
}

module.exports = CommonUtils;