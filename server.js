import express from 'express';
import puppeteer from 'puppeteer';

const server = express();
const port = 3002;

let data = [];

// get all products of ML
server.get('/', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.mercadolivre.com.br/ofertas');

    // get title page
    const titlePage = await page.title();
    data[0] = titlePage;

    // get list product Name
    const listProductsContainer = await page.$$('.promotion-item__link-container')
    const lenListOfProductName = listProductsContainer.length

    for (let i = 0; i < lenListOfProductName; i++) {
        // get item product
        const linkProductElement = await (await listProductsContainer[i].getProperty('href'))
        const link = await linkProductElement.jsonValue()

        // get title product
        const titleProductElement = await (await listProductsContainer[i].$('.promotion-item__title'));
        const textTitleProduct = await titleProductElement.getProperty('textContent')
        const title = await textTitleProduct.jsonValue()

        // get price product
        const priceProductElement = await (await listProductsContainer[i].$('.andes-money-amount__fraction'))
        const textPriceProduct = await priceProductElement.getProperty('textContent')
        const price = await textPriceProduct.jsonValue()

        // get image product
        const imageProductElement = await (await listProductsContainer[i].$('.promotion-item__img'))
        const imageProduct = await imageProductElement.getProperty('src')
        const imageAux = await imageProduct.jsonValue()
        let image

        if (!imageAux.includes('data:image')) {
            image = imageAux
        } else {
            image = await imageProduct
        }

        // set data product
        data.push({
            linkProduct: link,
            titleProduct: title,
            priceProduct: `R$ ${price}`,
            imageLink: image
        });
    }

    // close page
    await browser.close();
    res.send(data);
    data = []
});

// get list of stores
server.get('/lojas', (req, res) => {
    const listOfStores = []
    listOfStores[0] = data[0]
    res.send(listOfStores)
})

// list all products of all stores
server.listen(port, () => {
    console.log(`Server runing in port ${port}`);
});


