import { Bot, User } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        role === 'user' ? 'bg-indigo-600' : 'bg-zinc-700'
      }`}>
        {role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        role === 'user'
          ? 'bg-indigo-600 text-white'
          : 'bg-zinc-800 text-zinc-200'
      }`}>
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  )
}
