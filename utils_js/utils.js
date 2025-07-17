// utils/numberConverter.js

export function convertToBanglaNumber(englishNumber) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return englishNumber.toString().split('').map(d => banglaDigits[parseInt(d)]).join('');
}

// utils/banglaNumberToWords.js

// বাংলা ডিজিট থেকে ইংরেজি ডিজিটে কনভার্ট
function bnToEnNumber(bnNumStr) {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return bnNumStr
    .split('')
    .map(ch => {
      const idx = bnDigits.indexOf(ch);
      return idx !== -1 ? idx.toString() : ch;
    })
    .join('');
}

export function numberToBanglaWords(input) {
  // বাংলা ডিজিট থাকলে ইংরেজিতে কনভার্ট করে int এ রূপান্তর
  let num = typeof input === 'string' ? parseInt(bnToEnNumber(input), 10) : input;

  if (isNaN(num) || num < 0) return 'শুধুমাত্র ধনাত্মক সংখ্যা গ্রহণযোগ্য';

  if (num === 0) return 'শূন্য টাকা মাত্র';

  const units = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়'];
  const teens = ['দশ', 'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোল', 'সতেরো', 'আঠারো', 'উনিশ'];
  const tens = ['', '', 'বিশ', 'ত্রিশ', 'চল্লিশ', 'পঞ্চাশ', 'ষাট', 'সত্তর', 'আশি', 'নব্বই'];

  let parts = [];

  // হাজারের অংশ
  const hajar = Math.floor(num / 1000);
  num %= 1000;

  if (hajar > 0) {
    parts.push(numberBelowThousandToWords(hajar) + ' হাজার');
  }

  // বাকি শতকের নিচে অংশ
  if (num > 0) {
    parts.push(numberBelowThousandToWords(num));
  }

  return parts.join(' ') + ' টাকা মাত্র';

  // ৩ ডিজিটের নিচের সংখ্যাকে বাংলা শব্দে রূপান্তর করে
  function numberBelowThousandToWords(number) {
    let str = '';
    const hundredPart = Math.floor(number / 100);
    const remainder = number % 100;

    if (hundredPart > 0) {
      str += units[hundredPart] + ' শত ';
    }

    if (remainder > 0) {
      if (remainder < 10) {
        str += units[remainder] + ' ';
      } else if (remainder >= 10 && remainder < 20) {
        str += teens[remainder - 10] + ' ';
      } else {
        const tenPart = Math.floor(remainder / 10);
        const unitPart = remainder % 10;
        str += tens[tenPart] + ' ';
        if (unitPart > 0) {
          str += units[unitPart] + ' ';
        }
      }
    }
    return str.trim();
  }
}


