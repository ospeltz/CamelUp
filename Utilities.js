class Utilities {
    static centerString(str, totalLen, bufferChar=" ") {
        // returns a str of length totalLen with str in the center, and bufferChar
        // on either side to get it up to totLen
        if (bufferChar.length != 1) throw `invalid bufferChar "${bufferChar}"`;
        if (str.length > totalLen) throw `str: "${str} is longer than totalLen: ${totalLen}`;
        var prefix = Math.floor((totalLen - str.length) / 2);
        return bufferChar.repeat(prefix) + str + bufferChar.repeat(totalLen - str.length - prefix);
    }

    static shuffleArray(ar) {
        // shuffles input array ar in place
        for (var i = ar.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = ar[i];
            ar[i] = ar[j];
            ar[j] = temp;
        }
    }
}

exports.Utilities = Utilities;