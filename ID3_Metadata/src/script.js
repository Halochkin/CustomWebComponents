// Проверим поддержку File API браузером.
// if(window.File && window.FileReader && window.FileList && window.Blob) {
//   // Цепляем событие на изменение поле с файлом
//   document.getElementById('files').addEventListener('change',function(e) {
//     // Ни одного файла не выбрано
//     if(!e.target.files.length) {
//       alert('Please select a file!');
//       return;
//     }
//
//     // Будем читать первый выбранный файл
//     var file=e.target.files[0];
//
//     // Файл должен быть mp3, в других аудио-форматах другие форматы тегов
//     if(file.type=='audio/mp3'){
//       // Создадим объект тега
//       var tag=new ID3v2;
//       // Читаем тег
//       // Т.к. чтение файла происходит асинхронно,
//       // то нам нужна определить функцию,
//       // которая выполнится когда процесс закончится.
//       // Второй параметр как раз для этого.
//       tag.readFromFile(file,function(tag){
//         document.getElementById('title').value=tag.get('TIT2');
//         document.getElementById('artist').value=tag.get('TPE1');
//         document.getElementById('album').value=tag.get('TALB');
//         document.getElementById('year').value=tag.get('TDRC');
//       });
//     }
//     else {
//       alert('Unsupported file type <'+file.type+'>');
//     }
//   });
// }
// else {
//   alert('The File APIs are not fully supported in this browser.');
// }


// Проверим поддержку File API браузером.
// if (window.File && window.FileReader && window.FileList && window.Blob) {
// Цепляем событие на изменение поле с файлом
// document.getElementById('files').addEventListener('change', function (e) {


(function (url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function (e) {
    // let buffer = e.response;


    // // Ни одного файла не выбрано
    // if (!e.target.files.length) {
    //   alert('Please select a file!');
    //   return;
    // }

    // Будем читать первый выбранный файл
    var file = e.target.response;

    // Файл должен быть mp3, в других аудио-форматах другие форматы тегов

    // Создадим объект тега
    var tag = new ID3v2(file);
    // Читаем тег
    // Т.к. чтение файла происходит асинхронно,
    // то нам нужна определить функцию,
    // которая выполнится когда процесс закончится.
    // Второй параметр как раз для этого.
    tag.readFromFile(file, function (tag) {
      document.getElementById('title').innerText = tag.get('TIT2');
      document.getElementById('artist').innerText = tag.get('TPE1');
      document.getElementById('album').innerText = tag.get('TALB');
      document.getElementById('year').innerText = tag.get('TDRC');
      // console.log(tag.get('TDRC'));
    });

  };
  xhr.send();
})("../audio/vivaldi.mp3");





