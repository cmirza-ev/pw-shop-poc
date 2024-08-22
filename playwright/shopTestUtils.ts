interface ShopData {
  records: Array<{
    contact?: {
      website?: string;
    };
  }>;
}

// Can't fetch all records at once (causes 500 error), so we need to make two requests
const query1 = 'https://eva-shop-service.evipscloud.com/v1/places?sortKey=locationName&sortDir=asc&enhancementFilter=undefined&offset=0&limit=175';
const query2 = 'https://eva-shop-service.evipscloud.com/v1/places?sortKey=locationName&sortDir=asc&enhancementFilter=undefined&offset=175&limit=175';

// List of URLs to ignore
const ignoreList = [
  'https://naples.evrealestate.com',
];

export async function fetchAndExtractShopSites(): Promise<string[]> {
  try {
    const response1 = await fetch(query1);
    const data1: ShopData = await response1.json();

    const response2 = await fetch(query2);
    const data2: ShopData = await response2.json();

    const allRecords = [...data1.records, ...data2.records];
    
    const websites = allRecords
      .map(record => record.contact?.website)
      .filter((website): website is string => !!website)
      .map(website => `https://${website}`)
      .filter(website => !ignoreList.includes(website.toLowerCase()));

    const uniqueWebsites = Array.from(new Set(websites));

    console.log(`Total unique websites fetched: ${uniqueWebsites.length}`);

    return uniqueWebsites;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}
