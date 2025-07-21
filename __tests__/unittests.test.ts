import { createAgent } from '../lib/neuralseek'
import { generateCode } from '../lib/code_assistant'
import { deployToVercel } from '../lib/vercel'


describe('createAgent', () => {
  it('should return a valid agent object with improvedPrompt', async () => {
    const description = 'Crea un agente de IA personalizado para ser mi compañero de diario digital.'
    const result = await createAgent(description)

    expect(result).toHaveProperty('success', true)
    expect(result).toHaveProperty('agentJson')
    expect(result).toHaveProperty('agentName', 'testkike')
    expect(result).toHaveProperty('improvedPrompt')
    expect(result.improvedPrompt).toMatch(/diario digital/i)
    expect(result.agentJson).toHaveProperty('info')
    expect(result.agentJson.info).toHaveProperty('title')
  })
})
describe('generateCode', () => {
  it('should return generated code with expected structure', async () => {
    // Usa un agentJson de prueba mínimo y válido
    const agentJson = {
      info: {
        title: 'Test Agent',
        description: 'Agente de prueba'
      },
      paths: {}
    }
    const agentName = 'testkike'
    const improvedPrompt = 'Crea un agente de IA personalizado para ser mi compañero de diario digital.'

    const result = await generateCode(agentJson, agentName, improvedPrompt)

    expect(result).toHaveProperty('success', true)
    expect(result).toHaveProperty('code')
    expect(result).toHaveProperty('fullCode')
    expect(result.fullCode.length).toBeGreaterThan(50)
    expect(result.code).toMatch(/react|function|export/i)
  })
})
describe('deployToVercel', () => {
  beforeAll(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ url: 'test-deployment.vercel.app' }),
      })
    ) as any
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('should return the deployment URL on success', async () => {
    const siteCode = 'export default function Test() { return <div>Test</div> }'
    const projectName = 'test-project'
    const url = await deployToVercel(siteCode, projectName)
    expect(url).toBe('https://test-deployment.vercel.app')
  })
})