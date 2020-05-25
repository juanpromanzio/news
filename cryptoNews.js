const CryptoNewsAPI = require('crypto-news-api').default;
const term = require('terminal-kit').terminal;
const R = require('ramda');

const API_KEY = process.argv[2];
const COIN = process.argv[3];

const Api = new CryptoNewsAPI(API_KEY);

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

const listedItems = (coin) => {
        Api.enableSentiment();

        Api.getTopNewsByCoin(coin)
        .then(articles => {
            const titleDescriptionObject = article => {
                return {title: article.title, description: article.description}
            }
            const items = R.map(titleDescriptionObject, articles);
            const titleItems = R.map(e => e.title, items);
            ui(titleItems, items);
        });
}

const main = () => {
    if(API_KEY == "" || COIN == ""){
        console.error("\x1b[31m", "API_KEY or COIN not valid");
    } else {
        listedItems(COIN);
    }
};

main();