import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractPrice , extractDescription} from "../utils";
export async function scrapeAmazonProduct(url:string){
    if(!url) return;

// curl -i --proxy brd.superproxy.io:33335 --proxy-user brd-customer-hl_42053833-zone-price_solution:diuvye4swfi6 -k "https://geo.brdtest.com/welcome.txt?product=unlocker&method=native"

const username = String(process.env.BRIGHT_DATA_USERNAME);
const password = String(process.env.BRIGHT_DATA_PASSWORD);
const port = 33335;
const session_id = (1000000 * Math.random()) | 0;
const option = {
    auth: {
        username :`${username}-session-${session_id}`,
        password,
    },
    host: 'brd.superproxy.io', 
    port,
    rejectUnauthorized: false,
}
try {
 const response = await axios.get(url, option);
 const $ = cheerio.load(response.data);

 //Extract the product title
 const title = $('#productTitle').text().trim();
 const currentPrice = extractPrice(
    $('.priceToPay span.a-price-whole'),
    $('a.size.base.a-color-price'),
    $('.a-button-selected .a-color-base'),
    $('.a-price.a-text-price')
 );

 const originalprice = extractPrice(
    $('#priceblock_ourprice'),
    $('.a-price.a-text-price span.a-offscreen'),
    $('#listPrice'),
    $('priceblock_dealprice'),
    $('.a-size-base.a-color-price')
 );
 
 const outOfstock = $('#availability span').text().trim().toLowerCase() ==='currently unavailable';

 const images = 
 $('#imgBlkFront').attr('data-a-dynamic-image') ||
 $('#landingImage').attr('data-a-dynamic-image')||
 '{}'

 const imageUrls = Object.keys(JSON.parse(images));

 const currency = extractCurrency($('.a-price-symbol'))

 const discountRate = $('.savingsPercentage').text().replace(/[-%]/g,"");

 const description = extractDescription($)

 const data = {
    url,
    currency: currency || '$',
    image:imageUrls[0],
    title,
    currentPrice: Number(currentPrice) || Number(originalprice),
    originalprice: Number(originalprice) || Number(originalprice),
    priceHistory: [],
    discountRate:Number(discountRate),
    category:'category',
    reviewcount:100,
    stars: 4.5,
    isOutOFstock: outOfstock,
    description,
    lowestPrice: Number(currentPrice) || Number(originalprice),
    highestPrice: Number(originalprice) || Number(currentPrice),
    averageprice: Number(currentPrice) || Number(originalprice),
 }

 console.log(data);

}
catch(error: any){
    throw new Error(`Failed to scrape product: ${error.message}`)
}
}