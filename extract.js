const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('d:\\CV\\NguyenHuuThai_CV.pdf');

pdf(dataBuffer).then(function (data) {
    console.log(data.text);
});
