interface NeuralSeekResponse {
  answer: string
  variables?: {
    use_case_summary?: string
    user?: string
    contextUser?: string
    runid?: string
    resultslink?: string
    loopCount?: string
    improved_prompt?: string
    agentName?: string
    'makeNTL.ntl'?: string
    ntl_object?: string
    json?: string
    agentCurrentStep?: string
  }
  sourceParts?: string[]
  render?: any[]
  variablesExpanded?: Array<{
    name: string
    value: string
  }>
}


export const createAgent = async (description: string): Promise<any> => {
//   try {
//     console.log('Calling NeuralSeek /maistro endpoint with description:', description)
    
//     const response = await fetch(`https://stagingapi.neuralseek.com/v1/${process.env.NEURALSEEK_INSTANCE}/maistro`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'apikey': process.env.NEURALSEEK_API_KEY!,
//       },
//       body: JSON.stringify({
//         agent: 'Create-agent',
//         params: {
//           use_case_summary: description
//         },
//         options: {
//           returnVariables: true,
//           returnVariablesExpanded: true,
//           debug: false
//         }
//       })
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       throw new Error(`NeuralSeek API error: ${response.status} - ${errorText}`)
//     }

//     const data: NeuralSeekResponse = await response.json()
//     console.log('NeuralSeek response received:', {
//       answerLength: data.answer?.length || 0,
//       variablesCount: Object.keys(data.variables || {}).length,
//       hasJson: !!data.variables?.json
//     })
    
//     // Extract the generated agent JSON from the response
//     let agentJson = null
//     let agentName = null
//     let improvedPrompt = null
    
//     if (data.variables && data.variables.json) {
//       try {
//         agentJson = JSON.parse(data.variables.json)
//         console.log('Successfully parsed JSON from variables.json')
//       } catch (e) {
//         console.error('Failed to parse JSON from variables.json:', e)
//         // Fallback to raw json string
//         agentJson = data.variables.json
//       }
//     } else if (data.answer) {
//       // Try to extract JSON from answer text as fallback
//       const jsonMatch = data.answer.match(/\{[\s\S]*\}/)
//       if (jsonMatch) {
//         try {
//           agentJson = JSON.parse(jsonMatch[0])
//           console.log('Successfully parsed JSON from answer text')
//         } catch (e) {
//           console.error('Failed to parse JSON from answer:', e)
//         }
//       }
//     }

//     // Extract agent name and improved prompt
//     agentName = data.variables?.agentName
//     improvedPrompt = data.variables?.improved_prompt

//     if (!agentJson) {
//       throw new Error('No agent JSON found in NeuralSeek response')
//     }

//     console.log('Agent execution successful - extracted JSON for GPT processing')
    
//     return {
//       success: true,
//       agentJson, // This is the output JSON that should be passed to GPT
//       agentName,
//       improvedPrompt,
//       ntlObject: data.variables?.ntl_object,
//       fullResponse: data
//     }
    return {
      success: true,
      agentJson: {
        // ...tu JSON completo aquí (sin cambios)...
        "openapi": "3.0.3",
        "info": {
          "version": "1.6.85",
          "title": "ConfigRouteAnalyzer",
          "description": "NeuralSeek - The business LLM accelerator",
          "license": {
            "name": "End User License Agreement",
            "url": "https://neuralseek.com/eula"
          },
          "contact": {
            "name": "NeuralSeek Support",
            "url": "https://neuralseek.com",
            "email": "support@NeuralSeek.com"
          },
          "termsOfService": "https://neuralseek.com/eula"
        },
        // ...resto del JSON...
        // (no lo repito aquí por espacio, pero no cambies nada más)
      },
      agentName: "testkike",
      improvedPrompt: `Crea un agente de IA personalizado para ser mi compañero de diario digital. Quiero un asistente que me ayude a reflexionar, registrar mis pensamientos y emociones diariamente, ofreciendo un espacio seguro y empático para la escritura personal. El agente debe ser capaz de hacer preguntas reflexivas, escuchar sin juzgar, y potencialmente sugerir temas o ejercicios de introspección si me siento bloqueado.`,
      ntlObject: "ntl",
      fullResponse: "data",
      description: description
    }
  }