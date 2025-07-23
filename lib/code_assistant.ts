interface CodeAssistantResponse {
    agentName: string
    generation?: {
        prefix?: string
        imports?: string[]
        code?: string
    }
    messages?: any[]
}
export const generateCode = async (
    agentJson: any, 
    agentName?: string, 
    improvedPrompt?: string): Promise<any> => {
    try{
        console.log('=== GPT CODE GENERATION DEBUG ===')
        console.log('Agent Name received:', agentName)
        console.log('Improved Prompt received:', improvedPrompt)
        console.log('Agent JSON type:', typeof agentJson)
        console.log('Agent JSON keys:', Object.keys(agentJson || {}))
        console.log('Agent JSON info.title:', agentJson?.info?.title)
        console.log('Agent JSON info.description:', agentJson?.info?.description)
        console.log('Agent JSON paths count:', Object.keys(agentJson?.paths || {}).length) 

        //Prompt to code assistant
        const prompt = `
        Generate a complete Next.js React component for a dynamic agent interface based on this agent specification:

        Agent Name: ${agentName || 'Custom Agent'}
        Agent ID: ${agentName || 'Custom Agent'} (use this as the agentId when calling /api/ask-agent)
        Improved Prompt: ${improvedPrompt || 'No additional context'}

        Agent JSON Configuration:
        ${JSON.stringify(agentJson, null, 2)}

        CRITICAL REQUIREMENTS:
        1. Return ONLY valid code. Do NOT include markdown, explanations, or comments outside the code.
        2. The file MUST start with an import statement (e.g., import { useState } from 'react').
        3. On form submit, POST the user's plain text query and the agent's unique ID to /api/ask-agent as JSON: { query, agentId }.
        4. Use "${agentName || 'Custom Agent'}" as the agentId value.
        5. Display the response from the backend in the UI.
        6. Do NOT use mock data. Do NOT use JSON.parse on user input.
        7. Assume the backend endpoint will use the agent's JSON to call NeuralSeek and return the answer.
        8. Use fetch, not axios.
        9. Always use async/await.

        ALSO GENERATE THIS FILE:

        Create a Next.js API route at pages/api/ask-agent.ts that:
        - Accepts only POST requests with { query, agentId } in the body.
        - Calls https://stagingapi.neuralseek.com/v1/liam-demo/{agentId}/maistro with the query as the payload.
        - Uses the apikey from the environment variable process.env.NEURALSEEK_API_KEY.
        - Returns the NeuralSeek response as JSON.
        - Returns 405 for non-POST requests and 400 for missing fields.

        Example implementation (as a string, not real code!):

        \`\`\`ts
        // pages/api/ask-agent.ts
        import type { NextApiRequest, NextApiResponse } from 'next';

        export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }
        const { query, agentId } = req.body;
        if (!query || !agentId) {
            return res.status(400).json({ error: 'Missing query or agentId' });
        }
        const nsRes = await fetch(
            \`https://stagingapi.neuralseek.com/v1/liam-demo/\${agentId}/maistro\`,
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.NEURALSEEK_API_KEY!,
            },
            body: JSON.stringify({ params: { use_case_summary: query } }),
            }
        );
        const data = await nsRes.json();
        return res.status(200).json(data);
        }
        \`\`\`
        `

        console.log('=== GPT PROMPT SENT ===')
        console.log('Prompt length:', prompt.length)
        console.log('Prompt preview (first 500 chars):', prompt.substring(0, 500) + '...')
        console.log('Agent JSON in prompt (first 300 chars):', JSON.stringify(agentJson).substring(0, 300) + '...')

        const response = await fetch('https://codeassistant-production.up.railway.app/agents/secure/generate-code',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.CODE_ASSISTANT_API_KEY}`
                },
                body: JSON.stringify({
                // input: prompt,
                agent_json: agentJson,
                agent_name: agentName || 'Custom Agent',
                improved_prompt: improvedPrompt || ''
                })
            })
        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Code Assistant API error: ${response.status} - ${errorText}`)
        }
        const data: CodeAssistantResponse = await response.json()
        const { generation } = data
        if (!generation || !generation.code || generation.code.includes('Basic Chatbot Template')) {
            throw new Error('Code Assistant did not generate a personalized agent. Please try again.')
        } 
        let fullCode = ''
        if (generation.prefix) fullCode += generation.prefix + '\n'
        if (generation.imports && generation.imports.length > 0) fullCode += generation.imports.join('\n') + '\n'
        if (generation.code) fullCode += generation.code

        return {
            success: true,
            agentName: data.agentName,
            prefix: generation.prefix,
            imports: generation.imports,
            code: generation.code,
            fullCode,
            messages: data.messages || []
        }
    } catch (error) {
            console.error('Error executing CodeAssistant  agent:', error)
            return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
            }
        }
}
