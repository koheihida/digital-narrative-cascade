import { useState, useEffect, useCallback } from 'react'

/**
 * GitHub Sparkの代替として、localStorageベースのuseKVフックを提供
 * Spark環境でない場合でもアプリケーションが動作するようにします
 */
export function useKV<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // localStorage から初期値を読み込み
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  // 値が変更されたときに localStorage に保存
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
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
      localStorage.removeItem(key)
      setValue(defaultValue)
    } catch (error) {
      console.warn('localStorage削除に失敗しました:', error)
    }
  }, [key, defaultValue])

  return [value, setStoredValue, deleteValue]
}