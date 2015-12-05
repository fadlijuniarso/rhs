
const _base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/**
 * Base64-encodes a Uint8Array.
 *
 * @param input the Uint8Array to encode.
 * @param maxline the maximum number of encoded characters per line to use,
 *          defaults to none.
 *
 * @return the base64-encoded output string.
 */
const base64Encode = (input, maxline = 64) => {
  if (!(typeof input === 'string' || (input instanceof Uint8Array))) {
    throw new TypeError('input should be a string or instance of Uint8Array');
  }

  if (typeof input === 'string') {
    let uintArray = new Uint8Array(input.length);
    for (let j = 0; j < input.length; j++) {
      uintArray[j] = input.charCodeAt(j);
    }
    input = uintArray;
  }
  let line = '';
  let output = '';
  let chr1, chr2, chr3;
  let i = 0;
  while(i < input.byteLength) {
    chr1 = input[i++];
    chr2 = input[i++];
    chr3 = input[i++];

    // encode 4 character group
    line += _base64.charAt(chr1 >> 2);
    line += _base64.charAt(((chr1 & 3) << 4) | (chr2 >> 4));
    if(isNaN(chr2)) {
      line += '==';
    } else {
      line += _base64.charAt(((chr2 & 15) << 2) | (chr3 >> 6));
      line += isNaN(chr3) ? '=' : _base64.charAt(chr3 & 63);
    }

    if(maxline && line.length > maxline) {
      output += line.substr(0, maxline) + '\r\n';
      line = line.substr(maxline);
    }
  }
  output += line;
  return output;
}

export {base64Encode}


