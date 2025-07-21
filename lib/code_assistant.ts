interface CodeAssistantResponse {
    answer: string
    variables?: {
        prefix?: string
        imports?: string[]
        code?: string
    }
}
export const generateCode = async (agentJson: any, agentName?: string, improvedPrompt?: string): Promise<any> => {
    try{
        console.log('=== GPT CODE GENERATION DEBUG ===')
        console.log('Agent Name received:', agentName)
        console.log('Improved Prompt received:', improvedPrompt)
        console.log('Agent JSON type:', typeof agentJson)
        console.log('Agent JSON keys:', Object.keys(agentJson || {}))
        console.log('Agent JSON info.title:', agentJson?.info?.title)
        console.log('Agent JSON info.description:', agentJson?.info?.description)
        console.log('Agent JSON paths count:', Object.keys(agentJson?.paths || {}).length) 
        const response = await fetch('https://codeassistant-production.up.railway.app/generate-code',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.CODE_ASSISTANT_API_KEY}`
                },
                body: JSON.stringify({
                    agentJson,
                    agentName,
                    improvedPrompt
                })
            })
        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Code Assistant API error: ${response.status} - ${errorText}`)
        }
        const data: CodeAssistantResponse = await response.json()  
        let prefix = null
        let imports = null
        let code = null
        let fullCode = ''
        if (data.variables) {
            prefix = data.variables.prefix || null
            imports = data.variables.imports || []
            code = data.variables.code || ''
            if (prefix) fullCode += prefix + '\n'
            if (imports && imports.length > 0) fullCode += imports.join('\n') + '\n'
            if (code) fullCode += code
        } else {
            code = data.answer || ''
            fullCode = code
        }
        console.log('Code generated successfully:', {
            prefix,
            imports,
            codeLength: code.length
        })
        return {
            success: true,
            prefix,
            imports,
            code,
            fullCode // <-- Devuelve el código ensamblado
        }
    } catch (error) {
            console.error('Error executing CodeAssistant  agent:', error)
            return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
            }
        }
}

