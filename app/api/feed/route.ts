import { NextResponse } from 'next/server';
import feedData from '@/public/data/feed.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Simulate API delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = feedData.posts.slice(startIndex, endIndex);
    
    return NextResponse.json({
      posts,
      hasMore: endIndex < feedData.posts.length,
      total: feedData.posts.length,
      currentPage: page,
      totalPages: Math.ceil(feedData.posts.length / limit)
    });
  } catch (error) {
    console.error('Error fetching feed data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feed data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, action } = body;
    
    // Handle actions like like, share, add to cart, etc.
    console.log(`Action: ${action} on post: ${postId}`);
    
    return NextResponse.json({
      success: true,
      message: `Action ${action} completed successfully`
    });
  } catch (error) {
    console.error('Error processing post action:', error);
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    );
  }
}
