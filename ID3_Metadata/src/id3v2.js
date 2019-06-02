var ID3v2 = function () {
  // Cюда будем сохранять ошибки
  this.errors = [];
  // Версия тега
  this.version = 'Unknown';
  // Флаги тега
  this.flags = {
    isUnSynchronisation: false,
    hasExtendedHeader: false,
    isExperimental: false,
    hasFooter: false
  };
  // Размер тега в байтах. Размер не включает 10 байт заголовка и 10 байт футера (при наличии его)
  this.size = 0;
  // Фреймы тега
  this.frames = {};
};
ID3v2.prototype.readFromFile = function (file, callback) {
  // Проверим на всякий случай второй параметр
  if (!(callback instanceof Function)) {
    callback = function (target) {
    };
  }

  var self = this,
    // нам понадобится FileReader
    reader = new FileReader;

  // Расшифруем Synchsafe - в данном виде хранятся размеры тега  размеры фрейма, подробнее в интернете, например, в Вики
  // http://en.wikipedia.org/wiki/Synchsafe
  function UnSynchsafeInt(buffer) {
    var value = 0;
    for (var i = 0, length = 4; i < length; i++) {
      value += (buffer.byteAt(i) & 0x7F) * Math.pow(Math.pow(2, 7), length - i - 1);
    }
    return value;
  }


  // This event will occur when the specified piece of file is finished reading
  reader.onloadend = function (e) {
    // Let's check the successful completion of the reading
    if (e.target.readyState == FileReader.DONE) {
      // Let's bring the read result from Blob to our specially designed BinaryBuffer
      var result = new BinaryBuffer(e.target.result);

      // The first 3 bytes must contain the tag identifier
      if (result.stringAt(0, 3).toUpperCase() !== 'ID3') {
        let test = result.stringAt(0, 3).toUpperCase();
        self.errors.push('Error: ID3v2 not found, shittt!!');
        callback(self);
        return;
      } else {
        let test = result.stringAt(0, 3).toUpperCase();
        console.log("congrads");
      }
      // The fourth and fifth bytes contain the version of the tag
      self.version = '2.' + result.byteAt(5) + '.' + result.byteAt(4);
      // The fifth byte describes the flags of the tag.
      self.flags.isUnSynchronisation = result.byteAt(5) & 128 ? true : false;
      self.flags.hasExtendedHeader = result.byteAt(5) & 64 ? true : false;
      self.flags.isExperimental = result.byteAt(5) & 32 ? true : false;
      self.flags.hasFooter = result.byteAt(5) & 16 ? true : false;

      // Для размера тега отведены 4 байта начиная с 7

      // let test = UnSynchsafeInt(new Int16Array(result.buffer.slice(6, 4)));

      self.size = UnSynchsafeInt(result.slice(6, 4));

      if (self.size < 1) {
        self.errors.push('Ошибка: ID3v2 поврежден!');
        callback(self);
        return;
      }

      // Теперь когда у нас есть размер тега, прочтем тег из файла
      reader.onloadend = function (e) {
        var result = new BinaryBuffer(e.target.result),
          cursor = 0;

        // Тег состоит из фреймов.
        // Фрейм в свою очередь имеет заголовок и значение фрейма.
        // Заголовок всегда занимает 10 байт.
        // В котором содержится параметры фрейма: ID (4 байта), размер (4 байта), флаги (2 байта)

        do {
          var frame = {};
          // Первые 4 байта занимает идентификатор фрейма
          var id = result.stringAt(cursor, 4);


          // Проверим если ИД поддреживается
          if (ID3v2.validFramesIds.indexOf(id) < 0) {
            self.errors.push('Error: ID3v2 Фрейм не поддерживается (' + id + ')!');
            cursor += 10;
          }
          else {
            frame.id = id;
            frame.size = UnSynchsafeInt(result.slice(cursor + 4, 4));
            cursor += 10;

            frame.value = result.slice(cursor, frame.size).toString();
            cursor += frame.size;

            self.frames[id] = frame;
          }
        }
        while (cursor <= self.size);

        // Процесс завершен. Тег прочитан. Ура.
        callback(self);
      };
      reader.readAsArrayBuffer(file.slice(10, self.size));
    }
  };
  // О наличие тега в файле, свидетельствует наличие заголовка тега, который находится в первых 10 байтах файла.
  // *** ID3 Начиная с версии 2.4.0 может находится и в конце файла, но полное описание стандарта ID3 выходит за рамки этой статьи.
  // Читаем первые 10 байт из файла.


  // let fileTest =  reader.readAsArrayBuffer(file.slice(0,10));

  reader.readAsArrayBuffer(file.slice(0, 10));
};
// Геттер нужного фрейма
ID3v2.prototype.get = function (id) {
  return this.frames[id] ? this.frames[id].value : '';
};
ID3v2.validFramesIds = [
  'AENC',    // Audio encryption
  'APIC',    // Attached picture
  'COMM',    // Comments
  'COMR',    // Commercial frame
  'ENCR',    // Encryption method registration
  'EQUA',    // Equalization
  'ETCO',    // Event timing codes
  'GEOB',    // General encapsulated object
  'GRID',    // Group identification registration
  'IPLS',    // Involved people list
  'LINK',    // Linked information
  'MCDI',    // Music CD identifier
  'MLLT',    // MPEG location lookup table
  'OWNE',    // Ownership frame
  'PRIV',    // Private frame
  'PCNT',    // Play counter
  'POPM',    // Popularimeter
  'POSS',    // Position synchronisation frame
  'RBUF',    // Recommended buffer size
  'RVAD',    // Relative volume adjustment
  'RVRB',    // Reverb
  'SYLT',    // Synchronized lyric/text
  'SYTC',    // Synchronized tempo codes
  'TALB',    // Album/Movie/Show title
  'TBPM',    // BPM (beats per minute)
  'TCOM',    // Composer
  'TCON',    // Content type
  'TCOP',    // Copyright message
  'TDAT',    // Date
  'TDLY',    // Playlist delay
  'TENC',    // Encoded by
  'TEXT',    // Lyricist/Text writer
  'TFLT',    // File type
  'TIME',    // Time
  'TIT1',    // Content group description
  'TIT2',    // Title/songname/content description
  'TIT3',    // Subtitle/Description refinement
  'TKEY',    // Initial key
  'TLAN',    // Language(s)
  'TLEN',    // Length
  'TMED',    // Media type
  'TOAL',    // Original album/movie/show title
  'TOFN',    // Original filename
  'TOLY',    // Original lyricist(s)/text writer(s)
  'TOPE',    // Original artist(s)/performer(s)
  'TORY',    // Original release year
  'TOWN',    // File owner/licensee
  'TPE1',    // Lead performer(s)/Soloist(s)
  'TPE2',    // Band/orchestra/accompaniment
  'TPE3',    // Conductor/performer refinement
  'TPE4',    // Interpreted, remixed, or otherwise modified by
  'TPOS',    // Part of a set
  'TPUB',    // Publisher
  'TRCK',    // Track number/Position in set
  'TRDA',    // Recording dates
  'TRSN',    // Internet radio station name
  'TRSO',    // Internet radio station owner
  'TSIZ',    // Size
  'TSRC',    // ISRC (international standard recording code)
  'TSSE',    // Software/Hardware and settings used for encoding
  'TYER',    // Year
  'TXXX',    // User defined text information frame
  'UFID',    // Unique file identifier
  'USER',    // Terms of use
  'USLT',    // Unsychronized lyric/text transcription
  'WCOM',    // Commercial information
  'WCOP',    // Copyright/Legal information
  'WOAF',    // Official audio file webpage
  'WOAR',    // Official artist/performer webpage
  'WOAS',    // Official audio source webpage
  'WORS',    // Official internet radio station homepage
  'WPAY',    // Payment
  'WPUB',    // Publishers official webpage
  'WXXX',    // User defined URL link frame

  "TDRC"    // Unknown, possibly year !!!
];