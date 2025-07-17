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
      succces: true,
      agentJson:{
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
  "servers": [
    {
      "url": "https://stagingapi.neuralseek.com/v1/{instance}",
      "description": "NeuralSeek API server",
      "variables": {
        "instance": {
          "default": "Liam-demo",
          "description": "Your instance ID"
        }
      }
    }
  ],
  "paths": {
    "/maistro": {
      "post": {
        "tags": ["maistro"],
        "summary": "Run mAistro NTL or agent",
        "description": "Freeform prompting using NeuralSeek Template Language or a saved agent",
        "operationId": "maistro",
        "parameters": [
          {
            "in": "query",
            "name": "overrideschema",
            "schema": { "type": "string", "default": "" },
            "required": false,
            "description": "Find variables based on post body…"
          },
          {
            "in": "query",
            "name": "overrideagent",
            "schema": { "type": "string", "default": "" },
            "required": false,
            "description": "If using overrideSchema…"
          },
          {
            "in": "query",
            "name": "debug",
            "schema": { "type": "string", "default": "" },
            "required": false,
            "description": "Include NS debug information…"
          }
        ],
        "requestBody": {
          "description": "The request object.",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "ntl": {
                    "type": "string",
                    "description": "The NTL script to evaluate."
                  },
                  "agent": {
                    "type": "string",
                    "default": "ConfigRouteAnalyzer",
                    "description": "The agent to use."
                  },
                  "params": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "name": { "type": "string" },
                        "value": { "type": "string" }
                      }
                    }
                  },
                  "options": {
                    "type": "object",
                    "properties": {
                      "streaming": { "type": "boolean", "default": false },
                      "llm": { "type": "string", "default": "" },
                      "user_id": { "type": "string", "default": "" },
                      "timeout": { "type": "number", "minimum": 1, "maximum": 600000 },
                      "temperatureMod": { "type": "number", "minimum": -1, "maximum": 1 },
                      "toppMod": { "type": "number", "minimum": -1, "maximum": 1 },
                      "freqpenaltyMod": { "type": "number", "minimum": -1, "maximum": 1 },
                      "minTokens": { "type": "number", "minimum": 0 },
                      "maxTokens": { "type": "number", "minimum": 1 },
                      "lastTurn": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "input": { "type": "string" },
                            "response": { "type": "string" }
                          }
                        }
                      },
                      "returnVariables": { "type": "boolean", "default": false },
                      "returnVariablesExpanded": { "type": "boolean", "default": false },
                      "returnRender": { "type": "boolean", "default": false },
                      "returnSource": { "type": "boolean", "default": false },
                      "maxRecursion": { "type": "integer", "minimum": 0, "maximum": 1000, "default": 10 }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "answer": { "type": "string" },
                    "sourceParts": { "type": "array", "items": { "type": "string" } },
                    "render": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "node": { "type": "string" },
                          "vars": { "type": "object" },
                          "out": { "type": "string" },
                          "chained": { "type": "boolean" }
                        }
                      }
                    },
                    "variables": { "type": "object" },
                    "variablesExpanded": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": { "type": "string" },
                          "value": { "type": "string" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "security": [{ "apiKey": [] }]
      }
    }
  },
  "components": {
    "securitySchemes": {
      "apiKey": { "type": "apiKey", "name": "apikey", "in": "header" }
    }
  },
  "externalDocs": {
    "url": "https://documentation.neuralseek.com",
    "description": "Documentation"
  }
},
      agentName: "testkike",
      improvedPrompt: 'Configure a test scenario with routing disabled and strict mode turned off Provide details on the configuration settings and potential implications of these adjustments.',
      ntlObject: "ntl",
      fullResponse: "data"
      
    }
//   } catch (error) {
//     console.error('Error executing NeuralSeek agent:', error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Unknown error'
//     }
//   }
 } 