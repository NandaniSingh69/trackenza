import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractPrice, extractDescription } from "../utils";

export async function scrapeAmazonProduct(url: string): Promise<Record<string, any> | null> {
    if (!url) return null; // Early exit if no URL is provided

    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 33335;
    const session_id = (1000000 * Math.random()) | 0;
    const option = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    };

    try {
        const response = await axios.get(url, option);
        const $ = cheerio.load(response.data);

        // Extract the product title
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

        const outOfstock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

        const images = 
            $('#imgBlkFront').attr('data-a-dynamic-image') ||
            $('#landingImage').attr('data-a-dynamic-image') ||
            '{}';

        const imageUrls = Object.keys(JSON.parse(images));

        const currency = extractCurrency($('.a-price-symbol'));
        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

        const description = extractDescription($);

        const data = {
            url,
            currency: currency || '$',
            image: imageUrls[0] || '',
            title,
            currentPrice: Number(currentPrice) || Number(originalprice),
            originalprice: Number(originalprice) || Number(originalprice),
            priceHistory: [],
            discountRate: Number(discountRate),
            category: 'category', // You might want to extract this too if possible
            reviewcount: 100, // Extract if possible
            stars: 4.5, // Extract if possible
            isOutOfStock: outOfstock,
            description,
            lowestPrice: Math.min(Number(currentPrice) || 0, Number(originalprice) || 0),
            highestPrice: Math.max(Number(currentPrice) || 0, Number(originalprice) || 0),
            averageprice: (Number(currentPrice) || 0 + Number(originalprice) || 0) / 2,
        };

        console.log(data);

        return data; // Ensure to return the product data

    } catch (error: any) {
        console.error(`Failed to scrape product: ${error.message}`);
        return null; // Return null in case of an error
    }
}
