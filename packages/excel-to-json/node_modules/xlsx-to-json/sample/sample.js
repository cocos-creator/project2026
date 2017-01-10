var xlsx_json = require('../')

xlsx_json({
  input: __dirname + '/interview.xlsx',
  output: __dirname + '/test.json'
}, function(err, result) {
  if(err) {
    console.error(err);
  }else {
    console.log(result);
  }

});

