import {NextRequest, NextResponse} from 'next/server';
import {OpenAI} from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const {query} = await req.json();

  if (!query) {
    console.log('Query is required');
    return NextResponse.json({error: 'Query is required'}, {status: 400});
  }

  console.log('Received query:', query);

  try {
    const prompt = `Generate a fake price and proper designation and only give me the name of the car part followed by "|" and than the price in numbers only for the car body part and convert the price into DZD and  make sure to genreate a resonable price and do not givme any notes that this is a functional price only 1 string seperated by "|": ${query}`;
    console.log('Prompt:', prompt);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{role: 'user', content: prompt}],
      max_tokens: 50,
    });

    console.log('OpenAI response:', response.choices);

    const result = response.choices[0].message.content;
    console.log('Result content:', result);

    const [designation, price] = result.split('|');
    console.log('Designation:', designation.trim());
    console.log('Price:', parseFloat(price.trim()));

    return NextResponse.json({designation: designation.trim(), price: parseFloat(price.trim())});
  } catch (error) {
    console.error('Failed to fetch data from OpenAI:', error);
    return NextResponse.json({error: 'Failed to fetch data from OpenAI'}, {status: 500});
  }
}
