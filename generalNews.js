const term = require('terminal-kit').terminal;
const fetch = require('node-fetch');
const parser = require('fast-xml-parser');
const he = require('he');
const { parse } = require('node-html-parser');
const R = require('ramda');

const options = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName : "#text",
    ignoreAttributes : true,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false, //"strict"
    attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
    tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
    stopNodes: ["parse-me-as-string"]
};

const ui = (titles, news) => {
    term.singleColumnMenu(titles, (error, response) => {
        if(error){
            console.error("\x1b[31m", error);
        } else {
            console.log(news[response.selectedIndex].description);
            process.exit();
        }
    });
}

const generalNews = () => {
    fetch('https://news.google.com/rss?hl=es-419&gl=AR&ceid=AR:es-419')
    .then(response => response.text())
    .then(str => {
        const data = parser.parse(str, options);
        const mapTitleDescriptionObject = e => { 
            return {title: e.title, description: parse(e.description).text} 
        };

        const news = R.map(mapTitleDescriptionObject, data.rss.channel.item);
        const titleNews = R.map(e => e.title, news);

        ui(titleNews, news);
    });
};


generalNews();