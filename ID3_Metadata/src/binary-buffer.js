var BinaryBuffer = function (buffer) {
  this.buffer = buffer;
  this.length = buffer.length;
};
BinaryBuffer.prototype = {
  // Функция возвращающая часть данных
  slice: function (offset, length) {
    var buffer = new ArrayBuffer(length);
    for (var i = offset, j = 0; i < this.length && j < length; i++, j++) {
      buffer[j] = this.buffer[i];
    }
    return new BinaryBuffer(buffer);
  },


  // Возвращаем определенный байт
  byteAt: function (i) {
    let arr = new Int8Array(this.buffer);   //todo why it is no 4-6 ???
    return arr[i] & 0xFF;


    // let test = this.touint28(this.buffer[[""[[Int8Array]] & 0xFF);

    // return this.buffer[i] & 0xFF;
  },
  // Возращаем ASCII символ
  charAt: function (i) {
    var code = this.byteAt(i);
    if (code == 0) return "?";
    if (code < 32) return "?";
    return String.fromCharCode(code);
  },
  // Возращаем ASCII строку
  stringAt: function (offset, length) {
    var str = [];
    for (var i = offset, j = 0; i < offset + length; i++, j++) {
      str[j] = this.charAt(i);
    }
    return str.join("");
  },
  // Возращаем ASCII для всего массива данных
  toString: function () {
    return this.stringAt(0, this.length);
  }
};