/**
 * GitHub Spark API のモック実装
 * Spark環境外でのビルドを可能にするためのフォールバック実装
 */

import { useState, useEffect, useCallback } from 'react'

// Spark APIの型定義
interface UserInfo {
  avatarUrl: string
  email: string
  id: string
  isOwner: boolean
  login: string
}

interface SparkKV {
  keys: () => Promise<string[]>
  get: <T>(key: string) => Promise<T | undefined>
  set: <T>(key: string, value: T) => Promise<void>
  delete: (key: string) => Promise<void>
}

interface SparkAPI {
  llmPrompt: (strings: string[], ...values: any[]) => string
  llm: (prompt: string, modelName?: string, jsonMode?: boolean) => Promise<string>
  user: () => Promise<UserInfo>
  kv: SparkKV
}

// LocalStorageベースのKV実装
const mockKV: SparkKV = {
  async keys(): Promise<string[]> {
    try {
      const keys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('spark-kv:')) {
          keys.push(key.replace('spark-kv:', ''))
        }
      }
      return keys
    } catch {
      return []
    }
  },

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const stored = localStorage.getItem(`spark-kv:${key}`)
      return stored ? JSON.parse(stored) : undefined
    } catch {
      return undefined
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(`spark-kv:${key}`, JSON.stringify(value))
    } catch (error) {
      console.warn('localStorage保存に失敗しました:', error)
    }
  },

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(`spark-kv:${key}`)
    } catch (error) {
      console.warn('localStorage削除に失敗しました:', error)
    }
  }
}

// モックユーザー情報
const mockUser: UserInfo = {
  avatarUrl: 'https://github.com/github.png',
  email: 'user@example.com',
  id: 'mock-user',
  isOwner: true,
  login: 'mock-user'
}

// Spark APIのモック実装
const mockSpark: SparkAPI = {
  llmPrompt: (strings: string[], ...values: any[]): string => {
    // テンプレートリテラルを普通の文字列に変換
    return strings.reduce((result, string, i) => {
      return result + string + (values[i] || '')
    }, '')
  },

  async llm(prompt: string, modelName?: string, jsonMode?: boolean): Promise<string> {
    console.warn('Spark LLM API is not available in standalone mode. Using mock response.')
    
    if (jsonMode) {
      return '{"message": "Mock JSON response from LLM API"}'
    }
    
    return `Mock response from ${modelName || 'gpt-4o'} for prompt: ${prompt.substring(0, 50)}...`
  },

  async user(): Promise<UserInfo> {
    return mockUser
  },

  kv: mockKV
}

// useKVフックのモック実装
export function useKV<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // localStorage から初期値を読み込み
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(`spark-kv:${key}`)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  // 値が変更されたときに localStorage に保存
  useEffect(() => {
    try {
      localStorage.setItem(`spark-kv:${key}`, JSON.stringify(value))
    } catch (error) {
      console.warn('localStorage保存に失敗しました:', error)
    }
  }, [key, value])

  // setter関数：関数更新とdirect valueの両方をサポート
  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const finalValue = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prev) 
        : newValue
      return finalValue
    })
  }, [])

  // delete関数：値を削除してdefaultValueにリセット
  const deleteValue = useCallback(() => {
    try {
      localStorage.removeItem(`spark-kv:${key}`)
      setValue(defaultValue)
    } catch (error) {
      console.warn('localStorage削除に失敗しました:', error)
    }
  }, [key, defaultValue])

  return [value, setStoredValue, deleteValue]
}

// グローバルにSparkAPIを設定
declare global {
  interface Window {
    spark: SparkAPI
  }
}

// Spark環境でない場合はモック実装を使用
if (typeof window !== 'undefined' && !window.spark) {
  window.spark = mockSpark
}

export { mockSpark }