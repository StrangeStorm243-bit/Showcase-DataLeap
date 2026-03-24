import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatMessage } from '@/components/ChatMessage'

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant' as const,
  content: "Hey! I'm the Dataleap Quickstart Advisor. I'll help you find the perfect agent template for your workflow.\n\nFirst up \u2014 what's your role?\n\n\u2022 \ud83d\udcbc Sales\n\u2022 \u2699\ufe0f Operations\n\u2022 \ud83d\udcbb Engineering\n\u2022 \ud83d\udc65 HR\n\u2022 \ud83d\udce3 Marketing\n\u2022 \ud83d\udc54 Executive",
}

export function Advisor() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/advisor',
    }),
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && status === 'ready') {
      sendMessage({ text: input })
      setInput('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Advisor</h1>
        <p className="text-sm text-zinc-400 mt-1">Tell me about your workflow and I'll match you to the right agent template.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {/* Welcome message */}
        {messages.length === 0 && (
          <ChatMessage role="assistant" content={welcomeMessage.content} />
        )}
        {messages.map((message) => {
          const textContent = message.parts
            ?.filter((p) => p.type === 'text')
            .map((p) => ('text' in p ? p.text : ''))
            .join('') || ''

          return (
            <ChatMessage
              key={message.id}
              role={message.role as 'user' | 'assistant'}
              content={textContent}
            />
          )
        })}
        {status === 'streaming' && messages[messages.length - 1]?.role !== 'assistant' && (
          <ChatMessage role="assistant" content="Thinking..." />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t border-zinc-800">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          disabled={status !== 'ready'}
          className="bg-zinc-900 border-zinc-800 text-zinc-50 placeholder:text-zinc-500"
        />
        <Button type="submit" disabled={status !== 'ready' || !input.trim()} className="bg-indigo-600 hover:bg-indigo-500">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
