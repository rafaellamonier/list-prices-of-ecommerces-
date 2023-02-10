import express from 'express';
import puppeteer from 'puppeteer';

const server = express();
const port = 3001;

let data = [];

// get all products
server.get('/', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.mercadolivre.com.br/ofertas');

    // get title page
    const titlePage = await page.title();
    data[0] = titlePage;

    // get list product Name
    const listProductsName = await page.$$('.promotion-item__description')
    const lenListOfProductName = listProductsName.length

    for (let i = 0; i < lenListOfProductName; i++) {

        // get title product
        const titleProductElement = await (await listProductsName[i].$('.promotion-item__title'));
        const textTitleProduct = await titleProductElement.getProperty('textContent')
        const title = await textTitleProduct.jsonValue()

        // get price product


        // set data product
        data.push({
            titleProduct: title
        });
    }

    // close page
    await browser.close();
    res.send(data);
    data = []
});


// get list of E-commerces
server.get('/lojas', (req, res) => {
    const listOfStores = []
    listOfStores[0] = data[0]
    res.send(listOfStores)
})

server.listen(port, () => {
    console.log(`Server runing in port ${port}`);
});


