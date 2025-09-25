import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ModerationRequest {
  content: string
  type: 'story' | 'comment'
  id: number
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

    const { content, type, id }: ModerationRequest = await req.json()

    if (!content || !type || !id) {
      throw new Error('Missing required fields: content, type, id')
    }

    // Check with OpenAI Moderation API
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    let moderationResult = null
    let isAppropriate = true

    if (openaiKey) {
      const moderationResponse = await fetch('https://api.openai.com/v1/moderations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: content,
        }),
      })

      if (moderationResponse.ok) {
        moderationResult = await moderationResponse.json()
        isAppropriate = !moderationResult.results[0]?.flagged
      }
    }

    // Simple content checks (backup if OpenAI not available)
    const spamPatterns = [
      /\b(viagra|cialis|casino|poker|gambling)\b/i,
      /\b(buy now|click here|free money|make money fast)\b/i,
      /http[s]?:\/\/[^\s]+/g, // URLs
      /(.)\1{15,}/, // Repeated characters
      /[A-Z]{20,}/, // Too many caps
    ]

    const hasSpam = spamPatterns.some(pattern => pattern.test(content))
    
    if (hasSpam) {
      isAppropriate = false
    }

    // Update the content in database if flagged
    if (!isAppropriate) {
      if (type === 'story') {
        await supabaseClient
          .from('stories')
          .update({ 
            metadata: { 
              flagged: true, 
              moderation_result: moderationResult,
              flagged_at: new Date().toISOString()
            } 
          })
          .eq('id', id)
      } else {
        await supabaseClient
          .from('comments')
          .update({ 
            metadata: { 
              flagged: true, 
              moderation_result: moderationResult,
              flagged_at: new Date().toISOString()
            } 
          })
          .eq('id', id)
      }

      // Insert into flags table for admin review
      await supabaseClient
        .from('flags')
        .insert({
          story_id: type === 'story' ? id : null,
          comment_id: type === 'comment' ? id : null,
          reason: 'Automatic moderation flag',
          reporter_id: '00000000-0000-0000-0000-000000000000' // System user
        })
    }

    return new Response(
      JSON.stringify({
        success: true,
        appropriate: isAppropriate,
        flagged: !isAppropriate,
        reason: isAppropriate ? null : 'Content flagged by moderation system',
        moderation_result: moderationResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Moderation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})