export function extractPrice(...elements: any){
    for(const element of elements){
        const priceText = element.text().trim();

        if(priceText) return priceText.replace(/[^\d.]/g, '');
    }
    return '';
}

export function extractCurrency(element: any){
    const currencyText = element.text().trim().slice(0,1);
    return currencyText ? currencyText: '';
}
export function extractDescription($: any) {
    // these are possible elements holding description of the product
    const selectors = [
      ".a-unordered-list .a-list-item",
      ".a-expander-content p",
      // Add more selectors here if needed
    ];
}