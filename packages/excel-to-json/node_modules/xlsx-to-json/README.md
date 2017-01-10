# node-xlsx-json

[![Build Status](https://travis-ci.org/DataGarage/node-xlsx-json.png?branch=master)](https://travis-ci.org/DataGarage/node-xlsx-json)

Converting xlsx file to json files using nodejs

## Install

```
  npm install xlsx-to-json
```

## Usage

```javascript
  xlsxj = require("xlsx-to-json");
  xlsxj({
    input: "sample.xlsx", 
    output: "output.json"
  }, function(err, result) {
    if(err) {
      console.error(err);
    }else {
      console.log(result);
    }
  });
```

### Specifying a target sheet

You can optionally provide a sheet name to extract from that sheet

```javascript
  xlsxj = require("xlsx-to-json");
  xlsxj({
    input: "sample.xlsx", 
    output: "output.json",
    sheet: "tags"
  }, function(err, result) {
    if(err) {
      console.error(err);
    }else {
      console.log(result);
    }
  });
```

In config object, you have to enter an input path. But If you don't want to output any file you can set to `null`.

## License

MIT [@chilijung](http://github.com/chilijung)


