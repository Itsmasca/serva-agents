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

        const response = await fetch('https://codeassistant-production.up.railway.app/agents/secure/generate-code',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.CODE_ASSISTANT_API_KEY}`
                },
                body: JSON.stringify({
                    input:"agent",
                    agentName: agentName,
                    improvedPrompt: improvedPrompt,
                    agentJson: agentJson
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
