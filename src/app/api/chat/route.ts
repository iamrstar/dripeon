import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const lowercaseMessage = message.toLowerCase();
    let reply = "I'm Zayn, your AI stylist! I'm currently in beta mode. How can I help you drip today?";

    // 1. First check for product recommendations (e.g. "black oversized tee")
    // We'll extract common clothing keywords to search the database.
    const searchKeywords = ['black', 'white', 'oversized', 'baggy', 'tee', 't-shirt', 'hoodie', 'cargo', 'jacket', 'shirt', 'blue', 'red', 'green'];
    const matchedKeywords = searchKeywords.filter(word => lowercaseMessage.includes(word));

    if (matchedKeywords.length > 0) {
      await dbConnect();
      
      // Create a regex pattern to match ANY of the found keywords in the product name or description
      const regexPattern = matchedKeywords.join('|');
      
      // Fetch up to 3 products matching the keywords
      const products = await Product.find({
        isActive: true,
        $or: [
          { name: { $regex: regexPattern, $options: 'i' } },
          { description: { $regex: regexPattern, $options: 'i' } },
          { category: { $regex: regexPattern, $options: 'i' } }
        ]
      }).limit(3);

      if (products.length > 0) {
        reply = `I found some perfect pieces for you based on "${matchedKeywords.join(' ')}"! Check these out:<br><br>`;
        
        products.forEach(p => {
          reply += `🔥 <a href="/products/${p.slug}" style="color: #00ffff; text-decoration: underline; font-weight: 600;">${p.name}</a> - ₹${p.salePrice}<br>`;
        });
        
        reply += `<br>Let me know if you want to see anything else!`;
      } else {
        reply = `I couldn't find any specific matches for "${matchedKeywords.join(' ')}" right now, but we're constantly dropping new collections. Check out our <a href="/collections/all" style="color: #00ffff; text-decoration: underline;">All Products</a> page!`;
      }
    } 
    // 2. Fallback to basic FAQ keywords
    else if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
      reply = "Hey there! Ready to upgrade your wardrobe?";
    } else if (lowercaseMessage.includes('shipping') || lowercaseMessage.includes('delivery')) {
      reply = "We offer FREE shipping on all orders over ₹999! Standard delivery takes 3-5 business days.";
    } else if (lowercaseMessage.includes('return') || lowercaseMessage.includes('refund')) {
      reply = "We have a 7-day return policy for unused items with tags attached. Check our Returns page for more details.";
    } else if (lowercaseMessage.includes('size') || lowercaseMessage.includes('fit')) {
      reply = "Our streetwear is designed with an oversized fit. We recommend ordering your usual size for the perfect baggy look, or size down if you prefer a standard fit.";
    } else if (lowercaseMessage.includes('price') || lowercaseMessage.includes('cost')) {
      reply = "Our premium t-shirts start at ₹999, and hoodies at ₹1999. Use code SUMMER20 for 20% off!";
    }

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 });
  }
}
