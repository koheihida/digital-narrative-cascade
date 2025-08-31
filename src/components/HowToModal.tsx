import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog'
import { Card, CardContent } from './ui/card'
import { Separator } from './ui/separator'

const HowToModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-black/70 text-white border-white/20 hover:bg-black/80 backdrop-blur-sm"
        >
          使い方
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 text-white border-white/20 max-w-lg backdrop-blur-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-center">
            デジタル文字滝 - 使い方ガイド
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-blue-300">基本操作</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-200 font-mono">•</span>
                  <span><strong>マウスクリック</strong>：画面上をクリックして岩を配置</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-200 font-mono">•</span>
                  <span><strong>岩をクリア</strong>：配置した全ての岩を削除</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-green-300">文字の仕組み</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-200 font-mono">•</span>
                  <span>太宰治の小説から文字が一つずつ流れ落ちます</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-200 font-mono">•</span>
                  <span>文字は重力に従い、岩に当たると反射します</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-200 font-mono">•</span>
                  <span>文字が溜まりすぎると、自然に溢れて流れ去ります</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-200 font-mono">•</span>
                  <span>古い文字は時間とともに薄くなり消えていきます</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-yellow-300">楽しみ方のコツ</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-200 font-mono">•</span>
                  <span>岩を斜めに配置すると文字が美しく反射します</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-200 font-mono">•</span>
                  <span>複数の岩で「文字の道」を作ってみましょう</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-200 font-mono">•</span>
                  <span>文字が溜まる「池」を作ると、美しい溢れが見られます</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-white/20" />
          
          <div className="text-center text-xs text-white/60">
            <p>画面をクリックして、あなただけの文字滝を作ってみてください</p>
          </div>
        </div>

        <div className="pt-4">
          <DialogClose asChild>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              始める
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HowToModal