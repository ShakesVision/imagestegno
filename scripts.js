
//https://stackoverflow.com/questions/22087076/how-to-make-a-simple-image-upload-using-javascript-html

let canvas, ctx, canvas2, ctx2, img;

window.onload = function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas2 = document.getElementById('canvas2');
  ctx2 = canvas2.getContext('2d');

	$('#input').on('change', handleFile);
  $('#btn1').on('click', handleButton1);
  $('#btn2').on('click', handleButton2);
  $('#downloadButton').on('click', handleDownload);
  
  $('#convertButton').on('click', handleConvert);
  $('#convertCheckbox').on('change', handleCheckbox);
  $('#getBinaryButton').on('click', handleGetBinary);
}


function handleFile(evt){
  img = new Image;
  img.onload = function() {    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  }
  img.src =  URL.createObjectURL(evt.target.files[0]);
}

function handleButton1() {
  handleButton(false);
}
function handleButton2() {
  handleButton(true);
}
function handleButton(getting) {
    if(!img) {
      alert('no image');
      return;
    }

    let str = '';
    let strToSet = $('#textarea1').val();
    let imgData = ctx.getImageData(0, 0, img.width, img.height);

    for(let i=0, len=imgData.data.length; i<len; i+=4) {
      if(getting) {
        str += imgData.data[i]%2;
      } else {
        imgData.data[i] = Math.floor(imgData.data[i]/2)*2 + (strToSet[i/4]=='1' ? 1 : 0);
      }
    }

    if(getting) {
      $('#textarea2').val(str);      
    } else {
      canvas2.width = img.width;
      canvas2.height = img.height;
      ctx2.putImageData(imgData,0,0);      
    }
}

function handleDownload() {
  if(!img) {
      alert('no image');
      return;
    }
  let link = document.getElementById('downloadLink');
  link.href = canvas2.toDataURL();
  link.download = 'image.png';
  link.click();
}

function handleConvert() {
  let output = $('#convertOutput');
  let input = $('#convertInput').val();
  console.log(input);
  output.val('');

  if($('#convertCheckbox').is(':checked') ) {
    output.val(binaryToString(input) );
  } else {
    output.val(stringToBinary(input) );    
    if($('#fillCheckbox').is(':checked') ) {
      $('#textarea1').val(output.val() );
    }
  }
}

function handleCheckbox() {
  $('#fillCheckbox').attr('disabled', $('#convertCheckbox').is(':checked') );
  $('#getBinaryButton').attr('disabled', !$('#convertCheckbox').is(':checked') );
}

//https://ourcodeworld.com/articles/read/380/how-to-convert-a-binary-string-into-a-readable-string-and-vice-versa-with-javascript
function stringToBinary(str) {
    function zeroPad(num) {
        return '00000000'.slice(String(num).length) + num;
    }
    return str.replace(/[\s\S]/g, function(str) {
        str = zeroPad(str.charCodeAt().toString(2));
        return str;
    });
}
function binaryToString(str) {
    str = str.replace(/\s+/g, ''); //remove spaces
    str = str.match(/.{1,8}/g).join(' '); //add space every 8 chars

    let newBinary = str.split(' ');
    let binaryCode = [];

    for (i=0; i<newBinary.length; i++) {
        binaryCode.push(String.fromCharCode(parseInt(newBinary[i], 2) ) );
    }    
    return binaryCode.join('');
}

function handleGetBinary() {
  $('#convertInput').val($('#textarea2').val() );
}


/* TODO
make so encodes r, g, and b

OPTIONS
settings for checkboxes for editing r, g, or b
setting for editing last bit or 2 bits
give alert if ran out of room to encode
option to encode remianing bits with 0, 1, leasve as is, or random

give error alerts if click button with nothjing there
give error alerts for non binary inside of convert textarea


refresh, email, donate, night, fullscreen
*/

