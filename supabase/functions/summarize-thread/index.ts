import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SummarizeRequest {
  story_id: number
  max_length?: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { story_id, max_length = 200 }: SummarizeRequest = await req.json()

    if (!story_id) {
      throw new Error('Missing required field: story_id')
    }

    // Get the story and its comments
    const { data: story, error: storyError } = await supabaseClient
      .from('stories')
      .select(`
        id,
        title,
        body,
        category,
        created_at,
        profiles:author_id (
          username,
          full_name
        )
      `)
      .eq('id', story_id)
      .single()

    if (storyError || !story) {
      throw new Error('Story not found')
    }

    const { data: comments, error: commentsError } = await supabaseClient
      .from('comments')
      .select(`
        id,
        body,
        created_at,
        profiles:author_id (
          username,
          full_name
        )
      `)
      .eq('story_id', story_id)
      .order('created_at', { ascending: true })

    if (commentsError) {
      throw new Error('Failed to fetch comments')
    }

    // Prepare content for summarization
    const storyContent = `Title: ${story.title}\nCategory: ${story.category}\nContent: ${story.body}\nAuthor: ${story.profiles?.full_name || story.profiles?.username || 'Anonymous'}`
    
    const commentsContent = comments?.map((comment, index) => 
      `Comment ${index + 1} by ${comment.profiles?.full_name || comment.profiles?.username || 'Anonymous'}:\n${comment.body}`
    ).join('\n\n') || 'No comments yet.'

    const fullContent = `${storyContent}\n\nComments:\n${commentsContent}`

    // Generate summary using OpenAI
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    let summary = 'Summary generation not available - OpenAI API key not configured.'

    if (openaiKey) {
      const prompt = `Summarize this Frame Economics community discussion in ${max_length} characters or less. Focus on the main insights, challenges, and practical advice shared:

${fullContent}

Provide a concise summary that captures the key points and any actionable Frame Economics principles discussed.`

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at summarizing Frame Economics discussions. Focus on practical insights, challenges overcome, and specific principles applied.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: Math.floor(max_length / 3), // Rough estimate
          temperature: 0.3,
        }),
      })

      if (openaiResponse.ok) {
        const aiResult = await openaiResponse.json()
        summary = aiResult.choices[0]?.message?.content || 'Failed to generate summary.'
      } else {
        const error = await openaiResponse.text()
        console.error('OpenAI API error:', error)
        summary = 'Summary generation failed due to API error.'
      }
    }

    // Store summary in story metadata
    await supabaseClient
      .from('stories')
      .update({
        metadata: {
          ...story.metadata,
          summary,
          summary_generated_at: new Date().toISOString(),
          comment_count: comments?.length || 0
        }
      })
      .eq('id', story_id)

    return new Response(
      JSON.stringify({
        success: true,
        summary,
        story_id,
        comment_count: comments?.length || 0,
        generated_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Summarization error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})